/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lead, Reminder, Service, Package } from '../types';
import { Calendar as CalendarIcon, PhoneCall, ArrowRight, UserCheck, Inbox, Plus, Check } from 'lucide-react';

interface DashboardViewProps {
  leads: Lead[];
  reminders: Reminder[];
  services: Service[];
  packages: Package[];
  onNavigateTab: (tab: string) => void;
  onSelectLead: (leadId: string) => void;
  onToggleReminder: (reminderId: string) => void;
}

export default function DashboardView({
  leads,
  reminders,
  services,
  packages,
  onNavigateTab,
  onSelectLead,
  onToggleReminder,
}: DashboardViewProps) {
  const todayStr = '2026-06-27'; // Fixed timezone-safe context date

  // Filter lists
  const activeLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost');
  const convertedLeads = leads.filter(l => l.status === 'Converted');
  
  const todaysReminders = reminders.filter(r => r.date === todayStr);
  const pendingRemindersCount = todaysReminders.filter(r => !r.completed).length;

  const activeFollowups = activeLeads.filter(l => 
    l.status === 'First Call' || l.status === '1st Follow Up' || l.status === '2nd Follow Up' || l.status === '3rd Follow Up'
  );

  const upcomingBookings = convertedLeads
    .filter(l => l.weddingDate >= todayStr)
    .sort((a, b) => a.weddingDate.localeCompare(b.weddingDate))
    .slice(0, 5);

  const recentLeads = [...activeLeads]
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
    .slice(0, 5);

  // Future Revenue calculations (aesthetic but accurate metrics)
  const totalContractedRevenue = convertedLeads.reduce((acc, lead) => acc + lead.totalVal, 0);
  const projectedRevenue = activeLeads.reduce((acc, lead) => acc + lead.totalVal, 0);

  // Mini calendar logic
  const daysInMonth = 30;
  const startOffset = 1; // Simulated offset for display
  const calendarCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    const hasEvent = convertedLeads.some(l => l.weddingDate === dateStr);
    return { dayNum, dateStr, hasEvent };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Operational Cockpit</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Lumina Studio CRM Overview • Today is June 27, 2026</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigateTab('admin-calc')}
            id="btn-dash-quick-calc"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            <span>New Custom Quote</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Active Pipeline Leads</div>
          <div className="font-serif text-4xl text-[#1A1A1A] my-2">{activeLeads.length}</div>
          <div className="text-[11px] text-[#C5A059] font-medium tracking-wide">
            Est. Contract Value: ₹{projectedRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Confirmed Bookings</div>
          <div className="font-serif text-4xl text-[#1A1A1A] my-2">{convertedLeads.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium tracking-wide">
            Verified Bookings: ₹{totalContractedRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Reminders Pending Today</div>
          <div className="font-serif text-4xl text-[#1A1A1A] my-2">{pendingRemindersCount}</div>
          <div className="text-[11px] text-[#888] uppercase tracking-wider">
            out of {todaysReminders.length} scheduled tasks
          </div>
        </div>
        <div className="bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">Conversion Rate</div>
          <div className="font-serif text-4xl text-[#1A1A1A] my-2">
            {leads.length > 0 ? `${Math.round((convertedLeads.length / leads.length) * 100)}%` : '0%'}
          </div>
          <div className="text-[11px] text-[#888] uppercase tracking-wider">
            of total lifetime pipeline
          </div>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Reminders & Follow Ups */}
        <div className="space-y-8">
          {/* Today's Reminders Widget */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h2 className="font-serif text-lg italic text-[#1A1A1A]">Today's Reminders</h2>
              <button 
                onClick={() => onNavigateTab('reminders')}
                className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider hover:text-[#1A1A1A] flex items-center gap-1"
              >
                <span>Reminders Center</span>
                <ArrowRight size={12} />
              </button>
            </div>
            {todaysReminders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#888] italic">
                You're all caught up! No reminders scheduled for today.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysReminders.map((rem) => (
                  <div 
                    key={rem.id} 
                    className={`flex items-start gap-3 p-3 border border-[#F0EEEA] transition-all duration-150 ${
                      rem.completed ? 'bg-[#FAF9F6] opacity-65' : 'bg-white'
                    }`}
                  >
                    <button
                      onClick={() => onToggleReminder(rem.id)}
                      id={`btn-dash-complete-task-${rem.id}`}
                      className={`w-5 h-5 border rounded-full shrink-0 flex items-center justify-center transition-colors ${
                        rem.completed 
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                          : 'border-[#E5E1D8] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {rem.completed && <Check size={12} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold ${rem.completed ? 'line-through text-[#888]' : 'text-[#1A1A1A]'}`}>
                        {rem.title}
                      </div>
                      {rem.notes && (
                        <p className={`text-[11px] mt-1 ${rem.completed ? 'text-[#aaa]' : 'text-[#666]'} line-clamp-1`}>
                          {rem.notes}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[9px] uppercase tracking-wider text-[#888]">{rem.time}</span>
                        {rem.leadId && (
                          <button
                            onClick={() => onSelectLead(rem.leadId!)}
                            className="text-[9px] uppercase tracking-wider text-[#C5A059] font-medium hover:text-[#1A1A1A]"
                          >
                            View Client
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Follow Ups Widget */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h2 className="font-serif text-lg italic text-[#1A1A1A]">Pending Follow Ups</h2>
              <span className="stat-pill bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                {activeFollowups.length} Active
              </span>
            </div>
            {activeFollowups.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#888] italic">
                No follow-ups due. Excellent pipeline maintenance!
              </div>
            ) : (
              <div className="space-y-3">
                {activeFollowups.slice(0, 4).map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => onSelectLead(lead.id)}
                    className="p-3 border border-[#F0EEEA] hover:border-[#1A1A1A] cursor-pointer bg-[#FAF9F6]/30 hover:bg-[#FAF9F6] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-[#1A1A1A] truncate">{lead.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#666] mt-1 truncate">{lead.email}</div>
                    <div className="flex justify-between items-center mt-3 text-[9px] text-[#888] uppercase tracking-wider">
                      <span>Created {lead.dateCreated}</span>
                      <span className="text-[#1A1A1A] font-semibold">₹{lead.totalVal.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Leads */}
        <div className="space-y-8">
          <div className="bg-white border border-[#E5E1D8] p-6 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h2 className="font-serif text-lg italic text-[#1A1A1A]">Recent Leads</h2>
              <button 
                onClick={() => onNavigateTab('leads')}
                className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider hover:text-[#1A1A1A] flex items-center gap-1"
              >
                <span>All Leads</span>
                <ArrowRight size={12} />
              </button>
            </div>
            
            {recentLeads.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#888] italic flex-1 flex items-center justify-center">
                No active leads. Use the public calculator or quick calculator to create one.
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {recentLeads.map((lead) => {
                  const srv = services.find(s => s.id === lead.serviceId);
                  const pkg = packages.find(p => p.id === lead.packageId);
                  return (
                    <div 
                      key={lead.id} 
                      onClick={() => onSelectLead(lead.id)}
                      className="group p-4 border border-[#F0EEEA] hover:border-[#1A1A1A] cursor-pointer transition-all duration-150 relative bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                            {lead.name}
                          </h3>
                          <div className="text-[10px] text-[#888] mt-0.5 uppercase tracking-wide">
                            {srv?.name} • {pkg?.name}
                          </div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A] bg-[#FAF9F6] border border-[#E5E1D8] px-2 py-1">
                          {lead.status}
                        </span>
                      </div>
                      
                      {lead.notes && (
                        <p className="text-[11px] text-[#666] line-clamp-2 mt-2 bg-[#FAF9F6] p-2 italic border-l border-[#C5A059]">
                          "{lead.notes}"
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#F0EEEA] text-[9px] text-[#888] uppercase tracking-wider">
                        <span>Date: {lead.weddingDate}</span>
                        <span className="font-mono text-[#1A1A1A] font-semibold">₹{lead.totalVal.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Calendar Preview & Upcoming Bookings */}
        <div className="space-y-8">
          {/* Calendar Month Grid Mini Preview */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h2 className="font-serif text-lg italic text-[#1A1A1A]">Calendar Preview</h2>
              <button 
                onClick={() => onNavigateTab('calendar')}
                className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider hover:text-[#1A1A1A] flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ArrowRight size={12} />
              </button>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-center font-bold text-[#1A1A1A] mb-3">
              June 2026
            </div>
            
            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] uppercase tracking-wider text-[#888] font-semibold mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            
            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty placeholder offset */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-6" />
              ))}
              
              {/* Actual days */}
              {calendarCells.map(({ dayNum, dateStr, hasEvent }) => (
                <div 
                  key={dateStr}
                  className={`h-6 text-[10px] font-mono flex items-center justify-center relative ${
                    dateStr === todayStr 
                      ? 'border border-[#1A1A1A] text-[#1A1A1A] font-bold bg-[#FAF9F6]' 
                      : 'text-[#666]'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasEvent && (
                    <span className="absolute bottom-0.5 w-1 h-1 bg-[#C5A059] rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white border border-[#E5E1D8] p-6">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h2 className="font-serif text-lg italic text-[#1A1A1A]">Upcoming Bookings</h2>
              <button 
                onClick={() => onNavigateTab('bookings')}
                className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider hover:text-[#1A1A1A] flex items-center gap-1"
              >
                <span>All Bookings</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#888] italic">
                No upcoming bookings found. Convert a lead to book!
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((bk) => (
                  <div 
                    key={bk.id}
                    onClick={() => onSelectLead(bk.id)}
                    className="p-3 border border-[#F0EEEA] hover:border-[#1A1A1A] cursor-pointer bg-white transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1A1A1A] truncate">{bk.name}</div>
                      <div className="text-[9px] uppercase tracking-wider text-[#888] mt-0.5 font-mono">
                        Date: {bk.weddingDate}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold font-mono text-[#1A1A1A] shrink-0">
                      ₹{bk.totalVal.toLocaleString()}
                    </span>
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
