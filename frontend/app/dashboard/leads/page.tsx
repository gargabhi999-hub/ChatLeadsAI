'use client';

import React, { useEffect, useState } from 'react';
import {
  Search, Download, User, Building2, Calendar,
  Zap, Phone, Mail, ShieldCheck, Trash2, MessageCircle, Server
} from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Lead {
  id: number; extracted_name: string; mobile: string; email: string;
  company: string; lead_score: string; confidence: number;
  source_message: string; session_id: string; created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterScore, setFilterScore] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<{session_id: string; lead_count: number}[]>([]);
  const [selectedExportSessions, setSelectedExportSessions] = useState<string[]>([]);

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  const rawWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
  const wsUrl = rawWsUrl.endsWith('/ws') ? rawWsUrl : `${rawWsUrl.replace(/\/$/, '')}/ws`;
  const { lastMessage } = useWebSocket(wsUrl);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('query', searchTerm);
      if (filterSession) params.append('session_id', filterSession);
      if (filterScore) params.append('score', filterScore);
      const res = await fetch(`${apiUrl}/contacts/?${params}`);
      if (!res.ok) throw new Error();
      setLeads(await res.json());
      setError(false); setLoading(false);
    } catch { setError(true); setLoading(false); }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${apiUrl}/contacts/sessions`);
      if (res.ok) setAvailableSessions(await res.json());
    } catch {}
  };

  const openExportModal = () => { fetchSessions(); setSelectedExportSessions(filterSession ? [filterSession] : []); setShowExportModal(true); };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('query', searchTerm);
    if (filterScore) params.append('score', filterScore);
    selectedExportSessions.forEach(s => params.append('session_ids', s));
    window.location.href = `${apiUrl}/contacts/export?${params}`;
    setShowExportModal(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`${apiUrl}/contacts/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null); fetchLeads();
  };

  const confirmDeleteAll = async () => {
    await fetch(`${apiUrl}/contacts/all`, { method: 'DELETE' });
    setShowDeleteAll(false); fetchLeads();
  };

  useEffect(() => { fetchLeads(); }, [searchTerm, filterSession, filterScore]);
  useEffect(() => { if (lastMessage?.event === 'lead_updated') fetchLeads(); }, [lastMessage]);

  /* ── Modal wrapper ── */
  const Modal = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full sm:max-w-md animate-scale-in rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 sm:p-10 space-y-6 max-h-[85vh] sm:max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar"
        style={{ background: 'rgba(13,13,26,0.98)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)' }}>
        {children}
      </div>
    </div>
  );

  const selectStyle = {
    background: 'rgba(8,8,16,0.8)', border: '1px solid rgba(139,92,246,0.12)',
    color: '#a89fd4', borderRadius: '1rem', padding: '1rem 1.5rem',
    fontSize: '0.875rem', fontWeight: '700', outline: 'none', appearance: 'none' as const,
    cursor: 'pointer', width: '100%'
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">

      {/* ── Delete Modal ── */}
      {deleteId && (
        <Modal>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <Trash2 size={28} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-center text-white">Purge Lead?</h3>
          <p className="text-center text-sm" style={{ color: '#a89fd4' }}>
            This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)', color: '#6b6190' }}>
              Cancel
            </button>
            <button onClick={confirmDelete}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}>
              Delete Forever
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete All Modal ── */}
      {showDeleteAll && (
        <Modal>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>
            <ShieldCheck size={28} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-center text-white">System Wipe?</h3>
          <p className="text-center text-sm" style={{ color: '#a89fd4' }}>
            You are about to permanently delete <strong className="text-white">ALL</strong> contacts and lead data.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowDeleteAll(false)}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)', color: '#6b6190' }}>
              Cancel
            </button>
            <button onClick={confirmDeleteAll}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}>
              Wipe Everything
            </button>
          </div>
        </Modal>
      )}

      {/* ── Export Modal ── */}
      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full sm:max-w-lg animate-scale-in rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 sm:p-10 space-y-6 max-h-[85vh] sm:max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar"
            style={{ background: 'rgba(13,13,26,0.98)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <Download size={28} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-black text-center text-white">Export Intelligence</h3>
            <p className="text-center text-sm" style={{ color: '#a89fd4' }}>
              Select sessions to export. Active filters will be applied to the final spreadsheet.
            </p>
            <div className="max-h-52 overflow-y-auto space-y-2 custom-scrollbar">
              {availableSessions.length === 0 && (
                <p className="text-center italic font-bold text-sm" style={{ color: '#6b6190' }}>No sessions available.</p>
              )}
              {availableSessions.map(s => (
                <label key={s.session_id} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                  style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.08)'; }}>
                  <input type="checkbox" className="w-4 h-4"
                    checked={selectedExportSessions.includes(s.session_id)}
                    onChange={e => setSelectedExportSessions(
                      e.target.checked ? [...selectedExportSessions, s.session_id]
                        : selectedExportSessions.filter(id => id !== s.session_id)
                    )} />
                  <div>
                    <p className="font-black text-white text-sm capitalize">{s.session_id.replace('_', ' ')}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6b6190' }}>{s.lead_count} Leads</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowExportModal(false)}
                className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)', color: '#6b6190' }}>
                Cancel
              </button>
              <button onClick={handleExport}
                className="btn-primary flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                Download XLSX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.15))', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Zap size={18} className="text-purple-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-500">Neural Storage</p>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">
            Identity <span className="gradient-text">Log</span>
          </h1>
          <p className="text-sm font-bold flex items-center gap-2" style={{ color: '#6b6190' }}>
            <ShieldCheck size={14} className="text-emerald-500" />
            Secured Storage • {leads.length} Entities
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowDeleteAll(true)}
            className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all group"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}>
            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" /> Wipe All
          </button>
          <button onClick={openExportModal}
            className="btn-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 group">
            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Export
          </button>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-purple-400"
            size={18} style={{ color: '#3d3660' }} />
          <input type="text" placeholder="Search intelligence log..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="input-dark w-full pl-14 pr-6 py-4 rounded-xl font-bold text-sm" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select value={filterSession} onChange={e => setFilterSession(e.target.value)} style={{ ...selectStyle, minWidth: '160px' }}>
            <option value="">All Sessions</option>
            <option value="primary_account">Primary</option>
            <option value="diya">Diya</option>
          </select>
          <select value={filterScore} onChange={e => setFilterScore(e.target.value)} style={{ ...selectStyle, minWidth: '140px' }}>
            <option value="">All Scores</option>
            <option value="Hot">Hot Only</option>
            <option value="Warm">Warm Only</option>
            <option value="Cold">Cold Only</option>
          </select>
        </div>
      </div>

      {/* ── Leads List ── */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full animate-spin"
            style={{ border: '3px solid rgba(139,92,246,0.1)', borderTopColor: '#8b5cf6' }} />
          <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#6b6190' }}>
            Syncing Intelligence Pipeline...
          </p>
        </div>
      ) : error ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-5 rounded-3xl"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Server size={36} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-white">Intelligence Hub Offline</h3>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b6190' }}>
            Attempting to Restore Pipeline...
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-5">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px dashed rgba(139,92,246,0.15)' }}>
            <User size={40} style={{ color: '#3d3660' }} />
          </div>
          <h3 className="text-xl font-black text-white">No Intelligence Captured</h3>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#3d3660' }}>
            The neural log is currently empty
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} onDelete={() => setDeleteId(lead.id)} />)}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, index, onDelete }: { lead: Lead; index: number; onDelete: () => void }) {
  const isHot = lead.lead_score === 'Hot';
  const isWarm = lead.lead_score === 'Warm';

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-8 relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.06}s` }}>

      {/* Score glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${isHot ? '#f59e0b' : isWarm ? '#8b5cf6' : '#3d3660'}, transparent)` }} />

      {/* Score badge */}
      <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
        isHot ? 'badge-hot' : isWarm ? 'badge-warm' : 'badge-cold'
      }`}>
        {lead.lead_score}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        {/* Avatar + Name */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 relative overflow-hidden"
            style={{
              background: isHot
                ? 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))'
                : isWarm
                ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(139,92,246,0.2))'
                : 'rgba(139,92,246,0.08)',
              border: `1px solid ${isHot ? 'rgba(245,158,11,0.3)' : isWarm ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)'}`,
            }}>
            <User size={28} className={isHot ? 'text-yellow-400' : isWarm ? 'text-purple-400' : 'text-[#3d3660]'} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              {lead.extracted_name || 'Anonymous Lead'}
            </h3>
            {lead.company && (
              <div className="flex items-center gap-2 mt-1">
                <Building2 size={13} style={{ color: '#3d3660' }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b6190' }}>{lead.company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 lg:border-l lg:pl-8" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#6b6190' }}>
              <Mail size={14} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#a89fd4' }}>
              {lead.email || 'no-email@detected.ai'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#6b6190' }}>
              <Phone size={14} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#a89fd4' }}>
              {lead.mobile || 'Unknown Frequency'}
            </span>
          </div>
        </div>

        {/* Confidence + Delete */}
        <div className="flex items-center gap-6 lg:ml-auto">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(139,92,246,0.1)" strokeWidth="5" />
                <circle cx="28" cy="28" r="24" fill="transparent"
                  stroke={lead.confidence > 0.8 ? '#10b981' : '#f59e0b'} strokeWidth="5"
                  strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - lead.confidence)}
                  strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${lead.confidence > 0.8 ? '#10b981' : '#f59e0b'})` }} />
              </svg>
              <span className="absolute text-[10px] font-black text-white">
                {Math.round(lead.confidence * 100)}%
              </span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3d3660' }}>Confidence</p>
          </div>

          <button onClick={onDelete}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', color: '#6b6190' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#6b6190'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.1)'; }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderTop: '1px solid rgba(139,92,246,0.06)' }}>
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl w-full lg:w-2/3"
          style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.08)' }}>
          <MessageCircle size={15} className="text-purple-500 shrink-0" />
          <p className="text-xs font-medium italic line-clamp-1" style={{ color: '#6b6190' }}>
            "{lead.source_message}"
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3d3660' }}>
          <Calendar size={13} />
          {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
