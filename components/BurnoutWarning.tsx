
import React from 'react';

interface BurnoutWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const BurnoutWarning: React.FC<BurnoutWarningProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fa-solid fa-fire-flame-curved"></i>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Burnout Warning!</h2>
        <p className="text-slate-600 text-center mb-8">
          You are currently enrolled in multiple challenges. Taking on too many goals at once can lead to decreased motivation and burnout. Are you sure you want to start another one?
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
          >
            Yes, I can handle it
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Wait, let me focus on current ones
          </button>
        </div>
      </div>
    </div>
  );
};

export default BurnoutWarning;
