import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { MapPin, List, Calendar, Truck, ArrowRight, Search, User, Plus, CalendarPlus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RouteMap } from '@/components/orders/RouteMap';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { CreateRouteModal } from '@/components/routes/CreateRouteModal';
import { ScheduleRouteModal } from '@/components/routes/ScheduleRouteModal';
import { useToast } from '@/hooks/use-toast';

export default function RouteManagement() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isCreateRouteModalOpen, setIsCreateRouteModalOpen] = useState(false);
  const [isScheduleRouteModalOpen, setIsScheduleRouteModalOpen] = useState(false);
  const { toast } = useToast();

  const activeRoutes = [
    {
      id: '1',
      driverName: 'John Smith',
      driverId: '1',
      startTime: '08:30',
      estimatedCompletion: '14:45',
      progress: 4,
      totalStops: 12,
      vehicle: 'Ford Transit (LX21 WER)',
      stops: [
        { id: 1, name: 'Office Depot', address: '120 High Street, London', postcode: 'N1 7FG', status: 'completed' },
        { id: 2, name: 'Park Lane Apartments', address: '45 Park Lane, London', postcode: 'N1 8DT', status: 'completed' },
        { id: 3, name: 'City Hospital', address: '67 Medical Way, London', postcode: 'N1 9SB', status: 'completed' },
        { id: 4, name: 'Central Library', address: '18 Knowledge Street, London', postcode: 'N1 5HJ', status: 'in-progress' },
        { id: 5, name: 'Business Center', address: '92 Commerce Road, London', postcode: 'N1 3FD', status: 'pending' },
      ]
    },
    {
      id: '2',
      driverName: 'Sarah Johnson',
      driverId: '2',
      startTime: '09:00',
      estimatedCompletion: '15:30',
      progress: 2,
      totalStops: 10,
      vehicle: 'Mercedes Sprinter (KY21 PLX)',
      stops: [
        { id: 1, name: 'Garden Centre', address: '230 Green Road, London', postcode: 'E1 4RT', status: 'completed' },
        { id: 2, name: 'Tech Solutions Ltd', address: '78 Innovation Park, London', postcode: 'E1 6YU', status: 'completed' },
        { id: 3, name: 'River View Hotel', address: '92 Thames Road, London', postcode: 'E1 7KL', status: 'pending' },
        { id: 4, name: 'Fashion Boutique', address: '75 Style Avenue, London', postcode: 'E1 9CV', status: 'pending' },
      ]
    },
    {
      id: '3',
      driverName: 'Raj Patel',
      driverId: '3',
      startTime: '08:15',
      estimatedCompletion: '13:45',
      progress: 5,
      totalStops: 8,
      vehicle: 'Vauxhall Vivaro (CG20 TBL)',
      stops: [
        { id: 1, name: 'University Campus', address: '340 Learning Road, London', postcode: 'S1 2QW', status: 'completed' },
        { id: 2, name: 'Sports Complex', address: '56 Athletics Drive, London', postcode: 'S1 3ED', status: 'completed' },
        { id: 3, name: 'Central Library', address: '18 Knowledge Street, London', postcode: 'S1 5HJ', status: 'completed' },
        { id: 4, name: 'Art Gallery', address: '45 Exhibition Lane, London', postcode: 'S1 4PQ', status: 'completed' },
        { id: 5, name: 'Community Center', address: '87 Gathering Place, London', postcode: 'S1 7TY', status: 'completed' },
        { id: 6, name: 'Medical Clinic', address: '120 Health Road, London', postcode: 'S1 9BC', status: 'pending' },
      ]
    },
  ];

  const scheduledRoutes = [
    {
      id: '4',
      driverName: 'Emma Williams',
      driverId: '4',
      scheduledDate: 'Tomorrow',
      scheduledTime: '08:00',
      estimatedCompletion: '14:30',
      totalStops: 9,
      vehicle: 'Nissan NV200 (LE22 XVF)',
      stops: [
        { id: 1, name: 'Fashion Boutique', address: '75 Style Avenue, London', postcode: 'W1 9CV', status: 'scheduled' },
        { id: 2, name: 'Gourmet Restaurant', address: '120 Cuisine Road, London', postcode: 'W1 6BN', status: 'scheduled' },
        { id: 3, name: 'Art Gallery', address: '45 Exhibition Lane, London', postcode: 'W1 4PQ', status: 'scheduled' },
      ]
    }
  ];

  const completedRoutes = [
    {
      id: '5',
      driverName: 'John Smith',
      driverId: '1',
      completedDate: 'Yesterday',
      startTime: '08:30',
      endTime: '14:15',
      totalStops: 10,
      onTimeDeliveries: 9,
      lateDeliveries: 1,
      vehicle: 'Ford Transit (LX21 WER)'
    },
    {
      id: '6',
      driverName: 'Sarah Johnson',
      driverId: '2',
      completedDate: 'Yesterday',
      startTime: '09:00',
      endTime: '15:20',
      totalStops: 12,
      onTimeDeliveries: 12,
      lateDeliveries: 0,
      vehicle: 'Mercedes Sprinter (KY21 PLX)'
    }
  ];

  const handleViewRoute = (route: any) => {
    setSelectedRoute(route);
    setIsRouteModalOpen(true);
  };

  const handleCreateRoute = () => {
    setIsCreateRouteModalOpen(true);
  };

  const handleScheduleRoutes = () => {
    setIsScheduleRouteModalOpen(true);
  };

  const handleRouteCreated = () => {
    setIsCreateRouteModalOpen(false);
    toast({
      title: "Route created",
      description: "New route has been created successfully.",
    });
  };

  const handleRoutesScheduled = () => {
    setIsScheduleRouteModalOpen(false);
    toast({
      title: "Routes scheduled",
      description: "Routes have been scheduled successfully.",
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Route Management"
        subtitle="Monitor, plan, and optimize delivery routes"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search routes..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleScheduleRoutes}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Routes
            </Button>
            <Button size="sm" onClick={handleCreateRoute}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Route
            </Button>
          </>
        }
      />

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Routes</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Routes</TabsTrigger>
          <TabsTrigger value="completed">Completed Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Active Route Summary</h3>
                <div className="space-y-4">
                  {activeRoutes.map((route) => (
                    <div key={route.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Truck className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{route.driverName}</div>
                            <div className="text-sm text-gray-500">{route.vehicle}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500">In Progress</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                        <div>
                          <span className="text-gray-500 block">Started</span>
                          <span>{route.startTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Est. Completion</span>
                          <span>{route.estimatedCompletion}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Progress</span>
                          <span>{route.progress} of {route.totalStops} stops</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(route.progress / route.totalStops) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600" 
                          onClick={() => handleViewRoute(route)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 h-[500px]">
                <h3 className="font-semibold mb-4">Live Route Tracking</h3>
                <div className="h-[90%] bg-slate-50 rounded-md overflow-hidden">
                  <RouteMap automated={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Scheduled Routes</h3>
                <div className="space-y-4">
                  {scheduledRoutes.map((route) => (
                    <div key={route.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Truck className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">{route.driverName}</div>
                            <div className="text-sm text-gray-500">{route.vehicle}</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-500">Scheduled</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                        <div>
                          <span className="text-gray-500 block">Date</span>
                          <span>{route.scheduledDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Start Time</span>
                          <span>{route.scheduledTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Stops</span>
                          <span>{route.totalStops} stops</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-purple-600" 
                          onClick={() => handleViewRoute(route)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 h-[300px]">
                <h3 className="font-semibold mb-4">Weekly Schedule Overview</h3>
                <div className="flex h-[220px] border rounded">
                  <div className="w-16 border-r bg-gray-50">
                    <div className="h-10 border-b flex items-center justify-center text-xs font-medium">Time</div>
                    <div className="h-8 border-b flex items-center justify-center text-xs">8:00</div>
                    <div className="h-8 border-b flex items-center justify-center text-xs">10:00</div>
                    <div className="h-8 border-b flex items-center justify-center text-xs">12:00</div>
                    <div className="h-8 border-b flex items-center justify-center text-xs">14:00</div>
                    <div className="h-8 border-b flex items-center justify-center text-xs">16:00</div>
                    <div className="h-8 flex items-center justify-center text-xs">18:00</div>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                        <div key={day} className="flex-1 min-w-[80px]">
                          <div className="h-10 border-b flex items-center justify-center text-xs font-medium">{day}</div>
                          <div className="h-48 border-r relative">
                            {day === 'Tue' && (
                              <div 
                                className="absolute top-0 left-1 right-1 h-16 bg-purple-100 border border-purple-300 rounded text-xs p-1"
                                style={{ top: '0px' }}
                              >
                                Emma Williams<br />8:00-14:30<br />9 stops
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Completed Routes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On Time</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedRoutes.map((route) => (
                      <tr key={route.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {route.driverName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {route.completedDate}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {route.startTime} - {route.endTime}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {route.vehicle}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {route.totalStops}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            route.onTimeDeliveries === route.totalStops 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {route.onTimeDeliveries}/{route.totalStops}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewRoute(route)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Details Modal */}
      <Dialog open={isRouteModalOpen} onOpenChange={setIsRouteModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Route Details: {selectedRoute?.driverName}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            <div className="h-[400px] bg-slate-50 rounded-md overflow-hidden">
              <RouteMap selectedDriverId={selectedRoute?.driverId} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Driver Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{selectedRoute?.driverName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Vehicle</span>
                      <span className="font-medium">{selectedRoute?.vehicle}</span>
                    </div>
                    {selectedRoute?.startTime && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-gray-500 block">Start Time</span>
                          <span className="font-medium">{selectedRoute?.startTime}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">Completion</span>
                          <span className="font-medium">{selectedRoute?.estimatedCompletion || selectedRoute?.endTime}</span>
                        </div>
                      </div>
                    )}
                    {selectedRoute?.scheduledDate && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-gray-500 block">Scheduled Date</span>
                          <span className="font-medium">{selectedRoute?.scheduledDate}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 block">Scheduled Time</span>
                          <span className="font-medium">{selectedRoute?.scheduledTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Delivery Stops</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedRoute?.stops?.map((stop: any) => (
                      <div key={stop.id} className="flex items-start p-2 bg-gray-50 rounded-md">
                        <div className={`flex-shrink-0 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 ${
                          stop.status === 'completed' ? 'bg-green-500' :
                          stop.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}>
                          {stop.id}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{stop.name}</div>
                          <div className="text-sm text-gray-500">{stop.address}</div>
                          <div className="text-sm font-medium">{stop.postcode}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {stop.status === 'completed' && (
                            <Badge className="bg-green-500">Completed</Badge>
                          )}
                          {stop.status === 'in-progress' && (
                            <Badge className="bg-blue-500">In Progress</Badge>
                          )}
                          {stop.status === 'pending' && (
                            <Badge className="bg-gray-500">Pending</Badge>
                          )}
                          {stop.status === 'scheduled' && (
                            <Badge className="bg-purple-500">Scheduled</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {!selectedRoute?.stops && (
                      <div className="text-center p-4 text-gray-500">
                        No detailed stop information available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            {selectedRoute?.startTime && !selectedRoute?.completedDate && (
              <Button variant="default" className="mr-auto">
                <List className="mr-2 h-4 w-4" />
                View Manifest
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsRouteModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Route Modal */}
      <CreateRouteModal 
        open={isCreateRouteModalOpen} 
        onOpenChange={setIsCreateRouteModalOpen}
        onRouteCreated={handleRouteCreated}
      />

      {/* Schedule Routes Modal */}
      <ScheduleRouteModal
        open={isScheduleRouteModalOpen}
        onOpenChange={setIsScheduleRouteModalOpen}
        onRoutesScheduled={handleRoutesScheduled}
      />
    </MainLayout>
  );
}
