
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Book, Heart, Users } from 'lucide-react';

const HelpResources = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">We're Here to Help You</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          आप अकेली नहीं हैं - हमारी टीम और समुदाय आपकी सहायता के लिए यहाँ है
        </p>
      </div>

      {/* Supportive help center image */}
      <div className="flex justify-center mb-8">
        <img 
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop&crop=faces"
          alt="Woman getting help and support"
          className="w-full max-w-md h-48 object-cover rounded-xl shadow-lg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>24/7 Helpline Numbers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="font-medium">National Women Helpline</div>
              <div className="text-lg font-bold text-primary">1800-11-2233</div>
              <div className="text-sm text-muted-foreground">Free • Available 24/7</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="font-medium">Emergency Women's Helpline</div>
              <div className="text-lg font-bold text-primary">181</div>
              <div className="text-sm text-muted-foreground">Emergency support</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="font-medium">Health & Wellness Support</div>
              <div className="text-lg font-bold text-primary">104</div>
              <div className="text-sm text-muted-foreground">Medical guidance</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Community Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <div className="font-medium">Women Support Groups</div>
              </div>
              <div className="text-sm text-muted-foreground">Connect with other women in your area for support and guidance.</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Book className="w-5 h-5 text-primary" />
                <div className="font-medium">Resource Library</div>
              </div>
              <div className="text-sm text-muted-foreground">Access guides, forms, and educational materials in your language.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section with supportive tone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium text-sm mb-2">How do I check my application status?</div>
              <div className="text-xs text-muted-foreground">Visit the 'My Benefits' section to track all your applications and see real-time updates.</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium text-sm mb-2">What documents do I need?</div>
              <div className="text-xs text-muted-foreground">Each scheme has specific requirements listed in the scheme details. We'll guide you step by step.</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium text-sm mb-2">Can I apply for multiple schemes?</div>
              <div className="text-xs text-muted-foreground">Yes! You can apply for all schemes you're eligible for. We'll help you identify the best ones.</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium text-sm mb-2">Is my information secure?</div>
              <div className="text-xs text-muted-foreground">Absolutely. We follow strict privacy guidelines to protect your personal information.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpResources;
