
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, FileSpreadsheet, UserPlus, FileText } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ViewOrderDetails } from '@/components/orders/ViewOrderDetails';
import { useToast } from '@/hooks/use-toast';
import { AddDriverModal } from '@/components/drivers/AddDriverModal';
import { DriverAssignment } from '@/components/orders/DriverAssignment';

const ordersData = [
  {
    id: 'SF56823',
    customer: 'Acme Ltd',
    collectionAddress: '123 Collection St, London, EC1',
    deliveryAddress: '456 Delivery Rd, Manchester, M1',
    requestedDate: '2023-11-20',
    status: 'Pending',
    driver: 'Unassigned',
    priority: 'Standard',
    manifestId: 'MF400'
  },
  {
    id: 'SF56824',
    customer: 'TechCorp',
    collectionAddress: '78 Tech Lane, Birmingham, B1',
    deliveryAddress: '90 Business Park, Leeds, LS1',
    requestedDate: '2023-11-20',
    status: 'Assigned',
    driver: 'John Smith',
    priority: 'Express',
    manifestId: 'MF400'
  },
  {
    id: 'SF56825',
    customer: 'Global Solutions',
    collectionAddress: '45 Warehouse Rd, Glasgow, G1',
    deliveryAddress: '67 Office Block, Edinburgh, EH1',
    requestedDate: '2023-11-21',
    status: 'In Transit',
    driver: 'Sarah Johnson',
    priority: 'Standard',
    manifestId: 'MF400'
  },
  {
    id: 'SF56826',
    customer: 'UK Retail Ltd',
    collectionAddress: '12 Store St, Bristol, BS1',
    deliveryAddress: '34 Mall Rd, Cardiff, CF1',
    requestedDate: '2023-11-21',
    status: 'Delivered',
    driver: 'Mike Davies',
    priority: 'Standard',
    manifestId: 'MF400'
  },
  {
    id: 'SF56827',
    customer: 'Pharma Direct',
    collectionAddress: '56 Medical Way, Sheffield, S1',
    deliveryAddress: '89 Hospital Rd, Newcastle, NE1',
    requestedDate: '2023-11-22',
    status: 'Problem',
    driver: 'Emma Wilson',
    priority: 'Critical',
    manifestId: 'MF399'
  },
  {
    id: '005901729141',
    customer: 'UPR COURIER SERVICE',
    collectionAddress: '5A, GALPOTTA STREET, COLOMBO, Sri Lanka',
    deliveryAddress: '111 CO ORMERSWELLS, LANDSOUTHALL, UB1 2XL, UK',
    requestedDate: '2023-02-22',
    status: 'Assigned',
    driver: 'John Smith',
    priority: 'Express',
    manifestId: 'MF400'
  }
];

export default function OrderManagement() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState<any>(null);
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  const handleEditOrder = (orderId: string) => {
    toast({
      title: "Navigating to edit order",
      description: `Redirecting to edit order ${orderId}`
    });
    // In a real app, this would use a proper router navigation
    window.location.href = `/orders/edit/${orderId}`;
  };

  const handleAssignDriver = (order: any) => {
    setOrderToAssign(order);
    setIsAssignDriverModalOpen(true);
  };

  const handleDriverAssigned = (driverId: string) => {
    // In a real app, this would update the order with the assigned driver
    toast({
      title: "Driver assigned",
      description: `Driver has been assigned to order ${orderToAssign?.id}`
    });
    setIsAssignDriverModalOpen(false);
  };

  // Helper function to get consistent badge styling across the app
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success-500 hover:bg-success-600 transition-colors';
      case 'in transit':
      case 'in-transit':
        return 'bg-accent-500 hover:bg-accent-600 transition-colors';
      case 'assigned':
        return 'bg-success-400 hover:bg-success-500 transition-colors';
      case 'pending':
        return 'bg-warning-500 hover:bg-warning-600 transition-colors';
      case 'problem':
      case 'failed':
      case 'cancelled':
        return 'bg-danger-500 hover:bg-danger-600 transition-colors';
      default:
        return 'bg-gray-500 hover:bg-gray-600 transition-colors';
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Order Management"
        subtitle="Track and manage delivery orders across your fleet"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddDriverModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
            <Link to="/manifests">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Manifest Management
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Orders
            </Button>
            <Link to="/orders/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </Link>
          </>
        }
      />

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-title">Order List</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search orders..." className="pl-8 h-9 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>From / To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Manifest</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <div className="text-xs max-w-xs">
                    <div>From: {order.collectionAddress}</div>
                    <div className="mt-1">To: {order.deliveryAddress}</div>
                  </div>
                </TableCell>
                <TableCell>{new Date(order.requestedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    className={getStatusBadgeClass(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.driver === 'Unassigned' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs hover:bg-accent-100 hover:text-accent-700 hover:border-accent-300 transition-colors"
                      onClick={() => handleAssignDriver(order)}
                    >
                      Assign Driver
                    </Button>
                  ) : (
                    order.driver
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={
                      order.priority === 'Standard' ? 'border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors' : 
                      order.priority === 'Express' ? 'border-warning-500 text-warning-700 hover:bg-warning-50 transition-colors' : 
                      'border-danger-500 text-danger-700 hover:bg-danger-50 transition-colors'
                    }
                  >
                    {order.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link to="/manifests">
                    <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer transition-colors">
                      {order.manifestId}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewOrder(order)}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditOrder(order.id)}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <ViewOrderDetails 
              orderData={{
                consignmentNo: selectedOrder.id,
                consignorName: selectedOrder.customer,
                consignorStreet: selectedOrder.collectionAddress.split(',')[0],
                consignorCity: selectedOrder.collectionAddress.split(',')[1]?.trim(),
                consignorPostcode: selectedOrder.collectionAddress.split(',')[2]?.trim(),
                consignorCountry: "UK",
                consigneeName: "Recipient",
                consigneeStreet: selectedOrder.deliveryAddress.split(',')[0],
                consigneeCity: selectedOrder.deliveryAddress.split(',')[1]?.trim(),
                consigneePostcode: selectedOrder.deliveryAddress.split(',')[2]?.trim(),
                consigneeCountry: "UK",
                completionStatus: selectedOrder.status.toLowerCase(),
                priority: selectedOrder.priority,
                paymentStatus: "unpaid",
                serviceLevel: selectedOrder.priority === "Express" ? "sameDay" : 
                              selectedOrder.priority === "Critical" ? "sameDay" : 
                              "nextDay"
              }} 
              onEdit={() => {
                setViewDialogOpen(false);
                handleEditOrder(selectedOrder.id);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Driver Modal */}
      <Dialog open={isAssignDriverModalOpen} onOpenChange={setIsAssignDriverModalOpen}>
        <DialogContent className="max-w-3xl">
          {orderToAssign && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Assign Driver to Order {orderToAssign.id}</h2>
              <p className="text-muted-foreground">
                Assigning a driver to deliver {orderToAssign.customer}'s order.
              </p>
              <DriverAssignment 
                drivers={[
                  { id: "1", name: "John Smith", workload: 8, territory: "North London", specialization: "Heavy Goods" },
                  { id: "2", name: "Sarah Johnson", workload: 5, territory: "South London", specialization: "Express" },
                  { id: "3", name: "Raj Patel", workload: 7, territory: "East London", specialization: "Standard" },
                  { id: "4", name: "Emma Williams", workload: 3, territory: "West London", specialization: "Fragile Items" },
                  { id: "5", name: "Fahad Khan", workload: 6, territory: "Central London", specialization: "Refrigerated" },
                ]}
                onDriverSelect={handleDriverAssigned}
                selectedDriverId={null}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Driver Modal */}
      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)}
      />
    </MainLayout>
  );
}
