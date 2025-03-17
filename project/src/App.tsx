import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Quiz } from './components/Quiz';
import { Leaderboard } from './components/Leaderboard';
import { Navbar } from './components/Navbar';
import { AuthForm } from './components/AuthForm';
import { ConfirmEmailPage } from './components/ConfirmEmailPage';
import Cookies from 'js-cookie';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const username = Cookies.get('username');
  return username ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Routes>
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/register" element={<AuthForm type="register" />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-pink-600 mb-4">Welcome to KidsLearn!</h1>
                    <p className="text-gray-700 mb-8">Choose a quiz level to start learning</p>
                    {/* Quiz level selection will be added here */}
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <PrivateRoute>
                  <Quiz questions={[]} onComplete={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard users={[]} />
                </PrivateRoute>
              }
            />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;