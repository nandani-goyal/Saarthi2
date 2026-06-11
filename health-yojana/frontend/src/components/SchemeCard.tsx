
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, DollarSign, Heart, Home } from 'lucide-react';

interface SchemeCardProps {
  title: string;
  description: string;
  benefits: string[];
  eligibilityMatch: number;
  category: 'health' | 'nutrition' | 'income' | 'welfare';
  onViewDetails: () => void;
}

const categoryIcons = {
  health: Heart,
  nutrition: Home,
  income: DollarSign,
  welfare: CheckCircle
};

const categoryColors = {
  health: 'bg-red-50 text-red-700 border-red-200',
  nutrition: 'bg-green-50 text-green-700 border-green-200',
  income: 'bg-blue-50 text-blue-700 border-blue-200',
  welfare: 'bg-purple-50 text-purple-700 border-purple-200'
};

const SchemeCard: React.FC<SchemeCardProps> = ({
  title,
  description,
  benefits,
  eligibilityMatch,
  category,
  onViewDetails
}) => {
  const IconComponent = categoryIcons[category];
  
  return (
    <div className="scheme-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${categoryColors[category]}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            <Badge variant="outline" className="mt-1">
              {eligibilityMatch}% Match
            </Badge>
          </div>
        </div>
      </div>
      
      {/* <p className="text-muted-foreground mb-4">{description}</p> */}
      
      <div className="space-y-2 mb-4">
        {benefits.slice(0, 3).map((benefit, index) => (
          <div key={index} className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-sm">{benefit}</span>
          </div>
        ))}
      </div>
      
      <Button onClick={onViewDetails} className="w-full group">
        View Details & Apply
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default SchemeCard;
