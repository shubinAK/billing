/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lead, Service, Package } from '../types';
import { RefreshCw, Trash2, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface LostLeadsViewProps {
  leads: Lead[];
  services: Service[];
  packages: Package[];
  onRestoreLead: (leadId: string) => void;
  onPurgeLead: (leadId: string) => void;
}

export default function LostLeadsView({
  leads,
  services,
  packages,
  onRestoreLead,
  onPurgeLead,
}: LostLeadsViewProps) {
  // Extract lost leads
  const lostLeads = leads.filter(l => l.status === 'Lost');

  // Helper to calculate countdown
  const getDaysRemaining = (dateMarkedLostStr?: string) => {
    if (!dateMarkedLostStr) return 7;
    const current = new Date('2026-06-27').getTime();
    const lostDate = new Date(dateMarkedLostStr).getTime();
    const elapsedMs = current - lostDate;
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const remaining = 7 - elapsedDays;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Lost Leads Holding</h1>
        <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
          Temporary 7-day holding bin. Records are permanently purged automatically.
        </p>
      </div>

      {/* Warning banner */}
      <div className="bg-[#FAF9F6] border border-[#C5A059] p-4 flex items-start gap-3">
        <ShieldAlert className="text-[#C5A059] shrink-0 mt-0.5" size={16} />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">Retention Rule Warning</div>
          <p className="text-xs text-[#666] mt-0.5">
            Lost leads remain available in this bin for exactly 7 days. After 7 days, they are purged from the system databases automatically and cannot be recovered.
          </p>
        </div>
      </div>

      {/* Lost Leads Table */}
      <div className="bg-white border border-[#E5E1D8] overflow-hidden">
        {lostLeads.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#888] italic">
            No lost leads in the holding bin. Excellent pipeline status!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="table-lost-leads" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-[10px] uppercase tracking-wider font-bold text-[#666]">
                  <th className="p-4 px-6">Date Lost</th>
                  <th className="p-4 px-6">Customer Name</th>
                  <th className="p-4 px-6">Configured Package</th>
                  <th className="p-4 px-6">Estimated Loss</th>
                  <th className="p-4 px-6">Retention Time Left</th>
                  <th className="p-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEEA] text-xs text-[#1A1A1A]">
                {lostLeads.map((lead) => {
                  const srv = services.find(s => s.id === lead.serviceId);
                  const pkg = packages.find(p => p.id === lead.packageId);
                  const remainingDays = getDaysRemaining(lead.dateMarkedLost);
                  
                  return (
                    <tr key={lead.id} className="hover:bg-red-50/10 transition-colors">
                      <td className="p-4 px-6 font-mono text-[#888]">
                        {lead.dateMarkedLost || lead.dateCreated}
                      </td>
                      <td className="p-4 px-6 font-serif text-sm font-semibold text-[#1A1A1A]">
                        {lead.name}
                        <div className="text-[10px] font-normal text-[#888] mt-0.5 font-sans">
                          {lead.email}
                        </div>
                      </td>
                      <td className="p-4 px-6 text-[#666]">
                        <div className="font-semibold">{srv?.name}</div>
                        <div className="text-[10px] text-[#888] uppercase mt-0.5">{pkg?.name}</div>
                      </td>
                      <td className="p-4 px-6 font-semibold font-mono text-red-700">
                        ₹{lead.totalVal.toLocaleString()}
                      </td>
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${remainingDays <= 2 ? 'bg-red-600' : 'bg-[#C5A059]'}`}
                              style={{ width: `${(remainingDays / 7) * 100}%` }}
                            />
                          </div>
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${
                            remainingDays <= 2 ? 'text-red-600 font-extrabold' : 'text-[#C5A059]'
                          }`}>
                            {remainingDays} Days Left
                          </span>
                        </div>
                      </td>
                      <td className="p-4 px-6 text-right space-x-2 whitespace-nowrap">
                        {/* Restore Button */}
                        <button
                          onClick={() => onRestoreLead(lead.id)}
                          id={`btn-lost-restore-${lead.id}`}
                          className="px-3 py-1.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F6] text-[9px] uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <RefreshCw size={10} />
                          <span>Restore</span>
                        </button>

                        {/* Force Purge Button */}
                        <button
                          onClick={() => onPurgeLead(lead.id)}
                          id={`btn-lost-purge-${lead.id}`}
                          className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-50 text-[9px] uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 size={10} />
                          <span>Purge</span>
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
