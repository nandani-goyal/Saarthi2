
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  onStartJourney: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onStartJourney }) => {
  return (
    <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/5 to-accent/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Welcome to Your Health Journey</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            We're here to help you discover government schemes designed specifically for women's health, nutrition, and welfare.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center">
              ✨ Personalized scheme recommendations
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              ✨ Easy eligibility checking
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              ✨ Step-by-step application guidance
            </p>
          </div>
          <Button onClick={onStartJourney} className="mt-4" size="lg">
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <img 
            src="https://img.freepik.com/premium-photo/indian-woman-managing-homebased-event-planning-business-organizing-details-laptop_220770-41037.jpg"
            alt="Women supporting each other - health and welfare"
            className="w-full max-w-sm h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
