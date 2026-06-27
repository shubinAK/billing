/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Service, Package, Settings } from '../types';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

interface QuotationPrintViewProps {
  printData: {
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
  };
  services: Service[];
  packages: Package[];
  settings: Settings;
  retainerPercent: number;
  onClose: () => void;
}

export default function QuotationPrintView({
  printData,
  services,
  packages,
  settings,
  retainerPercent,
  onClose,
}: QuotationPrintViewProps) {
  const currentService = services.find(s => s.id === printData.serviceId);
  const currentPackage = packages.find(p => p.id === printData.packageId);

  // Expiration calculations
  const today = new Date('2026-06-27');
  const expiry = new Date(today);
  expiry.setDate(today.getDate() + settings.defaultValidityDays);

  const dateStr = today.toISOString().split('T')[0];
  const expiryStr = expiry.toISOString().split('T')[0];

  // Gross and discounts calculations
  const baseRate = currentPackage?.basePrice || 0;
  
  let grossAddons = 0;
  Object.entries(printData.selectedAddons).forEach(([name, qty]) => {
    const addRef = currentPackage?.addons.find(a => a.name === name);
    if (addRef) {
      grossAddons += addRef.price * qty;
    }
  });

  const grossSubtotal = baseRate + grossAddons;
  const packageDiscount = printData.discountPackage || 0;
  const addonsDiscount = printData.discountAddons || 0;

  // Payments break down splits
  const retainerAmount = (printData.totalVal * retainerPercent) / 100;
  const balanceAmount = printData.totalVal - retainerAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4 sm:px-6 font-sans print:bg-white print:p-0 print:m-0 print:min-h-0">
      
      {/* Top sticky non-print action toolbar */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 border border-[#E5E1D8] print:hidden">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-stone-50 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Calculator</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            id="btn-print-trigger"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white hover:bg-[#333] text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2"
          >
            <Printer size={14} />
            <span>Print or Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Paper Canvas Page */}
      <div id="quotation-print-canvas" className="max-w-4xl mx-auto bg-white border border-[#E5E1D8] p-10 md:p-14 space-y-10 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#E5E1D8] pb-8">
          <div>
            <div className="font-serif text-3xl font-bold italic text-[#1A1A1A] tracking-tight">
              {settings.logoText || settings.companyName}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold mt-1">
              Premium Cinematic Photography
            </div>
          </div>

          <div className="text-right text-[11px] text-[#666] space-y-0.5">
            <div><strong>Studio Contact Details:</strong></div>
            <div>{settings.address}</div>
            <div>Email: {settings.email}</div>
            <div>Web: {settings.website}</div>
            <div>Ph: {settings.phone}</div>
          </div>
        </div>

        {/* Title Meta block */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">CLIENT ESTIMATE</div>
            <h1 className="font-serif text-2xl font-semibold italic text-[#1A1A1A]">{printData.customerName}</h1>
            <div className="text-xs text-[#666] space-y-0.5">
              {printData.customerPhone && <div>Phone: {printData.customerPhone}</div>}
              {printData.customerEmail && <div>Email: {printData.customerEmail}</div>}
            </div>
          </div>

          <div className="text-right text-xs space-y-1 sm:self-end">
            <div>
              <span className="text-[#888] text-[9px] uppercase tracking-wider">Date Generated: </span>
              <strong className="font-mono text-[#1a1a1a]">{dateStr}</strong>
            </div>
            <div>
              <span className="text-[#888] text-[9px] uppercase tracking-wider">Estimate Valid Until: </span>
              <strong className="font-mono text-[#1a1a1a]">{expiryStr}</strong>
            </div>
          </div>
        </div>

        {/* Event details summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#FAF9F6] border border-[#E5E1D8] text-xs text-[#1A1A1A]">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#888] block mb-0.5">Target Service</span>
            <span className="font-semibold">{currentService?.name}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#888] block mb-0.5">Coverage Tier</span>
            <span className="font-semibold">{currentPackage?.name}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#888] block mb-0.5">Target Event Date</span>
            <span className="font-semibold font-mono">{printData.eventDate}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#888] block mb-0.5">Shoot Venue Location</span>
            <span className="font-semibold truncate block">{printData.venue || 'To Be Determined'}</span>
          </div>
        </div>

        {/* Line Items Pricing Table */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold pb-1.5 border-b border-[#E5E1D8]">
            ITEMIZED COVERAGE SELECTION
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F0EEEA] text-[#888] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Extended Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEA]/60">
              
              {/* Base package tier */}
              {currentPackage && (
                <tr className="text-[#1A1A1A]">
                  <td className="py-3">
                    <span className="font-bold text-sm block">{currentPackage.name} Coverage Package</span>
                    <span className="text-[#666] italic text-[11px] block mt-1">{currentPackage.description}</span>
                    <ul className="list-disc pl-5 mt-2 text-[#888] text-[11px] space-y-1">
                      {currentPackage.inclusions.map((inc, i) => (
                        <li key={inc.id || i}>
                          {inc.quantity > 0 ? `${inc.quantity} ${inc.unit || ''} - ` : ''}
                          <strong>{inc.name}</strong>
                          {inc.price !== undefined && inc.price > 0 && ` [Line Price: ₹${inc.price.toLocaleString()}]`}
                          {inc.description && ` (${inc.description})`}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 text-right font-mono font-bold align-top">
                    ₹{currentPackage.basePrice.toLocaleString()}.00
                  </td>
                </tr>
              )}

              {/* Addons detailed list */}
              {Object.entries(printData.selectedAddons).map(([name, qty]) => {
                const addRef = currentPackage?.addons.find(a => a.name === name);
                if (!addRef) return null;
                const extVal = addRef.price * qty;
                return (
                  <tr key={name} className="text-[#1A1A1A]">
                    <td className="py-3">
                      <span className="font-semibold">{name}</span>
                      <span className="text-[#888] text-[10px] uppercase ml-2 tracking-wide">
                        {qty > 1 ? `(Qty: ${qty} • Unit: ₹${addRef.price.toLocaleString()})` : 'Option Add-on'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold">
                      +₹{extVal.toLocaleString()}.00
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>

        {/* Totals & Splits column aligned right */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-1/2 space-y-2 border-t border-[#E5E1D8] pt-4 text-xs text-[#1A1A1A]">
            
            <div className="flex justify-between font-medium">
              <span>Gross Subtotal</span>
              <span className="font-mono">₹{grossSubtotal.toLocaleString()}.00</span>
            </div>

            {/* Package Discount if any */}
            {packageDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Package Tier Discount</span>
                <span className="font-mono">-₹{packageDiscount.toLocaleString()}.00</span>
              </div>
            )}

            {/* Addons Discount if any */}
            {addonsDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Add-on Modules Discount</span>
                <span className="font-mono">-₹{addonsDiscount.toLocaleString()}.00</span>
              </div>
            )}
            
            <div className="flex justify-between text-[#888] text-[11px]">
              <span>Tax / VAT (0.0%)</span>
              <span className="font-mono">₹0.00</span>
            </div>

            <div className="flex justify-between border-t-2 border-[#1A1A1A] pt-2 text-sm font-bold">
              <span className="font-serif italic text-base">Total Investment</span>
              <span className="font-mono text-base">₹{printData.totalVal.toLocaleString()}.00</span>
            </div>

            {/* Split Schedule display */}
            <div className="bg-[#FAF9F6] p-3 border border-[#E5E1D8] mt-4 space-y-1.5 text-[11px]">
              <div className="font-semibold uppercase text-[9px] tracking-widest text-[#C5A059] border-b border-[#E5E1D8] pb-1 mb-1">
                Scheduled Payment Milestones
              </div>
              <div className="flex justify-between">
                <span>Retainer Booking Deposit ({retainerPercent}%)</span>
                <span className="font-mono font-bold">₹{retainerAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[#666]">
                <span>Remaining Balance Due 14 Days Prior</span>
                <span className="font-mono">₹{balanceAmount.toLocaleString()}.00</span>
              </div>
            </div>

          </div>
        </div>

        {/* Custom Quotation Notes printed if present */}
        {printData.customNotes && (
          <div className="space-y-2 pt-6 border-t border-[#E5E1D8]">
            <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
              SPECIAL ESTIMATE NOTES & CONSIDERATIONS
            </div>
            <p className="text-xs leading-relaxed text-[#444] whitespace-pre-wrap pl-3 border-l-2 border-[#C5A059] italic font-serif">
              "{printData.customNotes}"
            </p>
          </div>
        )}

        {/* Terms & Conditions details block */}
        <div className="space-y-3 pt-6 border-t border-[#E5E1D8]">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            LEGAL AGREEMENT & GENERAL POLICIES
          </div>
          <p className="text-[10px] leading-relaxed text-[#666] font-mono whitespace-pre-wrap pl-3 border-l-2 border-[#C5A059]">
            {settings.termsConditions}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-[#F0EEEA] text-center space-y-1 text-[11px] text-[#888]">
          <div className="font-serif italic text-sm text-[#C5A059]">{settings.quotationFooter}</div>
          <div>Lumina Studio • Copyright © 2026 • All Rights Reserved.</div>
        </div>

      </div>

    </div>
  );
}
