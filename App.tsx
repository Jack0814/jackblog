import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { Login } from './pages/Login';
import { Editor } from './pages/Admin/Editor';
import { storageService } from './services/storage';
import { User } from './types';

interface PrivateRouteProps {
  children: React.ReactNode;
  user: User | null;
}

// Simple PrivateRoute wrapper
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, user }) => {
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // User State
  const [user, setUser] = useState<User | null>(null);

  // Initialize Auth
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle Theme Change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
  };

  const handleLogin = () => {
    const u = storageService.getCurrentUser();
    setUser(u);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
        <Navbar 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/admin/editor" 
            element={
              <PrivateRoute user={user}>
                <Editor user={user!} />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;