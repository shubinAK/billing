/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimelineEvent {
  id: string;
  date: string;
  content: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  venue?: string;
  notes?: string;
  serviceId: string;
  packageId: string;
  selectedAddons: { [addonName: string]: number }; // maps addon name to quantity (1 for toggled non-quantifiable)
  status: 'New Lead' | 'First Call' | '1st Follow Up' | '2nd Follow Up' | '3rd Follow Up' | 'Converted' | 'Lost';
  totalVal: number;
  discountPackage?: number;
  discountAddons?: number;
  customNotes?: string;
  dateCreated: string;
  dateMarkedLost?: string; // used for the 7-day countdown
  planSegment?: '30' | '60' | '90';
  timeline: TimelineEvent[];
}

export interface Reminder {
  id: string;
  date: string;
  time: string;
  title: string;
  notes?: string;
  leadId?: string; // associated lead if any
  completed: boolean;
}

export interface IncludedService {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  displayOrder: number;
  price?: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  pricingType: 'fixed' | 'quantity' | 'hour' | 'day';
  price: number;
  minQty: number;
  maxQty: number;
  defaultQty: number;
  allowQtySelect: boolean;
  enabled: boolean;
  displayOrder: number;
}

export interface PackageCustomizationRules {
  allowRemoveInclusions: boolean;
  allowAddOptional: boolean;
  allowChangeQuantity: boolean;
  allowEditIncludedQuantity: boolean;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  basePrice: number;
  description: string;
  coverImage?: string;
  displayOrder: number;
  hidden: boolean;
  inclusions: IncludedService[];
  addons: Addon[];
  customizationRules?: PackageCustomizationRules;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  displayOrder: number;
  createdDate: string;
  updatedDate: string;
}

export interface Settings {
  companyName: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoText: string;
  quotationFooter: string;
  termsConditions: string;
  defaultValidityDays: number;
}
