import { X, Star, Users, Calendar, Stethoscope, FileText, Heart, Shield, Activity, Database, Building2, Syringe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const ExploreModal = ({ isOpen, onClose, onLogin }: ExploreModalProps) => {
  if (!isOpen) return null;

  const experiences = [
    {
      id: 1,
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      service: "SheCycle+ Period Tracking",
      rating: 5,
      review: "This app changed my life! Finally, accurate predictions and helpful health insights. The mood tracking feature is amazing.",
      location: "Mumbai, Maharashtra",
      verified: true
    },
    {
      id: 2,
      name: "Dr. Meera Patel",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      service: "GynConnect Consultation",
      rating: 5,
      review: "As a gynecologist, I'm impressed by the quality of consultations. Patients come well-prepared with their symptoms documented.",
      location: "Ahmedabad, Gujarat",
      verified: true
    },
    {
      id: 3,
      name: "Ritu Agarwal",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      service: "HealthYojana Government Schemes",
      rating: 4,
      review: "Found government health schemes I never knew existed! Got my mother enrolled in the senior citizen health program.",
      location: "Delhi, NCR",
      verified: true
    },
    {
      id: 4,
      name: "Sunita Reddy",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      service: "SymptoScan AI Analysis",
      rating: 5,
      review: "The AI symptom checker caught early signs of PCOS. Early detection helped me get proper treatment quickly.",
      location: "Hyderabad, Telangana",
      verified: true
    },
    {
      id: 5,
      name: "Kavitha Nair",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face",
      service: "CareCircle Support Group",
      rating: 5,
      review: "Connected with amazing women facing similar challenges. The peer support helped me through my toughest times.",
      location: "Kochi, Kerala",
      verified: true
    },
    {
      id: 6,
      name: "Dr. Anita Gupta",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      service: "MediVault Health Records",
      rating: 4,
      review: "Secure, organized medical records. Easy to share with doctors and track health history over time.",
      location: "Jaipur, Rajasthan",
      verified: true
    }
  ];

  const features = [
    { 
      icon: Calendar, 
      name: "SheCycle+", 
      users: "25k+", 
      color: "from-rose-400 to-pink-500", 
      link: "https://feminine-she-care-vpg6.vercel.app/" 
    },
    { 
      icon: Activity, 
      name: "SymptoScan", 
      users: "18k+", 
      color: "from-blue-400 to-cyan-500", 
      link: "https://saarthi2-167k.vercel.app/" 
    },
    { 
      icon: Stethoscope, 
      name: "GynConnect", 
      users: "12k+", 
      color: "from-emerald-400 to-green-500", 
      link: "https://gyno3.vercel.app/" 
    },
    { 
      icon: Database, 
      name: "MediVault", 
      users: "30k+", 
      color: "from-purple-400 to-violet-500", 
      link: "https://medi-safe-journal-vault.vercel.app/" 
    },
    { 
      icon: FileText, 
      name: "HealthYojana", 
      users: "8k+", 
      color: "from-amber-400 to-orange-500", 
      link: "http://health-yojana.vercel.app/" 
    },
    { 
      icon: Building2, 
      name: "NGOHeal", 
      users: "15k+", 
      color: "from-teal-400 to-cyan-500", 
      link: "https://ngo-heal.vercel.app/" 
    },
    { 
      icon: MessageCircle, 
      name: "CareCircle", 
      users: "20k+", 
      color: "from-indigo-400 to-purple-500", 
      link: "https://carecircle-women-unite.vercel.app/" 
    },
    { 
      icon: Shield, 
      name: "VaxAlert", 
      users: "10k+", 
      color: "from-pink-400 to-rose-500", 
      link: "https://vaxalert2.vercel.app/" 
    }
  ];

  const handleFeatureClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleGetStarted = () => {
    onClose();
    onLogin();
  };

  const handleLearnMore = () => {
    onClose();
    // Scroll to about section
    setTimeout(() => {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header with attractive background */}
        <div className="bg-gradient-hero text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Explore Women's Experiences</h2>
              <p className="text-white/80 mt-1">Real stories from real women using Saarthi</p>
            </div>
            <Button variant="secondary" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Features Overview with attractive visuals */}
        <div className="p-6 bg-gradient-warm border-b border-border/50">
          <h3 className="text-lg font-semibold mb-4 text-center">Our Complete Service Suite</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-feature p-4 text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => handleFeatureClick(feature.link)}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-sm text-foreground">{feature.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.users} users</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Experiences */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">What Women Are Saying</h3>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="card-elegant p-4 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-start gap-4">
                  <img 
                    src={exp.image} 
                    alt={exp.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{exp.name}</h4>
                      {exp.verified && (
                        <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exp.location}</p>
                    
                    {/* Rating with better styling */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < exp.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({exp.rating}.0)</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-xs bg-gradient-to-r from-accent/20 to-primary/20 text-accent-foreground px-3 py-1 rounded-full border border-accent/30">
                        {exp.service}
                      </span>
                    </div>
                    
                    <p className="text-foreground text-sm leading-relaxed">"{exp.review}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer with attractive design */}
        <div className="p-6 bg-gradient-hero text-white rounded-b-2xl">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Start Your Journey?</h3>
            <p className="text-white/80 mb-4">Join thousands of women who trust Saarthi for their health</p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started Today
              </Button>
              <Button 
                onClick={handleLearnMore}
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreModal;
