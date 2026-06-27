/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service, Package } from '../types';
import { MapPin, Calendar, ExternalLink, CalendarDays, Search, CheckCircle2 } from 'lucide-react';

interface ConvertedBookingsViewProps {
  leads: Lead[];
  services: Service[];
  packages: Package[];
  onSelectLead: (leadId: string) => void;
}

export default function ConvertedBookingsView({
  leads,
  services,
  packages,
  onSelectLead,
}: ConvertedBookingsViewProps) {
  // Extract all converted leads
  const bookings = leads.filter(l => l.status === 'Converted');

  // Local query states
  const [query, setQuery] = useState('');

  const filteredBookings = bookings.filter(bk => 
    bk.name.toLowerCase().includes(query.toLowerCase()) ||
    (bk.venue && bk.venue.toLowerCase().includes(query.toLowerCase()))
  );

  // Download booking configurations as static iCal file
  const handleExportICal = () => {
    if (bookings.length === 0) return;
    
    let icalContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Lumina Studio//CRM Calendar//EN\n";
    
    bookings.forEach(bk => {
      const srv = services.find(s => s.id === bk.serviceId);
      const pkg = packages.find(p => p.id === bk.packageId);
      const dateNoDash = bk.weddingDate.replace(/-/g, '');
      icalContent += "BEGIN:VEVENT\n";
      icalContent += `UID:booking-${bk.id}@luminastudio.com\n`;
      icalContent += `DTSTART;VALUE=DATE:${dateNoDash}\n`;
      icalContent += `SUMMARY:Shoot - ${bk.name} (${srv?.name || 'Photography'})\n`;
      icalContent += `DESCRIPTION:Package: ${pkg?.name || 'Custom Setup'}\\nValue: ₹${bk.totalVal}\\nNotes: ${bk.notes || 'None'}\n`;
      if (bk.venue) {
        icalContent += `LOCATION:${bk.venue}\n`;
      }
      icalContent += "END:VEVENT\n";
    });

    icalContent += "END:VCALENDAR";

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Lumina_Confirmed_Bookings.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalClosedWonRevenue = bookings.reduce((acc, lead) => acc + lead.totalVal, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Secured Bookings</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Confirmed shoots, active contracts, and settled metrics</p>
        </div>

        <div className="flex items-center gap-3">
          {/* iCal Feed Download */}
          <button
            onClick={handleExportICal}
            id="btn-booking-export-ical"
            disabled={bookings.length === 0}
            className="px-4 py-2 border border-[#1A1A1A] hover:bg-[#FAF9F6] disabled:opacity-40 disabled:cursor-not-allowed text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
          >
            <CalendarDays size={12} />
            <span>Generate iCal Feed</span>
          </button>
        </div>
      </div>

      {/* Financial highlighters */}
      <div className="bg-white border border-[#E5E1D8] p-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E1D8]">
        <div className="pb-4 md:pb-0 md:pr-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Total Closed-Won Revenue</div>
          <div className="font-serif text-3xl text-emerald-800 font-medium font-mono mt-1">
            ₹{totalClosedWonRevenue.toLocaleString()}
          </div>
        </div>
        <div className="py-4 md:py-0 md:px-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Confirmed Events</div>
          <div className="font-serif text-3xl text-[#1a1a1a] font-medium mt-1">
            {bookings.length} Shoots Booked
          </div>
        </div>
        <div className="pt-4 md:pt-0 md:pl-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Average Booking Size</div>
          <div className="font-serif text-3xl text-stone-700 font-medium font-mono mt-1">
            ₹{bookings.length > 0 ? Math.round(totalClosedWonRevenue / bookings.length).toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#E5E1D8]">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter bookings by customer name or venue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-[#FAF9F6]/30 font-medium"
          />
          <Search size={14} className="absolute left-3 top-3 text-[#aaa]" />
        </div>
      </div>

      {/* Ledger list */}
      <div className="bg-white border border-[#E5E1D8] overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#888] italic">
            No confirmed bookings matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="table-bookings" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-[10px] uppercase tracking-wider font-bold text-[#666]">
                  <th className="p-4 px-6">Shoot Date</th>
                  <th className="p-4 px-6">Client Name</th>
                  <th className="p-4 px-6">Event Location</th>
                  <th className="p-4 px-6">Package Breakdown</th>
                  <th className="p-4 px-6 text-right">Settled Price</th>
                  <th className="p-4 px-6">Status</th>
                  <th className="p-4 px-6 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEEA] text-xs text-[#1A1A1A]">
                {filteredBookings.map((bk) => {
                  const srv = services.find(s => s.id === bk.serviceId);
                  const pkg = packages.find(p => p.id === bk.packageId);
                  return (
                    <tr key={bk.id} className="hover:bg-[#FAF9F6]/40 transition-colors group">
                      <td className="p-4 px-6 font-mono font-bold text-[#1A1A1A]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#C5A059]" />
                          <span>{bk.weddingDate}</span>
                        </div>
                      </td>
                      <td className="p-4 px-6 font-serif text-sm font-semibold text-[#1A1A1A]">
                        {bk.name}
                      </td>
                      <td className="p-4 px-6 text-[#666]">
                        {bk.venue ? (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-[#aaa]" />
                            <span>{bk.venue}</span>
                          </div>
                        ) : (
                          <span className="italic text-[#aaa]">No venue recorded</span>
                        )}
                      </td>
                      <td className="p-4 px-6">
                        <div className="font-semibold">{srv?.name}</div>
                        <div className="text-[10px] text-[#888] uppercase mt-0.5">{pkg?.name}</div>
                      </td>
                      <td className="p-4 px-6 text-right font-semibold font-mono text-emerald-800">
                        ₹{bk.totalVal.toLocaleString()}
                      </td>
                      <td className="p-4 px-6">
                        <span className="flex items-center gap-1 text-emerald-700 font-bold tracking-wider text-[10px] uppercase">
                          <CheckCircle2 size={12} className="text-emerald-700" />
                          <span>Active Contract</span>
                        </span>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <button
                          onClick={() => onSelectLead(bk.id)}
                          id={`btn-booking-layout-${bk.id}`}
                          className="px-3 py-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[9px] uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
