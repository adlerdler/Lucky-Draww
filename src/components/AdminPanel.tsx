import React, { useState } from 'react';
import { X, Save, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Prize } from '../types';

interface AdminPanelProps {
  prizes: Prize[];
  showHistory: boolean;
  siteName: string;
  siteIcon: string;
  mainTitle: string;
  subTitle: string;
  onSave: (prizes: Prize[], showHistory: boolean, siteName: string, siteIcon: string, mainTitle: string, subTitle: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ prizes, showHistory, siteName, siteIcon, mainTitle, subTitle, onSave, onClose }) => {
  const [editedPrizes, setEditedPrizes] = useState<Prize[]>(prizes);
  const [editedShowHistory, setEditedShowHistory] = useState(showHistory);
  const [editedSiteName, setEditedSiteName] = useState(siteName);
  const [editedSiteIcon, setEditedSiteIcon] = useState(siteIcon);
  const [editedMainTitle, setEditedMainTitle] = useState(mainTitle);
  const [editedSubTitle, setEditedSubTitle] = useState(subTitle);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof Prize, value: string | number) => {
    const newPrizes = [...editedPrizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setEditedPrizes(newPrizes);
  };

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      name: '新奖项',
      weight: 10,
      color: '#ffffff',
      textColor: '#000000'
    };
    setEditedPrizes([...editedPrizes, newPrize]);
  };

  const handleRemovePrize = (index: number) => {
    if (editedPrizes.length <= 2) return;
    setPrizeToDelete(index);
  };

  const confirmRemovePrize = () => {
    if (prizeToDelete === null) return;
    const newPrizes = [...editedPrizes];
    newPrizes.splice(prizeToDelete, 1);
    setEditedPrizes(newPrizes);
    setPrizeToDelete(null);
  };

  const handleSave = () => {
    const totalWeight = editedPrizes.reduce((sum, p) => sum + Number(p.weight), 0);
    
    if (totalWeight !== 100) {
      setShowWeightWarning(true);
      return;
    }

    onSave(editedPrizes, editedShowHistory, editedSiteName, editedSiteIcon, editedMainTitle, editedSubTitle);
    onClose();
  };

  const handleAutoFixAndSave = () => {
    const totalWeight = editedPrizes.reduce((sum, p) => sum + Number(p.weight), 0);
    let normalizedPrizes = editedPrizes;
    
    if (totalWeight === 0) {
      const equalWeight = Math.floor(100 / editedPrizes.length);
      normalizedPrizes = editedPrizes.map((p, index) => ({
        ...p,
        weight: index === editedPrizes.length - 1 ? 100 - equalWeight * (editedPrizes.length - 1) : equalWeight
      }));
    } else {
      let currentSum = 0;
      normalizedPrizes = editedPrizes.map((p, index) => {
        if (index === editedPrizes.length - 1) {
          return { ...p, weight: 100 - currentSum };
        }
        const newWeight = Math.round((Number(p.weight) / totalWeight) * 100);
        currentSum += newWeight;
        return { ...p, weight: newWeight };
      });
    }

    onSave(normalizedPrizes, editedShowHistory, editedSiteName, editedSiteIcon, editedMainTitle, editedSubTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">奖项管理 (Admin)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">全局设置</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">网站名称</label>
                  <input
                    type="text"
                    value={editedSiteName}
                    onChange={(e) => setEditedSiteName(e.target.value)}
                    placeholder="例如：Lucky Draw"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">网站图标 (文字或Emoji)</label>
                  <input
                    type="text"
                    value={editedSiteIcon}
                    onChange={(e) => setEditedSiteIcon(e.target.value)}
                    placeholder="例如：L 或 🎁"
                    maxLength={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">主标题</label>
                  <input
                    type="text"
                    value={editedMainTitle}
                    onChange={(e) => setEditedMainTitle(e.target.value)}
                    placeholder="例如：今日好运，一触即发"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">副标题</label>
                  <input
                    type="text"
                    value={editedSubTitle}
                    onChange={(e) => setEditedSubTitle(e.target.value)}
                    placeholder="例如：点击中心按钮，开启你的专属惊喜"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={editedShowHistory}
                  onClick={() => setEditedShowHistory(!editedShowHistory)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    editedShowHistory ? 'bg-indigo-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editedShowHistory ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span 
                  className="text-sm font-medium text-slate-700 cursor-pointer select-none"
                  onClick={() => setEditedShowHistory(!editedShowHistory)}
                >
                  前台显示最近中奖记录
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">奖项设置</h3>
          <div className="grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-slate-500 px-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">奖项名称</div>
            <div className="col-span-3">权重 (0-100)</div>
            <div className="col-span-2 text-center">背景色</div>
            <div className="col-span-2 text-center">文字色</div>
            <div className="col-span-1 text-center">操作</div>
          </div>

          <div className="space-y-3">
            {editedPrizes.map((prize, index) => (
              <div key={prize.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="col-span-1 text-center text-slate-400 font-medium">{index + 1}</div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={prize.weight}
                    onChange={(e) => handleChange(index, 'weight', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <input
                    type="color"
                    value={prize.color}
                    onChange={(e) => handleChange(index, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <input
                    type="color"
                    value={prize.textColor}
                    onChange={(e) => handleChange(index, 'textColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleRemovePrize(index)}
                    disabled={editedPrizes.length <= 2}
                    className={`p-1 transition-colors ${
                      editedPrizes.length <= 2 
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-red-400 hover:text-red-600 hover:bg-red-50 rounded'
                    }`}
                    title={editedPrizes.length <= 2 ? "至少需要保留两个奖项" : "删除奖项"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleAddPrize}
            className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            新增奖项
          </button>
          
          <div className="mt-6 text-sm text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
            提示：权重总和必须为 100。至少需要保留 2 个奖项。
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            保存设置
          </button>
        </div>

        {showWeightWarning && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center p-6">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">权重总和不为 100</h3>
              <p className="text-sm text-slate-600 mb-6">
                当前所有奖项的权重总和为 <span className="font-bold text-slate-900">{editedPrizes.reduce((sum, p) => sum + Number(p.weight), 0)}</span>。大转盘需要权重总和严格等于 100 才能正常工作。
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAutoFixAndSave}
                  className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-medium transition-colors"
                >
                  自动分配并保存
                </button>
                <button
                  onClick={() => setShowWeightWarning(false)}
                  className="w-full py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                >
                  返回手动修改
                </button>
              </div>
            </div>
          </div>
        )}

        {prizeToDelete !== null && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center p-6">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">确认删除奖项？</h3>
              <p className="text-sm text-slate-600 mb-6">
                您确定要删除奖项“<span className="font-bold text-slate-900">{editedPrizes[prizeToDelete]?.name}</span>”吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPrizeToDelete(null)}
                  className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmRemovePrize}
                  className="flex-1 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
