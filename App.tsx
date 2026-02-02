
import React, { useState, useEffect, useMemo } from 'react';
import { Challenge, User, UserProgress, Task, Achievement } from './types';
import { MOCK_CHALLENGES, POINTS_PER_TASK, TICKETS_PER_COMPLETION, ACHIEVEMENTS_LIST, TITLES } from './constants';
import ChallengeCard from './components/ChallengeCard';
import BurnoutWarning from './components/BurnoutWarning';
import CreateChallengeForm from './components/CreateChallengeForm';
import ChallengeDetail from './components/ChallengeDetail';
import ProfileView from './components/ProfileView';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('mastery_user');
    return saved ? JSON.parse(saved) : {
      id: 'u-me',
      name: 'Habit Hero',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      bio: 'On a journey to master Python and morning meditation.',
      points: 0,
      tickets: 5,
      currentTitle: TITLES[0],
      achievements: []
    };
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('mastery_challenges');
    return saved ? JSON.parse(saved) : MOCK_CHALLENGES;
  });

  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem('mastery_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'marketplace' | 'dashboard' | 'create' | 'profile'>('dashboard');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [showBurnoutWarning, setShowBurnoutWarning] = useState<Challenge | null>(null);

  useEffect(() => {
    localStorage.setItem('mastery_user', JSON.stringify(user));
    localStorage.setItem('mastery_challenges', JSON.stringify(challenges));
    localStorage.setItem('mastery_progress', JSON.stringify(userProgress));
  }, [user, challenges, userProgress]);

  const joinedChallengeIds = useMemo(() => userProgress.map(p => p.challengeId), [userProgress]);

  const checkAchievements = (updatedUser: User, updatedProgress: UserProgress[]) => {
    const newAchievements: Achievement[] = [...updatedUser.achievements];
    
    if (!newAchievements.find(a => a.id === 'a1')) {
      const hasCompletedAnyTask = updatedProgress.some(p => p.tasks.some(t => t.isCompleted));
      if (hasCompletedAnyTask) newAchievements.push({ ...ACHIEVEMENTS_LIST[0], unlockedAt: Date.now() });
    }

    if (!newAchievements.find(a => a.id === 'a3')) {
      const activeCount = updatedProgress.filter(p => p.status === 'active').length;
      if (activeCount >= 3) newAchievements.push({ ...ACHIEVEMENTS_LIST[2], unlockedAt: Date.now() });
    }

    if (!newAchievements.find(a => a.id === 'a5')) {
      const hasCompletedLongChallenge = updatedProgress.some(p => p.status === 'completed' && p.tasks.length >= 30);
      if (hasCompletedLongChallenge) newAchievements.push({ ...ACHIEVEMENTS_LIST[4], unlockedAt: Date.now() });
    }

    if (newAchievements.length !== updatedUser.achievements.length) {
      setUser({ ...updatedUser, achievements: newAchievements });
    }
  };

  const handleJoinChallenge = (challenge: Challenge) => {
    const activeChallengesCount = userProgress.filter(p => p.status === 'active').length;
    if (activeChallengesCount >= 2) {
      setShowBurnoutWarning(challenge);
    } else {
      confirmJoin(challenge);
    }
  };

  const confirmJoin = (challenge: Challenge) => {
    const newProgress: UserProgress = {
      userId: user.id,
      challengeId: challenge.id,
      startDate: Date.now(),
      status: 'active',
      totalPointsEarned: 0,
      tasks: challenge.tasks.map(t => ({ ...t, isCompleted: false })),
      reminderEnabled: true,
      reminderTime: '09:00'
    };
    
    const nextProgress = [...userProgress, newProgress];
    setUserProgress(nextProgress);
    setShowBurnoutWarning(null);
    setActiveTab('dashboard');
    checkAchievements(user, nextProgress);
  };

  const handleDropOut = (challengeId: string) => {
    const nextProgress = userProgress.filter(p => p.challengeId !== challengeId);
    setUserProgress(nextProgress);
    setSelectedChallengeId(null);
  };

  const handleCreateChallenge = (data: any) => {
    const newChallenge: Challenge = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      creatorId: user.id,
      creatorName: user.name,
      pointsValue: data.totalDays * POINTS_PER_TASK
    };
    
    setChallenges([newChallenge, ...challenges]);
    handleJoinChallenge(newChallenge);
  };

  const handleTaskToggle = (taskId: string) => {
    let pointsDelta = 0;
    const nextProgress = userProgress.map(p => {
      if (p.challengeId === selectedChallengeId) {
        const nextTasks = p.tasks.map(t => {
          if (t.id === taskId) {
            const isNowCompleted = !t.isCompleted;
            pointsDelta = isNowCompleted ? POINTS_PER_TASK : -POINTS_PER_TASK;
            return { ...t, isCompleted: isNowCompleted, completedAt: isNowCompleted ? Date.now() : undefined };
          }
          return t;
        });

        const allCompleted = nextTasks.every(t => t.isCompleted);
        const status = allCompleted ? 'completed' : 'active';
        
        return { 
          ...p, 
          status: status as any,
          tasks: nextTasks, 
          totalPointsEarned: nextTasks.filter(t => t.isCompleted).length * POINTS_PER_TASK 
        };
      }
      return p;
    });

    setUser(u => ({
      ...u,
      points: u.points + pointsDelta,
      tickets: pointsDelta > 0 && nextProgress.find(p => p.challengeId === selectedChallengeId)?.status === 'completed' 
        ? u.tickets + TICKETS_PER_COMPLETION 
        : u.tickets
    }));
    setUserProgress(nextProgress);
    checkAchievements({...user, points: user.points + pointsDelta}, nextProgress);
  };

  const handleUpdateSettings = (settings: any) => {
    setUserProgress(prev => prev.map(p => 
      p.challengeId === selectedChallengeId ? { ...p, ...settings } : p
    ));
  };

  const handleTaskEdit = (taskId: string, newDesc: string) => {
    setUserProgress(prev => prev.map(p => 
      p.challengeId === selectedChallengeId ? {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, description: newDesc } : t)
      } : p
    ));
  };

  const currentProgress = userProgress.find(p => p.challengeId === selectedChallengeId);
  const currentChallenge = challenges.find(c => c.id === selectedChallengeId);

  return (
    <div className="min-h-screen pb-28 bg-[#F8FAFC]">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setSelectedChallengeId(null); setActiveTab('dashboard');}}>
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">MASTERY 30</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <i className="fa-solid fa-coins"></i>
                <span className="text-sm">{user.points}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                <i className="fa-solid fa-ticket"></i>
                <span className="text-sm">{user.tickets}</span>
              </div>
            </div>
            <div 
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-sm cursor-pointer hover:scale-110 transition-transform"
              onClick={() => {setSelectedChallengeId(null); setActiveTab('profile');}}
            >
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4">
        {selectedChallengeId ? (
          <ChallengeDetail 
            progress={currentProgress!}
            title={currentChallenge?.title || 'Unknown Challenge'}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
            onUpdateSettings={handleUpdateSettings}
            onDropOut={() => handleDropOut(selectedChallengeId)}
            onBack={() => setSelectedChallengeId(null)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-slate-800 mb-2">My Journey</h1>
                    <p className="text-slate-500">You're currently working on {userProgress.filter(p => p.status === 'active').length} habits.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    <i className="fa-solid fa-plus"></i> New Habit
                  </button>
                </div>

                {userProgress.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                      <i className="fa-solid fa-seedling"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">Begin your evolution</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">Mastering a new skill takes time and consistency. Join a challenge or create your own to start.</p>
                    <button 
                      onClick={() => setActiveTab('marketplace')}
                      className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProgress.map(p => {
                      const c = challenges.find(ch => ch.id === p.challengeId);
                      if (!c) return null;
                      return (
                        <div key={p.challengeId} className="relative group">
                          {p.reminderEnabled && (
                            <div className="absolute -top-2 -right-2 z-10 bg-white border border-slate-100 rounded-lg p-2 shadow-md flex items-center gap-2 text-[10px] font-bold text-slate-500">
                              <i className="fa-solid fa-bell text-indigo-500"></i>
                              {p.reminderTime}
                            </div>
                          )}
                          <ChallengeCard 
                            challenge={c}
                            isJoined={true}
                            onView={(id) => setSelectedChallengeId(id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <h1 className="text-4xl font-black text-slate-800 mb-2">Marketplace</h1>
                  <p className="text-slate-500">Join a challenge and level up with friends.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.filter(c => c.isPublic).map(challenge => (
                    <ChallengeCard 
                      key={challenge.id}
                      challenge={challenge}
                      isJoined={joinedChallengeIds.includes(challenge.id)}
                      onJoin={handleJoinChallenge}
                      onView={(id) => setSelectedChallengeId(id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'create' && (
              <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
                <CreateChallengeForm 
                  onSave={handleCreateChallenge}
                  onCancel={() => setActiveTab('dashboard')}
                />
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileView 
                user={user}
                progress={userProgress}
                challenges={challenges}
                onUpdateUser={(data) => setUser(u => ({ ...u, ...data }))}
              />
            )}
          </>
        )}
      </main>

      {showBurnoutWarning && (
        <BurnoutWarning 
          onConfirm={() => confirmJoin(showBurnoutWarning)}
          onCancel={() => setShowBurnoutWarning(null)}
        />
      )}

      {!selectedChallengeId && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-slate-200 px-3 py-2 rounded-[32px] shadow-2xl z-50 flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-house-user"></i>
            <span className="hidden sm:inline text-xs">HOME</span>
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all ${activeTab === 'marketplace' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-compass"></i>
            <span className="hidden sm:inline text-xs">EXPLORE</span>
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-plus-square"></i>
            <span className="hidden sm:inline text-xs">CREATE</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <i className="fa-solid fa-user-circle"></i>
            <span className="hidden sm:inline text-xs">ME</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
