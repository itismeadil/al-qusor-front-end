import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        <div className="text-center mb-8">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-slate/60 font-medium">
            {t('appName')} Admin
          </span>
          <h1 className="font-display text-3xl text-ink mt-2">{t('welcomeBack')}</h1>
          <p className="text-slate/70 text-sm mt-1">{t('signInSubtitle')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="tag-edge bg-white rounded-b-xl rounded-t-sm shadow-sm border border-line px-7 pt-8 pb-7"
        >
          {error && (
            <div className="mb-5 text-sm text-clay bg-clay/5 border border-clay/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('username')}</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay/50"
              placeholder="admin"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay/50"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper text-sm font-medium rounded-md py-2.5 hover:bg-clay transition-colors disabled:opacity-60"
          >
            {submitting ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <p className="text-center text-xs text-slate/50 mt-6">{t('noSignupNote')}</p>
      </div>
    </div>
  );
};

export default Login;
