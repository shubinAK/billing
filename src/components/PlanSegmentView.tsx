/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service, Package } from '../types';
import { Search, Mail, Phone, Calendar, ArrowRight, Clock, Trash2, ListFilter } from 'lucide-react';

interface PlanSegmentViewProps {
  segment: '30' | '60' | '90';
  leads: Lead[];
  services: Service[];
  packages: Package[];
  onSelectLead: (leadId: string) => void;
  onUpdateLeadInfo: (leadId: string, info: Partial<Lead>) => void;
  onAddTimelineEvent: (leadId: string, content: string) => void;
}

export default function PlanSegmentView({
  segment,
  leads,
  services,
  packages,
  onSelectLead,
  onUpdateLeadInfo,
  onAddTimelineEvent,
}: PlanSegmentViewProps) {
  // Filter leads by active status AND the matching plan segment
  const segmentLeads = leads.filter(
    (l) => l.status !== 'Converted' && l.status !== 'Lost' && l.planSegment === segment
  );

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter segment leads by search query (name or phone)
  const filteredLeads = segmentLeads.filter((l) => {
    const query = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(query) ||
      (l.phone ? l.phone.toLowerCase().includes(query) : false) ||
      (l.email ? l.email.toLowerCase().includes(query) : false)
    );
  });

  // Re-allocate segment directly
  const handleReallocateSegment = (leadId: string, newSegment: '30' | '60' | '90' | '') => {
    onUpdateLeadInfo(leadId, { planSegment: newSegment || undefined });
    onAddTimelineEvent(
      leadId,
      newSegment
        ? `Reallocated lead directly from list view to: ${newSegment} Days Plan.`
        : 'Removed lead plan segment assignment from list view.'
    );
  };

  const totalSegmentValue = segmentLeads.reduce((acc, lead) => acc + lead.totalVal, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#888] uppercase tracking-wider">
            <span>Pipeline Segmentation</span>
            <span>/</span>
            <span className="font-semibold">{segment} Days Cadence</span>
          </div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A] mt-1">{segment} Days Plan</h1>
          <p className="text-xs text-[#666] uppercase tracking-wider mt-1">
            Sales outreach and follow-up plan tailored for the {segment}-day conversion horizon
          </p>
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="bg-white border border-[#E5E1D8] p-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E1D8]">
        <div className="pb-4 md:pb-0 md:pr-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Total In-Pipeline Value</div>
          <div className="font-serif text-3xl text-indigo-900 font-medium font-mono mt-1">
            ₹{totalSegmentValue.toLocaleString()}
          </div>
        </div>
        <div className="py-4 md:py-0 md:px-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Assigned Leads</div>
          <div className="font-serif text-3xl text-[#1a1a1a] font-medium mt-1">
            {segmentLeads.length} {segmentLeads.length === 1 ? 'Lead' : 'Leads'} Active
          </div>
        </div>
        <div className="pt-4 md:pt-0 md:pl-6">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Average Quote Size</div>
          <div className="font-serif text-3xl text-stone-700 font-medium font-mono mt-1">
            ₹{segmentLeads.length > 0 ? Math.round(totalSegmentValue / segmentLeads.length).toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#E5E1D8]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads in this plan by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id={`input-plan-search-${segment}`}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-[#FAF9F6]/30 font-medium placeholder:text-[#aaa]"
          />
          <Search size={14} className="absolute left-3 top-3 text-[#aaa]" />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[#E5E1D8] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#888] italic space-y-2">
            <div>No active leads assigned to the {segment} Days Plan.</div>
            <div className="text-xs">
              Go to the main <strong>Leads & CRM</strong> tab, open a lead, and select "{segment} Days Plan" from the dropdown to assign them here.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id={`table-plan-${segment}`} className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-[10px] uppercase tracking-wider font-bold text-[#666]">
                  <th className="p-4 px-6">Wedding Date</th>
                  <th className="p-4 px-6">Customer Name</th>
                  <th className="p-4 px-6">Contact Info</th>
                  <th className="p-4 px-6">Quotation Package</th>
                  <th className="p-4 px-6 text-right">Net Value</th>
                  <th className="p-4 px-6">Outreach Status</th>
                  <th className="p-4 px-6">Plan Segment</th>
                  <th className="p-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEEA] text-xs text-[#1A1A1A]">
                {filteredLeads.map((lead) => {
                  const srv = services.find((s) => s.id === lead.serviceId);
                  const pkg = packages.find((p) => p.id === lead.packageId);
                  return (
                    <tr key={lead.id} className="hover:bg-[#FAF9F6]/40 transition-colors group">
                      <td className="p-4 px-6 font-mono font-bold text-[#1A1A1A]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#C5A059]" />
                          <span>{lead.weddingDate}</span>
                        </div>
                      </td>
                      <td className="p-4 px-6 font-serif text-sm font-semibold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                        {lead.name}
                      </td>
                      <td className="p-4 px-6 space-y-0.5 text-[#666]">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-[#aaa]" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-[#aaa]" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 px-6 space-y-0.5">
                        <div className="font-semibold text-[#1A1A1A]">{srv?.name || 'Unknown Service'}</div>
                        <div className="text-[10px] text-[#888] uppercase font-bold">{pkg?.name || 'None'}</div>
                        {((lead.discountPackage || 0) > 0 || (lead.discountAddons || 0) > 0) && (
                          <div className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 border border-emerald-100 mt-0.5 rounded-sm">
                            Discounts Applied
                          </div>
                        )}
                      </td>
                      <td className="p-4 px-6 text-right font-semibold font-mono text-[#1A1A1A]">
                        ₹{lead.totalVal.toLocaleString()}
                      </td>
                      <td className="p-4 px-6">
                        <span className="stat-pill inline-block bg-[#C5A059]/15 text-[#C5A059] px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 px-6">
                        <select
                          value={lead.planSegment || ''}
                          onChange={(e) =>
                            handleReallocateSegment(lead.id, e.target.value as '30' | '60' | '90' | '')
                          }
                          className="px-2 py-1.5 border border-[#E5E1D8] text-[10px] uppercase tracking-wider font-semibold bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="">None</option>
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                        </select>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <button
                          onClick={() => onSelectLead(lead.id)}
                          id={`btn-plan-${segment}-view-${lead.id}`}
                          className="px-3 py-1.5 border border-[#1A1A1A] text-[9px] uppercase tracking-wider font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center gap-1 ml-auto"
                        >
                          <span>Manage</span>
                          <ArrowRight size={10} />
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
