import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/common/Navbar';
import Home from './components/home/Home';
import ChatSession from './components/chat/ChatSession';
import Settings from './components/settings/Settings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import History from './components/history/History';
import SessionDetail from './components/history/SessionDetail';
import FeedbackPage from './components/feedback/FeedbackPage';
import AdminRoute from './components/auth/AdminRoute';
import AdminPanel from './components/admin/AdminPanel';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <AuthProvider>
        <SessionProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
            path="/chat" 
            element={
              <PrivateRoute>
              <ChatSession />
              </PrivateRoute>
            } 
            />
            <Route 
            path="/history" 
            element={
              <PrivateRoute>
              <History />
              </PrivateRoute>
            } 
            />
            <Route 
            path="/history/:sessionId" 
            element={
              <PrivateRoute>
              <SessionDetail />
              </PrivateRoute>
            } 
            />
            <Route 
            path="/settings" 
            element={
              <PrivateRoute>
              <Settings />
              </PrivateRoute>
            } 
            />
            <Route
            path="/feedback"
            element={
              <PrivateRoute>
              <FeedbackPage />
              </PrivateRoute>
            }
            />
            <Route
            path="/admin"
            element={
              <AdminRoute>
              <AdminPanel />
              </AdminRoute>
            }
            />
          </Routes>
          </main>
        </div>
        </SessionProvider>
      </AuthProvider>
      </Router>
    </ErrorBoundary>

  );
}

export default App;
