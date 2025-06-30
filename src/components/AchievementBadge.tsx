
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Calendar, DollarSign } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description?: string;
    icon: string;
    category?: string;
    badge_color: string;
    requirement_type: string;
    requirement_value: number;
  };
  isNew?: boolean;
}

export const AchievementBadge = ({ achievement, isNew = false }: AchievementBadgeProps) => {
  const [showAnimation, setShowAnimation] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getIcon = () => {
    switch (achievement.requirement_type) {
      case 'days':
        return <Calendar className="w-6 h-6" />;
      case 'money_saved':
        return <DollarSign className="w-6 h-6" />;
      case 'journal_entries':
        return <Target className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'streak':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'wellness':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`p-4 relative overflow-hidden transition-all duration-300 ${
      showAnimation ? 'animate-pulse ring-2 ring-yellow-400 shadow-lg' : ''
    }`}>
      {isNew && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-yellow-500 text-white animate-bounce">
            <Star className="w-3 h-3 mr-1" />
            Novo!
          </Badge>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: achievement.badge_color }}
        >
          {achievement.icon ? (
            <span className="text-2xl">{achievement.icon}</span>
          ) : (
            getIcon()
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
          {achievement.description && (
            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          )}
          
          <div className="flex items-center mt-2 space-x-2">
            {achievement.category && (
              <Badge variant="secondary" className={getCategoryColor()}>
                {achievement.category}
              </Badge>
            )}
            <Badge variant="outline">
              {achievement.requirement_value} {achievement.requirement_type === 'days' ? 'dias' : 
               achievement.requirement_type === 'money_saved' ? 'reais' : 'entradas'}
            </Badge>
          </div>
        </div>
      </div>
      
      {showAnimation && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse" />
      )}
    </Card>
  );
};
