
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RouteMap } from "@/components/orders/RouteMap";
import { RouteAssignment as RouteAssignmentType, Order } from "@/types/manifest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Truck, User, PackageCheck, MapPin } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface RouteAssignmentProps {
  assignments: RouteAssignmentType[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function RouteAssignment({ assignments, onConfirm, onCancel }: RouteAssignmentProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteAssignmentType | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const handleViewRoute = (assignment: RouteAssignmentType) => {
    setSelectedRoute(assignment);
    setIsRouteModalOpen(true);
  };

  // Sample route stops - 3 orders per route
  const sampleRouteStops = {
    '1': [
      { stop: 1, name: 'Office Depot', address: '120 High Street, London', postcode: 'N1 7FG', pieces: 2, weight: 5.2 },
      { stop: 2, name: 'Park Lane Apartments', address: '45 Park Lane, London', postcode: 'N1 8DT', pieces: 1, weight: 3.7 },
      { stop: 3, name: 'City Hospital', address: '67 Medical Way, London', postcode: 'N1 9SB', pieces: 4, weight: 10.3 },
    ],
    '2': [
      { stop: 1, name: 'Garden Centre', address: '230 Green Road, London', postcode: 'E1 4RT', pieces: 3, weight: 8.1 },
      { stop: 2, name: 'Tech Solutions Ltd', address: '78 Innovation Park, London', postcode: 'E1 6YU', pieces: 2, weight: 4.5 },
      { stop: 3, name: 'River View Hotel', address: '92 Thames Road, London', postcode: 'E1 7KL', pieces: 5, weight: 12.8 },
    ],
    '3': [
      { stop: 1, name: 'University Campus', address: '340 Learning Road, London', postcode: 'S1 2QW', pieces: 6, weight: 15.4 },
      { stop: 2, name: 'Sports Complex', address: '56 Athletics Drive, London', postcode: 'S1 3ED', pieces: 2, weight: 7.2 },
      { stop: 3, name: 'Central Library', address: '18 Knowledge Street, London', postcode: 'S1 5HJ', pieces: 1, weight: 2.6 },
    ],
    '4': [
      { stop: 1, name: 'Fashion Boutique', address: '75 Style Avenue, London', postcode: 'W1 9CV', pieces: 4, weight: 9.3 },
      { stop: 2, name: 'Gourmet Restaurant', address: '120 Cuisine Road, London', postcode: 'W1 6BN', pieces: 2, weight: 6.8 },
      { stop: 3, name: 'Art Gallery', address: '45 Exhibition Lane, London', postcode: 'W1 4PQ', pieces: 3, weight: 8.1 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Route Planning</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Assignments
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-4">
            <div className="h-[400px]">
              <RouteMap automated={true} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Route Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Drivers</span>
                <span className="text-sm font-medium">{assignments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Orders</span>
                <span className="text-sm font-medium">
                  {assignments.reduce((sum, assignment) => sum + assignment.orders.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Pieces</span>
                <span className="text-sm font-medium">
                  {assignments.reduce((sum, assignment) => sum + assignment.totalPieces, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Weight</span>
                <span className="text-sm font-medium">
                  {assignments.reduce((sum, assignment) => sum + assignment.totalWeight, 0).toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Est. Total Distance</span>
                <span className="text-sm font-medium">
                  {assignments.reduce((sum, assignment) => sum + assignment.estimatedDistance, 0)} miles
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">
            <Truck className="mr-2 h-4 w-4" />
            Driver Assignments
          </TabsTrigger>
          <TabsTrigger value="orders">
            <PackageCheck className="mr-2 h-4 w-4" />
            Order Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.driverId}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-semibold text-lg">{assignment.driverName}</h3>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 md:ml-7">
                      {assignment.orders.length} orders • {assignment.totalPieces} pieces • {assignment.totalWeight.toFixed(1)} kg
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{assignment.estimatedDistance} miles</div>
                      <div className="text-xs text-gray-500">Estimated {assignment.estimatedTime}</div>
                    </div>
                    <Badge 
                      className="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors" 
                      onClick={() => handleViewRoute(assignment)}
                    >
                      View Route
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {/* Display 3 sample route stops for each assignment */}
                  {sampleRouteStops[assignment.driverId] && 
                    sampleRouteStops[assignment.driverId].map((stop) => (
                      <div key={stop.stop} className="flex items-center p-2 bg-gray-50 rounded-md text-sm">
                        <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                          {stop.stop}
                        </div>
                        <div className="truncate">{stop.postcode} - {stop.name}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consignment No.
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consignee
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Postcode
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.flatMap(assignment => 
                      assignment.orders.map(order => (
                        <tr key={order.consignmentNo}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.consignmentNo}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {order.consignee.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.consignee.postcode}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.weight} kg
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {assignment.driverName}
                          </td>
                        </tr>
                      ))
                    )}
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
            {/* Route Map */}
            <div className="h-[400px] bg-slate-50 rounded-md overflow-hidden">
              <RouteMap selectedDriverId={selectedRoute?.driverId} />
            </div>
            
            {/* Route Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Driver Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{selectedRoute?.driverName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500 block">Orders</span>
                        <span className="font-medium">{selectedRoute?.orders.length}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">Pieces</span>
                        <span className="font-medium">{selectedRoute?.totalPieces}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">Weight</span>
                        <span className="font-medium">{selectedRoute?.totalWeight.toFixed(1)} kg</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">Distance</span>
                        <span className="font-medium">{selectedRoute?.estimatedDistance} miles</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Estimated Time</span>
                      <span className="font-medium">{selectedRoute?.estimatedTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Delivery Stops</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedRoute && sampleRouteStops[selectedRoute.driverId] && 
                      sampleRouteStops[selectedRoute.driverId].map((stop) => (
                        <div key={stop.stop} className="flex items-start p-2 bg-gray-50 rounded-md">
                          <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            {stop.stop}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">{stop.name}</div>
                            <div className="text-sm text-gray-500">{stop.address}</div>
                            <div className="text-sm font-medium">{stop.postcode}</div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-sm font-medium">{stop.pieces} pcs</div>
                            <div className="text-xs text-gray-500">{stop.weight} kg</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRouteModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
