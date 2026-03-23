import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Settings, Lock, X } from 'lucide-react';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { ResultModal } from './components/ResultModal';
import { History } from './components/History';
import { INITIAL_PRIZES, ADMIN_PASSWORD } from './constants';
import { Prize, HistoryItem } from './types';

export default function App() {
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    const saved = localStorage.getItem('lucky_draw_prizes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PRIZES;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('lucky_draw_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [showHistory, setShowHistory] = useState<boolean>(() => {
    const saved = localStorage.getItem('lucky_draw_show_history');
    if (saved !== null) {
      return saved === 'true';
    }
    return true;
  });
  const [siteName, setSiteName] = useState<string>(() => {
    return localStorage.getItem('lucky_draw_site_name') || 'Lucky Draw';
  });
  const [siteIcon, setSiteIcon] = useState<string>(() => {
    return localStorage.getItem('lucky_draw_site_icon') || 'L';
  });

  useEffect(() => {
    localStorage.setItem('lucky_draw_prizes', JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem('lucky_draw_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('lucky_draw_show_history', String(showHistory));
  }, [showHistory]);

  useEffect(() => {
    localStorage.setItem('lucky_draw_site_name', siteName);
    document.title = siteName;
  }, [siteName]);

  useEffect(() => {
    localStorage.setItem('lucky_draw_site_icon', siteIcon);
  }, [siteIcon]);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [showResultModal, setShowResultModal] = useState(false);
  const [currentResult, setCurrentResult] = useState('');

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let winningIndex = prizes.length - 1;

    for (let i = 0; i < prizes.length; i++) {
      if (random < prizes[i].weight) {
        winningIndex = i;
        break;
      }
      random -= prizes[i].weight;
    }

    const sliceAngle = 360 / prizes.length;
    // Calculate target rotation to land exactly on the winning slice
    // We want the winning slice to be at the top (-90 degrees in SVG, which is 0 degrees in CSS rotation of the wheel if we didn't rotate it, but we rotated the SVG by -90)
    // Actually, slice 0 is centered at 0 degrees in SVG coordinates.
    // SVG is rotated by -90 degrees. So slice 0 is at -90 degrees (top).
    // If we want slice `i` to be at the top, we need to rotate the wheel by `-i * sliceAngle`.
    // Let's add 8 full rotations (2880 degrees) for a longer, more dynamic spinning effect.
    const randomOffset = (Math.random() - 0.5) * sliceAngle * 0.8;
    const targetRotation = rotation + (360 - (rotation % 360)) + 2880 - (winningIndex * sliceAngle) + randomOffset;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = prizes[winningIndex];
      setCurrentResult(wonPrize.name);
      setShowResultModal(true);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fef08a', '#fecaca', '#bfdbfe', '#bbf7d0', '#e9d5ff']
      });

      setHistory(prev => {
        const newHistory = [
          { id: Date.now().toString(), prizeName: wonPrize.name, timestamp: Date.now() },
          ...prev
        ].slice(0, 5);
        return newHistory;
      });
    }, 7000); // Match the CSS transition duration
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthModalOpen(false);
      setIsAdminOpen(true);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('密码错误，请重试');
    }
  };

  const handleSaveSettings = (newPrizes: Prize[], newShowHistory: boolean, newSiteName: string, newSiteIcon: string) => {
    setPrizes(newPrizes);
    setShowHistory(newShowHistory);
    setSiteName(newSiteName);
    setSiteIcon(newSiteIcon);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-lg">
            {siteIcon}
          </span>
          {siteName}
        </h1>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          title="管理后台"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            今日好运，一触即发
          </h2>
          <p className="text-slate-500 font-medium">点击中心按钮，开启你的专属惊喜</p>
        </div>

        <Wheel
          prizes={prizes}
          isSpinning={isSpinning}
          rotation={rotation}
          onSpin={handleSpin}
        />

        {showHistory && <History history={history} />}
      </main>

      {/* Admin Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError('');
                setPasswordInput('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-6 text-slate-800">管理员验证</h3>
            <form onSubmit={handleAdminAuth}>
              <input
                type="password"
                placeholder="请输入管理密码"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 mb-2 text-center text-lg tracking-widest"
                autoFocus
              />
              {authError && <p className="text-red-500 text-sm text-center mb-4">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors mt-4"
              >
                进入后台
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel
          prizes={prizes}
          showHistory={showHistory}
          siteName={siteName}
          siteIcon={siteIcon}
          onSave={handleSaveSettings}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        prizeName={currentResult}
        onClose={() => setShowResultModal(false)}
      />
    </div>
  );
}
