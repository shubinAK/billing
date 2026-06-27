/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Package, Lead, Reminder, Settings } from './types';

export const defaultServices: Service[] = [
  {
    id: 'srv-wedding',
    name: 'Wedding Photography',
    description: 'Complete photography coverage for your special wedding day.',
    enabled: true,
    displayOrder: 1,
    createdDate: '2026-06-27',
    updatedDate: '2026-06-27',
  },
  {
    id: 'srv-prewedding',
    name: 'Pre Wedding Shoot',
    description: 'Engagement shoots, pre-wedding destination concepts, and reels.',
    enabled: true,
    displayOrder: 2,
    createdDate: '2026-06-27',
    updatedDate: '2026-06-27',
  },
];

export const defaultPackages: Package[] = [
  {
    id: 'pkg-wed-standard',
    serviceId: 'srv-wedding',
    name: 'Standard Package',
    basePrice: 1500,
    description: 'Essential photography coverage for beautiful intimate weddings.',
    displayOrder: 1,
    hidden: false,
    inclusions: [
      { id: 'inc-wed-std-1', name: 'Continuous Coverage', description: 'Hours of photographer coverage', quantity: 6, unit: 'Hours', displayOrder: 1 },
      { id: 'inc-wed-std-2', name: 'Senior Lead Photographer', description: 'Experienced main shooter', quantity: 1, unit: 'Photographer', displayOrder: 2 },
      { id: 'inc-wed-std-3', name: 'Edited Digital Images', description: 'High-resolution downloadable photos', quantity: 300, unit: 'Images', displayOrder: 3 },
      { id: 'inc-wed-std-4', name: 'Private Web Gallery', description: 'Online hosting with sharing access', quantity: 1, unit: 'Year', displayOrder: 4 },
    ],
    addons: [
      { id: 'add-wed-std-1', name: 'Extra Hour of Coverage', description: 'Add additional hourly coverage', pricingType: 'hour', price: 150, minQty: 1, maxQty: 10, defaultQty: 1, allowQtySelect: true, enabled: true, displayOrder: 1 },
      { id: 'add-wed-std-2', name: 'Second Shoot Lead', description: 'A second lead photographer covering alternate angles', pricingType: 'fixed', price: 400, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 2 },
      { id: 'add-wed-std-3', name: 'Drone Aerial Photography', description: 'Premium drone captures', pricingType: 'fixed', price: 300, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 3 },
    ],
    customizationRules: {
      allowRemoveInclusions: true,
      allowAddOptional: true,
      allowChangeQuantity: true,
      allowEditIncludedQuantity: true,
    }
  },
  {
    id: 'pkg-wed-premium',
    serviceId: 'srv-wedding',
    name: 'Premium Gold Edition',
    basePrice: 3000,
    description: 'Full-day premium multi-angle story capture with custom albums.',
    displayOrder: 2,
    hidden: false,
    inclusions: [
      { id: 'inc-wed-prem-1', name: 'Continuous Coverage', description: 'Hours of photographer coverage', quantity: 10, unit: 'Hours', displayOrder: 1 },
      { id: 'inc-wed-prem-2', name: 'Senior Lead Photographers', description: 'Two main experienced shooters', quantity: 2, unit: 'Photographers', displayOrder: 2 },
      { id: 'inc-wed-prem-3', name: 'Edited Digital Images', description: 'High-resolution downloadable photos', quantity: 500, unit: 'Images', displayOrder: 3 },
      { id: 'inc-wed-prem-4', name: 'Pre-Wedding Engagement Shoot', description: 'Complimentary outdoor couple session', quantity: 1, unit: 'Session', displayOrder: 4 },
      { id: 'inc-wed-prem-5', name: 'Leather Album (12x12)', description: 'Lay-flat premium album', quantity: 1, unit: 'Album', displayOrder: 5 },
      { id: 'inc-wed-prem-6', name: 'Highlight Slideshow Video', description: 'High-definition video highlight', quantity: 1, unit: 'Video', displayOrder: 6 },
    ],
    addons: [
      { id: 'add-wed-prem-1', name: 'Extra Hour of Coverage', description: 'Add additional hourly coverage', pricingType: 'hour', price: 150, minQty: 1, maxQty: 10, defaultQty: 1, allowQtySelect: true, enabled: true, displayOrder: 1 },
      { id: 'add-wed-prem-2', name: 'Drone Aerial Photography', description: 'Premium drone captures', pricingType: 'fixed', price: 300, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 2 },
      { id: 'add-wed-prem-3', name: 'Same-Day Edit Slideshow', description: 'Live preview slideshow of early wedding shots', pricingType: 'fixed', price: 600, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 3 },
      { id: 'add-wed-prem-4', name: 'Parent Album Duplicates', description: 'Exact copy of the album for parents', pricingType: 'quantity', price: 200, minQty: 1, maxQty: 5, defaultQty: 1, allowQtySelect: true, enabled: true, displayOrder: 4 },
    ],
    customizationRules: {
      allowRemoveInclusions: true,
      allowAddOptional: true,
      allowChangeQuantity: true,
      allowEditIncludedQuantity: true,
    }
  },
  {
    id: 'pkg-pre-classic',
    serviceId: 'srv-prewedding',
    name: 'Classic Pre-Wedding Session',
    basePrice: 800,
    description: 'Perfect outdoor portraits and cinematic announcements.',
    displayOrder: 1,
    hidden: false,
    inclusions: [
      { id: 'inc-pre-cls-1', name: 'Continuous Coverage', description: 'Hours of photographer coverage', quantity: 2, unit: 'Hours', displayOrder: 1 },
      { id: 'inc-pre-cls-2', name: 'Lead Photographer', description: 'Main portrait photographer', quantity: 1, unit: 'Photographer', displayOrder: 2 },
      { id: 'inc-pre-cls-3', name: 'Location of Choice', description: 'Outdoor target location', quantity: 1, unit: 'Location', displayOrder: 3 },
      { id: 'inc-pre-cls-4', name: 'Edited Digital Images', description: 'High-resolution downloadable photos', quantity: 30, unit: 'Images', displayOrder: 4 },
    ],
    addons: [
      { id: 'add-pre-cls-1', name: 'Additional Outdoor Location', description: 'Add more locations to the session', pricingType: 'quantity', price: 200, minQty: 1, maxQty: 3, defaultQty: 1, allowQtySelect: true, enabled: true, displayOrder: 1 },
      { id: 'add-pre-cls-2', name: 'Professional Makeup & Hairstyling', description: 'Full makeup and hair styling artist', pricingType: 'fixed', price: 350, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 2 },
      { id: 'add-pre-cls-3', name: 'Cinematic Portrait Video Reel (60s)', description: 'Optimized horizontal/vertical short film video reel', pricingType: 'fixed', price: 400, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 3 },
    ],
    customizationRules: {
      allowRemoveInclusions: true,
      allowAddOptional: true,
      allowChangeQuantity: true,
      allowEditIncludedQuantity: true,
    }
  },
  {
    id: 'pkg-pre-cinematic',
    serviceId: 'srv-prewedding',
    name: 'Cinematic Destination Experience',
    basePrice: 1500,
    description: 'A premium full-concept destination shoot with video and hair styled.',
    displayOrder: 2,
    hidden: false,
    inclusions: [
      { id: 'inc-pre-cin-1', name: 'Session Coverage', description: 'Hours of session coverage', quantity: 5, unit: 'Hours', displayOrder: 1 },
      { id: 'inc-pre-cin-2', name: 'Photographers & Videographer', description: 'Full professional crew', quantity: 3, unit: 'Crew', displayOrder: 2 },
      { id: 'inc-pre-cin-3', name: 'Locations within 50 miles', description: 'Included shoot locations', quantity: 3, unit: 'Locations', displayOrder: 3 },
      { id: 'inc-pre-cin-4', name: 'Edited Digital Images', description: 'High-resolution downloadable photos', quantity: 80, unit: 'Images', displayOrder: 4 },
      { id: 'inc-pre-cin-5', name: 'Cinematic Highlights Reel', description: 'High definition 3-minute video highlights', quantity: 1, unit: 'Video', displayOrder: 5 },
      { id: 'inc-pre-cin-6', name: 'Makeup & Hair Artistry', description: 'Professional makeup and hair styling artists', quantity: 1, unit: 'Session', displayOrder: 6 },
    ],
    addons: [
      { id: 'add-pre-cin-1', name: 'Additional Outdoor Location', description: 'Add more locations to the session', pricingType: 'quantity', price: 200, minQty: 1, maxQty: 3, defaultQty: 1, allowQtySelect: true, enabled: true, displayOrder: 1 },
      { id: 'add-pre-cin-2', name: 'Drone Video Overlays', description: 'Beautiful aerial cinematic sequences', pricingType: 'fixed', price: 300, minQty: 1, maxQty: 1, defaultQty: 1, allowQtySelect: false, enabled: true, displayOrder: 2 },
    ],
    customizationRules: {
      allowRemoveInclusions: true,
      allowAddOptional: true,
      allowChangeQuantity: true,
      allowEditIncludedQuantity: true,
    }
  },
];

export const defaultLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins & James Smith',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 012-3456',
    weddingDate: '2026-10-12',
    venue: 'The Grand Ballroom, San Francisco',
    notes: 'Sarah wants premium leather texture on the main album cover. Highlighted interest in aerial shots.',
    serviceId: 'srv-wedding',
    packageId: 'pkg-wed-premium',
    selectedAddons: {
      'Drone Aerial Photography': 1,
      'Parent Album Duplicates': 2,
    },
    status: '1st Follow Up',
    totalVal: 3700, // 3000 base + 300 drone + 200*2 albums = 3700
    dateCreated: '2026-06-25',
    planSegment: '60',
    timeline: [
      { id: 't1', date: '2026-06-25', content: 'Lead created via Public Calculator.' },
      { id: 't2', date: '2026-06-26', content: 'Initial call completed. Confirmed date. Customer interested in leather textures and family duplicate albums.' },
    ],
  },
  {
    id: 'lead-2',
    name: 'Emily Davis & David Miller',
    email: 'emily.davis@web.com',
    phone: '+1 (555) 789-1011',
    weddingDate: '2026-08-05',
    venue: 'Napa Valley Vineyards',
    notes: 'Wants a sunset pre-wedding shoot with hair and makeup done on location.',
    serviceId: 'srv-prewedding',
    packageId: 'pkg-pre-cinematic',
    selectedAddons: {
      'Drone Video Overlays': 1,
    },
    status: 'New Lead',
    totalVal: 1800, // 1500 base + 300 drone
    dateCreated: '2026-06-27',
    planSegment: '30',
    timeline: [
      { id: 't3', date: '2026-06-27', content: 'Lead created via Public Calculator.' },
    ],
  },
  {
    id: 'lead-3',
    name: 'Michael Carter & Jessica Taylor',
    email: 'm.carter@gmail.com',
    phone: '+1 (555) 456-7890',
    weddingDate: '2026-11-20',
    venue: 'The Glasshouse, San Jose',
    notes: 'A large wedding with over 350 guests. Requires high-intensity coverage and early delivery.',
    serviceId: 'srv-wedding',
    packageId: 'pkg-wed-standard',
    selectedAddons: {
      'Second Shoot Lead': 1,
    },
    status: 'Converted',
    totalVal: 1900, // 1500 base + 400 second shoot
    dateCreated: '2026-06-15',
    timeline: [
      { id: 't4', date: '2026-06-15', content: 'Lead created.' },
      { id: 't5', date: '2026-06-17', content: 'Phone call completed. Sent standard quotation.' },
      { id: 't6', date: '2026-06-20', content: 'Invoice sent and retainer contract signed.' },
      { id: 't7', date: '2026-06-22', content: '30% Retainer payment verified. Status updated to Converted.' },
    ],
  },
  {
    id: 'lead-4',
    name: 'Sophia Martinez & Liam Wilson',
    email: 'sophia.m@outlook.com',
    phone: '+1 (555) 234-5678',
    weddingDate: '2026-07-15',
    venue: 'City Hall, San Francisco',
    notes: 'Looking for highly-budgeted standard coverage.',
    serviceId: 'srv-wedding',
    packageId: 'pkg-wed-standard',
    selectedAddons: {},
    status: 'Lost',
    totalVal: 1500,
    dateCreated: '2026-06-10',
    dateMarkedLost: '2026-06-26', // 1 day ago (retention active)
    timeline: [
      { id: 't8', date: '2026-06-10', content: 'Lead created.' },
      { id: 't9', date: '2026-06-12', content: 'Initial call completed.' },
      { id: 't10', date: '2026-06-26', content: 'Client opted for a part-time alternative due to budget mismatch.' },
    ],
  },
  {
    id: 'lead-5',
    name: 'Marcus Brody & Helena Shaw',
    email: 'marcus.brody@archaeology.org',
    phone: '+1 (555) 901-2345',
    weddingDate: '2026-12-05',
    venue: 'Museum of Antiquities, Chicago',
    notes: 'Requires vintage tones and historical venue coverage. Prefers black and white editorial style.',
    serviceId: 'srv-wedding',
    packageId: 'pkg-wed-premium',
    selectedAddons: {},
    status: 'New Lead',
    totalVal: 3000,
    dateCreated: '2026-06-27',
    planSegment: '90',
    timeline: [
      { id: 't11', date: '2026-06-27', content: 'Lead created.' },
    ],
  },
];

export const defaultReminders: Reminder[] = [
  {
    id: 'rem-1',
    date: '2026-06-28',
    time: '10:00',
    title: 'Call Sarah Jenkins about leather color choice',
    notes: 'She wanted to see standard tan vs charcoal gray leather options for the Premium Album cover.',
    leadId: 'lead-1',
    completed: false,
  },
  {
    id: 'rem-2',
    date: '2026-06-29',
    time: '14:00',
    title: 'Review vineyard shoot locations with Emily',
    notes: 'Coordinate exact permit details with Napa Vineyards for the 3 scheduled spots.',
    leadId: 'lead-2',
    completed: false,
  },
  {
    id: 'rem-3',
    date: '2026-06-27',
    time: '16:00',
    title: 'Check backup battery kits',
    notes: 'General camera checklist before upcoming weekend shoots.',
    completed: true,
  },
];

export const defaultSettings: Settings = {
  companyName: 'Lumina Studio',
  phone: '+1 (555) 123-4567',
  email: 'hello@luminastudio.com',
  website: 'www.luminastudio.com',
  address: '100 Creative Way, Suite A, San Francisco, CA',
  logoText: 'LUMINA STUDIO',
  quotationFooter: 'Thank you for choosing Lumina Studio. We are honored to capture your love story.',
  termsConditions: `1. A non-refundable 30% retainer is required to secure your date.
2. Balance payments are due 14 days prior to the wedding event date.
3. Turnaround time for delivery of edited images is 6-8 weeks.
4. Lumina Studio retains high creative control and copyright over images, with full digital printing rights granted to clients.`,
  defaultValidityDays: 14,
};
