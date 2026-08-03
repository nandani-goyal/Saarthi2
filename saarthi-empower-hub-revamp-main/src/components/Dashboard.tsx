import { Calendar, Heart, FileText, Users, TrendingUp, Settings, HelpCircle, ExternalLink, Activity, Database, Building2, Syringe, MessageCircle, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import HelpPopup from './HelpPopup';

interface DashboardProps {
  userName: string;
}

const Dashboard = ({ userName }: DashboardProps) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const personalizedFeatures = [
    {
      icon: Calendar,
      title: "SheCycle+",
      description: "Track your period & mood",
      progress: 85,
      lastUsed: "2 days ago",
      color: "from-rose-400 to-pink-500",
      link: "https://feminine-she-care-vpg6.vercel.app/",
      used: true
    },
    {
      icon: Activity,
      title: "SymptoScan",
      description: "AI health insights",
      progress: 70,
      lastUsed: "5 days ago",
      color: "from-blue-400 to-cyan-500",
      link: "https://saarthi2-167k.vercel.app/",
      used: true
    },
    {
      icon: Heart,
      title: "GynConnect",
      description: "Expert consultations",
      progress: 60,
      lastUsed: "1 week ago",
      color: "from-emerald-400 to-green-500",
      // link: "https://gyno-connect-oasis.vercel.app/",
      link:"https://gyno3.vercel.app/",
      used: true
    },
    {
      icon: Database,
      title: "MediVault",
      description: "Your health records",
      progress: 90,
      lastUsed: "1 day ago",
      color: "from-purple-400 to-violet-500",
      link: "https://medi-safe-journal-vault.vercel.app/",
      used: true
    },
    {
      icon: FileText,
      title: "HealthYojana",
      description: "Government schemes",
      progress: 0,
      lastUsed: "Never used",
      color: "from-amber-400 to-orange-500",
      link: "http://health-yojana.vercel.app/",
      used: false
    },
    {
      icon: Building2,
      title: "NGOHeal",
      description: "NGO support network",
      progress: 0,
      lastUsed: "Never used",
      color: "from-teal-400 to-cyan-500",
      link: "https://ngo-heal.vercel.app/",
      used: false
    },
    {
      icon: MessageCircle,
      title: "CareCircle",
      description: "Peer support groups",
      progress: 75,
      lastUsed: "3 days ago",
      color: "from-indigo-400 to-purple-500",
      link: "https://carecircle-women-unite.vercel.app/",
      used: true
    },
    {
      icon: Shield,
      title: "VaxAlert",
      description: "Vaccination reminders",
      progress: 0,
      lastUsed: "Never used",
      color: "from-pink-400 to-rose-500",
      link: "https://vaxalert2.vercel.app/",
      used: false
    }
  ];

  const usedFeaturesCount = personalizedFeatures.filter(f => f.used).length;

  const recentActivity = [
    { 
      type: "period",
      message: "Period tracking updated - Next cycle in 5 days",
      time: "2 hours ago",
      icon: Calendar
    },
    {
      type: "consultation", 
      message: "Dr. Sharma consultation completed successfully",
      time: "1 day ago",
      icon: Heart
    },
    {
      type: "community",
      message: "New message in PCOS Support Group",
      time: "2 days ago", 
      icon: Users
    },
    {
      type: "health",
      message: "Health records updated in MediVault",
      time: "3 days ago",
      icon: Database
    },
    {
      type: "help",
      message: "Support request submitted - Account Issues",
      time: "1 week ago",
      icon: HelpCircle,
      status: "Under Review"
    }
  ];

  const healthInsights = [
    {
      title: "Next Period",
      value: "In 5 days",
      trend: "On track",
      positive: true
    },
    {
      title: "Health Score",
      value: "85/100",
      trend: "+5 from last month",
      positive: true
    },
    {
      title: "Years with Saarthi",
      value: "1.2 years",
      trend: "Since March 2023",
      positive: true
    }
  ];

  const handleFeatureClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleHelpClick = () => {
    setIsHelpOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Welcome Section */}
        <div className="bg-gradient-hero text-white">
          <div className="container mx-auto px-4 py-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-white/80">
                Here's your personalized health dashboard for today
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Health Insights */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Health Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthInsights.map((insight, index) => (
                <Card key={index} className="card-elegant p-4">
                  <h3 className="font-medium text-muted-foreground text-sm mb-1">
                    {insight.title}
                  </h3>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {insight.value}
                  </div>
                  <div className={`text-sm ${insight.positive ? 'text-green-600' : 'text-orange-600'}`}>
                    {insight.trend}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Personalized Feature Progress */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Feature Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {personalizedFeatures.map((feature, index) => (
                <Card key={index} className="card-feature p-4 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => handleFeatureClick(feature.link)}>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-center">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 text-center">{feature.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{feature.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${feature.color}`}
                        style={{ width: `${feature.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">Last used: {feature.lastUsed}</p>
                  
                  <Button className="btn-feature w-full mt-3 flex items-center gap-2">
                    Open Feature
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Activity & Help Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <Card className="card-elegant p-4">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          {activity.status && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Help & Support */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Need Help?</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleHelpClick}
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Get Support
                </Button>
              </div>
              <Card className="card-elegant p-4">
                <div className="space-y-4">
                  <div className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium">Quick Help</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Need assistance with any feature? Our support team is here 24/7
                    </p>
                    <Button size="sm" className="btn-feature" onClick={handleHelpClick}>
                      Contact Support
                    </Button>
                  </div>
                  
                  <div className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium">Community Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with other women in our supportive community
                    </p>
                    <Button size="sm" className="btn-feature" onClick={() => handleFeatureClick("https://carecircle-women-unite.vercel.app/")}>
                      Join Community
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Dashboard;
