import React from 'react';
import { BookOpen, MessageCircle, Phone, Mail } from 'lucide-react';

export function Help() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HelpCard
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          title="Documentation"
          description="Read our comprehensive guides and documentation"
          actionText="Browse Docs"
        />
        <HelpCard
          icon={<MessageCircle className="h-6 w-6 text-blue-600" />}
          title="FAQ"
          description="Find answers to commonly asked questions"
          actionText="View FAQ"
        />
        <HelpCard
          icon={<Phone className="h-6 w-6 text-blue-600" />}
          title="Support"
          description="Get help from our support team"
          actionText="Contact Support"
        />
        <HelpCard
          icon={<Mail className="h-6 w-6 text-blue-600" />}
          title="Contact"
          description="Send us an email with your questions"
          actionText="Send Email"
        />
      </div>
    </div>
  );
}

function HelpCard({ 
  icon, 
  title, 
  description, 
  actionText 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  actionText: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
            {actionText} →
          </button>
        </div>
      </div>
    </div>
  );
}