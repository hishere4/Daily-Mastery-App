
import React, { useState } from 'react';
import { User, UserProgress, Challenge } from '../types';
import { TITLES, ACHIEVEMENTS_LIST } from '../constants';

interface ProfileViewProps {
  user: User;
  progress: UserProgress[];
  challenges: Challenge[];
  onUpdateUser: (userData: Partial<User>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, progress, challenges, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editTitle, setEditTitle] = useState(user.currentTitle);

  const activeChallenges = progress.filter(p => p.status === 'active');
  const completedChallenges = progress.filter(p => p.status === 'completed');

  const handleSave = () => {
    onUpdateUser({ name: editName, bio: editBio, currentTitle: editTitle });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 card-shadow border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-indigo-100 shadow-xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
              <i className="fa-solid fa-star text-sm"></i>
            </div>
          </div>
          
          <div className="flex-grow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {isEditing ? (
                <input 
                  className="text-3xl font-black text-slate-800 bg-slate-50 border-b-2 border-indigo-500 focus:outline-none"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              ) : (
                <h1 className="text-3xl font-black text-slate-800">{user.name}</h1>
              )}
              <span className="px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest self-center">
                {user.currentTitle}
              </span>
            </div>

            {isEditing ? (
              <textarea 
                className="w-full p-3 bg-slate-50 border rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={2}
              />
            ) : (
              <p className="text-slate-500 leading-relaxed max-w-xl">
                {user.bio || "No bio set yet. Start documenting your journey to mastery!"}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl font-bold border border-amber-100">
                <i className="fa-solid fa-coins"></i>
                {user.points} XP
              </div>
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-xl font-bold border border-rose-100">
                <i className="fa-solid fa-ticket"></i>
                {user.tickets} Tickets
              </div>
              <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-700 block mb-2">Select Your Title</label>
            <div className="flex flex-wrap gap-2">
              {TITLES.map(title => (
                <button
                  key={title}
                  onClick={() => setEditTitle(title)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${editTitle === title ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements Column */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-medal text-amber-500"></i>
            Trophy Cabinet
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {ACHIEVEMENTS_LIST.map(badge => {
              const isUnlocked = user.achievements.some(a => a.id === badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                    isUnlocked ? 'bg-white border-amber-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                    <i className={`fa-solid ${badge.icon}`}></i>
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{badge.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-fire text-orange-500"></i>
              Currently Mastering ({activeChallenges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map(p => {
                const c = challenges.find(ch => ch.id === p.challengeId);
                const percent = Math.round((p.tasks.filter(t => t.isCompleted).length / p.tasks.length) * 100);
                return (
                  <div key={p.challengeId} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                    <h3 className="font-bold text-slate-800 mb-1">{c?.title}</h3>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{percent}% Progress</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-certificate text-emerald-500"></i>
              Hall of Fame ({completedChallenges.length})
            </h2>
            {completedChallenges.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed rounded-3xl text-slate-400 font-medium">
                No challenges completed yet. Keep pushing!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedChallenges.map(p => {
                  const c = challenges.find(ch => ch.id === p.challengeId);
                  return (
                    <div key={p.challengeId} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-emerald-900">{c?.title}</h3>
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-bold uppercase mt-2">Completed {new Date(p.startDate).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
