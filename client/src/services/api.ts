import {
  User,
  Student,
  Classroom,
  Activity,
  ProgressAttempt,
  AIEvaluation,
  DashboardStats,
  Notification,
  Badge,
  WeeklyGoal,
  Book,
  GamificationProfile,
  MonthlyComparison
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('yachay_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // AUTH
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse<{
        token: string;
        user: User;
        studentProfile?: Student;
        childrenProfiles?: Student[];
      }>(res);
    },

    register: async (data: any) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse<{ token: string; user: User }>(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse<{
        user: User;
        studentProfile?: Student;
        childrenProfiles?: Student[];
      }>(res);
    },

    recoverPassword: async (email: string) => {
      const res = await fetch(`${API_BASE}/auth/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return handleResponse<{ message: string; resetToken?: string }>(res);
    },

    resetPassword: async (data: { token?: string; email?: string; newPassword: string }) => {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse<{ message: string }>(res);
    }
  },

  // STUDENTS
  students: {
    getAll: async (classroomId?: number): Promise<Student[]> => {
      const url = classroomId ? `${API_BASE}/students?classroomId=${classroomId}` : `${API_BASE}/students`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse<Student[]>(res);
    },

    getById: async (id: number): Promise<{
      student: Student;
      recentAttempts: ProgressAttempt[];
      totalAttempts: number;
      aiEvaluation: AIEvaluation | null;
    }> => {
      const res = await fetch(`${API_BASE}/students/${id}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    },

    getHistory: async (id: number): Promise<ProgressAttempt[]> => {
      const res = await fetch(`${API_BASE}/students/${id}/history`, { headers: getAuthHeaders() });
      return handleResponse<ProgressAttempt[]>(res);
    },

    create: async (data: any): Promise<Student> => {
      const res = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<Student>(res);
    },

    update: async (id: number, data: Partial<Student>): Promise<Student> => {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<Student>(res);
    }
  },

  // CLASSROOMS
  classrooms: {
    getAll: async (teacherId?: number): Promise<Classroom[]> => {
      const url = teacherId ? `${API_BASE}/classrooms?teacherId=${teacherId}` : `${API_BASE}/classrooms`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse<Classroom[]>(res);
    },

    getById: async (id: number): Promise<{
      classroom: Classroom;
      students: Student[];
      metrics: {
        totalStudents: number;
        averageAccuracy: number;
        averageWpm: number;
        totalActivitiesDone: number;
      };
    }> => {
      const res = await fetch(`${API_BASE}/classrooms/${id}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    },

    create: async (data: any): Promise<Classroom> => {
      const res = await fetch(`${API_BASE}/classrooms`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<Classroom>(res);
    }
  },

  // ACTIVITIES
  activities: {
    getAll: async (category?: string, level?: string): Promise<Activity[]> => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (level) params.append('level', level);
      const url = `${API_BASE}/activities?${params.toString()}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse<Activity[]>(res);
    },

    getById: async (id: number): Promise<Activity> => {
      const res = await fetch(`${API_BASE}/activities/${id}`, { headers: getAuthHeaders() });
      return handleResponse<Activity>(res);
    },

    create: async (data: any): Promise<Activity> => {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse<Activity>(res);
    }
  },

  // PROGRESS
  progress: {
    recordAttempt: async (attempt: {
      student_id: number;
      activity_id: number;
      score: number;
      max_score: number;
      accuracy_percentage: number;
      words_per_minute: number;
      time_spent_seconds: number;
      details_json?: any;
    }) => {
      const res = await fetch(`${API_BASE}/progress/attempt`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attempt)
      });
      return handleResponse<any>(res);
    },

    getStudentProgress: async (studentId: number): Promise<ProgressAttempt[]> => {
      const res = await fetch(`${API_BASE}/progress/student/${studentId}`, { headers: getAuthHeaders() });
      return handleResponse<ProgressAttempt[]>(res);
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
      const res = await fetch(`${API_BASE}/progress/stats/dashboard`, { headers: getAuthHeaders() });
      return handleResponse<DashboardStats>(res);
    }
  },

  // AI
  ai: {
    diagnose: async (studentId: number): Promise<{
      evaluation: AIEvaluation;
      suggestedLevel: string;
      studentName: string;
      aiEngine: string;
    }> => {
      const res = await fetch(`${API_BASE}/ai/diagnose/${studentId}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    },

    getRecommendation: async (studentId: number): Promise<{
      studentName: string;
      currentLevel: string;
      recommendedActivity: Activity;
      reason: string;
    }> => {
      const res = await fetch(`${API_BASE}/ai/recommend/${studentId}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    }
  },

  // REPORTS
  reports: {
    getAcademic: async (classroomId?: number, studentId?: number) => {
      const params = new URLSearchParams();
      if (classroomId) params.append('classroomId', classroomId.toString());
      if (studentId) params.append('studentId', studentId.toString());
      const res = await fetch(`${API_BASE}/reports/academic?${params.toString()}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    },

    getExportData: async () => {
      const res = await fetch(`${API_BASE}/reports/export-data`, { headers: getAuthHeaders() });
      return handleResponse<{
        title: string;
        date: string;
        rows: any[];
      }>(res);
    },

    getMonthlyComparison: async (): Promise<MonthlyComparison> => {
      const res = await fetch(`${API_BASE}/reports/monthly-comparison`, { headers: getAuthHeaders() });
      return handleResponse<MonthlyComparison>(res);
    }
  },

  // NOTIFICATIONS
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
      return handleResponse<Notification[]>(res);
    }
  },

  // BIBLIOTECA DIGITAL
  library: {
    getBooks: async (category?: string, level?: string): Promise<Book[]> => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (level) params.append('level', level);
      const res = await fetch(`${API_BASE}/library?${params.toString()}`, { headers: getAuthHeaders() });
      return handleResponse<Book[]>(res);
    },

    getBookById: async (id: number): Promise<Book> => {
      const res = await fetch(`${API_BASE}/library/${id}`, { headers: getAuthHeaders() });
      return handleResponse<Book>(res);
    },

    toggleFavorite: async (id: number): Promise<{ id: number; isFavorite: boolean }> => {
      const res = await fetch(`${API_BASE}/library/${id}/favorite`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse<{ id: number; isFavorite: boolean }>(res);
    }
  },

  // GAMIFICACIÓN
  gamification: {
    getProfile: async (studentId?: number): Promise<GamificationProfile> => {
      const url = studentId ? `${API_BASE}/gamification/profile?studentId=${studentId}` : `${API_BASE}/gamification/profile`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse<GamificationProfile>(res);
    },

    purchaseItem: async (itemId: number, studentId: number) => {
      const res = await fetch(`${API_BASE}/gamification/purchase`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ itemId, studentId })
      });
      return handleResponse<any>(res);
    },

    claimGoal: async (goalId: number, studentId: number) => {
      const res = await fetch(`${API_BASE}/gamification/claim-goal`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ goalId, studentId })
      });
      return handleResponse<any>(res);
    }
  }
};
