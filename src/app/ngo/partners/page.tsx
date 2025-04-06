import React from 'react';
import PartnerFinder from '@/components/ngo/PartnerFinder';

export const metadata = {
  title: 'NGO Partner Finder | Uyir Mei',
  description: 'Find and connect with NGO partners for collaboration, joint projects, and resource sharing',
};

export default function PartnersPage() {
  return (
    <div className="container mx-auto py-8">
      <PartnerFinder />
    </div>
  );
} 