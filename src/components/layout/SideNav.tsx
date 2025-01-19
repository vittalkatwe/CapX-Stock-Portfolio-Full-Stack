import React from 'react';
import { LayoutDashboard, LineChart, Settings, HelpCircle, Briefcase, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { IoLogOut } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface SideNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  showForm: boolean;
  onToggleForm: () => void;
}

export function SideNav({ activeSection, onSectionChange, showForm, onToggleForm }: SideNavProps) {
  const handleSubmit = async () => {
    try {
      await supabase.auth.signOut(); // Ensure the user is signed out
      toast.success('Logged Out');
    } catch (error) {
      toast.error('Error signing out');
      console.error('Sign-out error:', error);
    }
  };
  

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">Portfolio</span>
        </div>
      </div>
      
      <div className="flex-1 py-6">
        <div className="px-3 space-y-2">
          <NavItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={activeSection === 'dashboard'}
            onClick={() => onSectionChange('dashboard')}
          />
          <NavItem
            icon={<LineChart className="h-5 w-5" />}
            label="Portfolio"
            isActive={activeSection === 'portfolio'}
            onClick={() => onSectionChange('portfolio')}
          />
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            isActive={activeSection === 'settings'}
            onClick={() => onSectionChange('settings')}
          />
          <NavItem
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help"
            isActive={activeSection === 'help'}
            onClick={() => onSectionChange('help')}
          />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Link to='/home'>
        <button 
        onClick={handleSubmit}
          className=" w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
        <IoLogOut className="h-6 w-6 ml-1`" />
          Sign out
          
        </button></Link>
      </div>
      <div className="p-4 border-gray-200">
        <button
          onClick={onToggleForm}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5" />
          <span>{showForm ? 'Cancel' : 'Add Stock'}</span>
        </button>
      </div>
    </div>
  );
}