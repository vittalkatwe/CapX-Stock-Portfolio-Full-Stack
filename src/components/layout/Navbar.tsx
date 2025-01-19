import React from 'react';
import { Briefcase } from 'lucide-react';

interface NavbarProps {
  showForm: boolean;
  onToggleForm: () => void;
}

export function Navbar({ showForm, onToggleForm }: NavbarProps) {
  return (
    <nav className="h-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-xl font-bold">Stock Portfolio</span>
          </div>
          <button
            onClick={onToggleForm}
            className="bg-white text-blue-600 py-2 px-6 rounded-full font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200"
          >
            {showForm ? 'Cancel' : 'Add Stock'}
          </button>
        </div>
      </div>
    </nav>
  );
}