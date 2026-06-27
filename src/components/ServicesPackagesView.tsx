/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Service, Package, Lead, IncludedService } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Settings, 
  Eye, 
  EyeOff, 
  Calendar, 
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Box,
  Layers,
  Sparkles
} from 'lucide-react';

interface ServicesPackagesViewProps {
  services: Service[];
  packages: Package[];
  leads: Lead[];
  onAddService: (srv: Omit<Service, 'id' | 'createdDate' | 'updatedDate'>) => void;
  onUpdateService: (serviceId: string, updatedSrv: Partial<Service>) => void;
  onDeleteService: (serviceId: string) => boolean;
  onToggleService: (serviceId: string) => void;
  onAddPackage: (pkg: Omit<Package, 'id'>) => void;
  onUpdatePackage: (packageId: string, updatedPkg: Partial<Package>) => void;
  onDeletePackage: (packageId: string) => boolean;
}

export default function ServicesPackagesView({
  services,
  packages,
  leads,
  onAddService,
  onUpdateService,
  onDeleteService,
  onToggleService,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
}: ServicesPackagesViewProps) {
  // Sort services by displayOrder
  const sortedServices = [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Modals / Panels State
  const [isAdding, setIsAdding] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Expanded service package management
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // State for creating package
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(0);

  // State for editing package basic info
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editPkgName, setEditPkgName] = useState('');
  const [editPkgDesc, setEditPkgDesc] = useState('');
  const [editPkgPrice, setEditPkgPrice] = useState<number>(0);
  const [editPkgHidden, setEditPkgHidden] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [enabled, setEnabled] = useState(true);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Service Name is required.');
      return;
    }
    onAddService({
      name: name.trim(),
      description: description.trim(),
      displayOrder: Number(displayOrder) || 1,
      enabled,
    });
    // Reset form
    setName('');
    setDescription('');
    setDisplayOrder(1);
    setEnabled(true);
    setIsAdding(false);
  };

  const startEdit = (srv: Service) => {
    setEditingServiceId(srv.id);
    setName(srv.name);
    setDescription(srv.description);
    setDisplayOrder(srv.displayOrder || 1);
    setEnabled(srv.enabled);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;
    if (!name.trim()) {
      alert('Service Name is required.');
      return;
    }
    onUpdateService(editingServiceId, {
      name: name.trim(),
      description: description.trim(),
      displayOrder: Number(displayOrder) || 1,
      enabled,
    });
    setEditingServiceId(null);
  };

  // Check if service is unused
  const isServiceUnused = (serviceId: string) => {
    const pkgCount = packages.filter(p => p.serviceId === serviceId).length;
    const leadCount = leads.filter(l => l.serviceId === serviceId).length;
    return {
      unused: pkgCount === 0 && leadCount === 0,
      pkgCount,
      leadCount,
    };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E5E1D8] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1A1A1A]">Master Services Registry</h1>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
            Configure core photography disciplines, booking status boundaries, and presentation weights
          </p>
        </div>

        {!isAdding && !editingServiceId && (
          <button
            onClick={() => {
              setIsAdding(true);
              setName('');
              setDescription('');
              setDisplayOrder(sortedServices.length + 1);
              setEnabled(true);
            }}
            id="btn-service-add-new"
            className="px-4 py-2 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-[#333] transition-colors flex items-center gap-1.5"
          >
            <Plus size={12} />
            <span>Register New Service</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left pane: Registry Form or instructions (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {isAdding && (
            <div className="bg-white border border-[#E5E1D8] p-6 space-y-4">
              <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#F0EEEA] pb-3">
                Add New Service Line
              </h3>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Wedding Photography, Family Portraits"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                    Description / Catchphrase
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief outline of coverage services..."
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none resize-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={e => setDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                      Status
                    </label>
                    <select
                      value={enabled ? 'active' : 'inactive'}
                      onChange={e => setEnabled(e.target.value === 'active')}
                      className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#1A1A1A] text-white hover:bg-[#333] text-[10px] font-bold tracking-widest uppercase"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-[#E5E1D8] text-[10px] uppercase tracking-widest hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {editingServiceId && (
            <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-6 space-y-4">
              <h3 className="font-serif text-lg italic text-[#1A1A1A] border-b border-[#E5E1D8] pb-3">
                Edit Service Line
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                    Description / Catchphrase
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none resize-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={e => setDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                      Status
                    </label>
                    <select
                      value={enabled ? 'active' : 'inactive'}
                      onChange={e => setEnabled(e.target.value === 'active')}
                      className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#1A1A1A] text-white hover:bg-[#333] text-[10px] font-bold tracking-widest uppercase"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingServiceId(null)}
                    className="px-4 py-2 border border-[#E5E1D8] text-[10px] uppercase tracking-widest hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!isAdding && !editingServiceId && (
            <div className="bg-white border border-[#E5E1D8] p-6 space-y-4 text-xs text-[#666]">
              <div className="flex items-center gap-1.5 text-[#1A1A1A] font-bold uppercase tracking-wider text-[10px]">
                <Settings size={14} className="text-[#C5A059]" />
                <span>Registry Guidance</span>
              </div>
              <p className="leading-relaxed">
                Services registered here act as the root containers. You can define any customized disciplines (e.g., Destination shoots, Studio Portraits).
              </p>
              <p className="leading-relaxed">
                To manage specific packages, inclusions, customization rules, or optional addon accessories for these services, navigate to the <strong>Calculator Configuration</strong> screen.
              </p>
            </div>
          )}
        </div>

        {/* Right pane: Registered Services list (span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E5E1D8]">
            <div className="p-4 border-b border-[#E5E1D8] flex justify-between items-center bg-[#FAF9F6]">
              <span className="font-serif font-medium text-sm text-[#1A1A1A] flex items-center gap-2">
                <ListOrdered size={16} className="text-[#C5A059]" />
                <span>Active Registered Services List</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">
                {sortedServices.length} Registered
              </span>
            </div>

            <div className="divide-y divide-[#E5E1D8]">
              {sortedServices.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-400 italic">
                  No services configured in the registry.
                </div>
              ) : (
                sortedServices.map(srv => {
                  const check = isServiceUnused(srv.id);
                  return (
                    <div key={srv.id} className="p-6 space-y-4 hover:bg-stone-50/40 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center font-mono text-[10px] font-bold text-stone-600">
                              {srv.displayOrder || 1}
                            </span>
                            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">{srv.name}</h3>
                          </div>
                          <p className="text-xs text-[#666] leading-relaxed max-w-xl">{srv.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Visibility badge */}
                          <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border ${
                            srv.enabled 
                              ? 'border-emerald-200 text-emerald-800 bg-emerald-50' 
                              : 'border-amber-200 text-amber-800 bg-amber-50'
                          }`}>
                            {srv.enabled ? 'Active' : 'Inactive'}
                          </span>

                          <button
                            onClick={() => startEdit(srv)}
                            className="p-1.5 border border-[#E5E1D8] hover:border-black text-[#1A1A1A] hover:bg-white bg-stone-50/50"
                            title="Edit Service Settings"
                          >
                            <Edit size={12} />
                          </button>

                          <button
                            onClick={() => onToggleService(srv.id)}
                            className="p-1.5 border border-[#E5E1D8] hover:border-black text-[#1A1A1A] hover:bg-white bg-stone-50/50"
                            title={srv.enabled ? 'Mark as Inactive' : 'Mark as Active'}
                          >
                            {srv.enabled ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>

                          <button
                            onClick={() => {
                              if (check.unused) {
                                onDeleteService(srv.id);
                              } else {
                                alert(`Deletion Restricted: This service cannot be deleted because it is currently linked to ${check.pkgCount} packages and ${check.leadCount} active leads. Mark it as "Inactive" instead.`);
                              }
                            }}
                            className={`p-1.5 border transition-colors ${
                              check.unused 
                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                : 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-100/50'
                            }`}
                            title={check.unused ? 'Delete Service' : 'Deletion Restricted (In Use)'}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Audit dates / dependency stats */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] text-stone-500 font-mono border-t border-[#E5E1D8]/40 pt-2.5">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} className="text-stone-400" />
                          <span>Created: {srv.createdDate || '2026-06-27'}</span>
                        </div>
                        {srv.updatedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-stone-400" />
                            <span>Updated: {srv.updatedDate}</span>
                          </div>
                        )}
                        <div className="text-stone-500 font-sans ml-auto">
                          <span>Linked: <strong>{check.pkgCount} Packages</strong>, <strong>{check.leadCount} CRM Leads</strong></span>
                        </div>
                      </div>

                      {/* Packages management footer button */}
                      <div className="flex justify-between items-center border-t border-[#E5E1D8]/60 pt-3 mt-3">
                        <div className="text-xs text-[#666]">
                          Contains <strong className="text-[#1A1A1A] font-semibold">{check.pkgCount} active pricing packages</strong>.
                        </div>
                        <button
                          onClick={() => {
                            if (expandedServiceId === srv.id) {
                              setExpandedServiceId(null);
                            } else {
                              setExpandedServiceId(srv.id);
                              setIsAddingPackage(false);
                              setEditingPackageId(null);
                            }
                          }}
                          id={`btn-manage-pkg-${srv.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-[10px] font-semibold uppercase tracking-wider bg-white"
                        >
                          {expandedServiceId === srv.id ? (
                            <>
                              <span>Close Packages</span>
                              <ChevronUp size={12} />
                            </>
                          ) : (
                            <>
                              <span>Manage Packages ({check.pkgCount})</span>
                              <ChevronDown size={12} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Package Expansion Section */}
                      {expandedServiceId === srv.id && (
                        <div className="mt-4 border-t border-dashed border-[#E5E1D8] pt-4 space-y-4 bg-[#FAF9F6]/30 p-4 -mx-6 -mb-6 border-b">
                          <div className="flex justify-between items-center">
                            <h4 className="font-serif italic text-sm text-[#1A1A1A] flex items-center gap-2">
                              <Box size={14} className="text-[#C5A059]" />
                              <span>Packages & Custom Pricing Tiers</span>
                            </h4>
                            
                            {!isAddingPackage && (
                              <button
                                onClick={() => {
                                  setIsAddingPackage(true);
                                  setNewPkgName('');
                                  setNewPkgDesc('');
                                  setNewPkgPrice(0);
                                }}
                                className="px-3 py-1 bg-emerald-700 text-white text-[9px] font-semibold tracking-wider uppercase hover:bg-emerald-800 transition-colors flex items-center gap-1"
                              >
                                <Plus size={10} />
                                <span>Create New Package</span>
                              </button>
                            )}
                          </div>

                          {/* Add Package Form */}
                          {isAddingPackage && (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!newPkgName.trim()) {
                                  alert('Package name is required.');
                                  return;
                                }
                                onAddPackage({
                                  serviceId: srv.id,
                                  name: newPkgName.trim(),
                                  basePrice: Number(newPkgPrice) || 0,
                                  description: newPkgDesc.trim(),
                                  displayOrder: packages.filter(p => p.serviceId === srv.id).length + 1,
                                  hidden: false,
                                  inclusions: [],
                                  addons: []
                                });
                                setIsAddingPackage(false);
                              }}
                              className="bg-white border border-emerald-200 p-4 space-y-3 text-xs"
                            >
                              <div className="font-semibold text-emerald-800 uppercase tracking-wider text-[9px]">
                                Add New Package Tier for {srv.name}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-5 space-y-1">
                                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Package Name *</label>
                                  <input 
                                    type="text" 
                                    required 
                                    value={newPkgName}
                                    onChange={e => setNewPkgName(e.target.value)}
                                    placeholder="e.g. Classic Essentials, Premium Full-Day"
                                    className="w-full px-2 py-1.5 border border-[#E5E1D8] text-xs bg-white"
                                  />
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Base Price (₹, manual) *</label>
                                  <input 
                                    type="number" 
                                    required 
                                    min={0}
                                    value={newPkgPrice}
                                    onChange={e => setNewPkgPrice(Number(e.target.value))}
                                    placeholder="e.g. 55000"
                                    className="w-full px-2 py-1.5 border border-[#E5E1D8] text-xs bg-white font-mono"
                                  />
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                  <label className="text-[9px] uppercase tracking-widest text-[#888] font-bold block">Description / Note</label>
                                  <input 
                                    type="text" 
                                    value={newPkgDesc}
                                    onChange={e => setNewPkgDesc(e.target.value)}
                                    placeholder="e.g. Recommended for outdoor shoots"
                                    className="w-full px-2 py-1.5 border border-[#E5E1D8] text-xs bg-white"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#333]"
                                >
                                  Save Package
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsAddingPackage(false)}
                                  className="px-3 py-1 border border-[#E5E1D8] text-[9px] uppercase tracking-widest hover:bg-stone-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          {/* List of current packages */}
                          <div className="space-y-4">
                            {packages.filter(p => p.serviceId === srv.id).length === 0 ? (
                              <div className="text-center py-6 border border-dashed border-[#E5E1D8] text-xs text-stone-400 italic bg-white rounded">
                                No package tiers defined for this service yet. Click "Create New Package" to get started.
                              </div>
                            ) : (
                              packages
                                .filter(p => p.serviceId === srv.id)
                                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                                .map(pkg => {
                                  const isEditingPkg = editingPackageId === pkg.id;
                                  return (
                                    <div key={pkg.id} className="border border-[#E5E1D8] bg-white text-xs">
                                      {/* Package Header */}
                                      <div className="bg-[#FAF9F6] p-3 border-b border-[#E5E1D8] flex flex-wrap justify-between items-center gap-2">
                                        {isEditingPkg ? (
                                          <div className="flex-1 space-y-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                              <input
                                                type="text"
                                                value={editPkgName}
                                                onChange={e => setEditPkgName(e.target.value)}
                                                className="sm:col-span-5 px-2 py-1 border border-[#E5E1D8] text-xs bg-white font-semibold"
                                                placeholder="Package Name"
                                              />
                                              <div className="sm:col-span-4 flex items-center gap-1.5 bg-white border border-[#E5E1D8] px-2 py-0.5">
                                                <span className="text-[10px] text-stone-400 font-mono">₹</span>
                                                <input
                                                  type="number"
                                                  value={editPkgPrice}
                                                  onChange={e => setEditPkgPrice(Number(e.target.value))}
                                                  className="w-full bg-transparent focus:outline-none text-xs font-mono"
                                                  placeholder="Base Price"
                                                />
                                              </div>
                                              <div className="sm:col-span-3 flex items-center gap-1">
                                                <input
                                                  type="checkbox"
                                                  id={`chk-hide-${pkg.id}`}
                                                  checked={editPkgHidden}
                                                  onChange={e => setEditPkgHidden(e.target.checked)}
                                                  className="rounded border-[#E5E1D8]"
                                                />
                                                <label htmlFor={`chk-hide-${pkg.id}`} className="text-[9px] text-stone-500 select-none">Hide Public</label>
                                              </div>
                                            </div>
                                            <input
                                              type="text"
                                              value={editPkgDesc}
                                              onChange={e => setEditPkgDesc(e.target.value)}
                                              className="w-full px-2 py-1 border border-[#E5E1D8] text-xs bg-white"
                                              placeholder="Package short description..."
                                            />
                                            <div className="flex gap-2 justify-end">
                                              <button
                                                onClick={() => {
                                                  if (!editPkgName.trim()) return;
                                                  onUpdatePackage(pkg.id, {
                                                    name: editPkgName.trim(),
                                                    basePrice: editPkgPrice,
                                                    description: editPkgDesc.trim(),
                                                    hidden: editPkgHidden
                                                  });
                                                  setEditingPackageId(null);
                                                }}
                                                className="px-2 py-0.5 bg-emerald-700 text-white text-[9px] uppercase tracking-wider hover:bg-emerald-800"
                                              >
                                                Save
                                              </button>
                                              <button
                                                onClick={() => setEditingPackageId(null)}
                                                className="px-2 py-0.5 border border-[#E5E1D8] text-[9px] uppercase tracking-wider hover:bg-stone-50"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="space-y-0.5">
                                              <div className="flex items-center gap-2">
                                                <span className="font-serif font-bold text-sm text-[#1A1A1A]">{pkg.name}</span>
                                                {pkg.hidden && (
                                                  <span className="text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.2 border border-amber-200 text-amber-800 bg-amber-50">
                                                    Hidden
                                                  </span>
                                                )}
                                              </div>
                                              {pkg.description && (
                                                <p className="text-[10px] text-stone-500 italic">{pkg.description}</p>
                                              )}
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                              <div className="text-right">
                                                <span className="text-[8px] uppercase tracking-widest text-[#888] font-bold block">Base Price</span>
                                                <span className="font-mono font-bold text-sm text-[#1A1A1A]">₹{pkg.basePrice.toLocaleString()}</span>
                                              </div>

                                              <div className="flex gap-1">
                                                <button
                                                  onClick={() => {
                                                    setEditingPackageId(pkg.id);
                                                    setEditPkgName(pkg.name);
                                                    setEditPkgDesc(pkg.description || '');
                                                    setEditPkgPrice(pkg.basePrice);
                                                    setEditPkgHidden(!!pkg.hidden);
                                                  }}
                                                  className="p-1 border border-[#E5E1D8] hover:border-[#1A1A1A] text-stone-600 bg-white"
                                                  title="Edit package info"
                                                >
                                                  <Edit size={10} />
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    const usedInLeads = leads.filter(l => l.packageId === pkg.id);
                                                    if (usedInLeads.length > 0) {
                                                      alert(`This package is used by ${usedInLeads.length} active leads in the system. It cannot be deleted.`);
                                                    } else {
                                                      onDeletePackage(pkg.id);
                                                    }
                                                  }}
                                                  className="p-1 border border-[#E5E1D8] hover:border-red-500 hover:text-red-500 text-stone-600 bg-white"
                                                  title="Delete package"
                                                >
                                                  <Trash2 size={10} />
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      {/* Package Inclusions / Deliverable list items */}
                                      <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-baseline border-b border-stone-100 pb-1.5">
                                          <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold flex items-center gap-1">
                                            <Layers size={10} className="text-[#C5A059]" />
                                            <span>Package Deliverables & Line Items ({pkg.inclusions?.length || 0})</span>
                                          </span>
                                          {pkg.inclusions && pkg.inclusions.some(i => i.price && i.price > 0) && (
                                            <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                              Sum of Deliverables: ₹{pkg.inclusions.reduce((sum, i) => sum + (i.price || 0), 0).toLocaleString()}
                                            </span>
                                          )}
                                        </div>

                                        <div className="space-y-1.5">
                                          {!pkg.inclusions || pkg.inclusions.length === 0 ? (
                                            <div className="text-[11px] text-stone-400 italic py-1">No inclusions defined yet. Add lines below.</div>
                                          ) : (
                                            <div className="divide-y divide-stone-100 border border-stone-100 bg-stone-50/20 max-h-52 overflow-y-auto">
                                              {pkg.inclusions.map((inc, iIdx) => (
                                                <div key={inc.id || iIdx} className="p-2 flex justify-between items-center hover:bg-stone-50/60 gap-3">
                                                  <div className="space-y-0.5 flex-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                      <span className="font-semibold text-stone-800">{inc.name}</span>
                                                      {inc.quantity > 0 && (
                                                        <span className="text-[9px] text-stone-500 font-mono bg-stone-100 px-1 rounded">
                                                          {inc.quantity} {inc.unit || ''}
                                                        </span>
                                                      )}
                                                      {inc.price !== undefined && inc.price > 0 && (
                                                        <span className="text-[9px] text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-100 px-1 rounded">
                                                          ₹{inc.price.toLocaleString()}
                                                        </span>
                                                      )}
                                                    </div>
                                                    {inc.description && (
                                                      <p className="text-[10px] text-stone-400 italic">{inc.description}</p>
                                                    )}
                                                  </div>

                                                  <button
                                                    onClick={() => {
                                                      const updated = pkg.inclusions.filter(item => item.id !== inc.id);
                                                      onUpdatePackage(pkg.id, { inclusions: updated });
                                                    }}
                                                    className="text-stone-400 hover:text-red-500"
                                                    title="Remove item"
                                                  >
                                                    <Trash2 size={11} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        {/* Quick Add Inclusion line */}
                                        <div className="bg-stone-50/50 p-3 border border-stone-200/60 rounded">
                                          <span className="text-[8px] uppercase tracking-widest text-[#888] font-bold block mb-1.5">Add Line Item / Deliverable to this Package</span>
                                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                                            <div className="sm:col-span-4 space-y-0.5">
                                              <label className="text-[7px] uppercase tracking-widest text-stone-400 font-bold block">Item Name</label>
                                              <input
                                                type="text"
                                                id={`new-inc-name-${pkg.id}`}
                                                placeholder="e.g. Drone Pilot / Raw Footage"
                                                className="w-full px-2 py-1 border border-[#E5E1D8] text-[11px] bg-white"
                                              />
                                            </div>
                                            <div className="sm:col-span-2 space-y-0.5">
                                              <label className="text-[7px] uppercase tracking-widest text-stone-400 font-bold block">Qty</label>
                                              <input
                                                type="number"
                                                id={`new-inc-qty-${pkg.id}`}
                                                defaultValue={1}
                                                className="w-full px-2 py-1 border border-[#E5E1D8] text-[11px] bg-white"
                                              />
                                            </div>
                                            <div className="sm:col-span-2 space-y-0.5">
                                              <label className="text-[7px] uppercase tracking-widest text-stone-400 font-bold block">Unit</label>
                                              <input
                                                type="text"
                                                id={`new-inc-unit-${pkg.id}`}
                                                defaultValue="Hour"
                                                placeholder="Hour"
                                                className="w-full px-2 py-1 border border-[#E5E1D8] text-[11px] bg-white"
                                              />
                                            </div>
                                            <div className="sm:col-span-2 space-y-0.5">
                                              <label className="text-[7px] uppercase tracking-widest text-stone-400 font-bold block">Price (₹, Opt)</label>
                                              <input
                                                type="number"
                                                id={`new-inc-price-${pkg.id}`}
                                                placeholder="Optional"
                                                className="w-full px-2 py-1 border border-[#E5E1D8] text-[11px] bg-white"
                                              />
                                            </div>
                                            <div className="sm:col-span-2">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const nameInput = document.getElementById(`new-inc-name-${pkg.id}`) as HTMLInputElement;
                                                  const qtyInput = document.getElementById(`new-inc-qty-${pkg.id}`) as HTMLInputElement;
                                                  const unitInput = document.getElementById(`new-inc-unit-${pkg.id}`) as HTMLInputElement;
                                                  const priceInput = document.getElementById(`new-inc-price-${pkg.id}`) as HTMLInputElement;
                                                  const descInput = document.getElementById(`new-inc-desc-${pkg.id}`) as HTMLInputElement;

                                                  if (!nameInput || !nameInput.value.trim()) {
                                                    alert('Please specify an item name.');
                                                    return;
                                                  }

                                                  const newInc: IncludedService = {
                                                    id: `inc-sp-${Date.now()}`,
                                                    name: nameInput.value.trim(),
                                                    description: descInput ? descInput.value.trim() : '',
                                                    quantity: Number(qtyInput.value) || 0,
                                                    unit: unitInput.value.trim() || 'Unit',
                                                    displayOrder: (pkg.inclusions?.length || 0) + 1,
                                                    price: priceInput.value !== '' ? Number(priceInput.value) : undefined
                                                  };

                                                  const updated = [...(pkg.inclusions || []), newInc];
                                                  onUpdatePackage(pkg.id, { inclusions: updated });

                                                  // Reset
                                                  nameInput.value = '';
                                                  qtyInput.value = '1';
                                                  unitInput.value = 'Hour';
                                                  priceInput.value = '';
                                                  if (descInput) descInput.value = '';
                                                }}
                                                className="w-full py-1 bg-[#1A1A1A] text-white hover:bg-[#333] text-[9px] font-bold tracking-widest uppercase"
                                              >
                                                Add Item
                                              </button>
                                            </div>
                                          </div>
                                          <div className="mt-1.5 space-y-0.5">
                                            <label className="text-[7px] uppercase tracking-widest text-stone-400 font-bold block">Inclusion short description / specifications</label>
                                            <input
                                              type="text"
                                              id={`new-inc-desc-${pkg.id}`}
                                              placeholder="Brief specifications/coverage details..."
                                              className="w-full px-2 py-1 border border-[#E5E1D8] text-[10px] bg-white"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
