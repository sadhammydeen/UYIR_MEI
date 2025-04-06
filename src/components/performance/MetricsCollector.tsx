"use client";

import React from 'react';

interface MetricsCollectorProps {
  children?: React.ReactNode;
}

// Simple version of the MetricsCollector component
export default function MetricsCollector({ children }: MetricsCollectorProps) {
  return <>{children}</>;
}

// Add global gtag definition for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 