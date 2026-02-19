import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DailyTracker from './components/DailyTracker';
import ProgressOverview from './components/ProgressOverview';
import MatrixView from './components/MatrixView';
import BottomNavigation from './components/BottomNavigation';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DailyTracker />} />
          <Route path="/today" element={<DailyTracker />} />
          <Route path="/progress" element={<ProgressOverview />} />
          <Route path="/matrix" element={<MatrixView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}

export default App;
