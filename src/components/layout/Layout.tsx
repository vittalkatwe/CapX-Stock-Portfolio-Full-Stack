import React from 'react';
import { SideNav } from './SideNav';
import { Settings } from '../pages/Settings';
import { Help } from '../pages/Help';
import { Portfolio } from '../pages/Portfolio';
import { Dashboard } from '../Dashboard';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import Register from '../pages/Register';


interface LayoutProps {
  children: React.ReactNode;
  showForm: boolean;
  onToggleForm: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Layout({ showForm, onToggleForm, activeSection, onSectionChange }: LayoutProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return <Portfolio />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'home':
        return <Home />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNav 
        activeSection={activeSection} 
        onSectionChange={onSectionChange}
        showForm={showForm}
        onToggleForm={onToggleForm}
      />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}