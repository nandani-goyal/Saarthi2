
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AutoMatchSummary = () => {
  return (
    <Card className="health-gradient border-0 mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Your Health & Welfare Benefits</CardTitle>
            <p className="text-muted-foreground">We've found schemes that can support your health, income & nutrition</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-muted-foreground">Eligible Schemes</div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-muted-foreground">Applications Pending</div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-muted-foreground">Action Required</div>
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">85%</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete your profile to unlock more personalized scheme recommendations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoMatchSummary;
