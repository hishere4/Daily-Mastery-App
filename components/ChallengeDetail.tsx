
import React, { useState, useEffect } from 'react';
import { UserProgress, Task } from '../types';
import { ENCOURAGEMENTS } from '../constants';

interface ChallengeDetailProps {
  progress: UserProgress;
  title: string;
  onTaskToggle: (taskId: string) => void;
  onTaskEdit: (taskId: string, newDesc: string) => void;
  onUpdateSettings: (settings: { reminderEnabled: boolean; reminderTime: string }) => void;
  onDropOut: () => void;
  onBack: () => void;
}

const ChallengeDetail: React.FC<ChallengeDetailProps> = ({ 
  progress, 
  title, 
  onTaskToggle, 
  onTaskEdit, 
  onUpdateSettings,
  onDropOut,
  onBack 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDropConfirm, setShowDropConfirm] = useState(false);

  const completedCount = progress.tasks.filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / progress.tasks.length) * 100);

  useEffect(() => {
    if (progressPercent === 100 && progress.status === 'active') {
      setShowConfetti(true);
    }
  }, [progressPercent]);

  const handleToggle = (taskId: string) => {
    const task = progress.tasks.find(t => t.id === taskId);
    if (task && !task.isCompleted) {
      const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setToast(randomEncouragement);
      setTimeout(() => setToast(null), 3000);
    }
    onTaskToggle(taskId);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.description);
  };

  const saveEdit = (id: string) => {
    onTaskEdit(id, editValue);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 relative">
      {/* Dropout Confirmation Modal */}
      {showDropConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-heart-crack"></i>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Giving up already?</h2>
            <p className="text-slate-600 text-center mb-8">
              All your progress for <strong>{title}</strong> will be lost forever. Mastery requires resilience. Are you sure?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={onDropOut}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg"
              >
                Yes, Drop Out
              </button>
              <button 
                onClick={() => setShowDropConfirm(false)}
                className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                No, I'll keep going!
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 border-4 border-white">
            <i className="fa-solid fa-face-laugh-beam"></i>
            {toast}
          </div>
        </div>
      )}

      {showConfetti && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-900/40 backdrop-blur-md p-4 animate-in fade-in duration-700">
          <div className="bg-white rounded-[40px] p-12 max-w-lg w-full text-center shadow-2xl animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">MASTERED!</h2>
            <p className="text-slate-600 mb-8 text-lg">
              You completed all {progress.tasks.length} days of <strong>{title}</strong>. 
              Your dedication is truly legendary!
            </p>
            <div className="flex flex-col gap-3">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-4">
                <span className="text-amber-700 font-black text-2xl">+{progress.tasks.length * 10} XP</span>
              </div>
              <button 
                onClick={() => { setShowConfetti(false); onBack(); }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Claim My Reward
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Dashboard
        </button>
        
        <button 
          onClick={() => setShowDropConfirm(true)}
          className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-circle-xmark"></i>
          Drop Out
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 card-shadow border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-800">{title}</h1>
              {progressPercent === 100 && <i className="fa-solid fa-circle-check text-emerald-500 text-2xl"></i>}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-500 font-bold">Day {completedCount} / {progress.tasks.length}</span>
              <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className={`font-black ${progressPercent === 100 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                {progressPercent}% Complete
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reminders</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="time"
                    className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                    value={progress.reminderTime}
                    onChange={(e) => onUpdateSettings({ ...progress, reminderTime: e.target.value })}
                  />
                  <button 
                    onClick={() => onUpdateSettings({ ...progress, reminderEnabled: !progress.reminderEnabled })}
                    className={`w-10 h-6 rounded-full relative transition-all ${progress.reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${progress.reminderEnabled ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
              <i className={`fa-solid fa-bell ${progress.reminderEnabled ? 'text-indigo-500' : 'text-slate-300'}`}></i>
            </div>

            <div className="bg-amber-50 px-6 py-4 rounded-2xl text-center border border-amber-100 min-w-[100px]">
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">XP Earned</p>
              <p className="text-2xl font-black text-amber-500">{progress.totalPointsEarned}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {progress.tasks.map((task) => (
            <div 
              key={task.id}
              className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                task.isCompleted 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-100 shadow-sm'
              }`}
            >
              {task.isCompleted && (
                <div className="absolute -top-1 -right-1 p-2 bg-emerald-500 text-white rounded-bl-xl text-[10px] font-bold">
                  <i className="fa-solid fa-check"></i>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-black uppercase tracking-widest ${task.isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                  DAY {task.day}
                </span>
                {!task.isCompleted && (
                  <button 
                    onClick={() => startEdit(task)}
                    className="p-1 text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                )}
              </div>

              {editingId === task.id ? (
                <div className="space-y-3">
                  <textarea 
                    autoFocus
                    className="w-full text-sm bg-slate-50 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => saveEdit(task.id)}
                      className="flex-1 text-xs bg-indigo-600 text-white py-2 rounded-xl font-bold"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="flex-1 text-xs bg-slate-200 text-slate-600 py-2 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium mb-8 leading-relaxed min-h-[40px]">
                  {task.description}
                </p>
              )}

              <button 
                onClick={() => handleToggle(task.id)}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  task.isCompleted 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                  : 'bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {task.isCompleted ? 'COMPLETED' : 'MARK DONE'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
