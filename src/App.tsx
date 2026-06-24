import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { DarkModeProvider } from './DarkModeContext';
import { AppNavigation } from './components/BottomNavBar';

import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { StudyGuideWrapper } from './components/StudyGuide';
import { DailyPuzzle } from './components/DailyPuzzle';
import { Leaderboard } from './components/Leaderboard';
import { LiveChallenge } from './components/LiveChallenge';
import { Profile } from './components/Profile';
import { AdminPage } from './components/AdminPage';
import { LevelSelection } from './components/LevelSelection';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    if (user && profile && profile.level === 'pending' && location.pathname !== '/select-level') {
      navigate('/select-level', { replace: true });
    }
  }, [user, profile, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex bg-surface text-on-surface w-full min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="font-semibold text-on-surface/60">Loading EcoMastery...</p>
        </div>
      </div>
    );
  }

  const showNav = !!(user && profile && profile.level !== 'pending' && location.pathname !== '/select-level');

  return (
    <div className="flex bg-surface text-on-surface w-full min-h-screen">
      {showNav && <AppNavigation />}
      <div className={`flex-grow w-full max-w-full ${showNav ? 'md:ml-[88px]' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          {user ? (
            <>
              <Route path="/select-level" element={<LevelSelection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study" element={<Dashboard />} />
              <Route path="/study-guide/:topicId" element={<StudyGuideWrapper />} />
              <Route path="/daily-puzzle" element={<DailyPuzzle />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/live" element={<LiveChallenge />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPage />} />
            </>
          ) : null}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <AppContent />
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

