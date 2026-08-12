import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("errorSignIn"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-6">
          <LanguageToggle />
        </div>

        <div className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-champagne/70 font-medium">
            {t("appName")} {t("adminLabel")}
          </span>
          <h1 className="font-display text-4xl text-noir mt-3">
            {t("welcomeBack")}
          </h1>
          <p className="text-charcoal/70 text-sm mt-2">{t("signInSubtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-pearl rounded-xl shadow-sm border border-mist px-8 pt-8 pb-8"
        >
          {error && (
            <div className="mb-5 text-sm text-noir bg-noir/5 border border-noir/10 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <label className="block mb-5">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              {t("username")}
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-mist px-4 py-3 text-sm text-noir focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
              placeholder="admin"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              {t("password")}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-mist px-4 py-3 text-sm text-noir focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-noir text-pearl text-sm font-medium rounded-lg py-3 hover:bg-charcoal transition-colors disabled:opacity-60"
          >
            {submitting ? t("signingIn") : t("signIn")}
          </button>
        </form>

        <p className="text-center text-xs text-shadow/50 mt-8">
          {t("noSignupNote")}
        </p>
      </div>
    </div>
  );
};

export default Login;
