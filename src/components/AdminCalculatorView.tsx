/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Service, Package, Lead, Addon } from '../types';
import { Calculator, FileText, Save, RefreshCw, X, Plus, Sparkles } from 'lucide-react';

interface AdminCalculatorViewProps {
  services: Service[];
  packages: Package[];
  leads: Lead[];
  onAddLeadFromCalculator: (leadData: Omit<Lead, 'id' | 'dateCreated' | 'timeline'>) => void;
  onUpdateLeadQuotation: (
    leadId: string, 
    totalVal: number, 
    selectedAddons: { [addonName: string]: number }, 
    packageId: string, 
    serviceId: string,
    discountPackage?: number,
    discountAddons?: number,
    customNotes?: string
  ) => void;
  onTriggerQuotationPrint: (printData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    eventDate: string;
    venue: string;
    serviceId: string;
    packageId: string;
    selectedAddons: { [addonName: string]: number };
    totalVal: number;
    discountPackage?: number;
    discountAddons?: number;
    customNotes?: string;
  }) => void;
  preselectedLead?: Lead | null;
}

export default function AdminCalculatorView({
  services,
  packages,
  leads,
  onAddLeadFromCalculator,
  onUpdateLeadQuotation,
  onTriggerQuotationPrint,
  preselectedLead,
}: AdminCalculatorViewProps) {
  const activeServices = services.filter(s => s.enabled);

  // Core Selector States
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<{ [addonName: string]: number }>({});
  const [totalVal, setTotalVal] = useState(0);

  // Discount and custom notes states
  const [discountPackage, setDiscountPackage] = useState<number>(0);
  const [discountAddons, setDiscountAddons] = useState<number>(0);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Associated CRM Lead state
  const [associatedLeadId, setAssociatedLeadId] = useState<string>('');
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('');

  // Pre-load preselected lead values if passed from details view
  useEffect(() => {
    if (preselectedLead) {
      setSelectedServiceId(preselectedLead.serviceId);
      setSelectedPackageId(preselectedLead.packageId);
      setSelectedAddons(preselectedLead.selectedAddons || {});
      setDiscountPackage(preselectedLead.discountPackage || 0);
      setDiscountAddons(preselectedLead.discountAddons || 0);
      setCustomNotes(preselectedLead.customNotes || '');
      setAssociatedLeadId(preselectedLead.id);
    } else if (activeServices.length > 0) {
      const firstSrv = activeServices[0].id;
      setSelectedServiceId(firstSrv);
      const srvPkgs = packages.filter(p => p.serviceId === firstSrv && !p.hidden);
      if (srvPkgs.length > 0) {
        setSelectedPackageId(srvPkgs[0].id);
      }
      setDiscountPackage(0);
      setDiscountAddons(0);
      setCustomNotes('');
      setAssociatedLeadId('');
    }
  }, [preselectedLead]);

  // Handle manual select of associated lead
  const handleLeadAssociationChange = (leadId: string) => {
    setAssociatedLeadId(leadId);
    if (!leadId) {
      setDiscountPackage(0);
      setDiscountAddons(0);
      setCustomNotes('');
      return;
    }

    const foundLead = leads.find(l => l.id === leadId);
    if (foundLead) {
      setSelectedServiceId(foundLead.serviceId);
      setSelectedPackageId(foundLead.packageId);
      setSelectedAddons(foundLead.selectedAddons || {});
      setDiscountPackage(foundLead.discountPackage || 0);
      setDiscountAddons(foundLead.discountAddons || 0);
      setCustomNotes(foundLead.customNotes || '');
    }
  };

  // Handle service switch
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const srvPkgs = packages.filter(p => p.serviceId === serviceId && !p.hidden);
    if (srvPkgs.length > 0) {
      setSelectedPackageId(srvPkgs[0].id);
    } else {
      setSelectedPackageId('');
    }
    setSelectedAddons({});
    setDiscountPackage(0);
    setDiscountAddons(0);
    setCustomNotes('');
  };

  const currentPackage = packages.find(p => p.id === selectedPackageId);
  const availablePackages = packages.filter(p => p.serviceId === selectedServiceId && !p.hidden);

  // Recalculate Total on changes
  useEffect(() => {
    if (!currentPackage) {
      setTotalVal(0);
      return;
    }
    const basePrice = currentPackage.basePrice;
    const netPkg = Math.max(0, basePrice - (discountPackage || 0));

    let sumAddons = 0;
    Object.entries(selectedAddons).forEach(([addonName, qty]) => {
      const addonRef = currentPackage.addons.find(a => a.name === addonName);
      if (addonRef) {
        const qtyNum = Number(qty);
        if (addonRef.pricingType === 'fixed') {
          sumAddons += addonRef.price;
        } else {
          sumAddons += addonRef.price * qtyNum;
        }
      }
    });
    const netAdd = Math.max(0, sumAddons - (discountAddons || 0));

    setTotalVal(netPkg + netAdd);
  }, [selectedPackageId, selectedAddons, discountPackage, discountAddons]);

  // Toggle addons
  const handleToggleAddon = (addonName: string) => {
    setSelectedAddons(prev => {
      const next = { ...prev };
      if (next[addonName]) {
        delete next[addonName];
      } else {
        const addonRef = currentPackage?.addons.find(a => a.name === addonName);
        next[addonName] = addonRef?.defaultQty || 1;
      }
      return next;
    });
  };

  const handleQtyChange = (addonName: string, qty: number) => {
    const addonRef = currentPackage?.addons.find(a => a.name === addonName);
    const min = addonRef?.minQty ?? 1;
    const max = addonRef?.maxQty ?? 99;

    setSelectedAddons(prev => {
      const next = { ...prev };
      if (qty < min) {
        delete next[addonName];
      } else if (qty > max) {
        next[addonName] = max;
      } else {
        next[addonName] = qty;
      }
      return next;
    });
  };

  // Modal Dialog states
  const [activeModal, setActiveModal] = useState<'save-as-lead' | 'update-existing' | 'generate-quote' | null>(null);

  // Form states for creating NEW lead from calculator
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadDate, setLeadDate] = useState('2026-10-12');
  const [leadVenue, setLeadVenue] = useState('');
  const [leadNotes, setLeadNotes] = useState('');

  // Dropdown state for updating EXISTING lead
  const [updateLeadId, setUpdateLeadId] = useState('');

  // Form states for non-saving PDF Generation
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteDate, setQuoteDate] = useState('2026-10-12');
  const [quoteVenue, setQuoteVenue] = useState('');

  // Submit handlings
  const handleSaveAsLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      alert('Client Name and Email are required.');
      return;
    }

    onAddLeadFromCalculator({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      weddingDate: leadDate,
      venue: leadVenue,
      notes: leadNotes,
      serviceId: selectedServiceId,
      packageId: selectedPackageId,
      selectedAddons,
      status: 'New Lead',
      totalVal,
      discountPackage,
      discountAddons,
      customNotes,
    });

    // Reset fields & close modal
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadVenue('');
    setLeadNotes('');
    setActiveModal(null);
    alert('Lead saved successfully into pipeline!');
  };

  const handleUpdateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateLeadId) {
      alert('Please select an active lead to update.');
      return;
    }

    onUpdateLeadQuotation(
      updateLeadId, 
      totalVal, 
      selectedAddons, 
      selectedPackageId, 
      selectedServiceId, 
      discountPackage, 
      discountAddons, 
      customNotes
    );
    setActiveModal(null);
    alert('Lead quotation updated successfully!');
  };

  const handleDirectUpdateLead = () => {
    if (!associatedLeadId) return;
    onUpdateLeadQuotation(
      associatedLeadId, 
      totalVal, 
      selectedAddons, 
      selectedPackageId, 
      selectedServiceId, 
      discountPackage, 
      discountAddons, 
      customNotes
    );
    alert('Lead quotation updated successfully with custom packages, discounts, and notes!');
  };

  const handleGenerateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quotePhone) {
      alert('Customer Name and Phone Number are required.');
      return;
    }

    onTriggerQuotationPrint({
      customerName: quoteName,
      customerPhone: quotePhone,
      customerEmail: quoteEmail,
      eventDate: quoteDate,
      venue: quoteVenue,
      serviceId: selectedServiceId,
      packageId: selectedPackageId,
      selectedAddons,
      totalVal,
      discountPackage,
      discountAddons,
      customNotes,
    });

    setActiveModal(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Admin Quotation Calculator</h1>
        <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
          Perform dynamic calculations, select custom add-ons, and output instant vector quotes
        </p>
      </div>

      {preselectedLead && (
        <div className="bg-[#FAF9F6] border border-[#C5A059] p-4 text-xs flex justify-between items-center text-[#1A1A1A]">
          <div>
            Adjusting active quotation for client: <strong>{preselectedLead.name}</strong> • Currently scheduled on {preselectedLead.weddingDate}
          </div>
          <button 
            onClick={() => {
              // Reset to normal
              window.location.reload();
            }}
            className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] hover:underline"
          >
            Clear Target
          </button>
        </div>
      )}

      {/* Calculator Body Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left pane: Options setup controls (span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E1D8] p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#F0EEEA] pb-3">
            <Calculator className="text-[#C5A059]" size={18} />
            <h2 className="font-serif text-lg italic text-[#1A1A1A]">Quotation Customizer</h2>
          </div>

          {/* Associated CRM Lead Selector */}
          <div className="space-y-3 bg-[#FAF9F6] p-4 border border-[#E5E1D8]">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                Associate Quote with Pipeline Lead (Optional)
              </label>
              <p className="text-[10px] text-[#666] mb-2">Search by client name or phone number below to auto-load their package settings and save quotation logs directly.</p>
            </div>

            {/* Live Search Input for Leads */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type name or phone to search leads..."
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                id="input-admin-calc-lead-search"
                className="w-full px-3 py-1.5 pl-8 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A] placeholder:text-[#aaa] bg-white font-medium"
              />
              <span className="absolute left-2.5 top-2 text-[#aaa] text-xs">🔍</span>
              {leadSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLeadSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-xs text-[#888] hover:text-[#1A1A1A] font-bold"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtered Dropdown select */}
            <select
              value={associatedLeadId}
              onChange={(e) => handleLeadAssociationChange(e.target.value)}
              id="select-admin-calc-associated-lead"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs bg-white focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-semibold"
            >
              <option value="">-- Manual Option (No Lead Associated) --</option>
              {leads
                .filter(l => l.status !== 'Converted' && l.status !== 'Lost')
                .filter(lead => {
                  if (!leadSearchQuery) return true;
                  const q = leadSearchQuery.toLowerCase();
                  const nameMatch = lead.name.toLowerCase().includes(q);
                  const phoneMatch = lead.phone ? lead.phone.toLowerCase().includes(q) : false;
                  return nameMatch || phoneMatch;
                })
                .map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} {lead.phone ? `(${lead.phone})` : ''} - {lead.weddingDate || 'No Date'}
                  </option>
                ))}
            </select>

            {/* Dynamic Results Status indicator helper */}
            <div className="flex justify-between items-center text-[10px] text-[#888]">
              <span>
                Showing {
                  leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').filter(lead => {
                    if (!leadSearchQuery) return true;
                    const q = leadSearchQuery.toLowerCase();
                    const nameMatch = lead.name.toLowerCase().includes(q);
                    const phoneMatch = lead.phone ? lead.phone.toLowerCase().includes(q) : false;
                    return nameMatch || phoneMatch;
                  }).length
                } of {leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length} active leads
              </span>
              {leadSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLeadSearchQuery('')}
                  className="underline hover:text-[#1A1A1A]"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {associatedLeadId && (
              <p className="text-[11px] text-[#666] italic mt-1.5 pt-1.5 border-t border-[#E5E1D8]/60">
                ✓ Auto-loaded lead profile details. Updating quotation saves directly to their timeline history logs.
              </p>
            )}
          </div>

          {/* Service Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
              Photography Line Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              id="select-admin-calc-service"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs bg-white focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
            >
              <option value="">-- Choose Photography Line --</option>
              {activeServices.map(srv => (
                <option key={srv.id} value={srv.id}>{srv.name}</option>
              ))}
            </select>
          </div>

          {/* Package Selector */}
          {selectedServiceId && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                Target Base Package Tier
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => {
                  setSelectedPackageId(e.target.value);
                  setSelectedAddons({});
                }}
                id="select-admin-calc-package"
                className="w-full px-3 py-2 border border-[#E5E1D8] text-xs bg-white focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
              >
                <option value="">-- Select Package Base --</option>
                {availablePackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} (₹{pkg.basePrice.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Optional Addons Lists */}
          {currentPackage && (
            <div className="space-y-4 pt-4 border-t border-[#F0EEEA]">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block mb-1">
                  Optional Custom Add-on Modules
                </label>
                
                {currentPackage.addons.length === 0 ? (
                  <p className="text-xs text-[#888] italic">No add-ons configured for this package tier.</p>
                ) : (
                  <div className="space-y-2">
                    {currentPackage.addons.map((add) => {
                      const isSelected = !!selectedAddons[add.name];
                      const qty = selectedAddons[add.name] || 0;

                      return (
                        <div 
                          key={add.name}
                          className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            isSelected ? 'bg-[#FAF9F6] border-[#1A1A1A]' : 'border-[#E5E1D8] bg-white'
                          }`}
                        >
                          {/* Selector check box */}
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              id={`chk-admin-calc-addon-${add.name.toLowerCase().replace(/\s+/g, '-')}`}
                              checked={isSelected}
                              onChange={() => handleToggleAddon(add.name)}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <label 
                              htmlFor={`chk-admin-calc-addon-${add.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-xs font-semibold text-[#1A1A1A] cursor-pointer"
                            >
                              {add.name}
                            </label>
                          </div>

                          {/* Quantity and Prices */}
                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            {isSelected && add.pricingType !== 'fixed' && (
                              <div className="flex items-center border border-[#1A1A1A] text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(add.name, qty - 1)}
                                  className="px-2 py-0.5 bg-white border-r border-[#1A1A1A] hover:bg-stone-50"
                                >
                                  -
                                </button>
                                <span className="px-3 font-semibold font-mono text-[#1A1A1A]">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(add.name, qty + 1)}
                                  className="px-2 py-0.5 bg-white border-l border-[#1A1A1A] hover:bg-stone-50"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            <span className="text-xs font-mono font-bold text-[#C5A059]">
                              +₹{add.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Discounts & Notes Section */}
              <div className="space-y-4 pt-6 border-t border-[#F0EEEA]">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                  Discounts & Custom Quotation Notes
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Package discount */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#666] font-semibold block">
                      Package Discount (₹)
                    </span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-[#888] text-xs font-mono">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={discountPackage || ''}
                        onChange={(e) => setDiscountPackage(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className="w-full pl-6 pr-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-mono"
                      />
                    </div>
                    <span className="text-[9px] text-[#888] block">Discount applied on base package rate</span>
                  </div>

                  {/* Add-ons discount */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#666] font-semibold block">
                      Optional Add-ons Discount (₹)
                    </span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-[#888] text-xs font-mono">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={discountAddons || ''}
                        onChange={(e) => setDiscountAddons(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className="w-full pl-6 pr-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-mono"
                      />
                    </div>
                    <span className="text-[9px] text-[#888] block">Discount applied on overall addon modules</span>
                  </div>
                </div>

                {/* Custom notes text area */}
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#666] font-semibold block">
                    Custom Quotation Notes (Printed on PDF)
                  </span>
                  <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Include custom drone setup free of charge. Retainer rate locked until next week..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs resize-none focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Calculations Breakdown summary */}
          <div className="bg-white border border-[#E5E1D8] p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3 mb-4">
              <h3 className="font-serif text-lg italic text-[#1A1A1A]">Investment Total</h3>
              <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest font-mono">
                Real-Time Recalculator
              </span>
            </div>

            {/* Calculations items */}
            <div className="space-y-3 flex-1 min-h-[160px] text-xs text-[#1A1A1A]">
              {currentPackage ? (
                <>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#F0EEEA]">
                    <span>{currentPackage.name} Base Rate</span>
                    <span className="font-mono font-semibold">₹{currentPackage.basePrice.toLocaleString()}</span>
                  </div>

                  {/* Package Discount if any */}
                  {discountPackage > 0 && (
                    <div className="flex justify-between items-center py-1 border-b border-[#F0EEEA]/40 text-emerald-700 bg-emerald-50/50 px-1">
                      <span>Package Discount</span>
                      <span className="font-mono font-semibold">-₹{discountPackage.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Addons detailed list */}
                  {Object.entries(selectedAddons).map(([name, qty]) => {
                    const addonRef = currentPackage.addons.find(a => a.name === name);
                    if (!addonRef) return null;
                    const qtyNum = Number(qty);
                    return (
                      <div key={name} className="flex justify-between items-center text-[#666] py-1 border-b border-[#F0EEEA]/40">
                        <span>
                          + {name} {qtyNum > 1 && `(Qty ${qtyNum})`}
                        </span>
                        <span className="font-mono font-semibold text-[#1A1A1A]">
                          +₹{(addonRef.price * qtyNum).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}

                  {/* Addons Discount if any */}
                  {discountAddons > 0 && (
                    <div className="flex justify-between items-center py-1 border-b border-[#F0EEEA]/40 text-emerald-700 bg-emerald-50/50 px-1">
                      <span>Add-ons Discount</span>
                      <span className="font-mono font-semibold">-₹{discountAddons.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Custom notes text area preview */}
                  {customNotes && (
                    <div className="p-3 bg-stone-50 border border-dashed border-[#E5E1D8] text-[11px] text-[#666] italic mt-3">
                      <strong>Quotation Note Preview:</strong>
                      <p className="mt-1 line-clamp-3">"{customNotes}"</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center italic text-[#888] py-8">
                  Configure a target service & package tier on the left pane to visualize the investment split.
                </div>
              )}
            </div>

            {/* Huge Dynamic Total display */}
            <div className="mt-6 pt-4 border-t-2 border-[#1A1A1A] flex justify-between items-end mb-6">
              <span className="font-serif text-xl italic text-[#1A1A1A]">Contracted Investment</span>
              <span className="font-serif text-3xl text-[#1A1A1A] font-bold font-mono">
                ₹{totalVal.toLocaleString()}
              </span>
            </div>

            {/* THE DYNAMIC ACTIONS WORKFLOW */}
            <div className="space-y-3 pt-4 border-t border-[#F0EEEA]">
              
              {/* If lead is selected, provide DIRECT SAVE & PRINT options */}
              {associatedLeadId ? (
                <>
                  {/* DIRECT SAVE TO LEAD PROFILE */}
                  <button
                    onClick={handleDirectUpdateLead}
                    id="btn-admin-calc-direct-save-lead"
                    className="w-full py-3 bg-[#C5A059] text-white hover:bg-[#b08e4b] text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    <span>Save & Update Lead's Profile</span>
                  </button>

                  {/* DIRECT GENERATE PDF (Bypassing entry modal because we have all details!) */}
                  <button
                    onClick={() => {
                      if (!selectedPackageId) {
                        alert('Please select a package first.');
                        return;
                      }
                      const selectedLead = leads.find(l => l.id === associatedLeadId);
                      if (selectedLead) {
                        onTriggerQuotationPrint({
                          customerName: selectedLead.name,
                          customerPhone: selectedLead.phone || '',
                          customerEmail: selectedLead.email || '',
                          eventDate: selectedLead.weddingDate || '2026-10-12',
                          venue: selectedLead.venue || '',
                          serviceId: selectedServiceId,
                          packageId: selectedPackageId,
                          selectedAddons,
                          totalVal,
                          discountPackage,
                          discountAddons,
                          customNotes,
                        });
                      }
                    }}
                    id="btn-admin-calc-direct-pdf"
                    className="w-full py-3 bg-[#1A1A1A] text-white hover:bg-[#333] text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={14} />
                    <span>Generate Lead PDF Quotation</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Action 1: Generate PDF Quotation (DOES NOT SAVE, asks for Name/Phone) */}
                  <button
                    onClick={() => {
                      if (!selectedPackageId) {
                        alert('Please select a package first.');
                        return;
                      }
                      setQuoteName('');
                      setQuotePhone('');
                      setQuoteEmail('');
                      setQuoteVenue('');
                      setActiveModal('generate-quote');
                    }}
                    id="btn-admin-calc-gen-quote"
                    className="w-full py-3 bg-[#1A1A1A] text-white hover:bg-[#333] text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={14} />
                    <span>Generate PDF Quotation</span>
                  </button>

                  {/* Action 2: Save as Brand New Lead in Pipeline */}
                  <button
                    onClick={() => {
                      if (!selectedPackageId) {
                        alert('Please select a package first.');
                        return;
                      }
                      setActiveModal('save-as-lead');
                    }}
                    id="btn-admin-calc-save-lead"
                    className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F6] text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 bg-white"
                  >
                    <Save size={14} />
                    <span>Save as Pipeline Lead</span>
                  </button>

                  {/* Action 3: Update Existing Lead quotation */}
                  {leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length > 0 && (
                    <button
                      onClick={() => {
                        if (!selectedPackageId) {
                          alert('Please select a package first.');
                          return;
                        }
                        setActiveModal('update-existing');
                      }}
                      id="btn-admin-calc-update-lead"
                      className="w-full py-3 border border-dashed border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F6] text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 bg-white"
                    >
                      <RefreshCw size={14} />
                      <span>Update Existing Pipeline Lead</span>
                    </button>
                  )}
                </>
              )}

            </div>
          </div>

          {/* Standard inclusions details display for selection */}
          {currentPackage && (
            <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-6 space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest text-[#888] font-bold border-b border-[#E5E1D8] pb-1.5">
                Standard Inclusions Under this Tier
              </h4>
              <ul className="space-y-1.5 text-xs text-[#666] pl-2.5">
                {currentPackage.inclusions.map((inc, i) => (
                  <li key={inc.id || i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 shrink-0" />
                    <span className="text-xs text-[#1A1A1A]">
                      {inc.quantity > 0 && <span className="font-mono font-semibold">{inc.quantity} {inc.unit || ''} - </span>}
                      <strong>{inc.name}</strong>
                      {inc.price !== undefined && inc.price > 0 && (
                        <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5 ml-2 rounded">
                          ₹{inc.price.toLocaleString()}
                        </span>
                      )}
                      {inc.description && <span className="text-stone-500 block text-[11px] mt-0.5">{inc.description}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: Save as New Lead */}
      {activeModal === 'save-as-lead' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-md p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-4">
              <h3 className="font-serif text-xl italic text-[#1A1A1A]">Save Quote as Lead</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAsLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Client Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Rachel & Chandler"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="rachel@geller.com"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Phone Number</label>
                <input
                  type="text"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+1 (555) 789-4561"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Wedding Date</label>
                  <input
                    type="date"
                    required
                    value={leadDate}
                    onChange={(e) => setLeadDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Shoot Venue</label>
                  <input
                    type="text"
                    value={leadVenue}
                    onChange={(e) => setLeadVenue(e.target.value)}
                    placeholder="e.g. Central Park Pavilion"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Inquiry Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Notes from consultation details, customized splits discussed..."
                  rows={2}
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
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

      {/* MODAL 2: Update Existing Lead */}
      {activeModal === 'update-existing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-md p-8 space-y-6 relative">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-4">
              <h3 className="font-serif text-xl italic text-[#1A1A1A]">Update Pipeline Lead</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Select Active Pipeline Target *
                </label>
                <select
                  required
                  value={updateLeadId}
                  onChange={(e) => setUpdateLeadId(e.target.value)}
                  id="select-admin-calc-target-update"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs bg-white text-[#1a1a1a]"
                >
                  <option value="">-- Choose active lead to update --</option>
                  {leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} (₹{lead.totalVal.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-[#666] bg-[#FAF9F6] p-3 border border-[#E5E1D8] leading-relaxed">
                Updating will override the selected lead's target package tier, configured addon modules, and final total investment value with your current calculator specifications immediately.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333]"
                >
                  Apply Quotation Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Generate Quotation PDF without saving */}
      {activeModal === 'generate-quote' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-md p-8 space-y-6 relative">
            <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#C5A059]" size={16} />
                <h3 className="font-serif text-xl italic text-[#1A1A1A]">Output PDF Quotation</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateQuoteSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="e.g. Monica Geller"
                    id="input-quote-pdf-name"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    id="input-quote-pdf-phone"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Email Address</label>
                <input
                  type="email"
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  placeholder="monica@geller.com"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Event Date</label>
                  <input
                    type="date"
                    required
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">Event Venue</label>
                  <input
                    type="text"
                    value={quoteVenue}
                    onChange={(e) => setQuoteVenue(e.target.value)}
                    placeholder="e.g. Central Park Conservatory"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#888] italic">
                Note: Generating this quotation outputs a clean vector document print interface without writing any records into the local CRM pipeline databases.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-[#1A1A1A] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-quote-pdf-submit"
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333]"
                >
                  Proceed to Printable Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
