/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings } from '../types';
import { Save, Settings as SettingsIcon, Check } from 'lucide-react';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  // Local form states
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [logoText, setLogoText] = useState(settings.logoText);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [address, setAddress] = useState(settings.address);
  const [quotationFooter, setQuotationFooter] = useState(settings.quotationFooter);
  const [termsConditions, setTermsConditions] = useState(settings.termsConditions);
  const [defaultValidityDays, setDefaultValidityDays] = useState(settings.defaultValidityDays);

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      companyName,
      logoText,
      phone,
      email,
      website,
      address,
      quotationFooter,
      termsConditions,
      defaultValidityDays,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h1 className="font-serif text-3xl italic text-[#1A1A1A]">System Settings</h1>
        <p className="text-xs text-[#888] uppercase tracking-wider mt-1">Configure your corporate brand details, quotation legal terms, and address lines</p>
      </div>

      <form id="form-settings" onSubmit={handleSubmit} className="bg-white border border-[#E5E1D8] p-8 space-y-6">
        
        {/* Panel brand header */}
        <div className="flex items-center gap-2 border-b border-[#F0EEEA] pb-3">
          <SettingsIcon className="text-[#C5A059]" size={18} />
          <h2 className="font-serif text-lg italic text-[#1A1A1A]">Studio Corporate Profile</h2>
        </div>

        {/* Name & Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              id="input-settings-company"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Header Logo Text</label>
            <input
              type="text"
              required
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              id="input-settings-logo-text"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#F0EEEA]">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Studio Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="input-settings-phone"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Studio Email Inbox</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="input-settings-email"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Company Web Domain</label>
            <input
              type="text"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              id="input-settings-web"
              className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1 pt-4 border-t border-[#F0EEEA]">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Corporate Studio Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="input-settings-address"
            className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
          />
        </div>

        {/* Quotation Footer templates notes */}
        <div className="space-y-1 pt-4 border-t border-[#F0EEEA]">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Quotation Footer/Thank You Note</label>
          <input
            type="text"
            required
            value={quotationFooter}
            onChange={(e) => setQuotationFooter(e.target.value)}
            id="input-settings-footer-note"
            className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none"
          />
        </div>

        {/* Legal Terms & Conditions */}
        <div className="space-y-1 pt-4 border-t border-[#F0EEEA]">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">Legal Terms & Policy (Print Template)</label>
          <textarea
            required
            rows={5}
            value={termsConditions}
            onChange={(e) => setTermsConditions(e.target.value)}
            id="input-settings-terms"
            className="w-full px-3 py-2 border border-[#E5E1D8] text-xs font-mono leading-relaxed focus:outline-none resize-none"
          />
        </div>

        {/* Submit action */}
        <div className="flex items-center justify-between pt-6 border-t border-[#F0EEEA]">
          <div>
            {saved && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                <Check size={12} />
                <span>Settings persisted successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            id="btn-settings-save"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Save size={14} />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
