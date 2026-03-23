import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trophy } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium px-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg">最近中奖记录</h3>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <ul className="divide-y divide-slate-50">
          {history.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {item.prizeName.slice(0, 1)}
                </div>
                <span className="font-semibold text-slate-800 truncate">{item.prizeName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {new Date(item.timestamp).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
