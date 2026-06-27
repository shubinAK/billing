/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  PhoneCall, 
  CheckSquare, 
  Trash2, 
  Bell, 
  Settings, 
  Calculator, 
  BookOpen, 
  Grid,
  ExternalLink,
  Clock
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onSwitchToPublic: () => void;
}

export default function Sidebar({ currentTab, onTabChange, onLogout, onSwitchToPublic }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'leads', label: 'Leads & CRM', icon: Users },
    { id: 'plan-30', label: '30 Days Plan', icon: Clock },
    { id: 'plan-60', label: '60 Days Plan', icon: Clock },
    { id: 'plan-90', label: '90 Days Plan', icon: Clock },
    { id: 'follow-ups', label: 'Follow Ups', icon: PhoneCall },
    { id: 'bookings', label: 'Converted Bookings', icon: CheckSquare },
    { id: 'lost-leads', label: 'Lost Leads (7D)', icon: Trash2 },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'services-packages', label: 'Services & Packages', icon: BookOpen },
    { id: 'calc-config', label: 'Calculator Config', icon: Grid },
    { id: 'admin-calc', label: 'Admin Calculator', icon: Calculator },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E5E1D8] h-full flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Logo/Header */}
        <div className="p-6 border-b border-[#F0EEEA]">
          <div className="font-serif italic text-2xl text-[#1A1A1A] tracking-tight">Lumina Studio</div>
          <div className="text-[10px] uppercase tracking-widest text-[#888] mt-1">Admin Management</div>
        </div>

        {/* View Changer - To Public Calculator */}
        <div className="p-4 px-6 border-b border-[#F0EEEA]">
          <button
            onClick={onSwitchToPublic}
            id="btn-sidebar-switch-public"
            className="w-full flex items-center justify-between px-3 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <span>Public Calculator</span>
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                id={`btn-nav-item-${item.id}`}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left text-xs tracking-wider uppercase transition-all duration-150 ${
                  isActive
                    ? 'text-[#1A1A1A] font-semibold border-r-4 border-[#1A1A1A] bg-[#FAF9F6]'
                    : 'text-[#666] hover:text-[#1A1A1A] hover:bg-[#FAF9F6]/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#1A1A1A]' : 'text-[#888]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer info */}
      <div className="p-6 border-t border-[#F0EEEA] bg-[#FAF9F6]">
        <div className="text-xs text-[#1A1A1A] font-medium">Alexander P.</div>
        <div className="text-[10px] text-[#888] uppercase tracking-wider">Lead Studio Admin</div>
        <button
          onClick={onLogout}
          id="btn-sidebar-logout"
          className="mt-3 text-[10px] text-red-600 hover:text-red-800 uppercase tracking-widest font-semibold text-left block"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
