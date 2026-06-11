
import React from 'react';
import { Heart, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollText } from 'lucide-react';


const Header = () => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
  <ScrollText className="w-6 h-6 text-primary-foreground" />
</div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Health Yojana</h1>
              <p className="text-sm text-muted-foreground">स्वास्थ्य योजना सहायक</p>
            </div>
          </div>
          
          {/* Health and wellness focused image */}
          {/* <div className="hidden md:block">
            <img 
              src="https://img.freepik.com/premium-photo/indian-woman-managing-homebased-event-planning-business-organizing-details-laptop_220770-41037.jpg"
              alt="Women's health and wellness"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
          </div> */}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
