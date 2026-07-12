import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils';

export function LoginPage(): React.JSX.Element {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@transitops.io');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[55%] p-12 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #0d1a33 100%)' }}>
        {/* Ambient grid */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(34,211,238,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139,92,246,0.06) 0%, transparent 50%),
              linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
          }}
          aria-hidden
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-violet-600/10 rounded-full blur-3xl" aria-hidden />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">TransitOps</span>
            <p className="text-xs text-slate-600 mt-0.5 tracking-wide">Smart Transport Operations</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
            Command your
            <br />
            <span className="text-gradient-cyan">
              entire fleet
            </span>
            <br />
            from one place.
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-md">
            Real-time tracking, driver management, trip analytics, and maintenance scheduling — all in a single, powerful dashboard.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex gap-8">
            {[
              { value: '6+', label: 'Vehicles Tracked' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Monitoring' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
                <p className="text-xs text-slate-600 mt-0.5 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative border-l-2 border-cyan-500/30 pl-4">
          <p className="text-slate-500 text-sm italic leading-relaxed">
            &ldquo;TransitOps gave us complete visibility into our operations. Response time dropped by 40%.&rdquo;
          </p>
          <p className="text-slate-700 text-xs mt-1">— Operations Manager, City Transit</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TransitOps</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your TransitOps account</p>
          </div>

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm input-premium"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm input-premium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg btn-base',
                'text-white text-sm font-semibold',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900'
              )}
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-xl border"
               style={{ background: 'rgba(15,23,42,0.5)', borderColor: 'rgba(34,211,238,0.12)' }}>
            <p className="text-xs font-semibold text-slate-500 mb-2">🔑 Demo credentials</p>
            <p className="text-xs text-slate-600 font-mono">Email: alex.morgan@transitops.io</p>
            <p className="text-xs text-slate-600 font-mono">Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
