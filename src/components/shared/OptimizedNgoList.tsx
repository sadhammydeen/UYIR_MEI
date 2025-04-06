"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { VirtualizedList } from '@/components/ui/virtualized-list';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { where, orderBy, limit } from 'firebase/firestore';
import { useSidebar } from '@/store';
import Link from 'next/link';
import { Sparkles, MapPin, ExternalLink, Award, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import debounce from 'lodash.debounce';
import Button from '@/components/ui/button';
import NGOService from '@/api/services/ngo.service';

interface NgoProfile {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  address?: {
    city?: string;
    state?: string;
  };
  focusAreas: string[];
  metrics?: {
    beneficiariesHelped?: number;
  };
  rating?: number;
  verificationStatus?: string;
}

interface OptimizedNgoListProps {
  initialLimit?: number;
  showFilters?: boolean;
  className?: string;
}

export function OptimizedNgoList({
  initialLimit = 50,
  showFilters = true,
  className,
}: OptimizedNgoListProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [limitCount, setLimitCount] = useState(initialLimit);
  
  // Get sidebar state to adjust virtualized list width
  const { open: sidebarOpen } = useSidebar();
  
  // Create query constraints based on filters
  const createQueryConstraints = useCallback(() => {
    const constraints: any[] = [
      where('verificationStatus', '==', 'verified'),
      orderBy('name'),
      limit(limitCount),
    ];
    
    if (categoryFilter !== 'all') {
      constraints.push(where('focusAreas', 'array-contains', categoryFilter));
    }
    
    if (regionFilter !== 'all') {
      constraints.push(where('address.state', '==', regionFilter));
    }
    
    return constraints;
  }, [categoryFilter, regionFilter, limitCount]);
  
  // Fetch NGOs using optimized query
  const { data: ngos, isLoading, error, refetch } = useFirestoreQuery<NgoProfile>(
    'ngos',
    createQueryConstraints(),
    {
      // Unique key based on filters
      queryKey: `ngos:${categoryFilter}:${regionFilter}:${limitCount}`,
      // Keep previous data while loading
      keepPreviousData: true,
    }
  );
  
  // Filter ngos by search term on client side
  const filteredNgos = searchTerm
    ? ngos.filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ngos;
  
  // Debounced search handler
  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 300);
  
  // Load more data when reaching end of list
  const handleEndReached = () => {
    setLimitCount(prev => prev + 20);
  };
  
  // Render NGO list item (used by virtualized list)
  const renderNgoItem = useCallback((ngo: NgoProfile, index: number) => {
    return (
      <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <OptimizedImage
              src={ngo.logoUrl || '/images/placeholder.jpg'}
              alt={ngo.name}
              width={80}
              height={80}
              className="rounded-md"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between mb-1">
              <h3 className="font-bold text-lg truncate">{ngo.name}</h3>
              <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ngo.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {ngo.focusAreas.slice(0, 3).map((area, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-blue-50">{area}</Badge>
              ))}
              {ngo.focusAreas.length > 3 && (
                <Badge variant="outline" className="text-xs">+{ngo.focusAreas.length - 3}</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4">
              {ngo.address?.city && (
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {ngo.address.city}, {ngo.address.state}
                </span>
              )}
              
              {ngo.metrics?.beneficiariesHelped && (
                <span className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {ngo.metrics.beneficiariesHelped.toLocaleString()} beneficiaries
                </span>
              )}
              
              {ngo.rating && (
                <span className="flex items-center">
                  <Sparkles size={14} className="mr-1 text-amber-500" />
                  {ngo.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col justify-between items-end">
            <Link
              href={`/ngo/${ngo.id}`}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              View Profile
              <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }, []);
  
  return (
    <div className={className}>
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search NGOs by name or description..."
                className="pl-10"
                onChange={handleSearchChange}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Women Empowerment">Women Empowerment</SelectItem>
                <SelectItem value="Child Welfare">Child Welfare</SelectItem>
                <SelectItem value="Rural Development">Rural Development</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="Telangana">Telangana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {isLoading && filteredNgos.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">Loading NGOs...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          Error loading NGOs. Please try again later.
        </div>
      ) : filteredNgos.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">No NGOs found matching your criteria.</p>
        </div>
      ) : (
        <div className="h-[calc(100vh-220px)]">
          <VirtualizedList
            data={filteredNgos}
            renderItem={renderNgoItem}
            itemHeight={160}
            onEndReached={handleEndReached}
            loadingComponent={<div className="p-4 text-center">Loading more NGOs...</div>}
            isLoading={isLoading && ngos.length > 0}
          />
        </div>
      )}
    </div>
  );
} 