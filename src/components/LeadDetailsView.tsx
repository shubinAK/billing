/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service, Package, Reminder, TimelineEvent } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Plus, 
  FileText, 
  User, 
  CheckCircle, 
  Clock, 
  CornerDownRight, 
  Trash2,
  CalendarCheck,
  Ban
} from 'lucide-react';

interface LeadDetailsViewProps {
  lead: Lead;
  services: Service[];
  packages: Package[];
  reminders: Reminder[];
  onBack: () => void;
  onUpdateStatus: (leadId: string, status: Lead['status']) => void;
  onUpdateLeadInfo: (leadId: string, info: Partial<Lead>) => void;
  onAddTimelineEvent: (leadId: string, content: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  onSelectAdminCalcWithLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function LeadDetailsView({
  lead,
  services,
  packages,
  reminders,
  onBack,
  onUpdateStatus,
  onUpdateLeadInfo,
  onAddTimelineEvent,
  onAddReminder,
  onSelectAdminCalcWithLead,
  onDeleteLead,
}: LeadDetailsViewProps) {
  const currentService = services.find(s => s.id === lead.serviceId);
  const currentPackage = packages.find(p => p.id === lead.packageId);
  const leadReminders = reminders.filter(r => r.leadId === lead.id);

  // Edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(lead.name);
  const [editEmail, setEditEmail] = useState(lead.email);
  const [editPhone, setEditPhone] = useState(lead.phone);
  const [editDate, setEditDate] = useState(lead.weddingDate);
  const [editVenue, setEditVenue] = useState(lead.venue || '');
  const [editNotes, setEditNotes] = useState(lead.notes || '');
  const [editPlanSegment, setEditPlanSegment] = useState<'30' | '60' | '90' | ''>(lead.planSegment || '');

  // Log interaction form states
  const [interactionType, setInteractionType] = useState('Phone Call');
  const [interactionNotes, setInteractionNotes] = useState('');

  // New Reminder form states
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('2026-06-28');
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderNotes, setReminderNotes] = useState('');

  const statusWorkflow: Lead['status'][] = [
    'New Lead',
    'First Call',
    '1st Follow Up',
    '2nd Follow Up',
    '3rd Follow Up',
  ];

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLeadInfo(lead.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      weddingDate: editDate,
      venue: editVenue,
      notes: editNotes,
      planSegment: editPlanSegment || undefined,
    });
    setIsEditingInfo(false);
    onAddTimelineEvent(lead.id, 'Updated customer core profile information.');
  };

  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactionNotes.trim()) return;

    const summary = `Logged ${interactionType}: "${interactionNotes.trim()}"`;
    onAddTimelineEvent(lead.id, summary);
    setInteractionNotes('');
    
    // Auto advance status from "New Lead" or "First Call" on interaction if applicable
    if (lead.status === 'New Lead') {
      onUpdateStatus(lead.id, 'First Call');
    }
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    onAddReminder({
      title: reminderTitle,
      date: reminderDate,
      time: reminderTime,
      notes: reminderNotes,
      leadId: lead.id,
    });

    onAddTimelineEvent(lead.id, `Created follow-up reminder: "${reminderTitle}" scheduled for ${reminderDate} at ${reminderTime}.`);
    
    // Reset reminder form
    setReminderTitle('');
    setReminderNotes('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Upper navigation breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 border border-[#E5E1D8] hover:bg-[#FAF9F6] text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#888] uppercase tracking-wider">
              <span>Leads</span>
              <span>/</span>
              <span>{lead.name} Workspace</span>
            </div>
            <h1 className="font-serif text-2xl italic text-[#1A1A1A] mt-0.5">{lead.name}</h1>
          </div>
        </div>

        {/* Quick status visualization badge */}
        <div className="flex items-center gap-3">
          <span className="stat-pill bg-[#C5A059] text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
            Status: {lead.status}
          </span>
          {lead.status !== 'Converted' && lead.status !== 'Lost' && (
            <>
              <button
                onClick={() => onUpdateStatus(lead.id, 'Converted')}
                id="btn-lead-detail-convert"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <CalendarCheck size={12} />
                <span>Mark Converted</span>
              </button>
              <button
                onClick={() => onUpdateStatus(lead.id, 'Lost')}
                id="btn-lead-detail-lost"
                className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 text-[10px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <Ban size={12} />
                <span>Mark Lost</span>
              </button>
            </>
          )}
          <button
            onClick={() => {
              if (confirm('Are you absolutely sure you want to permanently delete this lead? This action is completely irreversible.')) {
                onDeleteLead(lead.id);
                onBack();
              }
            }}
            id="btn-lead-detail-delete"
            className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 text-[10px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
            title="Permanently Delete Lead"
          >
            <Trash2 size={12} />
            <span>Delete Lead</span>
          </button>
        </div>
      </div>

      {/* Status advancement pipeline visual rail */}
      {lead.status !== 'Converted' && lead.status !== 'Lost' && (
        <div className="bg-white p-5 border border-[#E5E1D8] space-y-3">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-[#888]">
            Status Advancement Pipeline Guide
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusWorkflow.map((st, idx) => {
              const isCurrent = lead.status === st;
              return (
                <React.Fragment key={st}>
                  <button
                    onClick={() => onUpdateStatus(lead.id, st)}
                    id={`btn-lead-detail-advance-${st.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                      isCurrent 
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                        : 'bg-transparent border-[#E5E1D8] text-[#666] hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {st}
                  </button>
                  {idx < statusWorkflow.length - 1 && (
                    <CornerDownRight size={12} className="text-[#aaa]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column - profile and current quotation setup (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Client Profile info */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h3 className="font-serif text-lg italic text-[#1A1A1A]">Client Profile</h3>
              <button
                onClick={() => {
                  if (isEditingInfo) {
                    setIsEditingInfo(false);
                  } else {
                    setEditName(lead.name);
                    setEditEmail(lead.email);
                    setEditPhone(lead.phone);
                    setEditDate(lead.weddingDate);
                    setEditVenue(lead.venue || '');
                    setEditNotes(lead.notes || '');
                    setEditPlanSegment(lead.planSegment || '');
                    setIsEditingInfo(true);
                  }
                }}
                className="text-[10px] font-bold text-[#C5A059] hover:text-[#1A1A1A] uppercase tracking-wider"
              >
                {isEditingInfo ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {isEditingInfo ? (
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Shoot Date</label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Venue</label>
                    <input
                      type="text"
                      value={editVenue}
                      onChange={(e) => setEditVenue(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Private Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Plan Segment</label>
                  <select
                    value={editPlanSegment}
                    onChange={(e) => setEditPlanSegment(e.target.value as '30' | '60' | '90' | '')}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white text-[#1a1a1a]"
                  >
                    <option value="">None / Unassigned</option>
                    <option value="30">30 Days Plan</option>
                    <option value="60">60 Days Plan</option>
                    <option value="90">90 Days Plan</option>
                  </select>
                </div>
                <button
                  type="submit"
                  id="btn-lead-detail-save-info"
                  className="w-full py-2 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-[#333]"
                >
                  Save Basic Details
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                    <User size={14} className="text-[#888]" />
                    <span className="font-semibold">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                    <Mail size={14} className="text-[#888]" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                      <Phone size={14} className="text-[#888]" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                    <Calendar size={14} className="text-[#888]" />
                    <span className="font-mono">{lead.weddingDate}</span>
                  </div>
                  {lead.venue && (
                    <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                      <MapPin size={14} className="text-[#888]" />
                      <span>{lead.venue}</span>
                    </div>
                  )}
                </div>

                {lead.notes && (
                  <div className="bg-[#FAF9F6] p-3 border-l border-[#C5A059] text-xs text-[#666] italic">
                    "{lead.notes}"
                  </div>
                )}
                
                <div className="text-[10px] uppercase tracking-wider text-[#888] font-mono">
                  Created on: {lead.dateCreated}
                </div>

                {/* Quick Plan Segment Selector dropdown */}
                <div className="pt-4 border-t border-[#F0EEEA] space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                    Plan Segment
                  </label>
                  <select
                    value={lead.planSegment || ''}
                    onChange={(e) => {
                      const val = e.target.value as '30' | '60' | '90' | '';
                      onUpdateLeadInfo(lead.id, { planSegment: val || undefined });
                      onAddTimelineEvent(lead.id, val ? `Changed lead plan segment to: ${val} Days Plan.` : 'Removed lead plan segment assignment.');
                    }}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-[#FAF9F6]/50 font-semibold text-[#1a1a1a]"
                  >
                    <option value="">None / Unassigned</option>
                    <option value="30">30 Days Plan</option>
                    <option value="60">60 Days Plan</option>
                    <option value="90">90 Days Plan</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Card: Active Selection Details */}
          <div className="bg-white border border-[#E5E1D8] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3">
              <h3 className="font-serif text-lg italic text-[#1A1A1A]">Calculated Package</h3>
              <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                ₹{lead.totalVal.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#1A1A1A]">
              <div>
                <strong className="text-[#888] text-[9px] uppercase tracking-wider block">Service Category</strong>
                <span>{currentService?.name || 'Unknown'}</span>
              </div>
              <div>
                <strong className="text-[#888] text-[9px] uppercase tracking-wider block">Chosen Base Package</strong>
                <span>{currentPackage?.name || 'Custom Package Setup'}</span>
                <span className="text-[#888] font-mono ml-1.5">(₹{currentPackage?.basePrice.toLocaleString()})</span>
              </div>

              {/* Package Discount if any */}
              {lead.discountPackage !== undefined && lead.discountPackage > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-sm">
                  <span className="font-medium">Package Discount</span>
                  <span className="font-mono font-semibold">-₹{lead.discountPackage.toLocaleString()}</span>
                </div>
              )}

              {/* Add-on modifications itemized details */}
              {Object.keys(lead.selectedAddons).length > 0 && (
                <div>
                  <strong className="text-[#888] text-[9px] uppercase tracking-wider block mb-1">Configured Add-ons</strong>
                  <div className="space-y-1 bg-[#FAF9F6] p-2 border border-[#E5E1D8]">
                    {Object.entries(lead.selectedAddons).map(([name, qty]) => {
                      const addonRef = currentPackage?.addons.find(a => a.name === name);
                      const rate = addonRef ? addonRef.price : 0;
                      const extended = rate * qty;
                      return (
                        <div key={name} className="flex justify-between text-[11px] text-[#666]">
                          <span>
                            {name} {qty > 1 && `(Qty ${qty})`}
                          </span>
                          <span className="font-semibold text-[#1A1A1A]">
                            +₹{extended.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-ons Discount if any */}
              {lead.discountAddons !== undefined && lead.discountAddons > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-sm">
                  <span className="font-medium">Add-on Discount</span>
                  <span className="font-mono font-semibold">-₹{lead.discountAddons.toLocaleString()}</span>
                </div>
              )}

              {/* Custom notes box printed if present */}
              {lead.customNotes && (
                <div className="mt-3 p-2.5 bg-stone-50 border border-dashed border-[#E5E1D8] text-[11px] text-[#666] italic">
                  <strong>Quotation Notes:</strong>
                  <p className="mt-1 font-serif text-[#444]">"{lead.customNotes}"</p>
                </div>
              )}
            </div>

            {/* Direct Admin Calculator Integration with current lead */}
            <div className="pt-3 border-t border-[#F0EEEA]">
              <button
                onClick={() => onSelectAdminCalcWithLead(lead)}
                id="btn-lead-detail-gen-quote"
                className="w-full py-2.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={14} />
                <span>Adjust Quote & print PDF</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right column - interaction logging, notes, reminders, timeline (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Add Interaction Log / Notes */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#F0EEEA] pb-3 mb-4">
              Log Interactions / Communication Notes
            </h3>
            
            <form onSubmit={handleLogInteraction} className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/3 space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Type</label>
                  <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs bg-white focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="Phone Call">📞 Phone Call</option>
                    <option value="Email Proposal">✉️ Email</option>
                    <option value="WhatsApp Note">💬 WhatsApp</option>
                    <option value="In-Person Meeting">🤝 Meeting</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Summary & Context</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sent standard contract. They will review and confirm by Friday..."
                    value={interactionNotes}
                    onChange={(e) => setInteractionNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  id="btn-lead-detail-log-interaction"
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-[#333]"
                >
                  Log Interaction
                </button>
              </div>
            </form>
          </div>

          {/* Card: Schedule Reminder for this specific lead */}
          {lead.status !== 'Converted' && lead.status !== 'Lost' && (
            <div className="bg-white border border-[#E5E1D8] p-6">
              <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#F0EEEA] pb-3 mb-4">
                Schedule Follow-up Reminder
              </h3>
              
              <form onSubmit={handleAddReminderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Reminder Date</label>
                    <input
                      type="date"
                      required
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Reminder Time</label>
                    <input
                      type="time"
                      required
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Reminder Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Call back regarding drone discount"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-[#888] font-bold block">Additional Description Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="Details about specific topics to mention..."
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    id="btn-lead-detail-add-reminder"
                    className="px-4 py-2 border border-[#1A1A1A] text-[10px] font-semibold tracking-wider uppercase hover:bg-[#FAF9F6] transition-colors"
                  >
                    Schedule Reminder
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Card: Chronological Timeline and Activity Logs */}
          <div className="bg-white border border-[#E5E1D8] p-6 space-y-4">
            <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#F0EEEA] pb-3 mb-2">
              Timeline & Activities History
            </h3>

            {lead.timeline.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#888] italic">
                No history recorded yet for this client inquiry.
              </div>
            ) : (
              <div className="space-y-4 relative pl-3 border-l border-[#E5E1D8] ml-2">
                {[...lead.timeline].reverse().map((evt) => (
                  <div key={evt.id} className="relative space-y-0.5">
                    {/* Tiny visual circle marker */}
                    <span className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-[#C5A059]" />
                    
                    <div className="text-[10px] uppercase tracking-wider text-[#888] font-mono">
                      {evt.date}
                    </div>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed">
                      {evt.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
