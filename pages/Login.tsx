import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await storageService.login(password);
      if (user) {
        onLogin();
        navigate('/admin/editor');
      } else {
        setError('Invalid password (hint: admin123)');
      }
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Hint: Password is 'admin123'
        </p>
      </div>
    </div>
  );
};
