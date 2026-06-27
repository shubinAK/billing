/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Service, 
  Package, 
  Lead, 
  Reminder, 
  Settings, 
  TimelineEvent 
} from './types';
import { 
  defaultServices, 
  defaultPackages, 
  defaultLeads, 
  defaultReminders, 
  defaultSettings 
} from './data';

// Import subcomponents
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import LeadsView from './components/LeadsView';
import LeadDetailsView from './components/LeadDetailsView';
import FollowUpsView from './components/FollowUpsView';
import ConvertedBookingsView from './components/ConvertedBookingsView';
import LostLeadsView from './components/LostLeadsView';
import ReminderCenterView from './components/ReminderCenterView';
import ServicesPackagesView from './components/ServicesPackagesView';
import CalculatorConfigView from './components/CalculatorConfigView';
import AdminCalculatorView from './components/AdminCalculatorView';
import PublicCalculatorView from './components/PublicCalculatorView';
import SettingsView from './components/SettingsView';
import QuotationPrintView from './components/QuotationPrintView';
import PlanSegmentView from './components/PlanSegmentView';

import { Eye, EyeOff, Lock, User, ShieldAlert, Bell, Calendar } from 'lucide-react';

export default function App() {
  // --- STATE SYSTEM SETUP ---
  const [currentView, setCurrentView] = useState<'public-calculator' | 'admin'>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Unified global data states
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [retainerPercent, setRetainerPercent] = useState<number>(30);

  // Focus navigation states
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [calculatorPreselectedLead, setCalculatorPreselectedLead] = useState<Lead | null>(null);

  // Print view state
  const [printData, setPrintData] = useState<any>(null);

  // Global Add Lead Modal states
  const [isGlobalAddLeadOpen, setIsGlobalAddLeadOpen] = useState(false);
  const [globalFormName, setGlobalFormName] = useState('');
  const [globalFormEmail, setGlobalFormEmail] = useState('');
  const [globalFormPhone, setGlobalFormPhone] = useState('');
  const [globalFormDate, setGlobalFormDate] = useState('2026-10-12');
  const [globalFormVenue, setGlobalFormVenue] = useState('');
  const [globalFormNotes, setGlobalFormNotes] = useState('');
  const [globalFormServiceId, setGlobalFormServiceId] = useState('');
  const [globalFormPackageId, setGlobalFormPackageId] = useState('');
  const [globalFormPlanSegment, setGlobalFormPlanSegment] = useState<'30' | '60' | '90' | ''>('');

  // Authentication states
  const [loginEmail, setLoginEmail] = useState('admin@luminastudio.com');
  const [loginPass, setLoginPass] = useState('lumina2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // --- PERSISTENCE & INITIALIZATION ---

  // Sync to database backend
  const triggerBackendSync = (updates: {
    leads?: Lead[];
    reminders?: Reminder[];
    packages?: Package[];
    services?: Service[];
    settings?: Settings;
    retainerPercent?: number;
  }) => {
    const currentState = {
      leads: updates.leads !== undefined ? updates.leads : JSON.parse(localStorage.getItem('lumina_leads') || '[]'),
      reminders: updates.reminders !== undefined ? updates.reminders : JSON.parse(localStorage.getItem('lumina_reminders') || '[]'),
      packages: updates.packages !== undefined ? updates.packages : JSON.parse(localStorage.getItem('lumina_packages') || '[]'),
      services: updates.services !== undefined ? updates.services : JSON.parse(localStorage.getItem('lumina_services') || '[]'),
      settings: updates.settings !== undefined ? updates.settings : JSON.parse(localStorage.getItem('lumina_settings') || 'null'),
      retainerPercent: updates.retainerPercent !== undefined ? updates.retainerPercent : Number(localStorage.getItem('lumina_retainer_percent') || '30'),
    };

    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dbState: currentState }),
    })
    .then(res => res.json())
    .then(resData => {
      if (!resData.success) {
        console.error('Failed to sync to backend database');
      }
    })
    .catch(err => console.error('Error syncing to backend:', err));
  };

  const initializeFromLocal = () => {
    // 1. Load Services
    let activeServices = defaultServices;
    const storedServices = localStorage.getItem('lumina_services');
    if (storedServices) {
      activeServices = JSON.parse(storedServices);
    } else {
      localStorage.setItem('lumina_services', JSON.stringify(defaultServices));
    }
    setServices(activeServices);

    // 2. Load Packages
    let activePackages = defaultPackages;
    const storedPackages = localStorage.getItem('lumina_packages');
    if (storedPackages) {
      activePackages = JSON.parse(storedPackages);
    } else {
      localStorage.setItem('lumina_packages', JSON.stringify(defaultPackages));
    }
    setPackages(activePackages);

    // 3. Load Settings
    let activeSettings = defaultSettings;
    const storedSettings = localStorage.getItem('lumina_settings');
    if (storedSettings) {
      activeSettings = JSON.parse(storedSettings);
    } else {
      localStorage.setItem('lumina_settings', JSON.stringify(defaultSettings));
    }
    setSettings(activeSettings);

    // 4. Load Retainer
    let activeRetainer = 30;
    const storedRetainer = localStorage.getItem('lumina_retainer_percent');
    if (storedRetainer) {
      activeRetainer = Number(storedRetainer);
    } else {
      localStorage.setItem('lumina_retainer_percent', '30');
    }
    setRetainerPercent(activeRetainer);

    // 5. Load Reminders
    let activeReminders = defaultReminders;
    const storedReminders = localStorage.getItem('lumina_reminders');
    if (storedReminders) {
      activeReminders = JSON.parse(storedReminders);
    } else {
      localStorage.setItem('lumina_reminders', JSON.stringify(defaultReminders));
    }
    setReminders(activeReminders);

    // 6. Load Leads
    const storedLeads = localStorage.getItem('lumina_leads');
    let rawLeads: Lead[] = [];
    if (storedLeads) {
      rawLeads = JSON.parse(storedLeads);
      rawLeads = rawLeads.map(l => {
        if (l.id === 'lead-1' && !l.planSegment) return { ...l, planSegment: '60' };
        if (l.id === 'lead-2' && !l.planSegment) return { ...l, planSegment: '30' };
        return l;
      });
      if (!rawLeads.some(l => l.id === 'lead-5')) {
        const demoLead5 = defaultLeads.find(l => l.id === 'lead-5');
        if (demoLead5) {
          rawLeads.push(demoLead5);
        }
      }
    } else {
      rawLeads = defaultLeads;
    }

    const todayMs = new Date('2026-06-27').getTime();
    const purgedLeadsList = rawLeads.filter(l => {
      if (l.status === 'Lost' && l.dateMarkedLost) {
        const lostDateMs = new Date(l.dateMarkedLost).getTime();
        const elapsedMs = todayMs - lostDateMs;
        const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
        return elapsedDays < 7;
      }
      return true;
    });

    setLeads(purgedLeadsList);
    localStorage.setItem('lumina_leads', JSON.stringify(purgedLeadsList));

    // Initial background sync
    const initialState = {
      services: activeServices,
      packages: activePackages,
      settings: activeSettings,
      retainerPercent: activeRetainer,
      reminders: activeReminders,
      leads: purgedLeadsList,
    };
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dbState: initialState }),
    }).catch(err => console.error('Initial background sync error:', err));
  };

  useEffect(() => {
    // Fetch from backend DB file first
    fetch('/api/db')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const db = resData.data;
          
          if (db.services) {
            setServices(db.services);
            localStorage.setItem('lumina_services', JSON.stringify(db.services));
          }
          if (db.packages) {
            setPackages(db.packages);
            localStorage.setItem('lumina_packages', JSON.stringify(db.packages));
          }
          if (db.settings) {
            setSettings(db.settings);
            localStorage.setItem('lumina_settings', JSON.stringify(db.settings));
          }
          if (db.retainerPercent !== undefined) {
            setRetainerPercent(db.retainerPercent);
            localStorage.setItem('lumina_retainer_percent', String(db.retainerPercent));
          }
          if (db.reminders) {
            setReminders(db.reminders);
            localStorage.setItem('lumina_reminders', JSON.stringify(db.reminders));
          }
          if (db.leads) {
            const todayMs = new Date('2026-06-27').getTime();
            const purged = db.leads.filter((l: Lead) => {
              if (l.status === 'Lost' && l.dateMarkedLost) {
                const lostDateMs = new Date(l.dateMarkedLost).getTime();
                const elapsedMs = todayMs - lostDateMs;
                const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
                return elapsedDays < 7;
              }
              return true;
            });
            setLeads(purged);
            localStorage.setItem('lumina_leads', JSON.stringify(purged));
          }
        } else {
          initializeFromLocal();
        }
      })
      .catch(err => {
        console.warn('Backend database not reachable, falling back to local storage:', err);
        initializeFromLocal();
      });

    const storedAuth = localStorage.getItem('lumina_session');
    if (storedAuth === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  // Sync utilities
  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('lumina_leads', JSON.stringify(updatedLeads));
    triggerBackendSync({ leads: updatedLeads });
  };

  const saveRemindersToStorage = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders);
    localStorage.setItem('lumina_reminders', JSON.stringify(updatedReminders));
    triggerBackendSync({ reminders: updatedReminders });
  };

  const savePackagesToStorage = (updatedPkgs: Package[]) => {
    setPackages(updatedPkgs);
    localStorage.setItem('lumina_packages', JSON.stringify(updatedPkgs));
    triggerBackendSync({ packages: updatedPkgs });
  };

  const saveServicesToStorage = (updatedSrvs: Service[]) => {
    setServices(updatedSrvs);
    localStorage.setItem('lumina_services', JSON.stringify(updatedSrvs));
    triggerBackendSync({ services: updatedSrvs });
  };

  const saveSettingsToStorage = (updatedSettings: Settings) => {
    setSettings(updatedSettings);
    localStorage.setItem('lumina_settings', JSON.stringify(updatedSettings));
    triggerBackendSync({ settings: updatedSettings });
  };

  const saveRetainerToStorage = (p: number) => {
    setRetainerPercent(p);
    localStorage.setItem('lumina_retainer_percent', String(p));
    triggerBackendSync({ retainerPercent: p });
  };

  // --- ACTIONS HANDLERS ---

  // Auth Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@luminastudio.com' && loginPass === 'lumina2026') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('lumina_session', 'active');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('lumina_session');
  };

  // Status transitions
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const updatedLead = { ...l, status: newStatus };
        
        // Add specific timestamp if marked lost for retention tracking
        if (newStatus === 'Lost') {
          updatedLead.dateMarkedLost = '2026-06-27';
        } else {
          delete updatedLead.dateMarkedLost;
        }

        // Auto timeline logger
        const timelineLog: TimelineEvent = {
          id: `t-sys-${Date.now()}`,
          date: '2026-06-27',
          content: `Advanced pipeline status to: "${newStatus}".`
        };
        updatedLead.timeline = [...(l.timeline || []), timelineLog];

        return updatedLead;
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  // Save manual adjustments in details
  const handleUpdateLeadInfo = (leadId: string, info: Partial<Lead>) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, ...info };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  // Append customized logs or interactions
  const handleAddTimelineEvent = (leadId: string, content: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const newEvent: TimelineEvent = {
          id: `t-user-${Date.now()}`,
          date: '2026-06-27',
          content,
        };
        return {
          ...l,
          timeline: [...(l.timeline || []), newEvent]
        };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  // Create standalone or client reminder
  const handleAddReminder = (reminderData: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: `rem-user-${Date.now()}`,
      completed: false,
    };
    saveRemindersToStorage([...reminders, newReminder]);
  };

  // Toggle checklist complete
  const handleToggleReminder = (reminderId: string) => {
    const updated = reminders.map(r => {
      if (r.id === reminderId) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    saveRemindersToStorage(updated);
  };

  // Delete checklist item
  const handleDeleteReminder = (reminderId: string) => {
    const updated = reminders.filter(r => r.id !== reminderId);
    saveRemindersToStorage(updated);
  };

  // Add Manual Lead
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'dateCreated' | 'timeline' | 'selectedAddons'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-manual-${Date.now()}`,
      dateCreated: '2026-06-27',
      selectedAddons: {},
      timeline: [
        { id: `t-init-${Date.now()}`, date: '2026-06-27', content: 'Manual lead created in system.' }
      ]
    };
    saveLeadsToStorage([newLead, ...leads]);
  };

  const handleGlobalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalFormName || !globalFormPhone || !globalFormServiceId || !globalFormPackageId) {
      alert('Please fill out all required fields (Name, Phone, Service, Package).');
      return;
    }
    handleAddLead({
      name: globalFormName,
      email: globalFormEmail || '',
      phone: globalFormPhone,
      weddingDate: globalFormDate,
      venue: globalFormVenue,
      notes: globalFormNotes,
      serviceId: globalFormServiceId,
      packageId: globalFormPackageId,
      status: 'New Lead',
      planSegment: globalFormPlanSegment || undefined,
      totalVal: packages.find(p => p.id === globalFormPackageId)?.basePrice || 1200,
    });
    // Reset and close
    setGlobalFormName('');
    setGlobalFormEmail('');
    setGlobalFormPhone('');
    setGlobalFormDate('2026-10-12');
    setGlobalFormVenue('');
    setGlobalFormNotes('');
    setGlobalFormServiceId('');
    setGlobalFormPackageId('');
    setGlobalFormPlanSegment('');
    setIsGlobalAddLeadOpen(false);
  };

  // Switch to Calculator with target context
  const handleSelectAdminCalcWithLead = (lead: Lead) => {
    setCalculatorPreselectedLead(lead);
    setCurrentTab('admin-calc');
  };

  // Update existing quotation values
  const handleUpdateLeadQuotation = (
    leadId: string, 
    totalVal: number, 
    selectedAddons: { [addonName: string]: number }, 
    packageId: string, 
    serviceId: string,
    discountPackage?: number,
    discountAddons?: number,
    customNotes?: string
  ) => {
    const srvName = services.find(s => s.id === serviceId)?.name || 'Photography Service';
    const pkgName = packages.find(p => p.id === packageId)?.name || 'Selected Package';
    const addonsStr = Object.keys(selectedAddons).length > 0 
      ? `\n• Add-ons: ${Object.entries(selectedAddons).map(([n, q]) => `${n} (Qty: ${q})`).join(', ')}` 
      : '';
    const discountStr = (discountPackage || discountAddons)
      ? `\n• Discounts: Package ₹${(discountPackage || 0).toLocaleString()}, Add-ons ₹${(discountAddons || 0).toLocaleString()}`
      : '';
    const notesStr = customNotes ? `\n• Custom Quotation Note: "${customNotes}"` : '';

    const updated = leads.map(l => {
      if (l.id === leadId) {
        const timelineLog: TimelineEvent = {
          id: `t-quote-${Date.now()}`,
          date: '2026-06-27',
          content: `Quotation updated: ${srvName} • ${pkgName}${addonsStr}${discountStr}${notesStr}\nNew total investment estimated at ₹${totalVal.toLocaleString()}`
        };
        return {
          ...l,
          totalVal,
          selectedAddons,
          packageId,
          serviceId,
          discountPackage,
          discountAddons,
          customNotes,
          timeline: [...(l.timeline || []), timelineLog]
        };
      }
      return l;
    });
    saveLeadsToStorage(updated);
    setCalculatorPreselectedLead(null); // Clear context
  };

  // Create lead from admin calculator
  const handleAddLeadFromCalculator = (leadData: Omit<Lead, 'id' | 'dateCreated' | 'timeline'>) => {
    const srvName = services.find(s => s.id === leadData.serviceId)?.name || 'Photography Service';
    const pkgName = packages.find(p => p.id === leadData.packageId)?.name || 'Selected Package';
    const addonsStr = Object.keys(leadData.selectedAddons).length > 0 
      ? `\n• Add-ons: ${Object.entries(leadData.selectedAddons).map(([n, q]) => `${n} (Qty: ${q})`).join(', ')}` 
      : '';
    const discountStr = (leadData.discountPackage || leadData.discountAddons)
      ? `\n• Discounts: Package ₹${(leadData.discountPackage || 0).toLocaleString()}, Add-ons ₹${(leadData.discountAddons || 0).toLocaleString()}`
      : '';
    const notesStr = leadData.customNotes ? `\n• Custom Quotation Note: "${leadData.customNotes}"` : '';

    const newLead: Lead = {
      ...leadData,
      id: `lead-calc-${Date.now()}`,
      dateCreated: '2026-06-27',
      timeline: [
        { 
          id: `t-init-${Date.now()}`, 
          date: '2026-06-27', 
          content: `Lead created from custom calculator quotation setup. Estimated value: ₹${leadData.totalVal.toLocaleString()}\nConfigured details: ${srvName} • ${pkgName}${addonsStr}${discountStr}${notesStr}` 
        }
      ]
    };
    saveLeadsToStorage([newLead, ...leads]);
  };

  // Create lead from customer public calculator
  const handleAddPublicInquiry = (leadData: Omit<Lead, 'id' | 'dateCreated' | 'timeline' | 'status'>) => {
    const newInquiry: Lead = {
      ...leadData,
      id: `lead-public-${Date.now()}`,
      dateCreated: '2026-06-27',
      status: 'New Lead',
      timeline: [
        { id: `t-init-${Date.now()}`, date: '2026-06-27', content: `Submitted self-enquiry on Public Price Calculator. Initial estimate: ₹${leadData.totalVal.toLocaleString()}` }
      ]
    };
    saveLeadsToStorage([newInquiry, ...leads]);

    // Create an automated reminder for admins to review this public lead
    handleAddReminder({
      title: `Review public inquiry from ${leadData.name}`,
      date: '2026-06-27',
      time: '18:00',
      notes: `Review customized choices. Selected package: ${leadData.packageId}`,
      leadId: newInquiry.id,
    });
  };

  // Restore lead from Lost
  const handleRestoreLead = (leadId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const timelineLog: TimelineEvent = {
          id: `t-restore-${Date.now()}`,
          date: '2026-06-27',
          content: 'Lead recovered and restored back to active First Call pipeline status.'
        };
        return {
          ...l,
          status: 'First Call' as Lead['status'],
          timeline: [...(l.timeline || []), timelineLog]
        };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  // Permanently delete lead
  const handlePurgeLead = (leadId: string) => {
    if (confirm('Are you absolutely sure you want to permanently delete this lead? This action is completely irreversible.')) {
      const updated = leads.filter(l => l.id !== leadId);
      saveLeadsToStorage(updated);
    }
  };

  // Create Service
  const handleAddService = (srvData: Omit<Service, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newSrv: Service = {
      ...srvData,
      id: `srv-custom-${Date.now()}`,
      createdDate: '2026-06-27',
      updatedDate: '2026-06-27',
    };
    saveServicesToStorage([...services, newSrv]);
  };

  // Update Service
  const handleUpdateService = (serviceId: string, updatedSrv: Partial<Service>) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          ...updatedSrv,
          updatedDate: '2026-06-27',
        };
      }
      return s;
    });
    saveServicesToStorage(updated);
  };

  // Delete Service (only if unused in packages and leads)
  const handleDeleteService = (serviceId: string): boolean => {
    const usedInPkgs = packages.filter(p => p.serviceId === serviceId);
    const usedInLeads = leads.filter(l => l.serviceId === serviceId);

    if (usedInPkgs.length > 0) {
      alert(`Cannot delete service: It is currently linked to ${usedInPkgs.length} active packages. Please delete or reassign those packages first.`);
      return false;
    }
    if (usedInLeads.length > 0) {
      alert(`Cannot delete service: It is currently linked to ${usedInLeads.length} active booking leads. Please reassign or delete those leads first.`);
      return false;
    }

    if (confirm('Are you sure you want to delete this service line permanently? This action cannot be undone.')) {
      const updated = services.filter(s => s.id !== serviceId);
      saveServicesToStorage(updated);
      return true;
    }
    return false;
  };

  // Toggle Services
  const handleToggleService = (serviceId: string) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return { ...s, enabled: !s.enabled, updatedDate: '2026-06-27' };
      }
      return s;
    });
    saveServicesToStorage(updated);
  };

  // Update Package Tier
  const handleUpdatePackage = (packageId: string, updatedPkg: Partial<Package>) => {
    const updated = packages.map(p => {
      if (p.id === packageId) {
        return { ...p, ...updatedPkg };
      }
      return p;
    });
    savePackagesToStorage(updated);
  };

  // Create Package Tier
  const handleAddPackage = (pkgData: Omit<Package, 'id'>) => {
    const newPkg: Package = {
      ...pkgData,
      id: `pkg-custom-${Date.now()}`,
    };
    savePackagesToStorage([...packages, newPkg]);
  };

  // Delete Package
  const handleDeletePackage = (packageId: string): boolean => {
    const usedInLeads = leads.filter(l => l.packageId === packageId);
    if (usedInLeads.length > 0) {
      alert(`Cannot delete package: It is currently linked to ${usedInLeads.length} active booking leads. You may toggle its visibility to hide it from new enquiries instead.`);
      return false;
    }

    if (confirm('Purge this package tier permanently? This action is irreversible.')) {
      const updated = packages.filter(p => p.id !== packageId);
      savePackagesToStorage(updated);
      return true;
    }
    return false;
  };

  // --- RENDER ROUTER CONTROLLER ---

  // Trigger Print Overlay
  if (printData) {
    return (
      <QuotationPrintView
        printData={printData}
        services={services}
        packages={packages}
        settings={settings}
        retainerPercent={retainerPercent}
        onClose={() => setPrintData(null)}
      />
    );
  }

  // View 1: Public Estimator Calculator View
  if (currentView === 'public-calculator') {
    return (
      <PublicCalculatorView
        services={services}
        packages={packages}
        onAddPublicInquiry={handleAddPublicInquiry}
        onSwitchToAdmin={() => setCurrentView('admin')}
      />
    );
  }

  // View 2: Admin Hub (Bypassed if not logged in)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-[#E5E1D8] w-full max-w-md p-10 space-y-8 relative">
          
          {/* Logo brand */}
          <div className="text-center space-y-2">
            <div className="font-serif italic text-3xl text-[#1A1A1A] tracking-tight">Lumina Studio</div>
            <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
              Secure CRM & Administrative Portal
            </div>
          </div>

          <form id="form-login" onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700 font-medium">
                <ShieldAlert className="shrink-0 mt-0.5" size={14} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  id="input-login-email"
                  placeholder="admin@luminastudio.com"
                  className="w-full pl-9 pr-4 py-2 border border-[#E5E1D8] text-xs bg-[#FAF9F6]/50 focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                />
                <User size={14} className="absolute left-3 top-3 text-[#aaa]" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold block">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  id="input-login-pass"
                  className="w-full pl-9 pr-10 py-2 border border-[#E5E1D8] text-xs bg-[#FAF9F6]/50 focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                />
                <Lock size={14} className="absolute left-3 top-3 text-[#aaa]" />
                <button
                  type="button"
                  id="btn-login-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#aaa] hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Demonstration help banner */}
            <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[11px] text-[#666] leading-relaxed">
              <strong>Interactive Demo Account:</strong><br />
              Email: <code className="font-mono bg-white px-1">admin@luminastudio.com</code><br />
              Pass: <code className="font-mono bg-white px-1">lumina2026</code>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-semibold hover:bg-[#333] transition-colors"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Jump directly to public calculator client view */}
          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentView('public-calculator')}
              className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold hover:underline"
            >
              ← Switch to Public Facing Calculator
            </button>
          </div>

        </div>
      </div>
    );
  }

  const todayStr = '2026-06-27';
  const todaysPendingRemindersCount = reminders.filter(r => r.date === todayStr && !r.completed).length;

  // Render Admin Layout with selected tab panel
  return (
    <div className="min-h-screen bg-[#F5F2ED] flex h-screen overflow-hidden text-[#1A1A1A]">
      
      {/* 1. Global Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setSelectedLeadId(null);
          setCalculatorPreselectedLead(null);
          setCurrentTab(tab);
        }}
        onLogout={handleLogout}
        onSwitchToPublic={() => setCurrentView('public-calculator')}
      />

      {/* 2. Main Administration Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Persistent Top Bar Header */}
        <div className="bg-white border-b border-[#E5E1D8] px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="font-serif italic text-lg text-[#1A1A1A]">Lumina Workspace</h1>
            <p className="text-[9px] text-[#888] uppercase tracking-wider">Secure Administrative Panel & CRM</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Bell Notifications Button */}
            <button
              onClick={() => {
                setCurrentTab('reminders');
                setSelectedLeadId(null);
                setCalculatorPreselectedLead(null);
              }}
              id="btn-global-header-bell"
              title="Today's Reminders"
              className="relative p-2 text-[#666] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] border border-[#E5E1D8] transition-all cursor-pointer rounded-sm flex items-center justify-center mr-1"
            >
              <Bell size={16} />
              {todaysPendingRemindersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                  {todaysPendingRemindersCount}
                </span>
              )}
            </button>

            {/* Calendar Button */}
            <button
              onClick={() => {
                setCurrentTab('calendar');
                setSelectedLeadId(null);
                setCalculatorPreselectedLead(null);
              }}
              id="btn-global-header-calendar"
              title="Calendar Tab"
              className="p-2 text-[#666] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] border border-[#E5E1D8] transition-all cursor-pointer rounded-sm flex items-center justify-center mr-2"
            >
              <Calendar size={16} />
            </button>

            {/* New Custom Quote Button */}
            <button
              onClick={() => {
                setCalculatorPreselectedLead(null);
                setCurrentTab('admin-calc');
                setSelectedLeadId(null);
              }}
              id="btn-global-new-quote"
              className="px-4 py-2 bg-white border border-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>+ New Custom Quote</span>
            </button>

            {/* Add Lead Button */}
            <button
              onClick={() => setIsGlobalAddLeadOpen(true)}
              id="btn-global-add-lead"
              className="px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>+ Add Lead</span>
            </button>
          </div>
        </div>

        {/* Dynamic Inner views container */}
        <div className="flex-1 overflow-y-auto bg-[#F5F2ED] relative">
          
          {selectedLeadId && leads.some(l => l.id === selectedLeadId) ? (
            // Detail Workspace focuses above normal tab folders
            <LeadDetailsView
              lead={leads.find(l => l.id === selectedLeadId)!}
              services={services}
              packages={packages}
              reminders={reminders}
              onBack={() => setSelectedLeadId(null)}
              onUpdateStatus={handleUpdateLeadStatus}
              onUpdateLeadInfo={handleUpdateLeadInfo}
              onAddTimelineEvent={handleAddTimelineEvent}
              onAddReminder={handleAddReminder}
              onSelectAdminCalcWithLead={handleSelectAdminCalcWithLead}
              onDeleteLead={handlePurgeLead}
            />
          ) : (
            // Normal tab folders routing
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  leads={leads}
                  reminders={reminders}
                  services={services}
                  packages={packages}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onToggleReminder={handleToggleReminder}
                />
              )}

              {currentTab === 'calendar' && (
                <CalendarView
                  leads={leads}
                  services={services}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                />
              )}

              {currentTab === 'leads' && (
                <LeadsView
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onAddLead={handleAddLead}
                />
              )}

              {currentTab === 'plan-30' && (
                <PlanSegmentView
                  segment="30"
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onUpdateLeadInfo={handleUpdateLeadInfo}
                  onAddTimelineEvent={handleAddTimelineEvent}
                />
              )}

              {currentTab === 'plan-60' && (
                <PlanSegmentView
                  segment="60"
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onUpdateLeadInfo={handleUpdateLeadInfo}
                  onAddTimelineEvent={handleAddTimelineEvent}
                />
              )}

              {currentTab === 'plan-90' && (
                <PlanSegmentView
                  segment="90"
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onUpdateLeadInfo={handleUpdateLeadInfo}
                  onAddTimelineEvent={handleAddTimelineEvent}
                />
              )}

              {currentTab === 'follow-ups' && (
                <FollowUpsView
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                  onUpdateStatus={handleUpdateLeadStatus}
                  onAddTimelineEvent={handleAddTimelineEvent}
                />
              )}

              {currentTab === 'bookings' && (
                <ConvertedBookingsView
                  leads={leads}
                  services={services}
                  packages={packages}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                />
              )}

              {currentTab === 'lost-leads' && (
                <LostLeadsView
                  leads={leads}
                  services={services}
                  packages={packages}
                  onRestoreLead={handleRestoreLead}
                  onPurgeLead={handlePurgeLead}
                />
              )}

              {currentTab === 'reminders' && (
                <ReminderCenterView
                  reminders={reminders}
                  leads={leads}
                  onToggleReminder={handleToggleReminder}
                  onDeleteReminder={handleDeleteReminder}
                  onAddReminder={handleAddReminder}
                  onSelectLead={(id) => setSelectedLeadId(id)}
                />
              )}

               {currentTab === 'services-packages' && (
                 <ServicesPackagesView
                   services={services}
                   packages={packages}
                   leads={leads}
                   onAddService={handleAddService}
                   onUpdateService={handleUpdateService}
                   onDeleteService={handleDeleteService}
                   onToggleService={handleToggleService}
                   onAddPackage={handleAddPackage}
                   onUpdatePackage={handleUpdatePackage}
                   onDeletePackage={handleDeletePackage}
                 />
               )}

              {currentTab === 'calc-config' && (
                <CalculatorConfigView
                  settings={settings}
                  onUpdateSettings={saveSettingsToStorage}
                  retainerPercent={retainerPercent}
                  onUpdateRetainerPercent={saveRetainerToStorage}
                  services={services}
                  packages={packages}
                  onUpdatePackage={handleUpdatePackage}
                  onAddPackage={handleAddPackage}
                  onDeletePackage={handleDeletePackage}
                />
              )}

              {currentTab === 'admin-calc' && (
                <AdminCalculatorView
                  services={services}
                  packages={packages}
                  leads={leads}
                  onAddLeadFromCalculator={handleAddLeadFromCalculator}
                  onUpdateLeadQuotation={handleUpdateLeadQuotation}
                  onTriggerQuotationPrint={(pData) => setPrintData(pData)}
                  preselectedLead={calculatorPreselectedLead}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={saveSettingsToStorage}
                />
              )}
            </>
          )}

        </div>

      </div>

      {/* Global Add Lead Modal Overlay */}
      {isGlobalAddLeadOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E5E1D8] w-full max-w-lg p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0EEEA] pb-4">
              <div>
                <h2 className="font-serif italic text-2xl text-[#1A1A1A]">Create New Lead</h2>
                <p className="text-[10px] text-[#888] uppercase tracking-wider font-semibold">
                  Add a prospective client directly to the pipeline
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGlobalAddLeadOpen(false)}
                className="text-[#888] hover:text-[#1A1A1A] transition-colors p-1"
                id="btn-close-global-add-lead"
              >
                <span className="text-xl font-bold font-mono">✕</span>
              </button>
            </div>

            {/* Modal Form */}
            <form id="form-global-add-lead" onSubmit={handleGlobalFormSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={globalFormName}
                  onChange={(e) => setGlobalFormName(e.target.value)}
                  id="input-global-lead-name"
                  placeholder="e.g. Jessica & David"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                />
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={globalFormEmail}
                    onChange={(e) => setGlobalFormEmail(e.target.value)}
                    id="input-global-lead-email"
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={globalFormPhone}
                    onChange={(e) => setGlobalFormPhone(e.target.value)}
                    id="input-global-lead-phone"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* Date / Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Wedding/Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={globalFormDate}
                    onChange={(e) => setGlobalFormDate(e.target.value)}
                    id="input-global-lead-date"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Event Venue
                  </label>
                  <input
                    type="text"
                    value={globalFormVenue}
                    onChange={(e) => setGlobalFormVenue(e.target.value)}
                    id="input-global-lead-venue"
                    placeholder="e.g. City Hall, SF"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] text-[#1a1a1a]"
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
                  value={globalFormServiceId}
                  onChange={(e) => {
                    setGlobalFormServiceId(e.target.value);
                    setGlobalFormPackageId(''); // reset package
                  }}
                  id="select-global-lead-service"
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white text-[#1a1a1a]"
                >
                  <option value="">-- Choose Photography Service --</option>
                  {services.filter(s => s.enabled).map(srv => (
                    <option key={srv.id} value={srv.id}>{srv.name}</option>
                  ))}
                </select>
              </div>

              {/* Package Selection */}
              {globalFormServiceId && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                    Target Package *
                  </label>
                  <select
                    required
                    value={globalFormPackageId}
                    onChange={(e) => setGlobalFormPackageId(e.target.value)}
                    id="select-global-lead-package"
                    className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] bg-white text-[#1a1a1a]"
                  >
                    <option value="">-- Select Specific Package Tier --</option>
                    {packages.filter(p => p.serviceId === globalFormServiceId && !p.hidden).map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (₹{pkg.basePrice.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Plan Segment Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-semibold block">
                  Plan Segment (Days)
                </label>
                <select
                  value={globalFormPlanSegment}
                  onChange={(e) => setGlobalFormPlanSegment(e.target.value as '30' | '60' | '90' | '')}
                  id="select-global-lead-plan-segment"
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
                  Internal Inquiry Notes
                </label>
                <textarea
                  value={globalFormNotes}
                  onChange={(e) => setGlobalFormNotes(e.target.value)}
                  id="textarea-global-lead-notes"
                  placeholder="E.g. Wants dynamic packages, extra albums, drone session..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E1D8] text-xs focus:outline-none focus:border-[#1A1A1A] resize-none text-[#1a1a1a]"
                />
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EEEA]">
                <button
                  type="button"
                  id="btn-global-lead-cancel"
                  onClick={() => setIsGlobalAddLeadOpen(false)}
                  className="px-4 py-2 border border-[#E5E1D8] text-[10px] uppercase tracking-widest font-semibold text-[#666] hover:bg-[#FAF9F6] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-global-lead-submit"
                  className="px-5 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors cursor-pointer"
                >
                  Create & Pipeline Lead
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
