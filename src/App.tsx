import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './useAuth';
import { DarkModeProvider } from './DarkModeContext';
import { AppNavigation } from './components/BottomNavBar';
import { AuthModal } from './components/AuthModal';

import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { StudyGuideWrapper } from './components/StudyGuide';
import { DailyPuzzle } from './components/DailyPuzzle';
import { Leaderboard } from './components/Leaderboard';
import { LiveChallenge } from './components/LiveChallenge';
import { Profile } from './components/Profile';
import { AdminPage } from './components/AdminPage';

function AppContent() {
  return (
    <div className="flex bg-surface text-on-surface w-full min-h-screen">
      <AppNavigation />
      <div className="flex-1 md:ml-[88px] w-full max-w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<Dashboard />} />
          <Route path="/study-guide/:topicId" element={<StudyGuideWrapper />} />
          <Route path="/daily-puzzle" element={<DailyPuzzle />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/live" element={<LiveChallenge />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <AuthModal />
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

