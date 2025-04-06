import React from 'react';
import ImpactLeaderboard from '@/components/shared/ImpactLeaderboard';

export const metadata = {
  title: 'NGO Impact Leaderboard | Uyir Mei',
  description: 'Recognizing excellence in service and impact among NGOs on the Uyir Mei platform',
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <ImpactLeaderboard />
    </div>
  );
} 