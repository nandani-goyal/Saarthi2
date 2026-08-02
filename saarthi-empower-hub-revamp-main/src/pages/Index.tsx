import { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, Shield, Zap, Heart, FileText, Calendar, Stethoscope, Award, Activity, UserCheck, Database, Building2, Syringe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import FeatureCard from '@/components/FeatureCard';
import AuthModal from '@/components/AuthModal';
import heroWomen from '@/assets/hero-women.jpg';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { user, loading, logout } = useAuth();
  const isLoggedIn = !!user;
  const userName = user ? user.name : "Priya";

  const [view, setView] = useState<'landing' | 'dashboard'>('dashboard');

  // Auth modal state — used when a guest clicks a gated feature card
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setView('dashboard');
    } else {
      setView('landing');
    }
  }, [isLoggedIn]);

  const handleLogin = (_name: string) => {
    // Compatibility hook — auth is fully handled by useAuth()
  };

  const handleLogout = () => {
    logout();
  };

  // Called by FeatureCard when a guest clicks a locked feature
  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium text-lg animate-pulse">Loading Saarthi...</p>
      </div>
    );
  }

  // If logged in and current view is dashboard, show dashboard
  if (isLoggedIn && view === 'dashboard') {
    return (
      <>
        <Header
          userDashboard={true}
          onViewChange={setView}
        />
        <Dashboard userName={userName} />
      </>
    );
  }

  // Feature cards with creative artistic icons and actual links
  const features = [
    {
      icon: Calendar,
      title: "SheCycle+",
      description: "Period & mood tracker with flow logs",
      fullDescription: "Complete period tracking with mood analysis, flow logs, and smart reminders to help you understand your cycle patterns better",
      users: "25k+ users",
      color: "from-rose-400 to-pink-500",
      link: "https://feminine-she-care-vpg6.vercel.app/"
    },
    {
      icon: Activity,
      title: "SymptoScan",
      description: "AI symptom scanner with health insights",
      fullDescription: "AI-powered symptom analysis offering verified health insights and personalized recommendations from medical experts",
      users: "18k+ users",
      color: "from-blue-400 to-cyan-500",
      link: "https://saarthi2-167k.vercel.app/"
    },
    {
      icon: Stethoscope,
      title: "GynConnect",
      description: "Video & chat with verified gynecologists",
      fullDescription: "Professional video consultations and secure chat with certified gynecologists for expert medical advice",
      users: "12k+ users",
      color: "from-emerald-400 to-green-500",
      link: "https://gyno3.vercel.app/"
    },
    {
      icon: Database,
      title: "MediVault",
      description: "Digital locker for health records",
      fullDescription: "Secure digital vault for prescriptions, medical reports, vitals, and health logs with encrypted storage",
      users: "30k+ users",
      color: "from-purple-400 to-violet-500",
      link: "https://medi-safe-journal-vault.vercel.app/"
    },
    {
      icon: FileText,
      title: "HealthYojana",
      description: "Discover govt. health schemes",
      fullDescription: "Navigate women-centric government health schemes with application assistance and eligibility guidance",
      users: "8k+ users",
      color: "from-amber-400 to-orange-500",
      link: "http://health-yojana.vercel.app/"
    },
    {
      icon: Building2,
      title: "NGOHeal",
      description: "Connect with NGOs for support",
      fullDescription: "Connect with verified NGOs for emergency shelter, legal aid, counseling, and community support resources",
      users: "15k+ users",
      color: "from-teal-400 to-cyan-500",
      link: "https://ngo-heal.vercel.app/"
    },
    {
      icon: MessageCircle,
      title: "CareCircle",
      description: "Peer support for mental health",
      fullDescription: "Anonymous peer support groups for emotional wellness with trained moderators and mental health resources",
      users: "20k+ users",
      color: "from-indigo-400 to-purple-500",
      link: "https://carecircle-women-unite.vercel.app/"
    },
    {
      icon: Shield,
      title: "VaxAlert",
      description: "Women's vaccine schedules & updates",
      fullDescription: "Personalized vaccination schedules, reminders, and updates on latest women-specific vaccines and health recommendations",
      users: "10k+ users",
      color: "from-pink-400 to-rose-500",
      link: "https://vaxalert2.vercel.app/"
    }
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Women Trust Us" },
    { icon: Star, value: "98%", label: "Satisfaction Rate" },
    { icon: Zap, value: "24/7", label: "Support Available" },
    { icon: Award, value: "25+", label: "Health Services" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Auth modal — triggered when a guest clicks a gated feature */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        defaultMode="login"
      />

      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium">Empowering Women's Health Since 2024</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Your Trusted
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200 py-2">
                  Digital Saarthi
                </span>
                for Complete Women's Wellness
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                From period tracking to expert consultations, government health schemes to peer support —
                experience comprehensive women's healthcare designed by women, for women.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-hero text-lg px-8 py-4"
                >
                  Join Saarthi Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => {
                  const aboutSection = document.getElementById('about-section');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }} variant="outline" className="btn-elegant text-lg px-8 py-4">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={heroWomen}
                alt="Professional women's health consultation"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-elegant">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-accent/20 text-accent-foreground rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-medium">⭐ Featured Solutions</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Revolutionary Health Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge women's healthcare technology designed by top medical experts
              and AI specialists. Each feature is crafted to empower your health journey.
            </p>
            {!isLoggedIn && (
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2 rounded-full">
                <span>🔒</span>
                <span>Please <button onClick={() => setIsAuthModalOpen(true)} className="underline font-semibold hover:text-amber-900">log in</button> to access any feature</span>
              </div>
            )}
          </div>

          {/* Feature Cards Grid - 2 rows of 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.slice(0, 4).map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                isLoggedIn={isLoggedIn}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(4, 8).map((feature, index) => (
              <FeatureCard
                key={index + 4}
                {...feature}
                isLoggedIn={isLoggedIn}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust Saarthi for their complete health and wellness needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsAuthModalOpen(true)} className="btn-hero text-lg px-8 py-4">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => {
              const aboutSection = document.getElementById('about-section');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }} variant="outline" className="btn-elegant text-lg px-8 py-4">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Saarthi Digital Hub</h3>
              <p className="text-primary-foreground/80 text-sm">
                Empowering women through technology and community support for better health outcomes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Period Tracking</li>
                <li>Doctor Consultations</li>
                <li>Health Records</li>
                <li>Government Schemes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>1800-SAARTHI</li>
                <li>hello@saarthi.health</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2024 Saarthi Digital Hub. All rights reserved. Made with ❤️ for women's health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
