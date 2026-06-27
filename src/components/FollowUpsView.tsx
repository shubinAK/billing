/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service, Package } from '../types';
import { Calendar, Mail, Phone, Clock, Plus, RefreshCw, Send, Check } from 'lucide-react';

interface FollowUpsViewProps {
  leads: Lead[];
  services: Service[];
  packages: Package[];
  onSelectLead: (leadId: string) => void;
  onUpdateStatus: (leadId: string, status: Lead['status']) => void;
  onAddTimelineEvent: (leadId: string, content: string) => void;
}

export default function FollowUpsView({
  leads,
  services,
  packages,
  onSelectLead,
  onUpdateStatus,
  onAddTimelineEvent,
}: FollowUpsViewProps) {
  // Extract active/in-progress leads needing follow-ups
  const followUpLeads = leads.filter(l => 
    l.status !== 'Converted' && l.status !== 'Lost'
  );

  // States to add a quick interaction note inline on a card
  const [activeQuickNoteLeadId, setActiveQuickNoteLeadId] = useState<string | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickStatus, setQuickStatus] = useState<Lead['status'] | ''>('');

  const handleSaveQuickNote = (leadId: string) => {
    if (!quickNoteText.trim()) return;

    let logMessage = `Logged Follow Up: "${quickNoteText.trim()}"`;
    if (quickStatus) {
      logMessage += ` (Status advanced to ${quickStatus})`;
      onUpdateStatus(leadId, quickStatus);
    }

    onAddTimelineEvent(leadId, logMessage);

    // Reset quick note states
    setQuickNoteText('');
    setQuickStatus('');
    setActiveQuickNoteLeadId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Pipeline Follow Ups</h1>
        <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Keep track of outstanding client touches and proposal states</p>
      </div>

      {/* Grid listing of active leads */}
      {followUpLeads.length === 0 ? (
        <div className="bg-white border border-[#E5E1D8] p-16 text-center">
          <p className="text-sm text-[#888] italic">No active leads currently in your pipeline. High-five! 🌟</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {followUpLeads.map((lead) => {
            const srv = services.find(s => s.id === lead.serviceId);
            const pkg = packages.find(p => p.id === lead.packageId);
            const isNoteOpen = activeQuickNoteLeadId === lead.id;

            return (
              <div 
                key={lead.id} 
                className="bg-white border border-[#E5E1D8] p-6 hover:shadow-sm hover:border-[#1A1A1A] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Status header */}
                  <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#888]">
                      {lead.dateCreated}
                    </span>
                    <span className="stat-pill text-[9px] font-bold tracking-widest uppercase bg-[#C5A059]/10 text-[#C5A059] px-2.5 py-1">
                      {lead.status}
                    </span>
                  </div>

                  {/* Customer title */}
                  <h3 
                    onClick={() => onSelectLead(lead.id)}
                    className="font-serif text-lg italic text-[#1A1A1A] hover:text-[#C5A059] cursor-pointer transition-colors"
                  >
                    {lead.name}
                  </h3>

                  {/* Context labels */}
                  <div className="text-xs text-[#666] space-y-1 mt-3">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-[#aaa]" />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-[#aaa]" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#aaa]" />
                      <span>Date: <strong className="font-mono text-[#1A1A1A]">{lead.weddingDate}</strong></span>
                    </div>
                  </div>

                  {/* Package values */}
                  <div className="bg-[#FAF9F6] p-3 border border-[#E5E1D8] mt-4">
                    <div className="text-[10px] uppercase text-[#888] tracking-wider">Configured Package</div>
                    <div className="text-xs font-semibold text-[#1A1A1A] mt-1 truncate">
                      {srv?.name} • {pkg?.name}
                    </div>
                    <div className="text-xs text-[#C5A059] font-semibold mt-1 font-mono">
                      Estimated Value: ₹{lead.totalVal.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Quick note addition forms */}
                <div className="mt-6 pt-4 border-t border-[#F0EEEA] space-y-3">
                  {isNoteOpen ? (
                    <div className="space-y-2 bg-[#FAF9F6] p-3 border border-[#E5E1D8]">
                      <div className="text-[10px] uppercase tracking-wider text-[#1a1a1a] font-bold">
                        Add Interaction Note
                      </div>
                      
                      <textarea
                        value={quickNoteText}
                        onChange={(e) => setQuickNoteText(e.target.value)}
                        placeholder="e.g. Discussed details via call. Will confirm packages shortly..."
                        rows={2}
                        id="input-follow-note-text"
                        className="w-full p-2 border border-[#E5E1D8] text-xs resize-none focus:outline-none focus:border-[#1A1A1A] bg-white text-[#1a1a1a]"
                      />

                      <div className="space-y-1 mt-1">
                        <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">
                          Update Pipeline Status (Optional)
                        </label>
                        <select
                          value={quickStatus}
                          onChange={(e) => setQuickStatus(e.target.value as Lead['status'])}
                          className="w-full p-1.5 border border-[#E5E1D8] text-xs bg-white text-[#1a1a1a]"
                        >
                          <option value="">-- Retain current state --</option>
                          <option value="First Call">First Call</option>
                          <option value="1st Follow Up">1st Follow Up</option>
                          <option value="2nd Follow Up">2nd Follow Up</option>
                          <option value="3rd Follow Up">3rd Follow Up</option>
                        </select>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => {
                            setActiveQuickNoteLeadId(null);
                            setQuickNoteText('');
                            setQuickStatus('');
                          }}
                          className="px-2 py-1.5 border border-[#1A1A1A] text-[9px] uppercase tracking-wider font-semibold hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveQuickNote(lead.id)}
                          className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-wider font-semibold hover:bg-[#333] flex items-center gap-1"
                        >
                          <Send size={10} />
                          <span>Save Note</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveQuickNoteLeadId(lead.id);
                          setQuickNoteText('');
                          setQuickStatus('');
                        }}
                        id={`btn-follow-quick-note-${lead.id}`}
                        className="flex-1 py-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F6] text-[10px] font-semibold tracking-wider uppercase transition-colors text-center"
                      >
                        Quick Interaction Log
                      </button>
                      <button
                        onClick={() => onSelectLead(lead.id)}
                        className="px-4 py-2 bg-[#1A1A1A] text-white hover:bg-[#333] text-[10px] font-semibold tracking-wider uppercase transition-colors text-center"
                      >
                        Details
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
