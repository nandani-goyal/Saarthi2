import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2 } from 'lucide-react';
import { getEligibleSchemes } from "@/lib/schemeService";
import { useNavigate } from "react-router-dom";

interface EligibilityFormProps {
  onSubmit: (formData: any) => void;
  /** When true, disables the submit button and shows a loading spinner */
  isLoading?: boolean;
}


const EligibilityForm: React.FC<EligibilityFormProps> = ({ onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    familySize: '',
    pregnant: false,
    breastfeeding: false,
    hasHealthInsurance: false,
    state: '',
    district: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      age: Number(formData.age),
      state: formData.state
        ?.toLowerCase()
        .replace(/\s+/g, "_"),
      pregnant: formData.pregnant === true,
      breastfeeding: formData.breastfeeding === true,
      hasHealthInsurance: formData.hasHealthInsurance === true,
    };
    console.log("FORM DATA:", formattedData);

    const schemes = await getEligibleSchemes(formattedData);
    console.log("SCHEMES:", schemes);
    localStorage.setItem("schemes", JSON.stringify(schemes));
    onSubmit(formattedData);
    // navigate to home to display results (optional)
    // navigate("/"); // removed to keep current view and state
  };

  return (
    
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left side - Woman image */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <img 
              src="https://img.freepik.com/photos-premium/illustration-petite-fille-musulmane-africaine-assise-table-revisant-ses-lecons-son-pc-blanc_116079-1252.jpg"

              alt="Woman filling forms - supportive companion"
              className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
            />
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-border">
              <p className="text-sm text-muted-foreground text-center">
                "मैं आपके साथ हूँ - आइए मिलकर आपके लिए सही योजनाएं खोजते हैं"
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                "I'm here with you - let's find the right schemes for you together"
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Find Your Perfect Schemes</CardTitle>
                <p className="text-muted-foreground">Tell us about yourself to get personalized recommendations</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mobile image - shown only on small screens */}
              <div className="lg:hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop&crop=faces"
                  alt="Woman with documents - form assistance"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <div className="mt-2 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-center text-primary">
                    "आपकी सहायता के लिए यहाँ हूँ 💪"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Family Income</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, income: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-50k">Below ₹50,000</SelectItem>
                      <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="1l-2l">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="above-2l">Above ₹2,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="familySize">Family Size</Label>
                  <Input
                    id="familySize"
                    type="number"
                    value={formData.familySize}
                    onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                    placeholder="Number of family members"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madhya_pradesh">Madhya Pradesh</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">City</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Enter your district"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium">Current Status (Check all that apply)</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pregnant"
                      checked={formData.pregnant}
                      onCheckedChange={(checked) => setFormData({ ...formData, pregnant: checked as boolean })}
                    />
                    <Label htmlFor="pregnant" className="text-sm">Currently Pregnant</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lactating"
                      checked={formData.breastfeeding}
                      onCheckedChange={(checked) => setFormData({ ...formData, breastfeeding: checked as boolean })}
                    />
                    <Label htmlFor="lactating" className="text-sm">Currently Breastfeeding</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasHealthInsurance"
                      checked={formData.hasHealthInsurance}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasHealthInsurance: checked as boolean })}
                    />
                    <Label htmlFor="hasHealthInsurance" className="text-sm">Have Health Insurance</Label>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finding Schemes…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Find My Schemes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EligibilityForm;
