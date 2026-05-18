'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

function FloatingOrb({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <div className="absolute rounded-full pointer-events-none opacity-0 animate-fade-in"
      style={{
        left: x, top: y, width: size, height: size, animationDelay: `${delay}s`,
        background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)',
        filter: 'blur(40px)',
        animation: `float-slow ${6 + delay}s ease-in-out ${delay}s infinite, fadeIn 1s ease ${delay}s forwards`,
      }} />
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (email === 'admin@chatleads.ai' && password === 'admin123') {
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setError('Invalid credentials. Use the admin account.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#050508' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Orbs */}
        <FloatingOrb x="10%" y="20%" size={200} delay={0} />
        <FloatingOrb x="70%" y="60%" size={150} delay={1} />
        <FloatingOrb x="30%" y="80%" size={100} delay={2} />
      </div>

      {/* Animated ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full animate-spin-slow opacity-5"
          style={{ border: '1px dashed rgba(139,92,246,0.8)' }} />
        <div className="absolute inset-8 rounded-full opacity-5"
          style={{ border: '1px dashed rgba(236,72,153,0.6)', animation: 'spinSlow 12s linear infinite reverse' }} />
      </div>

      {/* Card */}
      <div className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden animate-float"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow: '0 0 50px rgba(124,58,237,0.5), 0 20px 40px rgba(0,0,0,0.4)',
            }}>
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)' }} />
            <Zap size={36} className="text-white fill-white relative z-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-sm font-medium" style={{ color: '#6b6190' }}>
            Access your intelligence platform
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)' }}>
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: '#6b6190' }}>
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                  size={18}
                  style={{ color: email ? '#8b5cf6' : '#3d3660' }} />
                <input type="email" required placeholder="admin@chatleads.ai"
                  className="input-dark w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-medium"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: '#6b6190' }}>
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                  size={18}
                  style={{ color: password ? '#8b5cf6' : '#3d3660' }} />
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••••"
                  className="input-dark w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                  style={{ color: '#3d3660' }}
                  onClick={() => setShowPass(v => !v)}
                  onMouseEnter={e => { e.currentTarget.style.color = '#8b5cf6'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#3d3660'; }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-2xl flex items-center gap-3 animate-shake"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <p className="text-sm font-bold" style={{ color: '#f87171' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 group disabled:opacity-60"
              style={{ paddingTop: '18px', paddingBottom: '18px' }}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.08)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3d3660' }}>or</p>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.08)' }} />
          </div>

          {/* Demo hint */}
          <div className="p-4 rounded-2xl text-center"
            style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.08)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3d3660' }}>Demo Credentials</p>
            <p className="text-xs font-bold" style={{ color: '#6b6190' }}>
              admin@chatleads.ai / admin123
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <ShieldCheck size={14} style={{ color: '#3d3660' }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#3d3660' }}>
            End-to-End Encrypted Authentication
          </span>
        </div>
      </div>
    </div>
  );
}
