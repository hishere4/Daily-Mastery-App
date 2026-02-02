
export const APP_NAME = "Mastery30";
export const POINTS_PER_TASK = 10;
export const TICKETS_PER_COMPLETION = 5;

export const CATEGORIES = [
  "Fitness", "Coding", "Reading", "Meditation", "Art", "Writing", "Language", "Social"
];

export const TITLES = [
  "The Novice",
  "Habit Architect",
  "Consistency King",
  "N-Day Legend",
  "Unstoppable Force"
];

export const ENCOURAGEMENTS = [
  "Consistency is the key!",
  "Another step closer to mastery!",
  "You're crushing this!",
  "Great job showing up today.",
  "Your future self is thanking you!",
  "Keep that momentum going!",
  "Boom! Task smashed."
];

export const ACHIEVEMENTS_LIST = [
  { id: 'a1', title: 'First Step', description: 'Complete your first task', icon: 'fa-shoe-prints' },
  { id: 'a2', title: 'Streak Starter', description: 'Complete 7 days in a row', icon: 'fa-fire' },
  { id: 'a3', title: 'Multi-Tasker', description: 'Have 3 active challenges', icon: 'fa-layer-group' },
  { id: 'a4', title: 'Social Butterfly', description: 'Join a public challenge', icon: 'fa-people-group' },
  { id: 'a5', title: 'Mastery Attained', description: 'Finish a 30+ day challenge', icon: 'fa-crown' }
];

export const MOCK_CHALLENGES = [
  {
    id: 'c1',
    creatorId: 'u1',
    creatorName: 'Alex Rivers',
    title: '30 Days of Python',
    description: 'Learn Python from scratch by building small projects every day.',
    totalDays: 30,
    target: 'Build a full web app',
    category: 'Coding',
    isPublic: true,
    approvalRequired: false,
    pointsValue: 300,
    tasks: []
  },
  {
    id: 'c2',
    creatorId: 'u2',
    creatorName: 'Sarah Jenkins',
    title: '100 Days of Motion',
    description: 'Walk or run at least 5km every single day.',
    totalDays: 100,
    target: 'Improve cardiovascular health',
    category: 'Fitness',
    isPublic: true,
    approvalRequired: true,
    pointsValue: 1000,
    tasks: []
  }
];
