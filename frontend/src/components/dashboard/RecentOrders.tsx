
import { ArrowRightCircle, Calendar, Clock, MapPin, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ViewOrderDetails } from '@/components/orders/ViewOrderDetails';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  reference: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed';
  customerName: string;
  fromAddress: string;
  toAddress: string;
  createdAt: string;
  scheduledFor: string;
  packageInfo: {
    count: number;
    weight: string;
  };
}

const orders: OrderItem[] = [
  {
    id: 'order1',
    reference: 'SF-20230001',
    status: 'pending',
    customerName: 'Acme Supplies Ltd',
    fromAddress: 'Unit 5, Industrial Estate, Manchester, M17 1WN',
    toAddress: '24 High Street, Birmingham, B1 1LS',
    createdAt: '2023-06-10T09:30:00',
    scheduledFor: '2023-06-12',
    packageInfo: {
      count: 3,
      weight: '45kg',
    },
  },
  {
    id: 'order2',
    reference: 'SF-20230002',
    status: 'assigned',
    customerName: 'Tech Solutions UK',
    fromAddress: '8 Business Park, Leeds, LS11 5BZ',
    toAddress: '120 Victoria Road, Glasgow, G42 8YU',
    createdAt: '2023-06-09T14:15:00',
    scheduledFor: '2023-06-11',
    packageInfo: {
      count: 1,
      weight: '12kg',
    },
  },
  {
    id: 'order3',
    reference: 'SF-20230003',
    status: 'in-transit',
    customerName: 'Northern Healthcare',
    fromAddress: '45 Science Avenue, Cambridge, CB4 0PA',
    toAddress: '78 Hospital Road, Newcastle, NE1 4LP',
    createdAt: '2023-06-09T08:22:00',
    scheduledFor: '2023-06-10',
    packageInfo: {
      count: 5,
      weight: '30kg',
    },
  },
  {
    id: 'order4',
    reference: 'SF-20230004',
    status: 'delivered',
    customerName: 'Green Planet Foods',
    fromAddress: 'Distribution Centre, Bristol, BS1 6TL',
    toAddress: '14 Retail Park, Exeter, EX2 7HY',
    createdAt: '2023-06-08T10:45:00',
    scheduledFor: '2023-06-09',
    packageInfo: {
      count: 8,
      weight: '120kg',
    },
  },
  {
    id: 'order5',
    reference: 'SF-20230005',
    status: 'failed',
    customerName: 'City Office Supplies',
    fromAddress: '90 Commercial Street, London, E1 6LT',
    toAddress: '23 Market Square, Reading, RG1 2LQ',
    createdAt: '2023-06-08T09:10:00',
    scheduledFor: '2023-06-09',
    packageInfo: {
      count: 2,
      weight: '18kg',
    },
  },
];

function getStatusBadge(status: OrderItem['status']) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="border-warning-200 text-warning-700 bg-warning-50 hover:bg-warning-100 transition-colors">Pending</Badge>;
    case 'assigned':
      return <Badge variant="outline" className="border-success-200 text-success-700 bg-success-50 hover:bg-success-100 transition-colors">Assigned</Badge>;
    case 'in-transit':
      return <Badge variant="outline" className="border-accent-200 text-accent-700 bg-accent-50 hover:bg-accent-100 transition-colors">In Transit</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="border-success-200 text-success-700 bg-success-50 hover:bg-success-100 transition-colors">Delivered</Badge>;
    case 'failed':
      return <Badge variant="outline" className="border-danger-200 text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors">Failed</Badge>;
  }
}

export function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleViewDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dashboard-title">Recent Orders</h3>
        <Link to="/orders">
          <Button variant="outline" size="sm" className="text-xs">
            View All Orders
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Reference
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Customer
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Route
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Schedule
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-navy-700">
                    {order.reference}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {order.customerName}
                  </td>
                  <td className="py-3">
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-400" />
                      <div className="truncate max-w-[200px]">
                        <div className="truncate">{order.fromAddress}</div>
                        <div className="truncate mt-1">{order.toAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(order.scheduledFor).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Package className="h-3 w-3 mr-1" />
                        <span>
                          {order.packageInfo.count} items ({order.packageInfo.weight})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{getStatusBadge(order.status)}</td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      onClick={() => handleViewDetails(order)}
                    >
                      <span>Details</span>
                      <ArrowRightCircle className="ml-1 h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <ViewOrderDetails 
              orderData={{
                consignmentNo: selectedOrder.reference,
                consignorName: selectedOrder.customerName,
                consignorStreet: selectedOrder.fromAddress.split(',')[0],
                consignorCity: selectedOrder.fromAddress.split(',')[1]?.trim() || '',
                consignorPostcode: selectedOrder.fromAddress.split(',')[2]?.trim() || '',
                consignorCountry: "UK",
                consigneeName: "Recipient",
                consigneeStreet: selectedOrder.toAddress.split(',')[0],
                consigneeCity: selectedOrder.toAddress.split(',')[1]?.trim() || '',
                consigneePostcode: selectedOrder.toAddress.split(',')[2]?.trim() || '',
                consigneeCountry: "UK",
                completionStatus: selectedOrder.status,
                priority: "standard",
                paymentStatus: "unpaid",
                serviceLevel: "nextDay",
                pieces: selectedOrder.packageInfo.count,
                weight: parseFloat(selectedOrder.packageInfo.weight.replace('kg', ''))
              }}
              onEdit={() => {
                setIsDetailsDialogOpen(false);
                // In a real app, this would navigate to edit page
                window.location.href = `/orders/edit/${selectedOrder.id}`;
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
