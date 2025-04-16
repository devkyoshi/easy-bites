
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChartBar,
  Truck, 
  MapPin, 
  Clock, 
  Calendar,
  Package,
  ArrowDown,
  ArrowUp,
  Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { DriverAssignment } from './DriverAssignment';
import { RouteMap } from './RouteMap';

// Sample data for package allocation
const driverData = [
  { id: "d1", name: "John Smith", workload: 6, territory: "North London", specialization: "Same-day Delivery" },
  { id: "d2", name: "Sarah Johnson", workload: 4, territory: "South London", specialization: "Fragile Items" },
  { id: "d3", name: "Mike Davies", workload: 8, territory: "East London", specialization: "Large Parcels" },
  { id: "d4", name: "Emma Wilson", workload: 3, territory: "West London", specialization: "Express Delivery" },
  { id: "d5", name: "James Brown", workload: 5, territory: "Central London", specialization: "Standard Parcels" }
];

// Sample delivery efficiency data
const efficiencyData = [
  { name: 'John', onTime: 92, costPerMile: 0.58 },
  { name: 'Sarah', onTime: 97, costPerMile: 0.52 },
  { name: 'Mike', onTime: 85, costPerMile: 0.64 },
  { name: 'Emma', onTime: 94, costPerMile: 0.49 },
  { name: 'James', onTime: 89, costPerMile: 0.55 }
];

// Sample restrictions data for areas
const restrictionsData = [
  { id: 1, type: "Congestion Charge", areas: ["Central London"], timeWindow: "7:00-18:00", fee: "£15.00" },
  { id: 2, type: "ULEZ", areas: ["Inner London"], timeWindow: "24 hours", fee: "£12.50" },
  { id: 3, type: "Loading Restriction", areas: ["High Street"], timeWindow: "11:00-16:00", fee: "£0.00" },
  { id: 4, type: "School Zone", areas: ["Various"], timeWindow: "8:00-9:30, 15:00-16:30", fee: "£0.00" }
];

export function PackageAllocation() {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [allocationType, setAllocationType] = useState<string>("manual");
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" onValueChange={setAllocationType}>
        <TabsList className="mb-4">
          <TabsTrigger value="manual">Manual Allocation</TabsTrigger>
          <TabsTrigger value="automatic">Intelligent Distribution</TabsTrigger>
          <TabsTrigger value="analytics">Performance Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DriverAssignment 
              drivers={driverData} 
              onDriverSelect={setSelectedDriverId} 
              selectedDriverId={selectedDriverId} 
            />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">UK Delivery Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-auto max-h-[280px]">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 text-left">Restriction Type</th>
                          <th className="p-2 text-left">Areas</th>
                          <th className="p-2 text-left">Time Period</th>
                          <th className="p-2 text-left">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {restrictionsData.map(restriction => (
                          <tr key={restriction.id} className="border-b border-gray-100">
                            <td className="p-2">{restriction.type}</td>
                            <td className="p-2">{restriction.areas.join(", ")}</td>
                            <td className="p-2">{restriction.timeWindow}</td>
                            <td className="p-2">{restriction.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-accent-500" />
                      Today's Delivery Conditions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Traffic</Badge>
                        <span className="text-amber-500 font-medium">Moderate</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Weather</Badge>
                        <span className="text-green-500 font-medium">Good</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Events</Badge>
                        <span className="text-red-500 font-medium">Marathon (East)</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Restrictions</Badge>
                        <span className="text-amber-500 font-medium">ULEZ Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Route Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <RouteMap selectedDriverId={selectedDriverId} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="automatic">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Intelligent Package Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <RouteMap automated={true} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Algorithm Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Optimization Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Clock className="mr-2 h-4 w-4" /> Time
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start bg-accent text-accent-foreground">
                        <Truck className="mr-2 h-4 w-4" /> Fuel
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Package className="mr-2 h-4 w-4" /> Load
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 p-3 rounded-md">
                    <h4 className="font-medium mb-2">Distribution Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Packages:</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drivers Required:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Completion Time:</span>
                        <span className="font-medium">5h 20m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Efficiency:</span>
                        <span className="font-medium text-green-500">Optimized</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbon Footprint:</span>
                        <span className="font-medium">128kg CO2</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full">
                      Apply Allocation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Driver Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {driverData.slice(0, 3).map(driver => (
                    <div key={driver.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-accent-50 flex items-center justify-center">
                          <Truck className="h-5 w-5 text-accent-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{driver.name}</h4>
                          <div className="text-sm text-gray-500">{driver.territory}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-sm text-gray-500">Packages</div>
                          <div className="font-medium">{Math.floor(Math.random() * 10) + 5}</div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm text-gray-500">Est. Time</div>
                          <div className="font-medium">{Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m</div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Driver Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    onTime: {
                      label: "On-Time %",
                      theme: {
                        light: "#4f46e5",
                        dark: "#818cf8",
                      },
                    },
                    costPerMile: {
                      label: "Cost Per Mile (£)",
                      theme: {
                        light: "#22c55e",
                        dark: "#4ade80",
                      },
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={efficiencyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent />
                        }
                      />
                      <ChartLegend />
                      <Bar yAxisId="left" dataKey="onTime" name="On-Time %" fill="var(--color-onTime)" />
                      <Bar yAxisId="right" dataKey="costPerMile" name="Cost Per Mile (£)" fill="var(--color-costPerMile)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input 
                      className="pl-10" 
                      placeholder="Search metrics..." 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded bg-blue-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Order Fulfillment Rate</h4>
                            <p className="text-sm text-gray-500">Last 30 days</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">97.4%</div>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>1.2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded bg-green-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">On-Time Delivery</h4>
                            <p className="text-sm text-gray-500">Last 30 days</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">92.1%</div>
                          <div className="flex items-center text-sm text-red-600">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>0.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded bg-amber-100 flex items-center justify-center">
                            <Truck className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Cost Per Delivery</h4>
                            <p className="text-sm text-gray-500">Average this month</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">£4.32</div>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>3.1%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <ChartBar className="mr-2 h-4 w-4" />
                      Full Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
