export type Role = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  created_at?: string;
}

export interface Classroom {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher_id: number;
  teacher_name?: string;
  student_count?: number;
  academic_year: string;
  created_at?: string;
}

export interface Student {
  id: number;
  user_id?: number;
  classroom_id: number;
  classroom_name?: string;
  classroom_grade?: string;
  classroom_section?: string;
  first_name: string;
  last_name: string;
  age: number;
  grade: string;
  reading_level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  avatar: string;
  streak_days: number;
  total_stars: number;
  relationship?: string;
  created_at?: string;
}

export interface Activity {
  id: number;
  title: string;
  category: 'letters' | 'syllables' | 'words' | 'sentences' | 'comprehension' | 'games';
  level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content_json: any;
  points: number;
  created_at?: string;
}

export interface ProgressAttempt {
  id: number;
  student_id: number;
  activity_id: number;
  activity_title?: string;
  activity_category?: string;
  activity_level?: string;
  score: number;
  max_score: number;
  accuracy_percentage: number;
  words_per_minute: number;
  time_spent_seconds: number;
  details_json?: any;
  completed_at: string;
  first_name?: string;
  last_name?: string;
}

export interface AIEvaluation {
  id: number;
  student_id: number;
  reading_level: string;
  words_per_minute: number;
  accuracy: number;
  comprehension_score: number;
  strengths: string[];
  difficulties: string[];
  recommendations: string[];
  pedagogical_action_plan: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClassrooms: number;
  totalActivities: number;
  totalAttempts: number;
  avgAccuracy: number;
  avgWpm: number;
  totalReadingMinutes: number;
  levelDistribution: {
    Inicial: number;
    Básico: number;
    Intermedio: number;
    Avanzado: number;
  };
  attemptsByCategory: { name: string; value: number }[];
  weeklyEvolution: { day: string; wpm: number; precision: number; minutos: number }[];
}

// Gamification Models
export interface Badge {
  id: number;
  title: string;
  description: string;
  category: 'fonologia' | 'velocidad' | 'constancia' | 'comprension';
  tier: 'Bronce' | 'Plata' | 'Oro' | 'Diamante';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardXP: number;
}

export interface WeeklyGoal {
  id: number;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  rewardStars: number;
  completed: boolean;
}

export interface RewardItem {
  id: number;
  name: string;
  category: 'avatar' | 'marco' | 'fondo';
  costStars: number;
  icon: string;
  unlocked: boolean;
}

export interface GamificationProfile {
  studentId: number;
  studentName: string;
  level: number;
  rankTitle: string;
  totalXP: number;
  xpInLevel: number;
  nextLevelXP: number;
  totalStars: number;
  streakDays: number;
  badges: Badge[];
  weeklyGoals: WeeklyGoal[];
  storeItems: RewardItem[];
}

// Digital Library Book Model
export interface Book {
  id: number;
  title: string;
  author: string;
  category: 'Cuentos Andinos' | 'Fábulas y Valores' | 'Aventuras Mágicas' | 'Ciencia para Niños';
  level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  readTimeMinutes: number;
  coverImage: string;
  description: string;
  isFavorite: boolean;
  paragraphs: string[];
  vocabularyWords: { word: string; meaning: string }[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

// Monthly Comparison Report Model
export interface MonthlyComparison {
  schoolYear: string;
  institution: string;
  growthPercentage: string;
  accuracyIncrease: string;
  monthlyData: {
    mes: string;
    wpm: number;
    precision: number;
    minutos: number;
    actividades: number;
    metaPPM: number;
  }[];
  competenciesRadar: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
}
