
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { generateChallengeTasks } from '../services/geminiService';
import { Task } from '../types';

interface CreateChallengeFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState<'info' | 'tasks'>('info');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalDays: 30,
    target: '',
    category: CATEGORIES[0],
    isPublic: true,
    approvalRequired: false
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInitialGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateTasks();
    setStep('tasks');
  };

  const generateTasks = async () => {
    setIsGenerating(true);
    const aiTasks = await generateChallengeTasks(formData.title + " " + formData.description, formData.totalDays);
    
    const newTasks: Task[] = aiTasks.length > 0 ? aiTasks.map((t: any, i: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      day: t.day || i + 1,
      description: t.description,
      isCompleted: false
    })) : Array.from({ length: formData.totalDays }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      day: i + 1,
      description: `Task for day ${i + 1}`,
      isCompleted: false
    }));

    setTasks(newTasks);
    setIsGenerating(false);
  };

  const handleTaskEdit = (id: string, newDesc: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, description: newDesc } : t));
  };

  const handleFinalSubmit = () => {
    onSave({ ...formData, tasks });
  };

  return (
    <div className="bg-white rounded-[32px] p-8 card-shadow border border-slate-100 max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step === 'info' ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
          {step === 'info' ? '1' : <i className="fa-solid fa-check"></i>}
        </div>
        <div className="h-0.5 flex-grow bg-slate-100">
          <div className={`h-full bg-indigo-600 transition-all ${step === 'tasks' ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold border-2 transition-all ${step === 'tasks' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-300'}`}>
          2
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-800 mb-6">
        {step === 'info' ? 'Setup Your Mastery' : 'Perfect Your Daily Tasks'}
      </h2>

      {step === 'info' && (
        <form onSubmit={handleInitialGenerate} className="space-y-6 animate-in slide-in-from-left duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Challenge Title</label>
              <input 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                placeholder="e.g. 100 Days of Code"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ultimate Goal</label>
            <input 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
              placeholder="What is the final reward?"
              value={formData.target}
              onChange={e => setFormData({...formData, target: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
              placeholder="Briefly explain what this challenge is about..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Duration (1-365 days)</label>
              <input 
                type="number"
                min="1"
                max="365"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold"
                value={formData.totalDays}
                onChange={e => setFormData({...formData, totalDays: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="flex flex-col justify-center gap-2 pt-2">
               <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="isPublic"
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    checked={formData.isPublic}
                    onChange={e => setFormData({...formData, isPublic: e.target.checked})}
                  />
                  <label htmlFor="isPublic" className="text-sm font-bold text-slate-700">Make Public in Marketplace</label>
               </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isGenerating}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              Generate AI Tasks
            </button>
          </div>
        </form>
      )}

      {step === 'tasks' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <p className="text-slate-500 text-sm mb-4">
            AI has drafted a schedule for you. Feel free to tweak descriptions for any day to match your specific needs.
          </p>

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 scroll-hide">
            {tasks.map((task) => (
              <div key={task.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">
                  D{task.day}
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm font-medium focus:outline-none resize-none"
                  value={task.description}
                  rows={2}
                  onChange={(e) => handleTaskEdit(task.id, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={handleFinalSubmit}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rocket"></i>
              Launch Challenge
            </button>
            <div className="flex gap-3">
              <button 
                onClick={generateTasks}
                disabled={isGenerating}
                className="flex-1 py-3 bg-amber-50 text-amber-600 rounded-2xl font-bold hover:bg-amber-100 transition-all flex items-center justify-center gap-2 border border-amber-100"
              >
                {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-rotate"></i>}
                Regenerate AI Tasks
              </button>
              <button 
                onClick={() => setStep('info')}
                className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChallengeForm;
