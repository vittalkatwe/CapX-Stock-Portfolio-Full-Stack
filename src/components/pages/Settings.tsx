import React from 'react';
import { Bell, Shield, Eye, Globe } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingCard
              icon={<Bell className="h-6 w-6 text-blue-600" />}
              title="Notifications"
              description="Configure how you want to receive alerts"
            />
            <SettingCard
              icon={<Shield className="h-6 w-6 text-blue-600" />}
              title="Security"
              description="Manage your account security settings"
            />
            <SettingCard
              icon={<Eye className="h-6 w-6 text-blue-600" />}
              title="Preferences"
              description="Customize your viewing preferences"
            />
            <SettingCard
              icon={<Globe className="h-6 w-6 text-blue-600" />}
              title="Language"
              description="Choose your preferred language"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-100 transition-colors duration-200">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}