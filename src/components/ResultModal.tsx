import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  prizeName: string;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, prizeName, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Gift className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              恭喜中奖！
            </h3>
            <p className="text-slate-500 mb-6">
              您抽中了
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8">
              <span className="text-3xl font-black text-indigo-600 tracking-tight">
                {prizeName}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-slate-800 text-white rounded-xl font-semibold text-lg hover:bg-slate-700 active:scale-95 transition-all shadow-md"
            >
              收下奖品
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
