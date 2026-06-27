/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Service, Package, IncludedService, Addon } from '../types';
import { 
  Grid, HelpCircle, Save, Check, Plus, Trash2, Copy, Eye, EyeOff, 
  ChevronUp, ChevronDown, Sparkles, Layers, Sliders, DollarSign, Award
} from 'lucide-react';

interface CalculatorConfigViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  retainerPercent: number;
  onUpdateRetainerPercent: (percent: number) => void;
  services: Service[];
  packages: Package[];
  onUpdatePackage: (packageId: string, updatedPkg: Partial<Package>) => void;
  onAddPackage: (pkg: Omit<Package, 'id'>) => void;
  onDeletePackage: (packageId: string) => boolean;
}

export default function CalculatorConfigView({
  settings,
  onUpdateSettings,
  retainerPercent,
  onUpdateRetainerPercent,
  services,
  packages,
  onUpdatePackage,
  onAddPackage,
  onDeletePackage,
}: CalculatorConfigViewProps) {
  // Global settings state
  const [retPercent, setRetPercent] = useState(retainerPercent);
  const [validDays, setValidDays] = useState(settings.defaultValidityDays);
  const [isSaved, setIsSaved] = useState(false);

  // Filter out active services to create tabs
  const activeServices = services.filter(s => s.enabled);
  const [activeTabServiceId, setActiveTabServiceId] = useState<string>(activeServices[0]?.id || '');

  // Active Selected Package for Detail Config (Null if none, or "new" if creating)
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);

  // State for creating or editing package
  const [isNewPkg, setIsNewPkg] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgBasePrice, setPkgBasePrice] = useState(1500);
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgDisplayOrder, setPkgDisplayOrder] = useState(1);
  const [pkgCoverImage, setPkgCoverImage] = useState('');
  
  // Customization rules
  const [allowRemoveInclusions, setAllowRemoveInclusions] = useState(true);
  const [allowEditIncludedQuantity, setAllowEditIncludedQuantity] = useState(true);
  const [allowAddOptional, setAllowAddOptional] = useState(true);
  const [allowChangeQuantity, setAllowChangeQuantity] = useState(true);

  // Inclusions and Add-ons lists
  const [inclusions, setInclusions] = useState<IncludedService[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  // Individual Form entries for additions
  const [newIncName, setNewIncName] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncQty, setNewIncQty] = useState(1);
  const [newIncUnit, setNewIncUnit] = useState('Hour');
  const [newIncPrice, setNewIncPrice] = useState<string>('');

  const [newAddName, setNewAddName] = useState('');
  const [newAddDesc, setNewAddDesc] = useState('');
  const [newAddPrice, setNewAddPrice] = useState(150);
  const [newAddPricingType, setNewAddPricingType] = useState<Addon['pricingType']>('quantity');
  const [newAddMin, setNewAddMin] = useState(1);
  const [newAddMax, setNewAddMax] = useState(10);
  const [newAddDef, setNewAddDef] = useState(1);

  // Global retainer/deposit split save
  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRetainerPercent(Number(retPercent));
    onUpdateSettings({
      defaultValidityDays: Number(validDays),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Filter packages belonging to active tab service
  const currentServicePkgs = packages
    .filter(p => p.serviceId === activeTabServiceId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Initialize form with a package configuration
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPkgId(pkg.id);
    setIsNewPkg(false);
    setPkgName(pkg.name);
    setPkgBasePrice(pkg.basePrice);
    setPkgDescription(pkg.description);
    setPkgDisplayOrder(pkg.displayOrder || 1);
    setPkgCoverImage(pkg.coverImage || '');
    
    setAllowRemoveInclusions(pkg.customizationRules?.allowRemoveInclusions ?? true);
    setAllowEditIncludedQuantity(pkg.customizationRules?.allowEditIncludedQuantity ?? true);
    setAllowAddOptional(pkg.customizationRules?.allowAddOptional ?? true);
    setAllowChangeQuantity(pkg.customizationRules?.allowChangeQuantity ?? true);

    setInclusions(pkg.inclusions || []);
    setAddons(pkg.addons || []);
  };

  // Setup state for configuring a brand new package tier
  const handleStartNewPkg = () => {
    setSelectedPkgId('new');
    setIsNewPkg(true);
    setPkgName('');
    setPkgBasePrice(2000);
    setPkgDescription('');
    setPkgDisplayOrder(currentServicePkgs.length + 1);
    setPkgCoverImage('');
    
    setAllowRemoveInclusions(true);
    setAllowEditIncludedQuantity(true);
    setAllowAddOptional(true);
    setAllowChangeQuantity(true);

    setInclusions([
      { id: 'inc-1', name: 'Lead Professional Photographer', description: 'Full coverage by principal photographer', quantity: 8, unit: 'Hours', displayOrder: 1 }
    ]);
    setAddons([
      { id: 'add-1', name: 'Drone Aerial Drone Overlays', description: 'Cinematic drone capture', price: 299, pricingType: 'fixed', minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 1 }
    ]);
  };

  // Save the Package Configuration
  const handleSavePackageConfig = () => {
    if (!pkgName.trim()) {
      alert('Please enter a Package Name.');
      return;
    }

    const pkgData = {
      serviceId: activeTabServiceId,
      name: pkgName.trim(),
      basePrice: Number(pkgBasePrice) || 0,
      description: pkgDescription.trim(),
      coverImage: pkgCoverImage.trim(),
      displayOrder: Number(pkgDisplayOrder) || 1,
      customizationRules: {
        allowRemoveInclusions,
        allowEditIncludedQuantity,
        allowAddOptional,
        allowChangeQuantity,
      },
      inclusions,
      addons,
      hidden: false,
    };

    if (isNewPkg) {
      onAddPackage(pkgData);
      alert('New package tier added successfully!');
    } else if (selectedPkgId) {
      onUpdatePackage(selectedPkgId, pkgData);
      alert('Package configuration saved successfully!');
    }

    // Reset setup
    setSelectedPkgId(null);
  };

  // Duplicate Package Tier (Fast customizer cloning!)
  const handleDuplicatePackage = (pkg: Package) => {
    const copyData: Omit<Package, 'id'> = {
      ...pkg,
      name: `${pkg.name} (Copy)`,
      displayOrder: (pkg.displayOrder || 0) + 1,
    };
    onAddPackage(copyData);
    alert(`Duplicated package tier "${pkg.name}" successfully!`);
  };

  // Sub-items inclusions helpers
  const handleAddInclusion = () => {
    if (!newIncName.trim()) return;
    const item: IncludedService = {
      id: `inc-cust-${Date.now()}`,
      name: newIncName.trim(),
      description: newIncDesc.trim(),
      quantity: Number(newIncQty) || 1,
      unit: newIncUnit.trim() || 'Unit',
      displayOrder: inclusions.length + 1,
      price: newIncPrice !== '' ? Number(newIncPrice) : undefined
    };
    setInclusions([...inclusions, item]);
    setNewIncName('');
    setNewIncDesc('');
    setNewIncQty(1);
    setNewIncUnit('Hour');
    setNewIncPrice('');
  };

  const handleRemoveInclusion = (id: string) => {
    setInclusions(inclusions.filter(inc => inc.id !== id));
  };

  // Sub-items addons helpers
  const handleAddAddon = () => {
    if (!newAddName.trim()) return;
    const item: Addon = {
      id: `add-cust-${Date.now()}`,
      name: newAddName.trim(),
      description: newAddDesc.trim(),
      price: Number(newAddPrice) || 0,
      pricingType: newAddPricingType,
      minQty: Number(newAddMin) || 1,
      maxQty: Number(newAddMax) || 1,
      defaultQty: Number(newAddDef) || 1,
      allowQtySelect: newAddPricingType !== 'fixed',
      enabled: true,
      displayOrder: addons.length + 1
    };
    setAddons([...addons, item]);
    setNewAddName('');
    setNewAddDesc('');
    setNewAddPrice(150);
    setNewAddPricingType('quantity');
    setNewAddMin(1);
    setNewAddMax(10);
    setNewAddDef(1);
  };

  const handleRemoveAddon = (id: string) => {
    setAddons(addons.filter(add => add.id !== id));
  };

  const handleToggleAddonEnabled = (id: string) => {
    setAddons(addons.map(add => add.id === id ? { ...add, enabled: !add.enabled } : add));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Calculator Master Configuration</h1>
        <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
          Architect specific packages, customize permission guidelines, and setup dynamic calculations for public & admin views
        </p>
      </div>

      {/* Dynamic Services Selector Tabs */}
      {activeServices.length === 0 ? (
        <div className="bg-white border border-[#E5E1D8] p-12 text-center text-xs text-stone-500 italic">
          No active services registry found. Go to "Master Services" tab to activate services first.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex border-b border-[#E5E1D8] gap-2 overflow-x-auto pb-px">
            {activeServices.map(srv => {
              const isActive = srv.id === activeTabServiceId || (!activeTabServiceId && srv.id === activeServices[0]?.id);
              if (!activeTabServiceId && isActive) {
                // Ensure initial selection
                setActiveTabServiceId(srv.id);
              }
              return (
                <button
                  key={srv.id}
                  onClick={() => {
                    setActiveTabServiceId(srv.id);
                    setSelectedPkgId(null);
                  }}
                  className={`px-5 py-3 font-serif text-sm italic transition-all duration-150 border-t border-x -mb-px shrink-0 ${
                    isActive
                      ? 'bg-white border-[#1A1A1A] text-[#1A1A1A] font-semibold border-t-2'
                      : 'border-transparent text-[#666] hover:text-[#1a1a1a]'
                  }`}
                >
                  {srv.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column A: Package Lists for selected service (span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E5E1D8]">
                <div className="p-4 border-b border-[#E5E1D8] flex justify-between items-center bg-[#FAF9F6]">
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold flex items-center gap-1.5">
                    <Layers size={14} className="text-[#C5A059]" />
                    <span>Package Tiers / Levels</span>
                  </span>
                  
                  <button
                    onClick={handleStartNewPkg}
                    className="px-2.5 py-1 bg-black text-white hover:bg-stone-800 text-[9px] uppercase tracking-wider font-semibold"
                  >
                    + New Tier
                  </button>
                </div>

                <div className="divide-y divide-[#E5E1D8]">
                  {currentServicePkgs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 italic">
                      No package tiers configured yet for this service discipline.
                    </div>
                  ) : (
                    currentServicePkgs.map(pkg => {
                      const isSelected = selectedPkgId === pkg.id;
                      return (
                        <div 
                          key={pkg.id} 
                          onClick={() => handleSelectPackage(pkg)}
                          className={`p-4 transition-colors cursor-pointer space-y-2 hover:bg-[#FAF9F6]/40 ${
                            isSelected ? 'bg-[#FAF9F6] border-l-4 border-l-[#1A1A1A]' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-serif text-sm font-semibold text-[#1A1A1A]">{pkg.name}</span>
                                {pkg.hidden && (
                                  <span className="text-[8px] uppercase tracking-wider px-1 border border-stone-300 bg-stone-50 text-stone-500 font-mono">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#666] line-clamp-1">{pkg.description}</p>
                            </div>

                            <span className="font-mono text-xs font-bold text-[#1A1A1A] shrink-0">
                              ₹{pkg.basePrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Quick Toolbar */}
                          <div className="flex justify-between items-center text-[10px] text-stone-500 pt-2 border-t border-stone-100 font-mono">
                            <span>Order: {pkg.displayOrder || 1}</span>
                            <div className="flex gap-3 text-[9px] uppercase font-sans font-bold" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => handleDuplicatePackage(pkg)} 
                                className="text-[#C5A059] hover:text-[#1a1a1a] flex items-center gap-0.5"
                              >
                                <Copy size={10} /> Duplicate
                              </button>
                              <button 
                                onClick={() => onUpdatePackage(pkg.id, { hidden: !pkg.hidden })}
                                className="text-stone-600 hover:text-[#1a1a1a] flex items-center gap-0.5"
                              >
                                {pkg.hidden ? <Eye size={10} /> : <EyeOff size={10} />}
                                {pkg.hidden ? 'Show' : 'Hide'}
                              </button>
                              <button 
                                onClick={() => {
                                  if (onDeletePackage(pkg.id)) {
                                    setSelectedPkgId(null);
                                  }
                                }} 
                                className="text-red-600 hover:text-red-950 flex items-center gap-0.5"
                              >
                                <Trash2 size={10} /> Purge
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Package Live Preview Mockup Card */}
              {selectedPkgId && selectedPkgId !== 'new' && (
                <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-5 space-y-4">
                  <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-[#E5E1D8] pb-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#C5A059]" />
                    <span>Real-time Visual Applet Preview</span>
                  </div>
                  <div className="bg-white border border-[#E5E1D8] p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest font-bold text-[#C5A059]">Selected Tier</span>
                        <h4 className="font-serif italic text-base text-[#1a1a1a]">{pkgName || 'Untitled Package'}</h4>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#1a1a1a]">₹{pkgBasePrice.toLocaleString()}</span>
                    </div>

                    <p className="text-[10px] text-stone-500 italic">{pkgDescription || 'No description supplied'}</p>

                    <div className="space-y-1 pt-2 border-t border-stone-100">
                      <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">Inclusions</span>
                      <ul className="space-y-0.5 pl-2 text-[10px] text-stone-600">
                        {inclusions.map((inc, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-[#C5A059] rounded-full shrink-0" />
                            <span className="truncate"><strong>{inc.quantity} {inc.unit}</strong> - {inc.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column B: Selected Package Editor parameters (span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {selectedPkgId ? (
                <div className="bg-white border border-[#E5E1D8] p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-[#F0EEEA] pb-3">
                    <div className="flex items-center gap-1.5">
                      <Sliders size={18} className="text-[#C5A059]" />
                      <h3 className="font-serif text-lg italic text-[#1A1A1A]">
                        {isNewPkg ? 'Add New Package Tier' : `Configure: ${pkgName}`}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedPkgId(null)}
                      className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-black font-bold"
                    >
                      Close Config
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Package Name *</label>
                        <input
                          type="text"
                          required
                          value={pkgName}
                          onChange={e => setPkgName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Base Price (₹) *</label>
                          {inclusions.some(inc => inc.price && inc.price > 0) && (
                            <span className="text-[9px] text-stone-500 font-mono">
                              Inclusions Sum: ₹{inclusions.reduce((sum, inc) => sum + (inc.price || 0), 0).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          required
                          value={pkgBasePrice}
                          onChange={e => setPkgBasePrice(Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Sales Description</label>
                      <input
                        type="text"
                        value={pkgDescription}
                        onChange={e => setPkgDescription(e.target.value)}
                        placeholder="Highlight selling benefits"
                        className="w-full px-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Cover Image URL</label>
                        <input
                          type="text"
                          value={pkgCoverImage}
                          onChange={e => setPkgCoverImage(e.target.value)}
                          placeholder="Link to showcase cover graphic"
                          className="w-full px-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Priority Display Order</label>
                        <input
                          type="number"
                          min={1}
                          value={pkgDisplayOrder}
                          onChange={e => setPkgDisplayOrder(Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-[#E5E1D8] text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Client Permission Customization Guidelines */}
                    <div className="border border-[#E5E1D8] p-4 bg-stone-50/50 space-y-3">
                      <span className="text-[9px] uppercase tracking-widest text-[#1a1a1a] font-bold block border-b border-stone-200 pb-1">
                        Client Customization Rule Guidelines
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowRemoveInclusions}
                            onChange={e => setAllowRemoveInclusions(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span>Allow client to omit standard inclusions</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowEditIncludedQuantity}
                            onChange={e => setAllowEditIncludedQuantity(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span>Allow editing inclusion quantities</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowAddOptional}
                            onChange={e => setAllowAddOptional(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span>Allow picking optional additions</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowChangeQuantity}
                            onChange={e => setAllowChangeQuantity(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span>Allow changing addition quantities</span>
                        </label>
                      </div>
                    </div>

                    {/* Managing Included Services */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-bold block">
                        Included Standard Services & Deliverables
                      </span>

                      <div className="space-y-2">
                        {inclusions.length === 0 ? (
                           <div className="text-xs text-stone-400 italic">No inclusions specified yet.</div>
                        ) : (
                          <div className="divide-y divide-[#E5E1D8] border border-[#E5E1D8] max-h-44 overflow-y-auto">
                            {inclusions.map((inc, index) => (
                              <div key={inc.id || index} className="p-2.5 flex justify-between items-center text-xs bg-white">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-stone-800">{inc.name}</span>
                                    {inc.quantity > 0 && (
                                      <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-1 py-0.5">
                                        {inc.quantity} {inc.unit || ''}
                                      </span>
                                    )}
                                    {inc.price !== undefined && inc.price > 0 && (
                                      <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5">
                                        ₹{inc.price.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  {inc.description && <p className="text-[10px] text-stone-400 italic mt-0.5">{inc.description}</p>}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveInclusion(inc.id)}
                                  className="text-red-500 hover:text-red-700 shrink-0"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Inclusion Addition Controls */}
                      <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-3 space-y-2.5">
                        <span className="text-[9px] uppercase tracking-wider text-[#888] block font-bold">New Deliverable</span>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                          <div className="md:col-span-4 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Inclusion Name</label>
                            <input
                              type="text"
                              value={newIncName}
                              onChange={e => setNewIncName(e.target.value)}
                              placeholder="e.g. Cinematic Highlights Cut"
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Quantity</label>
                            <input
                              type="number"
                              min={1}
                              value={newIncQty}
                              onChange={e => setNewIncQty(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Unit</label>
                            <input
                              type="text"
                              value={newIncUnit}
                              onChange={e => setNewIncUnit(e.target.value)}
                              placeholder="Hours/Min/etc"
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Price (₹, Opt)</label>
                            <input
                              type="number"
                              min={0}
                              value={newIncPrice}
                              onChange={e => setNewIncPrice(e.target.value)}
                              placeholder="e.g. 600"
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={handleAddInclusion}
                              className="w-full py-1 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-wider font-bold"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={newIncDesc}
                          onChange={e => setNewIncDesc(e.target.value)}
                          placeholder="Brief delivery format explanation..."
                          className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Managing Optional Addons */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-bold block">
                        Optional Add-on Accessories & Extra Coverage
                      </span>

                      <div className="space-y-2">
                        {addons.length === 0 ? (
                          <div className="text-xs text-stone-400 italic">No accessories specified.</div>
                        ) : (
                          <div className="divide-y divide-[#E5E1D8] border border-[#E5E1D8] max-h-44 overflow-y-auto">
                            {addons.map((add, index) => (
                              <div key={add.id || index} className="p-2.5 flex justify-between items-center text-xs bg-white">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-stone-800">{add.name}</span>
                                    <span className="text-[9px] uppercase tracking-wider px-1 bg-[#FAF9F6] border border-stone-200 text-stone-600 font-mono">
                                      {add.pricingType} pricing
                                    </span>
                                    {!add.enabled && (
                                      <span className="text-[8px] uppercase tracking-wider px-1 border border-amber-300 bg-amber-50 text-amber-700">
                                        Disabled
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-stone-400 italic">{add.description}</p>
                                  <p className="text-[10px] text-stone-500 font-mono">
                                    Min: {add.minQty} | Max: {add.maxQty} | Default: {add.defaultQty}
                                  </p>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="font-mono font-semibold text-[#C5A059]">
                                    +₹{add.price.toLocaleString()}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAddonEnabled(add.id)}
                                    className="text-stone-400 hover:text-stone-800 text-[10px] font-bold"
                                  >
                                    {add.enabled ? 'Disable' : 'Enable'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAddon(add.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Addon Addition Controls */}
                      <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-3 space-y-2.5">
                        <span className="text-[9px] uppercase tracking-wider text-[#888] block font-bold">New Upgrade Item</span>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                          <div className="md:col-span-4 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Upgrade Name</label>
                            <input
                              type="text"
                              value={newAddName}
                              onChange={e => setNewAddName(e.target.value)}
                              placeholder="e.g. Same-Day Fast Edit"
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Price (₹)</label>
                            <input
                              type="number"
                              value={newAddPrice}
                              onChange={e => setNewAddPrice(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            />
                          </div>
                          <div className="md:col-span-3 space-y-0.5">
                            <label className="text-[8px] text-stone-400 font-bold block">Price Format</label>
                            <select
                              value={newAddPricingType}
                              onChange={e => setNewAddPricingType(e.target.value as Addon['pricingType'])}
                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                            >
                              <option value="fixed">Fixed Flat Fee</option>
                              <option value="quantity">Per Item Count</option>
                              <option value="hour">Per Coverage Hour</option>
                              <option value="day">Per Event Day</option>
                            </select>
                          </div>
                          <div className="md:col-span-3 grid grid-cols-3 gap-1">
                            <div>
                              <label className="text-[7px] text-stone-400 font-bold block">Min</label>
                              <input
                                type="number"
                                value={newAddMin}
                                onChange={e => setNewAddMin(Number(e.target.value))}
                                className="w-full px-1 py-1 border border-[#E5E1D8] text-xs bg-white font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[7px] text-stone-400 font-bold block">Max</label>
                              <input
                                type="number"
                                value={newAddMax}
                                onChange={e => setNewAddMax(Number(e.target.value))}
                                className="w-full px-1 py-1 border border-[#E5E1D8] text-xs bg-white font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[7px] text-stone-400 font-bold block">Def</label>
                              <input
                                type="number"
                                value={newAddDef}
                                onChange={e => setNewAddDef(Number(e.target.value))}
                                className="w-full px-1 py-1 border border-[#E5E1D8] text-xs bg-white font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                          <input
                            type="text"
                            value={newAddDesc}
                            onChange={e => setNewAddDesc(e.target.value)}
                            placeholder="Describe how this enhancement improves deliverables..."
                            className="md:col-span-10 px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddAddon}
                            className="md:col-span-2 py-1 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-wider font-bold"
                          >
                            Add Addon
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                    <button
                      type="button"
                      onClick={() => setSelectedPkgId(null)}
                      className="px-4 py-2 border border-[#E5E1D8] text-[10px] uppercase tracking-widest font-semibold hover:bg-stone-50"
                    >
                      Discard Setup
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePackageConfig}
                      className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-stone-800"
                    >
                      Save Package Config
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-10 text-center text-xs text-stone-500 italic space-y-2">
                  <Sliders size={28} className="text-stone-400 mx-auto" />
                  <p>Select an existing package tier from the list on the left to start fine-tuning, or click "+ New Tier" to spin up a custom pricing tier.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Global Financial Splits & Deposit Split Rules Card */}
      <form onSubmit={handleSaveGlobal} className="bg-white border border-[#E5E1D8] p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#F0EEEA] pb-3">
          <Grid className="text-[#C5A059]" size={18} />
          <h2 className="font-serif text-lg italic text-[#1A1A1A]">Global Pricing Calculations & Retainer Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Retainer Split */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
              Earnest Retainer Deposit %
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={100}
                required
                value={retPercent}
                onChange={(e) => setRetPercent(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
              />
              <span className="text-sm font-semibold text-[#1A1A1A]">% of total quotation investment</span>
            </div>
            <p className="text-[11px] text-[#666] leading-relaxed">
              Default earnest retainer deposit percentage required to lock the calendar booking slot. Propagates dynamically to quotation breakdown matrices.
            </p>
          </div>

          {/* Quotation Validity Days */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
              Default Quotation Validity (Days)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                required
                value={validDays}
                onChange={(e) => setValidDays(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
              />
              <span className="text-sm font-semibold text-[#1A1A1A]">Days from generation</span>
            </div>
            <p className="text-[11px] text-[#666] leading-relaxed">
              Standard expiration range for generated print outputs. Promotes clean pipeline conversions before price updates.
            </p>
          </div>
        </div>

        {/* Action toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EEEA]">
          <div>
            {isSaved && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                <Check size={12} />
                <span>Default global calculations updated successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            id="btn-calc-config-save"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Save size={14} />
            <span>Save Global Rules</span>
          </button>
        </div>
      </form>

    </div>
  );
}
