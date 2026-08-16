import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Settings, Lock, X, Loader2, Globe, Volume2, VolumeX } from 'lucide-react';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { ResultModal } from './components/ResultModal';
import { History } from './components/History';
import { INITIAL_PRIZES, ADMIN_PASSWORD } from './constants';
import { Prize, HistoryItem } from './types';
import { Language, translations } from './locales';
import { playSpinStart, startSpinningTicks, playWinSound } from './utils/audio';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lucky_draw_language');
    return (saved as Language) || 'zh';
  });
  const t = translations[language];

  const [isLoading, setIsLoading] = useState(true);
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(true);
  const [siteName, setSiteName] = useState<string>('Lucky Draw');
  const [siteIcon, setSiteIcon] = useState<string>('L');
  const [mainTitle, setMainTitle] = useState<string>('今日好运，一触即发');
  const [subTitle, setSubTitle] = useState<string>('点击中心按钮，开启你的专属惊喜');
  const [adminPassword, setAdminPassword] = useState<string>(ADMIN_PASSWORD);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data.prizes) setPrizes(data.prizes);
        if (data.history) setHistory(data.history);
        if (data.showHistory !== undefined) setShowHistory(data.showHistory);
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteIcon) setSiteIcon(data.siteIcon);
        if (data.mainTitle) setMainTitle(data.mainTitle);
        if (data.subTitle) setSubTitle(data.subTitle);
        if (data.adminPassword) setAdminPassword(data.adminPassword);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('lucky_draw_language', language);
  }, [language]);

  useEffect(() => {
    document.title = siteName;
  }, [siteName]);

  const saveData = async (newData: any) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (err) {
      console.error('Failed to save data', err);
    }
  };
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [showResultModal, setShowResultModal] = useState(false);
  const [currentResult, setCurrentResult] = useState('');

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    if (soundEnabled) {
      playSpinStart();
      startSpinningTicks(7000);
    }

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
    const randomOffset = (Math.random() - 0.5) * sliceAngle * 0.8;
    const targetRotation = rotation + (360 - (rotation % 360)) + 2880 - (winningIndex * sliceAngle) + randomOffset;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = prizes[winningIndex];
      setCurrentResult(wonPrize.name);
      setShowResultModal(true);
      
      if (soundEnabled) {
        playWinSound();
      }

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
        saveData({ history: newHistory });
        return newHistory;
      });
    }, 7000); // Match the CSS transition duration
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthModalOpen(false);
      setIsAdminOpen(true);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError(t.incorrectPassword);
    }
  };

  const handleSaveSettings = (newPrizes: Prize[], newShowHistory: boolean, newSiteName: string, newSiteIcon: string, newMainTitle: string, newSubTitle: string, newAdminPassword?: string) => {
    setPrizes(newPrizes);
    setShowHistory(newShowHistory);
    setSiteName(newSiteName);
    setSiteIcon(newSiteIcon);
    setMainTitle(newMainTitle);
    setSubTitle(newSubTitle);
    if (newAdminPassword) {
      setAdminPassword(newAdminPassword);
    }

    saveData({
      prizes: newPrizes,
      showHistory: newShowHistory,
      siteName: newSiteName,
      siteIcon: newSiteIcon,
      mainTitle: newMainTitle,
      subTitle: newSubTitle,
      ...(newAdminPassword ? { adminPassword: newAdminPassword } : {})
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="p-4 sm:p-6 flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-lg">
            {siteIcon}
          </span>
          {siteName}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors"
            title={soundEnabled ? '音效已开启' : '音效已关闭'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1.5"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            {t.language}
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            title="管理后台"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">
            {mainTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">{subTitle}</p>
        </div>

        <Wheel
          prizes={prizes}
          isSpinning={isSpinning}
          rotation={rotation}
          onSpin={handleSpin}
          language={language}
        />

        {showHistory && <History history={history} language={language} />}
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
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 text-slate-800">{t.adminAuth}</h3>
            <form onSubmit={handleAdminAuth}>
              <input
                type="password"
                placeholder={t.enterAdminPassword}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 mb-2 text-center text-base sm:text-lg tracking-widest"
                autoFocus
              />
              {authError && <p className="text-red-500 text-sm text-center mb-4">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors mt-4"
              >
                {t.enterAdminPanel}
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
          mainTitle={mainTitle}
          subTitle={subTitle}
          adminPassword={adminPassword}
          onSave={handleSaveSettings}
          onClose={() => setIsAdminOpen(false)}
          language={language}
        />
      )}

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        prizeName={currentResult}
        onClose={() => setShowResultModal(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="w-full py-6 mt-auto text-center text-sm text-slate-400">
        <p>
          &copy; 2026 {t.allRightsReserved}{' '}
          <a
            href="https://blog.a1l.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors font-medium"
          >
            A1L
          </a>
        </p>
      </footer>
    </div>
  );
}
