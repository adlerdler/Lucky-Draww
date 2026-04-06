import React, { useState } from 'react';
import { X, Save, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Prize } from '../types';
import { Language, translations } from '../locales';

interface AdminPanelProps {
  prizes: Prize[];
  showHistory: boolean;
  siteName: string;
  siteIcon: string;
  mainTitle: string;
  subTitle: string;
  adminPassword?: string;
  onSave: (prizes: Prize[], showHistory: boolean, siteName: string, siteIcon: string, mainTitle: string, subTitle: string, adminPassword?: string) => void;
  onClose: () => void;
  language: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ prizes, showHistory, siteName, siteIcon, mainTitle, subTitle, adminPassword, onSave, onClose, language }) => {
  const t = translations[language];
  const [editedPrizes, setEditedPrizes] = useState<Prize[]>(prizes);
  const [editedShowHistory, setEditedShowHistory] = useState(showHistory);
  const [editedSiteName, setEditedSiteName] = useState(siteName);
  const [editedSiteIcon, setEditedSiteIcon] = useState(siteIcon);
  const [editedMainTitle, setEditedMainTitle] = useState(mainTitle);
  const [editedSubTitle, setEditedSubTitle] = useState(subTitle);
  const [editedAdminPassword, setEditedAdminPassword] = useState(adminPassword || '');
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
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
    const hasEmptyName = editedPrizes.some(p => !p.name.trim());
    if (hasEmptyName) {
      setValidationError(t.nameCannotBeEmpty);
      return;
    }

    const hasInvalidWeight = editedPrizes.some(p => Number(p.weight) <= 0);
    if (hasInvalidWeight) {
      setValidationError(t.weightMustBePositive);
      return;
    }

    setValidationError(null);

    const totalWeight = editedPrizes.reduce((sum, p) => sum + Number(p.weight), 0);
    
    if (totalWeight !== 100) {
      setShowWeightWarning(true);
      return;
    }

    onSave(editedPrizes, editedShowHistory, editedSiteName, editedSiteIcon, editedMainTitle, editedSubTitle, editedAdminPassword);
    onClose();
  };

  const handleAutoFixAndSave = () => {
    const hasEmptyName = editedPrizes.some(p => !p.name.trim());
    if (hasEmptyName) {
      setShowWeightWarning(false);
      setValidationError(t.nameCannotBeEmpty);
      return;
    }

    const hasInvalidWeight = editedPrizes.some(p => Number(p.weight) <= 0);
    if (hasInvalidWeight) {
      setShowWeightWarning(false);
      setValidationError(t.weightMustBePositive);
      return;
    }

    setValidationError(null);

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

    onSave(normalizedPrizes, editedShowHistory, editedSiteName, editedSiteIcon, editedMainTitle, editedSubTitle, editedAdminPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{t.adminPanel}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="mb-6 sm:mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">{t.globalSettings}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.siteName}</label>
                  <input
                    type="text"
                    value={editedSiteName}
                    onChange={(e) => setEditedSiteName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.siteIcon}</label>
                  <input
                    type="text"
                    value={editedSiteIcon}
                    onChange={(e) => setEditedSiteIcon(e.target.value)}
                    maxLength={2}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.mainTitle}</label>
                  <input
                    type="text"
                    value={editedMainTitle}
                    onChange={(e) => setEditedMainTitle(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.subTitle}</label>
                  <input
                    type="text"
                    value={editedSubTitle}
                    onChange={(e) => setEditedSubTitle(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.adminPassword}</label>
                  <input
                    type="text"
                    value={editedAdminPassword}
                    onChange={(e) => setEditedAdminPassword(e.target.value)}
                    placeholder={t.setNewPassword}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                  {t.showHistoryFrontend}
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">{t.prizeSettings}</h3>
          
          <div className="space-y-4">
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-slate-500 px-2">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">{t.prizeName}</div>
              <div className="col-span-3">{t.weight}</div>
              <div className="col-span-1 text-center">{t.background}</div>
              <div className="col-span-1 text-center">{t.text}</div>
              <div className="col-span-2 text-center">{t.actions}</div>
            </div>

            <div className="space-y-3">
              {editedPrizes.map((prize, index) => (
                <div key={prize.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center bg-slate-50 p-4 sm:p-2 rounded-xl sm:rounded-lg border border-slate-200 sm:border-slate-100 shadow-sm sm:shadow-none">
                  
                  {/* Mobile Header & Delete Button */}
                  <div className="flex justify-between items-center w-full sm:hidden mb-1">
                    <span className="text-sm font-bold text-slate-700">奖项 #{index + 1}</span>
                    <button
                      onClick={() => handleRemovePrize(index)}
                      disabled={editedPrizes.length <= 2}
                      className={`p-2 transition-colors ${
                        editedPrizes.length <= 2 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-red-500 hover:bg-red-50 rounded-lg'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Desktop Index */}
                  <div className="hidden sm:block col-span-1 text-center text-slate-400 font-medium">{index + 1}</div>
                  
                  {/* Name */}
                  <div className="w-full sm:col-span-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 sm:hidden">{t.name}</label>
                    <input
                      type="text"
                      value={prize.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg sm:rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  
                  {/* Weight */}
                  <div className="w-full sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 sm:hidden">{t.weight0_100}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={prize.weight}
                      onChange={(e) => handleChange(index, 'weight', Number(e.target.value))}
                      className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg sm:rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  
                  {/* Colors - Mobile */}
                  <div className="flex gap-4 w-full sm:hidden mt-1">
                    <div className="flex-1 flex flex-col">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">{t.bgColor}</label>
                      <input
                        type="color"
                        value={prize.color}
                        onChange={(e) => handleChange(index, 'color', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">{t.textColor}</label>
                      <input
                        type="color"
                        value={prize.textColor}
                        onChange={(e) => handleChange(index, 'textColor', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer border-0 p-0"
                      />
                    </div>
                  </div>

                  {/* Colors - Desktop */}
                  <div className="hidden sm:flex col-span-1 justify-center">
                    <input
                      type="color"
                      value={prize.color}
                      onChange={(e) => handleChange(index, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                  <div className="hidden sm:flex col-span-1 justify-center">
                    <input
                      type="color"
                      value={prize.textColor}
                      onChange={(e) => handleChange(index, 'textColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                  
                  {/* Desktop Delete */}
                  <div className="hidden sm:flex col-span-2 justify-center">
                    <button
                      onClick={() => handleRemovePrize(index)}
                      disabled={editedPrizes.length <= 2}
                      className={`p-1.5 transition-colors ${
                        editedPrizes.length <= 2 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-red-400 hover:text-red-600 hover:bg-red-50 rounded'
                      }`}
                      title={editedPrizes.length <= 2 ? t.atLeastTwoPrizes : t.deletePrize}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleAddPrize}
            className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            {t.addPrize}
          </button>
          
          <div className="mt-6 text-sm text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
            {t.weightTip}
          </div>
          
          {validationError && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {validationError}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm sm:text-base text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {t.saveSettings}
          </button>
        </div>

        {showWeightWarning && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{t.totalWeightNot100}</h3>
              <p className="text-sm text-slate-600 mb-6">
                {t.currentTotalWeight} <span className="font-bold text-slate-900">{editedPrizes.reduce((sum, p) => sum + Number(p.weight), 0)}</span>{t.wheelRequires100}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAutoFixAndSave}
                  className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-medium transition-colors"
                >
                  {t.autoFixAndSave}
                </button>
                <button
                  onClick={() => setShowWeightWarning(false)}
                  className="w-full py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                >
                  {t.returnToEdit}
                </button>
              </div>
            </div>
          </div>
        )}

        {prizeToDelete !== null && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{t.confirmDeletion}</h3>
              <p className="text-sm text-slate-600 mb-6">
                {t.areYouSureDelete}<span className="font-bold text-slate-900">{editedPrizes[prizeToDelete]?.name}</span>{t.cannotBeUndone}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPrizeToDelete(null)}
                  className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmRemovePrize}
                  className="flex-1 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium transition-colors"
                >
                  {t.confirmDelete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
