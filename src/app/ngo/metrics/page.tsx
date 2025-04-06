import React from 'react';
import ImpactMetrics from '@/components/shared/ImpactMetrics';

export const metadata = {
  title: 'NGO Impact Metrics Dashboard | Uyir Mei',
  description: 'Comprehensive impact metrics dashboard for NGOs on the Uyir Mei platform',
};

export default function MetricsPage() {
  return (
    <div className="container mx-auto py-8">
      <ImpactMetrics />
    </div>
  );
} 