import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { ChevronUp, ChevronDown, Users, Trophy, Target, Clock, Zap, ArrowUpRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample impact metric data
const metricData = {
  beneficiaries: [
    { month: 'Jan', count: 150 },
    { month: 'Feb', count: 180 },
    { month: 'Mar', count: 210 },
    { month: 'Apr', count: 240 },
    { month: 'May', count: 270 },
    { month: 'Jun', count: 320 },
    { month: 'Jul', count: 380 },
    { month: 'Aug', count: 430 },
    { month: 'Sep', count: 450 },
    { month: 'Oct', count: 490 },
    { month: 'Nov', count: 520 },
    { month: 'Dec', count: 580 },
  ],
  outcomes: [
    { month: 'Jan', successful: 65, partial: 25, unsuccessful: 10 },
    { month: 'Feb', successful: 70, partial: 20, unsuccessful: 10 },
    { month: 'Mar', successful: 75, partial: 15, unsuccessful: 10 },
    { month: 'Apr', successful: 78, partial: 12, unsuccessful: 10 },
    { month: 'May', successful: 80, partial: 12, unsuccessful: 8 },
    { month: 'Jun', successful: 82, partial: 11, unsuccessful: 7 },
    { month: 'Jul', successful: 84, partial: 10, unsuccessful: 6 },
    { month: 'Aug', successful: 85, partial: 10, unsuccessful: 5 },
    { month: 'Sep', successful: 87, partial: 8, unsuccessful: 5 },
    { month: 'Oct', successful: 88, partial: 7, unsuccessful: 5 },
    { month: 'Nov', successful: 89, partial: 7, unsuccessful: 4 },
    { month: 'Dec', successful: 90, partial: 6, unsuccessful: 4 },
  ],
  funding: [
    { month: 'Jan', amount: 15000, utilized: 12000 },
    { month: 'Feb', amount: 17000, utilized: 14000 },
    { month: 'Mar', amount: 18500, utilized: 16000 },
    { month: 'Apr', amount: 19000, utilized: 17000 },
    { month: 'May', amount: 20000, utilized: 18000 },
    { month: 'Jun', amount: 22000, utilized: 20000 },
    { month: 'Jul', amount: 23000, utilized: 21000 },
    { month: 'Aug', amount: 25000, utilized: 23000 },
    { month: 'Sep', amount: 26000, utilized: 24000 },
    { month: 'Oct', amount: 27500, utilized: 25500 },
    { month: 'Nov', amount: 29000, utilized: 27000 },
    { month: 'Dec', amount: 30000, utilized: 28000 },
  ],
  volunteers: [
    { month: 'Jan', active: 12, engaged: 8 },
    { month: 'Feb', active: 14, engaged: 10 },
    { month: 'Mar', active: 15, engaged: 11 },
    { month: 'Apr', active: 16, engaged: 12 },
    { month: 'May', active: 18, engaged: 14 },
    { month: 'Jun', active: 20, engaged: 16 },
    { month: 'Jul', active: 22, engaged: 17 },
    { month: 'Aug', active: 24, engaged: 18 },
    { month: 'Sep', active: 26, engaged: 20 },
    { month: 'Oct', active: 28, engaged: 22 },
    { month: 'Nov', active: 30, engaged: 24 },
    { month: 'Dec', active: 32, engaged: 26 },
  ],
};

// Calculation of key stats
const keyStats = {
  totalBeneficiaries: metricData.beneficiaries.reduce((sum, month) => sum + month.count, 0),
  avgSuccessRate: Math.round(
    metricData.outcomes.reduce((sum, month) => sum + month.successful, 0) / metricData.outcomes.length
  ),
  totalFunding: metricData.funding.reduce((sum, month) => sum + month.amount, 0),
  fundUtilization: Math.round(
    (metricData.funding.reduce((sum, month) => sum + month.utilized, 0) / 
     metricData.funding.reduce((sum, month) => sum + month.amount, 0)) * 100
  ),
  peakVolunteers: Math.max(...metricData.volunteers.map(month => month.active)),
  avgEngagement: Math.round(
    metricData.volunteers.reduce((sum, month) => sum + month.engaged, 0) / metricData.volunteers.length
  ),
  beneficiaryGrowth: Math.round(
    ((metricData.beneficiaries[metricData.beneficiaries.length - 1].count - 
      metricData.beneficiaries[0].count) / metricData.beneficiaries[0].count) * 100
  ),
  successRateGrowth: Math.round(
    metricData.outcomes[metricData.outcomes.length - 1].successful - metricData.outcomes[0].successful
  ),
};

const ImpactMetrics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Impact Metrics Dashboard</h2>
          <p className="text-gray-500 mt-1">Track, measure, and showcase your organization's impact</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Beneficiaries</p>
                <p className="text-2xl font-bold">{keyStats.totalBeneficiaries.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-600">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>{keyStats.beneficiaryGrowth}%</span>
              </div>
              <span className="text-gray-500 ml-2">since first month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{keyStats.avgSuccessRate}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-600">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>+{keyStats.successRateGrowth} points</span>
              </div>
              <span className="text-gray-500 ml-2">since first month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Fund Utilization</p>
                <p className="text-2xl font-bold">{keyStats.fundUtilization}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-600">
                <span>₹{keyStats.totalFunding.toLocaleString()}</span>
              </div>
              <span className="text-gray-500 ml-2">total funds received</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Volunteer Engagement</p>
                <p className="text-2xl font-bold">{keyStats.avgEngagement}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-600">
                <span>{keyStats.peakVolunteers} active</span>
              </div>
              <span className="text-gray-500 ml-2">at peak</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
        </TabsList>

        <Card>
          <TabsContent value="overview" className="mt-0">
            <CardHeader>
              <CardTitle>Impact Overview</CardTitle>
              <CardDescription>Key metrics overview for the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricData.beneficiaries}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Beneficiaries"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Outcome Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricData.outcomes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="successful" name="Successful" fill="#22c55e" stackId="a" />
                          <Bar dataKey="partial" name="Partial" fill="#eab308" stackId="a" />
                          <Bar dataKey="unsuccessful" name="Unsuccessful" fill="#ef4444" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Volunteer Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricData.volunteers}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="active"
                            name="Active"
                            stroke="#8b5cf6"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="engaged"
                            name="Engaged"
                            stroke="#6366f1"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="beneficiaries" className="mt-0">
            <CardHeader>
              <CardTitle>Beneficiaries</CardTitle>
              <CardDescription>Detailed analysis of beneficiaries served</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricData.beneficiaries}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Beneficiaries"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Monthly Average</p>
                    <p className="text-xl font-bold">
                      {Math.round(keyStats.totalBeneficiaries / metricData.beneficiaries.length)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Highest Month</p>
                    <p className="text-xl font-bold">
                      {Math.max(...metricData.beneficiaries.map(m => m.count))}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Growth Rate</p>
                    <p className="text-xl font-bold flex items-center">
                      {keyStats.beneficiaryGrowth}%
                      <ArrowUpRight className="h-4 w-4 ml-1 text-green-600" />
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="outcomes" className="mt-0">
            <CardHeader>
              <CardTitle>Outcomes & Success Rates</CardTitle>
              <CardDescription>Tracking program effectiveness and impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metricData.outcomes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successful" name="Successful" fill="#22c55e" stackId="a" />
                    <Bar dataKey="partial" name="Partial" fill="#eab308" stackId="a" />
                    <Bar dataKey="unsuccessful" name="Unsuccessful" fill="#ef4444" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Average Success Rate</p>
                    <p className="text-xl font-bold">{keyStats.avgSuccessRate}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Partial Outcomes</p>
                    <p className="text-xl font-bold">
                      {Math.round(
                        metricData.outcomes.reduce((sum, month) => sum + month.partial, 0) / metricData.outcomes.length
                      )}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Success Rate Growth</p>
                    <p className="text-xl font-bold flex items-center">
                      +{keyStats.successRateGrowth} points
                      <ArrowUpRight className="h-4 w-4 ml-1 text-green-600" />
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="funding" className="mt-0">
            <CardHeader>
              <CardTitle>Funding & Utilization</CardTitle>
              <CardDescription>Financial resources and utilization analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricData.funding}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Funding Received"
                      stroke="#8b5cf6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="utilized"
                      name="Funds Utilized"
                      stroke="#ec4899"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Funding</p>
                    <p className="text-xl font-bold">₹{keyStats.totalFunding.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Fund Utilization</p>
                    <p className="text-xl font-bold">{keyStats.fundUtilization}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Average Monthly Funding</p>
                    <p className="text-xl font-bold">
                      ₹{Math.round(keyStats.totalFunding / metricData.funding.length).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ImpactMetrics; 