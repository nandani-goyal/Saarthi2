import React, { useState } from 'react';
import { useSchemesMutation } from '@/hooks/useSchemesMutation';
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
import { CheckCircle, Clock, Package, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const handleSchemeDetails = (id: number) => {
  console.log("Viewing scheme:", id);
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recommendedSchemes, setRecommendedSchemes] = useState<any[]>([]);

  /**
   * useSchemesMutation gives us three important values:
   *   - mutateAsync  → call this to trigger the actual API request
   *   - isPending    → true while the request is running (show a spinner)
   *   - isError      → true if the request failed (show an error banner)
   *   - error        → the error object containing a message
   *   - reset        → clears the error so the user can try again
   */
  const { mutateAsync, isPending, isError, error, reset } = useSchemesMutation();

  const handleEligibilitySubmit = async (formData: any) => {
    // Clear any previous error before starting a new attempt
    reset();

    try {
      // mutateAsync runs getEligibleSchemes and handles retries automatically
      const schemes = await mutateAsync(formData);

      // Map backend scheme shape → UI card shape
      const formatted = schemes.map((scheme: any, index: number) => ({
        id: index,
        title: scheme.name,
        description: scheme.description || scheme.benefits?.join(", "),
        benefits: scheme.benefits,
        eligibilityMatch: scheme.score,
        category: scheme.category || "health",
      }));

      setRecommendedSchemes(formatted);
      toast({
        title: "Schemes Found!",
        description: `We found ${formatted.length} scheme(s) for you.`,
      });
      setActiveTab('dashboard');
    } catch (err) {
      // isError will automatically be set to true by React Query.
      // We don't need to do anything here – the UI will handle it below.
      console.error("Eligibility submission failed:", err);
    }
  };

  // ----------------------------------------------------------------
  // Re-usable Loading Spinner component (inline, no extra file needed)
  // ----------------------------------------------------------------
  const LoadingOverlay = () => (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-lg font-medium text-muted-foreground">
        Finding the best schemes for you…
      </p>
      <p className="text-sm text-muted-foreground">
        This usually takes a second or two.
      </p>
    </div>
  );

  // ----------------------------------------------------------------
  // Re-usable Error Banner component
  // ----------------------------------------------------------------
  const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl max-w-lg w-full">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-700">Something went wrong</p>
          <p className="text-sm text-red-600 mt-1">{message}</p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onRetry}
        className="border-red-300 text-red-600 hover:bg-red-50"
      >
        Try Again
      </Button>
    </div>
  );

  // ----------------------------------------------------------------
  // Dashboard Tab
  // ----------------------------------------------------------------
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
          <p className="text-muted-foreground">
            Please fill the eligibility form to see personalized recommendations.
          </p>
        )}
      </div>
    </div>
  );

  // ----------------------------------------------------------------
  // Eligibility Tab – shows loading/error/form based on state
  // ----------------------------------------------------------------
  const renderEligibility = () => {
    // While the API call is in-flight, show a spinner instead of the form
    if (isPending) return <LoadingOverlay />;

    // If the API call failed, show an error banner with a retry button
    if (isError) {
      return (
        <ErrorBanner
          message={error?.message || "Unknown error. Please check if the backend is running."}
          onRetry={() => {
            reset();              // clear the error in React Query
            setActiveTab('eligibility'); // stay on this tab so user can re-submit
          }}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Health Schemes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and we'll match you with government schemes that can
            support your health, nutrition, and welfare needs.
          </p>
        </div>
        <EligibilityForm onSubmit={handleEligibilitySubmit} isLoading={isPending} />
      </div>
    );
  };

  // ----------------------------------------------------------------
  // Tracker Tab
  // ----------------------------------------------------------------
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
      case 'eligibility': return renderEligibility();
      case 'tracker':     return renderTracker();
      case 'help':        return renderHelp();
      default:            return renderDashboard();
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