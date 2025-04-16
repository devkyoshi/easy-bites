
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Clock, Package, Truck, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface OrderAlert {
  id: string;
  type: 'delay' | 'exception' | 'priority' | 'pending';
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  timeInfo: string;
  orderNumber: string;
  status?: string;
  location?: {
    address: string;
    postcode: string;
  };
  driver?: {
    id: string;
    name: string;
  };
}

const orderAlerts: OrderAlert[] = [
  {
    id: 'alert1',
    type: 'delay',
    severity: 'high',
    title: 'Delivery Delayed',
    detail: 'Customer reports no delivery for expected package',
    timeInfo: '45 minutes overdue',
    orderNumber: 'ORD-29743',
    status: 'urgent',
    location: {
      address: '24 High Street, Manchester',
      postcode: 'M1 4BT'
    },
    driver: {
      id: 'DRV001',
      name: 'John Smith'
    }
  },
  {
    id: 'alert2',
    type: 'exception',
    severity: 'high',
    title: 'Package Damaged',
    detail: 'Driver reported package damage during transit',
    timeInfo: '15 minutes ago',
    orderNumber: 'ORD-29812',
    status: 'needs-review',
    location: {
      address: '8 Church Lane, Birmingham',
      postcode: 'B5 5TF'
    },
    driver: {
      id: 'DRV003',
      name: 'Mike Davies'
    }
  },
  {
    id: 'alert3',
    type: 'priority',
    severity: 'medium',
    title: 'Priority Order',
    detail: 'VIP customer requires guaranteed delivery today',
    timeInfo: 'Due by 17:00',
    orderNumber: 'ORD-29856',
    status: 'in-progress',
    location: {
      address: '156 Park Road, London',
      postcode: 'NW1 8XL'
    }
  },
  {
    id: 'alert4',
    type: 'pending',
    severity: 'medium',
    title: 'Unassigned Order',
    detail: 'Order needs driver assignment - time-sensitive',
    timeInfo: 'Created 3 hours ago',
    orderNumber: 'ORD-29877',
    status: 'pending',
    location: {
      address: '92 Castle Street, Edinburgh',
      postcode: 'EH2 3BP'
    }
  },
  {
    id: 'alert5',
    type: 'exception',
    severity: 'low',
    title: 'Address Clarification',
    detail: 'Driver unable to locate exact delivery address',
    timeInfo: '30 minutes ago',
    orderNumber: 'ORD-29801',
    status: 'resolved',
    location: {
      address: 'Flat 4, The Meadows, Glasgow',
      postcode: 'G11 5PQ'
    },
    driver: {
      id: 'DRV005',
      name: 'Sarah Johnson'
    }
  },
];

function getSeverityColor(severity: OrderAlert['severity']) {
  switch (severity) {
    case 'high':
      return 'bg-danger-50 text-danger-700 border-danger-200';
    case 'medium':
      return 'bg-warning-50 text-warning-700 border-warning-200';
    case 'low':
      return 'bg-accent-50 text-accent-700 border-accent-200';
  }
}

function getAlertIcon(type: OrderAlert['type']) {
  switch (type) {
    case 'delay':
      return <Clock className="h-4 w-4" />;
    case 'exception':
      return <AlertCircle className="h-4 w-4" />;
    case 'priority':
      return <Package className="h-4 w-4" />;
    case 'pending':
      return <Truck className="h-4 w-4" />;
  }
}

function getStatusBadge(status?: string) {
  if (!status) return null;
  
  switch (status) {
    case 'urgent':
      return <Badge variant="outline" className="border-danger-200 text-danger-700 bg-danger-50">Urgent</Badge>;
    case 'needs-review':
      return <Badge variant="outline" className="border-warning-200 text-warning-700 bg-warning-50">Needs Review</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="border-accent-200 text-accent-700 bg-accent-50">In Progress</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-info-200 text-info-700 bg-info-50">Pending</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="border-success-200 text-success-700 bg-success-50">Resolved</Badge>;
  }
}

export function OrderAlerts() {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<OrderAlert | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertsData, setAlertsData] = useState<OrderAlert[]>(orderAlerts);

  const handleViewDetails = (alert: OrderAlert) => {
    setSelectedAlert(alert);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedAlert) return;
    
    setAlertsData(prev => 
      prev.map(alert => 
        alert.id === selectedAlert.id ? { ...alert, status: newStatus } : alert
      )
    );
    
    setIsDialogOpen(false);
    toast({
      title: "Status updated",
      description: `Order #${selectedAlert.orderNumber} marked as ${newStatus}`,
    });
  };

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dashboard-title">Order Alerts</h3>
        <Link to="/orders">
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className={`px-4 py-3 rounded-md border ${getSeverityColor(
              alert.severity
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div>
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Order #{alert.orderNumber}</span>
                  </p>
                  <p className="text-xs mt-1">{alert.detail}</p>
                  {alert.status && (
                    <div className="mt-2">
                      {getStatusBadge(alert.status)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {alert.timeInfo}
                  </span>
                </div>
                <div className="flex mt-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    onClick={() => handleViewDetails(alert)}
                  >
                    Details
                  </Button>
                  <Link to={`/orders/edit/${alert.orderNumber}`}>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                    >
                      View Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
            <DialogDescription>
              Order #{selectedAlert?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm mb-4">{selectedAlert?.detail}</p>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-warning-500" />
              <span className="text-sm font-medium">
                {selectedAlert?.timeInfo}
              </span>
            </div>
            
            {selectedAlert?.location && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Delivery Location</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div className="text-sm">
                    <p>{selectedAlert.location.address}</p>
                    <p>{selectedAlert.location.postcode}</p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedAlert?.driver && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Assigned Driver</h4>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">{selectedAlert.driver.name}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Status</h4>
              <div>
                {getStatusBadge(selectedAlert?.status)}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Link to={`/orders/edit/${selectedAlert?.orderNumber}`}>
              <Button>
                Go to Order
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
