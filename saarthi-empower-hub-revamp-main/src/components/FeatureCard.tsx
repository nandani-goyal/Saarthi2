import { useState } from 'react';
import { ExternalLink, LucideIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
  users: string;
  color: string;
  link: string;
  isLoggedIn?: boolean;
  onAuthRequired?: () => void;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  fullDescription,
  users,
  color,
  link,
  isLoggedIn = false,
  onAuthRequired,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoToFeature = () => {
    if (!isLoggedIn) {
      // User is not authenticated — trigger login modal
      onAuthRequired?.();
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      className="card-feature p-6 text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lock badge for unauthenticated users */}
      {!isLoggedIn && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>
      )}

      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${!isLoggedIn ? 'opacity-80' : ''}`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>

      <p className="text-muted-foreground mb-4">
        {isHovered ? fullDescription : description}
      </p>

      <div className="text-sm text-accent-foreground mb-4 font-medium">{users}</div>

      {isHovered ? (
        <Button
          onClick={handleGoToFeature}
          className={`w-full group-hover:scale-105 transition-transform duration-300 ${
            isLoggedIn
              ? 'btn-feature'
              : 'bg-amber-500 hover:bg-amber-600 text-white border-0'
          }`}
        >
          {isLoggedIn ? (
            <>
              Go to Feature
              <ExternalLink className="ml-2 w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="mr-2 w-4 h-4" />
              Login to Access
            </>
          )}
        </Button>
      ) : (
        <div className="h-10 flex items-center justify-center">
          {isLoggedIn ? (
            <span className="text-sm text-muted-foreground">Hover to learn more</span>
          ) : (
            <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Login required
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default FeatureCard;
