import React from 'react';
import { CertificationBadgeCollection } from '@/components/shared/CertificationBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Medal, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'NGO Achievements & Certifications | Uyir Mei',
  description: 'Recognition and certification platform for NGOs on Uyir Mei',
};

export default function AchievementsPage() {
  // Sample badges for demonstration
  const orgBadges = [
    {
      type: 'transparency' as const,
      level: 'platinum' as const,
      verifiedDate: 'July 12, 2023',
      issuer: 'Uyir Mei Verification Team',
    },
    {
      type: 'impact' as const,
      level: 'gold' as const,
      verifiedDate: 'August 24, 2023',
      issuer: 'Impact Assessment Panel',
    },
    {
      type: 'excellence' as const,
      level: 'gold' as const,
      verifiedDate: 'June 18, 2023',
      issuer: 'Beneficiary Review Board',
    },
    {
      type: 'community' as const,
      level: 'silver' as const,
      verifiedDate: 'September 3, 2023',
      issuer: 'Community Voting Panel',
    },
    {
      type: 'volunteer' as const,
      level: 'gold' as const,
      verifiedDate: 'October 15, 2023',
      issuer: 'Volunteer Management Association',
    }
  ];
  
  // Criteria for earning badges
  const badgeCriteria = [
    {
      badge: 'Transparency',
      criteria: [
        'Regular financial reporting with detailed expenditure breakdowns',
        'Public disclosure of funding sources and allocation',
        'Independent audit reports available for verification',
        'Clear governance structures and decision-making processes',
      ]
    },
    {
      badge: 'Impact',
      criteria: [
        'Demonstrated measurable outcomes for beneficiaries',
        'Clear impact metrics that show progress over time',
        'Third-party verification of claimed impact',
        'Beneficiary testimonials and success stories',
      ]
    },
    {
      badge: 'Excellence',
      criteria: [
        'Consistent high ratings from beneficiaries',
        'Low complaint rates and high resolution rates',
        'Innovative service delivery methods',
        'Professional standards in all interactions',
      ]
    },
    {
      badge: 'Community',
      criteria: [
        'Recognized by community through voting',
        'High engagement with local communities',
        'Addressing community-identified needs',
        'Positive media coverage and community feedback',
      ]
    },
    {
      badge: 'Volunteer Management',
      criteria: [
        'Structured volunteer onboarding and training',
        'High volunteer retention and satisfaction',
        'Clear roles and responsibilities for volunteers',
        'Recognition and growth opportunities for volunteers',
      ]
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements & Recognition</h1>
        <p className="text-gray-600">
          Showcasing excellence and impact through verified certifications and badges.
        </p>
      </div>

      <Tabs defaultValue="badges">
        <TabsList className="mb-6">
          <TabsTrigger value="badges">Your Badges</TabsTrigger>
          <TabsTrigger value="criteria">Earning Criteria</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <CertificationBadgeCollection 
            badges={orgBadges}
            title="Your Organization's Achievements"
            description="These badges represent your organization's verified achievements and certifications on the Uyir Mei platform."
          />
          
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                  Available Achievements
                </CardTitle>
                <CardDescription>
                  Additional badges your organization can work towards earning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="bg-indigo-50 pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-4 w-4 text-indigo-600 mr-1" />
                        Innovation Leader
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="text-sm text-gray-600">
                        Awarded to organizations implementing innovative approaches to social challenges.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-emerald-50 pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-4 w-4 text-emerald-600 mr-1" />
                        Environmental Champion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="text-sm text-gray-600">
                        Recognizes organizations with exceptional environmental sustainability practices.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-cyan-50 pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-4 w-4 text-cyan-600 mr-1" />
                        Digital Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="text-sm text-gray-600">
                        Celebrates organizations effectively using technology for social impact.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="criteria">
          <Card>
            <CardHeader>
              <CardTitle>Badge Earning Criteria</CardTitle>
              <CardDescription>
                What it takes to earn each certification badge on the Uyir Mei platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {badgeCriteria.map((item, index) => (
                  <div key={index} className="border-b pb-5 last:border-b-0 last:pb-0">
                    <h3 className="font-medium text-lg mb-3 flex items-center">
                      <Medal className="h-5 w-5 text-amber-500 mr-2" />
                      {item.badge} Badge Criteria
                    </h3>
                    <ul className="space-y-2">
                      {item.criteria.map((criterion, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Certification</CardTitle>
              <CardDescription>
                How earning badges and certifications helps your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Enhanced Visibility</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Featured placement in search results</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Badges displayed prominently on your profile</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Inclusion in the "Excellence Showcase" section</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Featured in Uyir Mei's social media highlights</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Donor Confidence</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Verified status increases trust with donors</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Higher conversion rates on donation campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Ability to showcase badges in fundraising materials</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Access to exclusive donor matching opportunities</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Collaboration Opportunities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Priority access to partnership programs</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Invitation to exclusive NGO collaboration events</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Inclusion in multi-organization grant proposals</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Access to shared resources and knowledge networks</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Growth & Development</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Detailed feedback on improvement areas</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Access to specialized training programs</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Mentorship from established certified organizations</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">Clear pathway to higher certification levels</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 