
import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, Search, FileText, HelpCircle, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'eligibility', label: 'Find Schemes', icon: Search },
    { id: 'tracker', label: 'My Benefits', icon: FileText },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <Card className="mb-6">
      <div className="flex overflow-x-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default Navigation;
