import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, FileSpreadsheet, Truck, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ManifestImport } from '@/components/manifests/ManifestImport';
import { ManifestDetails } from '@/components/manifests/ManifestDetails';
import { RouteAssignment } from '@/components/manifests/RouteAssignment';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Manifest, Order, Driver, RouteAssignment as RouteAssignmentType } from '@/types/manifest';

// Sample data for demo
import { sampleManifest } from '@/data/sampleManifest';

export default function ManifestManagement() {
  const { toast } = useToast();
  const [manifest, setManifest] = useState<Manifest | null>(sampleManifest);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([
    { id: '1', name: 'John Smith', available: true, maxCapacity: 100, currentLoad: 0, territory: 'North London', vehicle: 'Ford Transit' },
    { id: '2', name: 'Sarah Johnson', available: true, maxCapacity: 80, currentLoad: 0, territory: 'South London', vehicle: 'Mercedes Sprinter' },
    { id: '3', name: 'Raj Patel', available: true, maxCapacity: 120, currentLoad: 0, territory: 'East London', vehicle: 'Vauxhall Vivaro' },
    { id: '4', name: 'Emma Williams', available: true, maxCapacity: 90, currentLoad: 0, territory: 'West London', vehicle: 'Nissan NV200' },
  ]);
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [routeAssignments, setRouteAssignments] = useState<RouteAssignmentType[]>([]);
  const [activeTab, setActiveTab] = useState('manifest');

  const handleImportManifest = (newManifest: Manifest) => {
    setManifest(newManifest);
    setIsImportModalOpen(false);
    toast({
      title: "Manifest Imported",
      description: `Successfully imported manifest #${newManifest.manifestNumber} with ${newManifest.orders.length} orders`,
    });
  };

  const handleToggleOrder = (orderId: string) => {
    if (!manifest) return;
    
    const updatedOrders = manifest.orders.map(order => {
      if (order.consignmentNo === orderId) {
        return { ...order, selected: !order.selected };
      }
      return order;
    });
    
    setManifest({
      ...manifest,
      orders: updatedOrders
    });
    
    setSelectedOrders(updatedOrders.filter(order => order.selected));
  };

  const handleToggleAllOrders = (select: boolean) => {
    if (!manifest) return;
    
    const updatedOrders = manifest.orders.map(order => ({
      ...order,
      selected: select
    }));
    
    setManifest({
      ...manifest,
      orders: updatedOrders
    });
    
    setSelectedOrders(select ? updatedOrders : []);
  };

  const handleToggleDriver = (driverId: string) => {
    const updatedDrivers = availableDrivers.map(driver => {
      if (driver.id === driverId) {
        return { ...driver, selected: !driver.selected };
      }
      return driver;
    });
    
    setAvailableDrivers(updatedDrivers);
    setSelectedDrivers(updatedDrivers.filter(driver => driver.selected));
  };

  const handleToggleAllDrivers = (select: boolean) => {
    const updatedDrivers = availableDrivers.map(driver => ({
      ...driver,
      selected: select
    }));
    
    setAvailableDrivers(updatedDrivers);
    setSelectedDrivers(select ? updatedDrivers : []);
  };

  const createRoutes = () => {
    if (selectedOrders.length === 0 || selectedDrivers.length === 0) {
      toast({
        title: "Cannot Create Routes",
        description: "Please select at least one order and one driver",
        variant: "destructive"
      });
      return;
    }

    // Simple algorithm to distribute orders among drivers based on postcodes
    // In a real app, this would use a more sophisticated routing algorithm
    const assignments: RouteAssignmentType[] = [];
    const driverCount = selectedDrivers.length;
    
    // Group orders by the first part of the postcode
    const ordersByPostcode: { [key: string]: Order[] } = {};
    
    selectedOrders.forEach(order => {
      const postcode = order.consignee.postcode.split(' ')[0];
      if (!ordersByPostcode[postcode]) {
        ordersByPostcode[postcode] = [];
      }
      ordersByPostcode[postcode].push(order);
    });
    
    // Sort postcodes to try and keep nearby areas together
    const sortedPostcodes = Object.keys(ordersByPostcode).sort();
    
    // Distribute postcode groups among drivers
    selectedDrivers.forEach((driver, index) => {
      const driverOrders: Order[] = [];
      
      for (let i = index; i < sortedPostcodes.length; i += driverCount) {
        driverOrders.push(...ordersByPostcode[sortedPostcodes[i]]);
      }
      
      if (driverOrders.length > 0) {
        const totalPieces = driverOrders.reduce((sum, order) => sum + order.pieces, 0);
        const totalWeight = driverOrders.reduce((sum, order) => sum + order.weight, 0);
        
        assignments.push({
          driverId: driver.id,
          driverName: driver.name,
          orders: driverOrders,
          totalPieces,
          totalWeight,
          estimatedDistance: Math.round(Math.random() * 30 + 10), // Mock data
          estimatedTime: `${Math.round(Math.random() * 3 + 1)}h ${Math.round(Math.random() * 59)}m` // Mock data
        });
      }
    });
    
    setRouteAssignments(assignments);
    setIsRouteModalOpen(true);
  };

  const confirmRouteAssignments = () => {
    if (!manifest) return;
    
    // Update the status of assigned orders
    const updatedOrders = manifest.orders.map(order => {
      const assignment = routeAssignments.find(route => 
        route.orders.some(routeOrder => routeOrder.consignmentNo === order.consignmentNo)
      );
      
      if (assignment) {
        return {
          ...order,
          status: 'Assigned',
          assignedDriver: assignment.driverName
        };
      }
      
      return order;
    });
    
    setManifest({
      ...manifest,
      orders: updatedOrders
    });
    
    setIsRouteModalOpen(false);
    setSelectedOrders([]);
    setSelectedDrivers([]);
    
    // Reset selection states
    handleToggleAllOrders(false);
    handleToggleAllDrivers(false);
    
    toast({
      title: "Routes Created",
      description: `Successfully assigned ${selectedOrders.length} orders to ${routeAssignments.length} drivers`,
    });
    
    // Navigate to orders tab to show the assignments
    setActiveTab('orders');
  };

  return (
    <MainLayout>
      <PageHeader
        title="Manifest Management"
        subtitle="Import and manage manifests and create optimized delivery routes"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import Manifest
            </Button>
            <Link to="/orders">
              <Button variant="outline" size="sm">
                <PackageCheck className="mr-2 h-4 w-4" />
                Order Management
              </Button>
            </Link>
            <Button 
              size="sm" 
              onClick={createRoutes}
              disabled={selectedOrders.length === 0 || selectedDrivers.length === 0}
            >
              <Truck className="mr-2 h-4 w-4" />
              Create Routes
            </Button>
          </>
        }
      />

      <Tabs defaultValue="manifest" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="manifest">Manifest Details</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="drivers">Available Drivers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manifest" className="space-y-4">
          {manifest ? (
            <ManifestDetails 
              manifest={manifest} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg">
              <FileSpreadsheet className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Manifest Imported</h3>
              <p className="text-gray-500 mb-4">Import a manifest to start managing orders and creating routes</p>
              <Button onClick={() => setIsImportModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Import Manifest
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          {manifest ? (
            <ManifestOrders 
              orders={manifest.orders}
              onToggleOrder={handleToggleOrder}
              onToggleAll={handleToggleAllOrders}
              selectedCount={selectedOrders.length}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg">
              <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Available</h3>
              <p className="text-gray-500 mb-4">Import a manifest to view and manage orders</p>
              <Button onClick={() => setIsImportModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Import Manifest
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drivers" className="space-y-4">
          <DriverList 
            drivers={availableDrivers}
            onToggleDriver={handleToggleDriver}
            onToggleAll={handleToggleAllDrivers}
            selectedCount={selectedDrivers.length}
          />
        </TabsContent>
      </Tabs>

      {/* Import Manifest Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ManifestImport onImport={handleImportManifest} onCancel={() => setIsImportModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Route Planning Modal */}
      <Dialog open={isRouteModalOpen} onOpenChange={setIsRouteModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <RouteAssignment 
            assignments={routeAssignments}
            onConfirm={confirmRouteAssignments}
            onCancel={() => setIsRouteModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

// Component to display the list of orders from a manifest
const ManifestOrders = ({ 
  orders, 
  onToggleOrder, 
  onToggleAll,
  selectedCount
}: { 
  orders: Order[], 
  onToggleOrder: (id: string) => void,
  onToggleAll: (select: boolean) => void,
  selectedCount: number
}) => {
  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="dashboard-title">Orders in Manifest</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {selectedCount} of {orders.length} selected
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleAll(true)}
            disabled={selectedCount === orders.length}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleAll(false)}
            disabled={selectedCount === 0}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consignment No.
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pieces
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consignee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Postcode
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr 
                key={order.consignmentNo}
                className={order.selected ? "bg-blue-50" : order.status === "Assigned" ? "bg-green-50" : ""}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={!!order.selected} 
                    onChange={() => onToggleOrder(order.consignmentNo)}
                    disabled={order.status === "Assigned"}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.sNo}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.consignmentNo}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.pieces}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.weight}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="text-sm">
                    <div className="font-medium">{order.consignee.name}</div>
                    <div className="text-gray-500">{order.consignee.address.join(', ')}</div>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.consignee.postcode}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500 max-w-[200px] truncate">
                  {order.description}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.value} {order.currency}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "Assigned" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status || "Unassigned"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {order.assignedDriver || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to display the list of available drivers
const DriverList = ({ 
  drivers, 
  onToggleDriver, 
  onToggleAll,
  selectedCount
}: { 
  drivers: Driver[], 
  onToggleDriver: (id: string) => void,
  onToggleAll: (select: boolean) => void,
  selectedCount: number
}) => {
  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="dashboard-title">Available Drivers</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {selectedCount} of {drivers.length} selected
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleAll(true)}
            disabled={selectedCount === drivers.length}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleAll(false)}
            disabled={selectedCount === 0}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Territory
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Capacity
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Load
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id} className={driver.selected ? "bg-blue-50" : ""}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={!!driver.selected} 
                    onChange={() => onToggleDriver(driver.id)}
                    disabled={!driver.available}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {driver.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {driver.territory}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {driver.vehicle}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {driver.maxCapacity} kg
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {driver.currentLoad} kg
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    driver.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {driver.available ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
