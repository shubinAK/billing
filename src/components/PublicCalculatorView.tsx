/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Service, Package, Lead } from '../types';
import { Sparkles, Calendar, Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight, LayoutGrid } from 'lucide-react';

interface PublicCalculatorViewProps {
  services: Service[];
  packages: Package[];
  onAddPublicInquiry: (leadData: Omit<Lead, 'id' | 'dateCreated' | 'timeline' | 'status'>) => void;
  onSwitchToAdmin: () => void;
}

export default function PublicCalculatorView({
  services,
  packages,
  onAddPublicInquiry,
  onSwitchToAdmin,
}: PublicCalculatorViewProps) {
  const activeServices = services.filter(s => s.enabled);

  // States
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<{ [addonName: string]: number }>({});
  const [removedInclusions, setRemovedInclusions] = useState<{ [incId: string]: boolean }>({});
  const [editedInclusionQtys, setEditedInclusionQtys] = useState<{ [incId: string]: number }>({});
  const [totalVal, setTotalVal] = useState(0);

  // Inquiry form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientDate, setClientDate] = useState('2026-10-12');
  const [clientVenue, setClientVenue] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Finished state
  const [submitted, setSubmitted] = useState(false);

  // Auto select first items on load
  useEffect(() => {
    if (activeServices.length > 0) {
      const firstSrv = activeServices[0].id;
      setSelectedServiceId(firstSrv);
      const srvPkgs = packages.filter(p => p.serviceId === firstSrv && !p.hidden);
      if (srvPkgs.length > 0) {
        setSelectedPackageId(srvPkgs[0].id);
      }
    }
  }, []);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const srvPkgs = packages.filter(p => p.serviceId === serviceId && !p.hidden);
    if (srvPkgs.length > 0) {
      setSelectedPackageId(srvPkgs[0].id);
    } else {
      setSelectedPackageId('');
    }
    setSelectedAddons({});
    setRemovedInclusions({});
    setEditedInclusionQtys({});
  };

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setSelectedAddons({});
    setRemovedInclusions({});
    setEditedInclusionQtys({});
  };

  const currentPackage = packages.find(p => p.id === selectedPackageId);
  const availablePackages = packages.filter(p => p.serviceId === selectedServiceId && !p.hidden);

  // Recalculate Total
  useEffect(() => {
    if (!currentPackage) {
      setTotalVal(0);
      return;
    }
    let sum = currentPackage.basePrice;
    Object.entries(selectedAddons).forEach(([addonName, qty]) => {
      const addonRef = currentPackage.addons.find(a => a.name === addonName);
      if (addonRef) {
        const qtyNum = Number(qty);
        if (addonRef.pricingType === 'fixed') {
          sum += addonRef.price;
        } else {
          sum += addonRef.price * qtyNum;
        }
      }
    });
    setTotalVal(sum);
  }, [selectedPackageId, selectedAddons]);

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

  const handleToggleInclusion = (incId: string) => {
    setRemovedInclusions(prev => ({
      ...prev,
      [incId]: !prev[incId]
    }));
  };

  const handleInclusionQtyChange = (incId: string, qty: number) => {
    if (qty < 0) return;
    setEditedInclusionQtys(prev => ({
      ...prev,
      [incId]: qty
    }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !selectedServiceId || !selectedPackageId) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    onAddPublicInquiry({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      weddingDate: clientDate,
      venue: clientVenue,
      notes: clientNotes,
      serviceId: selectedServiceId,
      packageId: selectedPackageId,
      selectedAddons,
      totalVal,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-[#E5E1D8] w-full max-w-xl p-10 space-y-8 text-center">
          <div className="flex justify-center">
            <CheckCircle2 size={56} className="text-[#C5A059]" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-3xl italic text-[#1A1A1A]">Inquiry Received</h2>
            <p className="text-[#666] text-sm leading-relaxed max-w-md mx-auto">
              Thank you for requesting a custom pricing breakdown from Lumina Studio. Our lead photography administrators have received your selection.
            </p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-5 text-left text-xs text-[#1A1A1A] space-y-2">
            <div className="font-serif italic font-semibold text-[#C5A059] text-sm border-b border-[#E5E1D8] pb-1.5 mb-2">
              Inquiry Selection Summary
            </div>
            <div>
              <strong>Target Service:</strong> {services.find(s => s.id === selectedServiceId)?.name}
            </div>
            <div>
              <strong>Base Tier Selected:</strong> {currentPackage?.name}
            </div>
            {Object.keys(selectedAddons).length > 0 && (
              <div>
                <strong>Included Custom Add-ons:</strong>
                <ul className="list-disc pl-5 mt-1 text-[#666] space-y-0.5">
                  {Object.entries(selectedAddons).map(([name, qty]) => {
                    const qtyNum = Number(qty);
                    return (
                      <li key={name}>
                        {name} {qtyNum > 1 && `(Qty ${qtyNum})`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="text-sm font-semibold pt-2 border-t border-[#E5E1D8] flex justify-between font-mono">
              <span>Estimated Value:</span>
              <span>₹{totalVal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EEEA] flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Reset form
                setClientName('');
                setClientEmail('');
                setClientPhone('');
                setClientVenue('');
                setClientNotes('');
                setSelectedAddons({});
                setSubmitted(false);
              }}
              className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#333] transition-colors"
            >
              Configure Another Package
            </button>
            <button
              onClick={onSwitchToAdmin}
              className="px-6 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold tracking-wider uppercase hover:bg-[#FAF9F6]"
            >
              Go to CRM Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col font-sans">
      
      {/* Mini brand navbar */}
      <header className="bg-white border-b border-[#E5E1D8] px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="font-serif italic text-xl text-[#1A1A1A] tracking-tight">Lumina Studio</div>
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold border-l border-[#E5E1D8] pl-2">
            Interactive Calculator
          </span>
        </div>

        <button
          onClick={onSwitchToAdmin}
          className="px-4 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1"
        >
          <span>Admin Workspace</span>
          <ChevronRight size={12} />
        </button>
      </header>

      {/* Main Container Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Calculator (span 7) */}
        <section className="lg:col-span-7 bg-white border border-[#E5E1D8] p-6 md:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#F0EEEA] pb-4">
            <h1 className="font-serif text-3xl italic text-[#1A1A1A] tracking-tight">Investment Estimator</h1>
            <p className="text-xs text-[#888] leading-relaxed">
              Tailor photography options to suit your wedding dreams. Receive a transparent price projection dynamically updated.
            </p>
          </div>

          {/* Service Line Selection */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
              Choose Service Line
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeServices.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleServiceChange(srv.id)}
                    className={`p-4 border text-left transition-all ${
                      isSelected 
                        ? 'bg-[#FAF9F6] border-[#1A1A1A] ring-1 ring-[#1A1A1A]' 
                        : 'bg-white border-[#E5E1D8] hover:border-[#aaa]'
                    }`}
                  >
                    <h4 className="font-serif text-sm font-semibold text-[#1A1A1A]">{srv.name}</h4>
                    <p className="text-[11px] text-[#666] mt-1 line-clamp-2 leading-relaxed">{srv.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package Selection Selector */}
          {selectedServiceId && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                Select Base Coverage Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePackages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageChange(pkg.id)}
                      className={`p-4 border text-left transition-all ${
                        isSelected 
                          ? 'bg-[#FAF9F6] border-[#1A1A1A] ring-1 ring-[#1A1A1A]' 
                          : 'bg-white border-[#E5E1D8] hover:border-[#aaa]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#1A1A1A]">{pkg.name}</h4>
                        <span className="font-mono text-xs font-bold text-[#C5A059] shrink-0">
                          ₹{pkg.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666] mt-1 line-clamp-2 leading-relaxed">{pkg.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Included Services Section */}
          {currentPackage && currentPackage.inclusions && currentPackage.inclusions.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#F0EEEA]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                  Included Services & Items
                </label>
                {currentPackage.customizationRules?.allowRemoveInclusions && (
                  <span className="text-[9px] uppercase tracking-wider text-green-600 font-bold bg-green-50 px-1.5 py-0.5">
                    Removable
                  </span>
                )}
              </div>

              <div className="space-y-2 bg-[#FAF9F6] p-4 border border-[#E5E1D8]">
                {currentPackage.inclusions.map((inc) => {
                  const isRemoved = !!removedInclusions[inc.id];
                  const canRemove = currentPackage.customizationRules?.allowRemoveInclusions ?? true;
                  const canEditQty = currentPackage.customizationRules?.allowEditIncludedQuantity ?? true;
                  const currentQty = editedInclusionQtys[inc.id] !== undefined ? editedInclusionQtys[inc.id] : inc.quantity;

                  return (
                    <div 
                      key={inc.id}
                      className={`flex items-center justify-between py-1.5 border-b border-[#E5E1D8]/60 last:border-none ${
                        isRemoved ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {canRemove ? (
                          <input
                            type="checkbox"
                            checked={!isRemoved}
                            onChange={() => handleToggleInclusion(inc.id)}
                            className="w-3.5 h-3.5 cursor-pointer accent-[#1A1A1A]"
                          />
                        ) : (
                          <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shrink-0" />
                        )}
                        <div className="text-xs">
                          <span className="font-semibold text-[#1A1A1A]">{inc.name}</span>
                          {inc.price !== undefined && inc.price > 0 && (
                            <span className="text-[9px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 ml-2.5 rounded">
                              ₹{inc.price.toLocaleString()}
                            </span>
                          )}
                          {inc.description && (
                            <span className="text-[10px] text-[#666] block">{inc.description}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isRemoved && canEditQty && inc.quantity > 0 ? (
                          <div className="flex items-center border border-[#1A1A1A]/30 bg-white text-[10px] scale-90 origin-right">
                            <button
                              type="button"
                              onClick={() => handleInclusionQtyChange(inc.id, Math.max(0, currentQty - 1))}
                              className="px-1.5 py-0.5 hover:bg-stone-50"
                            >
                              -
                            </button>
                            <span className="px-2 font-semibold font-mono">{currentQty}</span>
                            <button
                              type="button"
                              onClick={() => handleInclusionQtyChange(inc.id, currentQty + 1)}
                              className="px-1.5 py-0.5 hover:bg-stone-50 border-l border-[#1A1A1A]/30"
                            >
                              +
                            </button>
                            <span className="px-1.5 text-stone-400 bg-stone-50 font-sans border-l border-[#1A1A1A]/30">{inc.unit}</span>
                          </div>
                        ) : (
                          !isRemoved && inc.quantity > 0 && (
                            <span className="text-[11px] font-mono font-medium text-[#666] bg-stone-100 px-1.5 py-0.5">
                              {currentQty} {inc.unit}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on selection controls */}
          {currentPackage && (
            <div className="space-y-2 pt-4 border-t border-[#F0EEEA]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                  Enhance Your Collection with Add-ons
                </label>
                {currentPackage.customizationRules?.allowAddOptional === false && (
                  <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">
                    Custom Toggles Disabled for this Tier
                  </span>
                )}
              </div>

              {currentPackage.customizationRules?.allowAddOptional !== false ? (
                currentPackage.addons.length > 0 ? (
                  <div className="space-y-2">
                    {currentPackage.addons.filter(add => add.enabled !== false).map((add) => {
                      const isSelected = !!selectedAddons[add.name];
                      const qty = selectedAddons[add.name] || 0;
                      const isQuantifiable = add.pricingType !== 'fixed';
                      const allowQtyChange = currentPackage.customizationRules?.allowChangeQuantity ?? true;

                      return (
                        <div 
                          key={add.name}
                          onClick={() => handleToggleAddon(add.name)}
                          className={`p-3 border flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                            isSelected ? 'bg-[#FAF9F6] border-[#1A1A1A]' : 'border-[#E5E1D8] hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent click
                              className="w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-semibold text-[#1A1A1A] block">{add.name}</span>
                              {add.description && (
                                <span className="text-[10px] text-[#666] block">{add.description}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                            {isSelected && isQuantifiable && allowQtyChange && (
                              <div className="flex items-center border border-[#1A1A1A] bg-white text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(add.name, qty - 1)}
                                  className="px-2 py-0.5 border-r border-[#1A1A1A] hover:bg-stone-50"
                                >
                                  -
                                </button>
                                <span className="px-3 font-semibold font-mono">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(add.name, qty + 1)}
                                  className="px-2 py-0.5 border-l border-[#1A1A1A] hover:bg-stone-50"
                                >
                                  +
                                </button>
                              </div>
                            )}
                            <span className="text-xs font-mono font-bold text-[#C5A059]">
                              +₹{add.price.toLocaleString()}{isQuantifiable ? `/${add.pricingType}` : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-[#888] italic py-2">No optional additions configured for this package tier.</div>
                )
              ) : (
                <div className="p-3 bg-stone-50 border border-dashed border-stone-200 text-xs text-stone-500 italic">
                  Additional optional accessories are restricted for the selected package tier.
                </div>
              )}
            </div>
          )}

        </section>

        {/* Right Side: Inquiry Submission form and Live Price (span 5) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Investment Total Live Card */}
          <div className="bg-white border border-[#E5E1D8] p-6 md:p-8">
            <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold border-b border-[#F0EEEA] pb-2 mb-4">
              Your Dynamic Estimate Summary
            </div>

            <div className="space-y-2.5 text-xs text-[#1A1A1A]">
              {currentPackage ? (
                <>
                  <div className="flex justify-between items-center py-1">
                    <span>{currentPackage.name} coverage</span>
                    <span className="font-mono font-semibold">₹{currentPackage.basePrice.toLocaleString()}</span>
                  </div>

                  {Object.entries(selectedAddons).map(([name, qty]) => {
                    const addRef = currentPackage.addons.find(a => a.name === name);
                    if (!addRef) return null;
                    const qtyNum = Number(qty);
                    return (
                      <div key={name} className="flex justify-between items-center text-[#666] py-0.5">
                        <span>+ {name} {qtyNum > 1 && `(Qty ${qtyNum})`}</span>
                        <span className="font-mono font-semibold text-[#1A1A1A]">
                          +₹{(addRef.price * qtyNum).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="italic text-[#888] py-2 text-center">Select service coverage parameters on left pane...</div>
              )}
            </div>

            {/* Total Price */}
            <div className="mt-5 pt-4 border-t-2 border-[#1A1A1A] flex justify-between items-end">
              <span className="font-serif text-lg italic text-[#1A1A1A]">Projected Investment</span>
              <span className="font-serif text-3xl text-[#1A1A1A] font-bold font-mono">
                ₹{totalVal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Form Card: Submit Enquiry */}
          <div className="bg-white border border-[#E5E1D8] p-6 md:p-8 space-y-4">
            <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#F0EEEA] pb-3">
              Request Booking Information
            </h3>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Rachel Green"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="rachel@green.com"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Phone Number</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (555) 789-0123"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Shoot Date *</label>
                  <input
                    type="date"
                    required
                    value={clientDate}
                    onChange={(e) => setClientDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Shoot Location / Venue</label>
                  <input
                    type="text"
                    value={clientVenue}
                    onChange={(e) => setClientVenue(e.target.value)}
                    placeholder="e.g. Napa Valley, CA"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold block">Enquiry Details / Vision</label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Tell us about your love story, special album styles, or guest sizes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                id="btn-public-submit-inquiry"
                disabled={!selectedPackageId}
                className="w-full py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-semibold hover:bg-[#333] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Submit Price inquiry</span>
              </button>

            </form>
          </div>
        </section>

      </main>

    </div>
  );
}
