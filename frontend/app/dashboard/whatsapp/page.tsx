'use client';

import React, { useEffect, useState } from 'react';
import {
  Smartphone, ShieldCheck, Zap, Loader2, Lock,
  Wifi, Plus, Trash2, Server, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Session {
  id: number; session_id: string; status: string;
  qr_code: string | null; last_seen: string;
}

function ClockIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SessionCard({ session, onDelete, isDeleting }: { session: Session; onDelete: () => void; isDeleting: boolean }) {
  const isConnected = session.status === 'connected';
  const hasQR = !!session.qr_code;

  return (
    <div className={`glass-card rounded-3xl flex flex-col overflow-hidden relative transition-all duration-500 ${
      isDeleting ? 'opacity-40 scale-95' : 'glass-card-hover'
    }`}>
      {isDeleting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-3 rounded-3xl"
          style={{ background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(8px)' }}>
          <Loader2 className="animate-spin text-red-400" size={36} />
          <p className="text-red-400 font-black text-xs uppercase tracking-widest">Purging Session...</p>
        </div>
      )}

      {/* Card Header */}
      <div className="p-6 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
            style={{
              background: isConnected
                ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))'
                : 'rgba(139,92,246,0.08)',
              border: `1px solid ${isConnected ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.12)'}`,
            }}>
            {isConnected && (
              <div className="absolute inset-0 rounded-2xl opacity-50"
                style={{ animation: 'ping-slow 2s ease-out infinite', background: 'rgba(16,185,129,0.15)' }} />
            )}
            <Smartphone size={22} className={isConnected ? 'text-emerald-400' : 'text-[#6b6190]'} />
          </div>
          <div>
            <h4 className="font-black text-white capitalize">
              {session.session_id.replace(/_/g, ' ')}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#3d3660]'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#6b6190' }}>
                {session.status}
              </span>
            </div>
          </div>
        </div>

        <button onClick={onDelete}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'rgba(239,68,68,0.06)', color: '#6b6190', border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#6b6190'; e.currentTarget.style.borderColor = 'transparent'; }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
        {isConnected ? (
          <div className="text-center space-y-5">
            {/* Connected glow ring */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'scale(1.5)' }} />
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
                <ShieldCheck size={40} className="text-emerald-400" />
              </div>
            </div>
            <div>
              <p className="text-lg font-black text-white">Secured & Active</p>
              <p className="text-xs font-medium mt-2 leading-relaxed" style={{ color: '#6b6190' }}>
                Encrypted session active.<br />Monitoring incoming leads.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
              <Wifi size={14} /> Live Sync
            </div>
          </div>
        ) : hasQR ? (
          <div className="text-center space-y-5">
            <div className="p-5 rounded-2xl inline-block relative"
              style={{ background: 'white', boxShadow: '0 0 40px rgba(139,92,246,0.3)', border: '3px solid rgba(139,92,246,0.2)' }}>
              <QRCodeSVG value={session.qr_code!} size={180} level="H" fgColor="#0f0020" />
            </div>
            <div>
              <p className="text-base font-black text-white">Scan to Connect</p>
              <p className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: '#6b6190' }}>
                Open WhatsApp → Linked Devices → Link a Device
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full animate-spin"
                style={{ border: '3px solid rgba(139,92,246,0.1)', borderTopColor: '#8b5cf6' }} />
              <div className="absolute inset-3 rounded-full animate-spin"
                style={{ border: '2px solid rgba(139,92,246,0.05)', borderBottomColor: '#a78bfa', animationDirection: 'reverse', animationDuration: '0.7s' }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse" style={{ color: '#6b6190' }}>
              Requesting QR Token...
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-5 grid grid-cols-2 gap-3"
        style={{ borderTop: '1px solid rgba(139,92,246,0.06)', background: 'rgba(5,5,8,0.3)' }}>
        <div className="flex items-center gap-2">
          <Lock size={13} style={{ color: '#3d3660' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6b6190' }}>E2EE Ready</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ClockIcon size={13} className="text-[#3d3660]" />
          <span className="text-[10px] font-bold" style={{ color: '#6b6190' }}>
            {new Date(session.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSessionId, setNewSessionId] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${apiUrl}/sessions/`);
      if (!res.ok) throw new Error();
      setSessions(await res.json());
      setError(false); setLoading(false);
    } catch { setError(true); setLoading(false); }
  };

  useEffect(() => {
    fetchSessions();
    const rawWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    const wsUrl = rawWsUrl.endsWith('/ws') ? rawWsUrl : `${rawWsUrl.replace(/\/$/, '')}/ws`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      const ping = setInterval(() => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ type: 'ping' })), 30000);
      ws.addEventListener('close', () => clearInterval(ping));
    };
    ws.onmessage = e => { try { const m = JSON.parse(e.data); if (m.event === 'session_updated') fetchSessions(); } catch {} };
    return () => ws.close();
  }, []);

  const handleCreate = async () => {
    if (!newSessionId.trim()) return;
    try {
      await fetch(`${apiUrl}/sessions/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: newSessionId.toLowerCase().replace(/\s+/g, '_') })
      });
      setNewSessionId(''); setShowModal(false); fetchSessions();
    } catch {}
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm(`Permanently delete "${sessionId}"?`)) return;
    setDeletingSessionId(sessionId);
    try {
      await fetch(`${apiUrl}/sessions/${sessionId}`, { method: 'DELETE' });
      fetchSessions();
    } catch (e) { alert(`Delete failed: ${e instanceof Error ? e.message : 'Unknown error'}`); }
    finally { setDeletingSessionId(null); }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-lg rounded-3xl p-10 space-y-6 animate-scale-in"
            style={{ background: 'rgba(13,13,26,0.98)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white">Link New Device</h3>
                <p className="text-sm mt-1" style={{ color: '#6b6190' }}>Assign a unique identifier for this WhatsApp instance.</p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(139,92,246,0.08)', color: '#6b6190' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.color = '#a78bfa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#6b6190'; }}>
                <X size={16} />
              </button>
            </div>
            <input type="text" placeholder="e.g. Sales Team, Support Line"
              className="input-dark w-full px-6 py-4 rounded-2xl font-bold text-sm"
              value={newSessionId}
              onChange={e => setNewSessionId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()} />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)', color: '#6b6190' }}>
                Cancel
              </button>
              <button onClick={handleCreate}
                className="btn-primary flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                Initialize Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.15))', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Zap size={18} className="text-purple-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-500">Integration Console</p>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-white mb-2">
            Device <span className="gradient-text">Fleet</span>
          </h2>
          <p className="font-medium" style={{ color: '#a89fd4' }}>
            Manage WhatsApp instances for cross-channel lead capture.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="btn-primary px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Link New Device
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full animate-spin"
              style={{ border: '3px solid rgba(139,92,246,0.1)', borderTopColor: '#8b5cf6' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone size={18} className="text-purple-500" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#6b6190' }}>
            Syncing Session Fleet...
          </p>
        </div>
      ) : error ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-5 rounded-3xl"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Server size={36} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-white">Connection Interrupted</h3>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b6190' }}>
            Attempting to Re-Sync with Hub...
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 text-center space-y-5"
          style={{ border: '1px dashed rgba(139,92,246,0.15)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
            <Smartphone size={36} style={{ color: '#3d3660' }} />
          </div>
          <h3 className="text-xl font-black text-white">No Active Sessions</h3>
          <p className="max-w-sm mx-auto text-sm" style={{ color: '#6b6190' }}>
            Start by linking your primary WhatsApp account to begin capturing lead intelligence.
          </p>
          <button onClick={() => setShowModal(true)}
            className="btn-primary inline-flex px-8 py-4 rounded-2xl font-black text-sm items-center gap-2">
            <Plus size={16} /> Link First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {sessions.map(s => (
            <SessionCard key={s.id} session={s}
              onDelete={() => handleDelete(s.session_id)}
              isDeleting={deletingSessionId === s.session_id} />
          ))}
        </div>
      )}
    </div>
  );
}
