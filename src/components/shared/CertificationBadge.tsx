import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Award, Star, Clock, Info, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/button';

interface CertificationBadgeProps {
  type: 'transparency' | 'impact' | 'excellence' | 'community' | 'innovation' | 'volunteer';
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  verifiedDate?: string;
  issuer?: string;
  description?: string;
  showDetails?: boolean;
}

const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  type,
  level = 'gold',
  verifiedDate = 'June 15, 2023',
  issuer = 'Uyir Mei Platform',
  description,
  showDetails = false,
}) => {
  // Badge configuration based on type
  const badgeConfig: Record<string, { 
    title: string; 
    icon: React.ReactNode; 
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }> = {
    transparency: {
      title: 'Transparency Badge',
      icon: <Shield className="h-7 w-7" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Recognizes organizations with exemplary financial transparency and disclosure practices.',
    },
    impact: {
      title: 'Impact Champion',
      icon: <Award className="h-7 w-7" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Awarded to organizations demonstrating exceptional and measurable social impact.',
    },
    excellence: {
      title: 'Service Excellence',
      icon: <Star className="h-7 w-7" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Highlights organizations with consistent high-quality service delivery and beneficiary satisfaction.',
    },
    community: {
      title: 'Community Choice',
      icon: <Award className="h-7 w-7" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Recognized by the community for making a significant positive difference.',
    },
    innovation: {
      title: 'Innovation Leader',
      icon: <Award className="h-7 w-7" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: 'Celebrates organizations implementing innovative approaches to social challenges.',
    },
    volunteer: {
      title: 'Volunteer Champion',
      icon: <Award className="h-7 w-7" />,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      description: 'Recognizes excellence in volunteer engagement and management.',
    }
  };

  // Level configuration
  const levelConfig: Record<string, { label: string; color: string }> = {
    bronze: { 
      label: 'Bronze', 
      color: 'bg-amber-700'
    },
    silver: { 
      label: 'Silver', 
      color: 'bg-gray-400'
    },
    gold: { 
      label: 'Gold', 
      color: 'bg-amber-500'
    },
    platinum: { 
      label: 'Platinum', 
      color: 'bg-slate-700'
    }
  };

  const config = badgeConfig[type];
  const levelInfo = levelConfig[level];
  const badgeDescription = description || config.description;

  return (
    <div className={`rounded-lg border ${config.borderColor} overflow-hidden`}>
      {showDetails ? (
        <Card>
          <CardHeader className={`${config.bgColor} py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${config.color} mr-3`}>
                  {config.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge className={`${levelInfo.color} text-white`}>
                      {levelInfo.label} Level
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="rounded-full bg-white p-1 w-10 h-10 flex items-center justify-center shadow-sm">
                <Image 
                  src="/img/uyir-mei-icon.png" 
                  alt="Uyir Mei" 
                  width={30} 
                  height={30}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">{badgeDescription}</p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Verified and authenticated</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>Issued on {verifiedDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <Info className="h-4 w-4 text-gray-500 mr-2" />
                <span>Issued by {issuer}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-gray-600 flex items-center"
            >
              View Verification <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className={`flex items-center p-3 ${config.bgColor}`}>
          <div className={`${config.color} mr-3`}>
            {config.icon}
          </div>
          <div>
            <div className="font-medium">{config.title}</div>
            <Badge className={`${levelInfo.color} text-white text-xs mt-1`}>
              {levelInfo.label}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

// Component to display multiple badges
export const CertificationBadgeCollection: React.FC<{
  badges: Array<CertificationBadgeProps>;
  title?: string;
  description?: string;
}> = ({ badges, title = "Achievements & Certifications", description }) => {
  return (
    <div>
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-gray-500 mb-4 text-sm">{description}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <CertificationBadge key={index} {...badge} showDetails />
        ))}
      </div>
    </div>
  );
};

export default CertificationBadge; 