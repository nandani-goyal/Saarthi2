import React, { useState } from 'react';
import { getEligibleSchemes } from '@/lib/schemeService';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import WelcomeBanner from '@/components/WelcomeBanner';
import AutoMatchSummary from '@/components/AutoMatchSummary';
import SchemeCard from '@/components/SchemeCard';
import EligibilityForm from '@/components/EligibilityForm';
import HelpResources from '@/components/HelpResources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// import { stateSchemes } from '@/lib/stateSchemes';
import { useEffect } from 'react';


const handleSchemeDetails = (id: number) => {
  console.log("Viewing scheme:", id);
};
const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [recommendedSchemes, setRecommendedSchemes] = useState<any[]>([]);

  // No initial scheme loading; recommendations will appear after eligibility submission
  useEffect(() => {
    // intentionally left blank
  }, []);

  const handleEligibilitySubmit = async (formData: any) => {
    try {
      // Use the shared service to fetch eligible schemes based on user data
      const schemes = await getEligibleSchemes(formData);
      // The service returns an array of schemes
      const formatted = schemes.map((scheme: any, index: number) => ({
        id: index,
        title: scheme.name,
        description: scheme.description || scheme.benefits?.join(", "),
        benefits: scheme.benefits,
        eligibilityMatch: scheme.score || "90%",
        category: scheme.category || "health",
      }));
      setRecommendedSchemes(formatted);
      toast({
        title: "Profile Updated!",
        description: "We've updated your recommendations based on your information.",
      });
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Error submitting eligibility:", error);
    }
  };
  
  const renderDashboard = () => (
    <div className="space-y-6">
      <WelcomeBanner onStartJourney={() => setActiveTab('eligibility')} />
      <AutoMatchSummary />
      
      <div>
        <h2 className="text-2xl font-bold mb-6">Recommended Schemes for You</h2>
        
        
        {recommendedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                title={scheme.title}
                description={scheme.description}
                benefits={scheme.benefits}
                eligibilityMatch={scheme.eligibilityMatch}
                category={scheme.category}
                onViewDetails={() => handleSchemeDetails(scheme.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Please fill the eligibility form to see personalized recommendations.</p>
        )}
      </div>
    </div>
  );

  const renderEligibility = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Find Your Perfect Health Schemes</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions and we'll match you with government schemes that can support your health, nutrition, and welfare needs.
        </p>
      </div>
      <EligibilityForm onSubmit={handleEligibilitySubmit} />
    </div>
  );

  const renderTracker = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Track Your Benefits Journey</h2>
        <p className="text-lg text-muted-foreground">
          See your progress and manage your applications
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop&crop=center"
          alt="Woman tracking her benefits and applications"
          className="w-full max-w-md h-40 object-cover rounded-xl shadow-lg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Active Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-sm">Matru Vandana Yojana</div>
                <div className="text-xs text-muted-foreground">Received: ₹3,000</div>
                <Badge variant="outline" className="mt-1 text-xs">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>Pending Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium text-sm">Janani Suraksha Yojana</div>
                <div className="text-xs text-muted-foreground">Applied: 15 days ago</div>
                <Badge variant="outline" className="mt-1 text-xs">Processing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Available Schemes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-sm">Ujjwala Yojana</div>
                <div className="text-xs text-muted-foreground">85% Match</div>
                <Button size="sm" className="mt-2 text-xs">Apply Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHelp = () => <HelpResources />;

  const renderContent = () => {
    switch (activeTab) {
      case 'eligibility':
        return renderEligibility();
      case 'tracker':
        return renderTracker();
      case 'help':
        return renderHelp();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;


// const [schemes, setSchemes] = useState([]);
// useEffect(() => {
//   const stored = localStorage.getItem("schemes");

//   if (stored) {
//     const parsed = JSON.parse(stored);

//     // map backend data → your UI format
//     const formatted = parsed.map((scheme: any, index: number) => ({
//       id: index,
//       title: scheme.name,
//       description: scheme.benefits?.join(", "),
//       benefits: scheme.benefits,
//       eligibilityMatch: "Eligible", // you can improve later
//       category: "Health"
//     }));

//     setRecommendedSchemes(formatted);
//   }
// }, []);