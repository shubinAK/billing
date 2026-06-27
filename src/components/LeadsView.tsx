/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lead, Service, Package } from '../types';
import { Search, Plus, Download, Mail, Phone, Calendar, ArrowRight, X } from 'lucide-react';

interface LeadsViewProps {
  leads: Lead[];
  services: Service[];
  packages: Package[];
  onSelectLead: (leadId: string) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'dateCreated' | 'timeline' | 'selectedAddons'>) => void;
}

export default function LeadsView({
  leads,
  services,
  packages,
  onSelectLead,
  onAddLead,
}: LeadsViewProps) {
  // We only display active leads (not converted, not lost) in the main pipeline view
  const activeLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost');

  // Interactive local states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding manual lead
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDate, setFormDate] = useState('2026-10-12');
  const [formVenue, setFormVenue] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formServiceId, setFormServiceId] = useState('');
  const [formPackageId, setFormPackageId] = useState('');
  const [formPlanSegment, setFormPlanSegment] = useState<'30' | '60' | '90' | ''>('');

  // Handle service change in manual lead form to update packages available
  const availablePackagesForForm = packages.filter(p => p.serviceId === formServiceId);

  // Filter logic
  const filteredLeads = activeLeads.filter(l => {
    // Search
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      l.name.toLowerCase().includes(query) ||
      (l.email ? l.email.toLowerCase().includes(query) : false) ||
      (l.phone ? l.phone.toLowerCase().includes(query) : false);
    
    // Status Filter
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

    // Service Filter
    const matchesService = serviceFilter === 'all' || l.serviceId === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Export to CSV function (fully simulated client-side download)
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ['Date Created', 'Customer Name', 'Email', 'Phone', 'Wedding Date', 'Venue', 'Service ID', 'Package ID', 'Total Value', 'Status'];
    const rows = filteredLeads.map(l => [
      l.dateCreated,
      l.name,
      l.email,
      l.phone,
      l.weddingDate,
      l.venue || '',
      l.serviceId,
      l.packageId,
      l.totalVal,
      l.status
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lumina_Active_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formServiceId || !formPackageId) {
      alert('Please fill out all required fields.');
      return;
    }

    onAddLead({
      name: formName,
      email: formEmail,
      phone: formPhone,
      weddingDate: formDate,
      venue: formVenue,
      notes: formNotes,
      serviceId: formServiceId,
      packageId: formPackageId,
      status: 'New Lead',
      planSegment: formPlanSegment || undefined,
      totalVal: packages.find(p => p.id === formPackageId)?.basePrice || 1200,
    });

    // Reset Form
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormDate('2026-10-12');
    setFormVenue('');
    setFormNotes('');
    setFormServiceId('');
    setFormPackageId('');
    setFormPlanSegment('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Leads & CRM</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Manage pipeline inquiries and sales process</p>
        </div>

        <div className="flex gap-3">
          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            id="btn-leads-export"
            disabled={filteredLeads.length === 0}
            className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#FAF9F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

          {/* Manual Lead Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            id="btn-leads-add-manual"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Add Manual Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E5E1D8] grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="input-leads-search"
            className="w-full pl-9 pr-4 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-[#FAF9F6]/30 font-medium placeholder:text-[#aaa]"
          />
          <Search size={14} className="absolute left-3 top-3 text-[#aaa]" />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="select-leads-filter-status"
            className="w-full px-3 py-2 border border-[#E5E1D8] text-xs uppercase tracking-wider bg-white font-medium focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="all">All Pipeline Statuses</option>
            <option value="New Lead">New Lead</option>
            <option value="First Call">First Call</option>
            <option value="1st Follow Up">1st Follow Up</option>
            <option value="2nd Follow Up">2nd Follow Up</option>
            <option value="3rd Follow Up">3rd Follow Up</option>
          </select>
        </div>

        {/* Service Filter */}
        <div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            id="select-leads-filter-service"
            className="w-full px-3 py-2 border border-[#E5E1D8] text-xs uppercase tracking-wider bg-white font-medium focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="all">All Services</option>
            {services.map(srv => (
              <option key={srv.id} value={srv.id}>{srv.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Leads Master Table */}
      <div className="bg-white border border-[#E5E1D8] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm text-[#888] italic mb-3">No active leads found matching your filters. Create a lead or adjust your filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="table-leads" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-[10px] uppercase tracking-wider font-bold text-[#666]">
                  <th className="p-4 px-6">Date Generated / Added</th>
                  <th className="p-4 px-6">Customer Name</th>
                  <th className="p-4 px-6">Contact Info</th>
                  <th className="p-4 px-6">Quotation, Add-ons & Discounts</th>
                  <th className="p-4 px-6 text-right">Net Value</th>
                  <th className="p-4 px-6">Pipeline Status</th>
                  <th className="p-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEEA] text-xs text-[#1A1A1A]">
                {filteredLeads.map((lead) => {
                  const srv = services.find(s => s.id === lead.serviceId);
                  const pkg = packages.find(p => p.id === lead.packageId);
                  return (
                    <tr key={lead.id} className="hover:bg-[#FAF9F6]/40 transition-colors group">
                      <td className="p-4 px-6 font-mono text-[#888]">{lead.dateCreated}</td>
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
                      <td className="p-4 px-6 space-y-1">
                        <div className="font-semibold text-[#1A1A1A]">{srv?.name || 'Unknown Service'}</div>
                        <div className="text-[10px] text-[#888] uppercase font-bold">{pkg?.name || 'None'}</div>

                        {/* Custom Quotation Notes summary */}
                        {lead.customNotes && (
                          <div className="text-[10px] italic text-[#666] line-clamp-2 max-w-xs bg-stone-50 p-1 border border-stone-100 rounded-sm mt-1" title={lead.customNotes}>
                            <strong>Note:</strong> "{lead.customNotes}"
                          </div>
                        )}

                        {/* Custom Discounts display */}
                        {((lead.discountPackage || 0) > 0 || (lead.discountAddons || 0) > 0) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lead.discountPackage && lead.discountPackage > 0 ? (
                              <span className="inline-flex items-center text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-100 uppercase tracking-wider rounded-sm">
                                Pkg Discount: -₹{lead.discountPackage.toLocaleString()}
                              </span>
                            ) : null}
                            {lead.discountAddons && lead.discountAddons > 0 ? (
                              <span className="inline-flex items-center text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-100 uppercase tracking-wider rounded-sm">
                                Add-on Discount: -₹{lead.discountAddons.toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="p-4 px-6 text-right font-semibold font-mono text-[#1A1A1A]">
                        ₹{lead.totalVal.toLocaleString()}
                      </td>
                      <td className="p-4 px-6 space-y-1.5">
                        <span className="stat-pill inline-block bg-[#C5A059]/15 text-[#C5A059] px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase block text-center max-w-[120px]">
                          {lead.status}
                        </span>
                        {lead.planSegment && (
                          <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm text-center max-w-[120px]">
                            {lead.planSegment} Days Plan
                          </span>
                        )}
                      </td>
                      <td className="p-4 px-6 text-right">
                        <button
                          onClick={() => onSelectLead(lead.id)}
                          id={`btn-leads-view-${lead.id}`}
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

      {/* Manual Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-lg p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-4">
              <h2 className="font-serif text-xl italic text-[#1A1A1A]">Add Manual In-Office Lead</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888] hover:text-[#1A1A1A] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form id="form-leads-manual-add" onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  id="input-manual-lead-name"
                  placeholder="e.g. Jessica & David"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    id="input-manual-lead-email"
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    id="input-manual-lead-phone"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Date / Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Wedding/Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    id="input-manual-lead-date"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Event Venue
                  </label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    id="input-manual-lead-venue"
                    placeholder="e.g. City Hall, SF"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Target Service *
                </label>
                <select
                  required
                  value={formServiceId}
                  onChange={(e) => {
                    setFormServiceId(e.target.value);
                    setFormPackageId(''); // reset package
                  }}
                  id="select-manual-lead-service"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white"
                >
                  <option value="">-- Choose Photography Service --</option>
                  {services.filter(s => s.enabled).map(srv => (
                    <option key={srv.id} value={srv.id}>{srv.name}</option>
                  ))}
                </select>
              </div>

              {/* Package Selection */}
              {formServiceId && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Target Package *
                  </label>
                  <select
                    required
                    value={formPackageId}
                    onChange={(e) => setFormPackageId(e.target.value)}
                    id="select-manual-lead-package"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white"
                  >
                    <option value="">-- Select Specific Package Tier --</option>
                    {availablePackagesForForm.filter(p => !p.hidden).map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (₹{pkg.basePrice.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Plan Segment Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Plan Segment (Days)
                </label>
                <select
                  value={formPlanSegment}
                  onChange={(e) => setFormPlanSegment(e.target.value as '30' | '60' | '90' | '')}
                  id="select-manual-lead-plan-segment"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white text-[#1a1a1a]"
                >
                  <option value="">None / Unassigned</option>
                  <option value="30">30 Days Plan</option>
                  <option value="60">60 Days Plan</option>
                  <option value="90">90 Days Plan</option>
                </select>
              </div>

              {/* Special private notes */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Private Administration Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  id="input-manual-lead-notes"
                  placeholder="Record initial requests, custom budgets, package options discussed..."
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
                  Save New Lead
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
