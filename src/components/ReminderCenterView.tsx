/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Reminder, Lead } from '../types';
import { Check, Trash2, Calendar, Clock, AlertCircle, Plus, X } from 'lucide-react';

interface ReminderCenterViewProps {
  reminders: Reminder[];
  leads: Lead[];
  onToggleReminder: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  onSelectLead: (leadId: string) => void;
}

export default function ReminderCenterView({
  reminders,
  leads,
  onToggleReminder,
  onDeleteReminder,
  onAddReminder,
  onSelectLead,
}: ReminderCenterViewProps) {
  const todayStr = '2026-06-27'; // Fixed timezone-safe context date

  // Folder states
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'overdue' | 'completed'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-06-28');
  const [formTime, setFormTime] = useState('10:00');
  const [formNotes, setFormNotes] = useState('');
  const [formLeadId, setFormLeadId] = useState('');

  // Get status of reminders
  const getReminderStatus = (rem: Reminder) => {
    if (rem.completed) return 'completed';
    if (rem.date < todayStr) return 'overdue';
    return 'pending';
  };

  // Filters
  const filteredReminders = reminders.filter(r => {
    const status = getReminderStatus(r);
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return status === 'pending' || status === 'overdue'; // pending folder shows current and overdue
    if (activeTab === 'overdue') return status === 'overdue';
    if (activeTab === 'completed') return status === 'completed';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Task Title is required.');
      return;
    }

    onAddReminder({
      title: formTitle,
      date: formDate,
      time: formTime,
      notes: formNotes,
      leadId: formLeadId || undefined,
    });

    // Reset Form
    setFormTitle('');
    setFormNotes('');
    setFormLeadId('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Reminders Center</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
            Maintain your workflow schedule, follow-up calls, and checklist items
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="btn-remind-new"
          className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors flex items-center gap-2 self-start"
        >
          <Plus size={14} />
          <span>Add Custom Reminder</span>
        </button>
      </div>

      {/* Folders Tab select bar */}
      <div className="flex border-b border-[#E5E1D8]">
        {(['pending', 'overdue', 'completed', 'all'] as const).map((tab) => {
          const count = reminders.filter(r => {
            const status = getReminderStatus(r);
            if (tab === 'all') return true;
            if (tab === 'pending') return status === 'pending' || status === 'overdue';
            if (tab === 'overdue') return status === 'overdue';
            if (tab === 'completed') return status === 'completed';
            return true;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs tracking-wider uppercase font-semibold border-b-2 transition-all duration-150 ${
                activeTab === tab
                  ? 'border-[#1A1A1A] text-[#1A1A1A]'
                  : 'border-transparent text-[#888] hover:text-[#1A1A1A]'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Reminders List */}
      <div className="bg-white border border-[#E5E1D8] divide-y divide-[#F0EEEA]">
        {filteredReminders.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#888] italic">
            No reminders found in this folder. All quiet on the calendar!
          </div>
        ) : (
          filteredReminders
            .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
            .map((rem) => {
              const client = leads.find(l => l.id === rem.leadId);
              const isOverdue = getReminderStatus(rem) === 'overdue';

              return (
                <div 
                  key={rem.id} 
                  className={`p-5 flex items-start justify-between gap-4 transition-all duration-150 ${
                    rem.completed ? 'bg-[#FAF9F6]/50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox trigger */}
                    <button
                      onClick={() => onToggleReminder(rem.id)}
                      className={`w-5 h-5 border rounded-full shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                        rem.completed 
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                          : 'border-[#E5E1D8] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {rem.completed && <Check size={12} />}
                    </button>

                    <div>
                      {/* Title & Warning tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-semibold ${rem.completed ? 'line-through text-[#888]' : 'text-[#1A1A1A]'}`}>
                          {rem.title}
                        </span>
                        {isOverdue && (
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 font-bold">
                            <AlertCircle size={10} />
                            <span>Overdue Action</span>
                          </span>
                        )}
                      </div>

                      {/* Notes descriptions */}
                      {rem.notes && (
                        <p className={`text-xs mt-1.5 leading-relaxed max-w-2xl ${rem.completed ? 'text-[#aaa]' : 'text-[#666]'}`}>
                          {rem.notes}
                        </p>
                      )}

                      {/* Context metadata details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#888] uppercase tracking-wider mt-3 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#aaa]" />
                          <strong className="text-[#1A1A1A] font-mono">{rem.date}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#aaa]" />
                          <strong className="text-[#1A1A1A] font-mono">{rem.time}</strong>
                        </span>
                        {client && (
                          <button
                            onClick={() => onSelectLead(client.id)}
                            className="text-[#C5A059] font-bold hover:underline"
                          >
                            Client: {client.name}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Purge button */}
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    id={`btn-remind-delete-${rem.id}`}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors shrink-0"
                    title="Delete Reminder"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
        )}
      </div>

      {/* Create Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-md p-8 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-4">
              <h2 className="font-serif text-xl italic text-[#1A1A1A]">Create Custom Reminder</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#1A1A1A] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form id="form-remind-universal" onSubmit={handleSubmit} className="space-y-4">
              
              {/* Task title */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Prep photography lens bag"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Reminder Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Target Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Client Association Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Link Associated Lead (Optional)
                </label>
                <select
                  value={formLeadId}
                  onChange={(e) => setFormLeadId(e.target.value)}
                  id="select-remind-client-link"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none bg-white"
                >
                  <option value="">-- No specific client profile --</option>
                  {leads.filter(l => l.status !== 'Lost').map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} ({lead.weddingDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Description Notes */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Task Descriptions / Context
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Write clear details of subtasks to finalize..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333]"
                >
                  Save Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
