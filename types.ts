
export interface Task {
  id: string;
  day: number;
  description: string;
  isCompleted: boolean;
  completedAt?: number;
  proofUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface Challenge {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  totalDays: number;
  target: string;
  category: string;
  isPublic: boolean;
  approvalRequired: boolean;
  pointsValue: number;
  tasks: Task[];
}

export interface UserProgress {
  userId: string;
  challengeId: string;
  startDate: number;
  tasks: Task[];
  status: 'active' | 'completed' | 'failed';
  totalPointsEarned: number;
  reminderEnabled: boolean;
  reminderTime: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  points: number;
  tickets: number;
  currentTitle: string;
  achievements: Achievement[];
}
