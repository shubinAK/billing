/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Tag } from 'lucide-react';

interface CalendarViewProps {
  leads: Lead[];
  services: Service[];
  onSelectLead: (leadId: string) => void;
}

export default function CalendarView({ leads, services, onSelectLead }: CalendarViewProps) {
  // Only display confirmed bookings
  const confirmedBookings = leads.filter(l => l.status === 'Converted');

  // Interactive calendar navigation state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed (5 is June)
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [filterServiceId, setFilterServiceId] = useState<string>('all');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate dates
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(5); // June
  };

  // Days mapping
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOfMonth(currentYear, currentMonth);

  // Filter items
  const filteredBookings = confirmedBookings.filter(bk => {
    if (filterServiceId !== 'all' && bk.serviceId !== filterServiceId) return false;
    return true;
  });

  // Check if active cell has event
  const getDayEvents = (dayNum: number) => {
    const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return filteredBookings.filter(bk => bk.weddingDate === formattedDate);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Studio Calendar</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Confirmed and secured client bookings</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Service Category Filter */}
          <select
            value={filterServiceId}
            onChange={(e) => setFilterServiceId(e.target.value)}
            id="select-cal-filter-service"
            className="px-3 py-2 border border-[#E5E1D8] text-xs uppercase tracking-wider bg-white font-medium"
          >
            <option value="all">All Services</option>
            {services.map(srv => (
              <option key={srv.id} value={srv.id}>{srv.name}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-[#1A1A1A]">
            <button
              onClick={() => setViewMode('month')}
              id="btn-cal-view-month"
              className={`px-4 py-2 text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                viewMode === 'month' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A] hover:bg-[#FAF9F6]'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('list')}
              id="btn-cal-view-list"
              className={`px-4 py-2 text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-[#1A1A1A] hover:bg-[#FAF9F6]'
              }`}
            >
              Agenda List
            </button>
          </div>

          <button
            onClick={handleToday}
            id="btn-cal-today"
            className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#FAF9F6] transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="flex justify-between items-center bg-white p-4 border border-[#E5E1D8]">
        <h2 className="font-serif text-xl italic text-[#1A1A1A]">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            id="btn-cal-prev"
            className="p-2 border border-[#E5E1D8] hover:bg-[#FAF9F6] text-[#1A1A1A] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            id="btn-cal-next"
            className="p-2 border border-[#E5E1D8] hover:bg-[#FAF9F6] text-[#1A1A1A] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Mode */}
      {viewMode === 'month' && (
        <div className="bg-white border border-[#E5E1D8]">
          {/* Weekday Names */}
          <div className="grid grid-cols-7 border-b border-[#E5E1D8] bg-[#FAF9F6] text-center text-[10px] uppercase tracking-widest font-bold py-3 text-[#666]">
            <span>Sunday</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E5E1D8] border-[#E5E1D8]">
            {/* Blank pre-offset padding cells */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="min-h-[120px] bg-[#FAF9F6]/30 bg-pattern" />
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const cellEvents = getDayEvents(dayNum);
              const isToday = currentYear === 2026 && currentMonth === 5 && dayNum === 27;

              return (
                <div 
                  key={`day-${dayNum}`} 
                  className={`min-h-[120px] p-2 flex flex-col justify-between hover:bg-[#FAF9F6]/20 transition-colors ${
                    isToday ? 'bg-[#FAF9F6]' : 'bg-white'
                  }`}
                >
                  {/* Day Number Label */}
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs font-semibold ${
                      isToday ? 'w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold' : 'text-[#666]'
                    }`}>
                      {dayNum}
                    </span>
                    {cellEvents.length > 0 && (
                      <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">
                        {cellEvents.length} Event{cellEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Day Event Cards list */}
                  <div className="flex-1 mt-2 space-y-1 select-none">
                    {cellEvents.map(evt => {
                      const srv = services.find(s => s.id === evt.serviceId);
                      const isWedding = evt.serviceId === 'srv-wedding';
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(evt.id);
                          }}
                          className={`p-1.5 border border-l-4 rounded cursor-pointer transition-all duration-150 text-left ${
                            isWedding 
                              ? 'border-[#E5E1D8] border-l-[#C5A059] bg-[#FAF9F6]/50 hover:bg-[#FAF9F6]' 
                              : 'border-[#E5E1D8] border-l-[#1A1A1A] bg-stone-50 hover:bg-stone-100'
                          }`}
                        >
                          <div className="text-[10px] font-semibold text-[#1A1A1A] truncate">
                            {evt.name}
                          </div>
                          <div className="text-[9px] text-[#888] truncate uppercase tracking-wider mt-0.5">
                            {srv?.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda list Mode */}
      {viewMode === 'list' && (
        <div className="bg-white border border-[#E5E1D8] divide-y divide-[#E5E1D8]">
          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#888] italic">
              No confirmed bookings found for the current filter.
            </div>
          ) : (
            filteredBookings
              .sort((a, b) => a.weddingDate.localeCompare(b.weddingDate))
              .map((bk) => {
                const srv = services.find(s => s.id === bk.serviceId);
                return (
                  <div
                    key={bk.id}
                    onClick={() => onSelectLead(bk.id)}
                    className="p-6 hover:bg-[#FAF9F6] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg italic text-[#1A1A1A]">
                          {bk.name}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest bg-[#C5A059]/10 text-[#C5A059] uppercase">
                          Confirmed Booking
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} className="text-[#888]" />
                          <strong className="font-mono text-[#1A1A1A]">{bk.weddingDate}</strong>
                        </span>
                        {bk.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-[#888]" />
                            {bk.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Tag size={12} className="text-[#888]" />
                          {srv?.name}
                        </span>
                      </div>
                      {bk.notes && (
                        <p className="text-xs text-[#888] italic line-clamp-1 mt-1">
                          "{bk.notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-[#888]">Total Value</div>
                        <div className="font-serif text-xl font-medium text-[#1a1a1a] font-mono">
                          ${bk.totalVal.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(bk.id);
                        }}
                        className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors"
                      >
                        Manage Booking
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

    </div>
  );
}
