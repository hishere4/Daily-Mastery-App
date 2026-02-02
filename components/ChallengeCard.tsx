
import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challenge: Challenge) => void;
  onView?: (challengeId: string) => void;
  isJoined?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin, onView, isJoined }) => {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow border border-slate-100 flex flex-col h-full hover:border-indigo-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          {challenge.category}
        </span>
        <span className="text-slate-400 text-sm">
          {challenge.totalDays} Days
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">{challenge.title}</h3>
      <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
        {challenge.description}
      </p>
      
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
          <i className="fa-solid fa-user text-[10px]"></i>
        </div>
        <span>Created by <strong>{challenge.creatorName}</strong></span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-amber-500 font-bold">
          <i className="fa-solid fa-coins mr-2"></i>
          {challenge.totalDays * 10}
        </div>
        
        {isJoined ? (
          <button 
            onClick={() => onView?.(challenge.id)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={() => onJoin?.(challenge)}
            className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
