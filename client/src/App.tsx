import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/dashboard/Dashboard';
import { StudentsList } from './pages/students/StudentsList';
import { StudentDetail } from './pages/students/StudentDetail';
import { ClassroomsList } from './pages/classrooms/ClassroomsList';
import { ClassroomDetail } from './pages/classrooms/ClassroomDetail';
import { ActivitiesPage } from './pages/activities/ActivitiesPage';
import { ActivityPlayer } from './pages/activities/ActivityPlayer';
import { AIPanel } from './pages/ai/AIPanel';
import { ParentPortal } from './pages/parents/ParentPortal';
import { ReportsPage } from './pages/reports/ReportsPage';
import { LibraryPage } from './pages/library/LibraryPage';
import { BookReader } from './pages/library/BookReader';
import { GamificationPage } from './pages/gamification/GamificationPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="classrooms" element={<ClassroomsList />} />
        <Route path="classrooms/:id" element={<ClassroomDetail />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/:id" element={<ActivityPlayer />} />
        <Route path="parents" element={<ParentPortal />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:id" element={<BookReader />} />
        <Route path="gamification" element={<GamificationPage />} />
        <Route path="ai" element={<AIPanel />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
