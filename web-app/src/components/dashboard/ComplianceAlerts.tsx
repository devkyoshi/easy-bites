
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AlertItem {
  id: string;
  type: 'MOT' | 'Insurance' | 'Service' | 'CPC' | 'License';
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  daysRemaining: number;
  entity: {
    type: 'vehicle' | 'driver';
    id: string;
    name: string;
  };
  status?: 'pending' | 'in-progress' | 'completed';
}

const alerts: AlertItem[] = [
  {
    id: 'alert1',
    type: 'MOT',
    severity: 'high',
    title: 'MOT Expiring Soon',
    detail: 'Vehicle MOT certificate will expire in 7 days',
    daysRemaining: 7,
    entity: {
      type: 'vehicle',
      id: 'VEH001',
      name: 'Ford Transit (KN67 ZXC)',
    },
    status: 'pending',
  },
  {
    id: 'alert2',
    type: 'Insurance',
    severity: 'medium',
    title: 'Insurance Renewal',
    detail: 'Vehicle insurance policy requires renewal',
    daysRemaining: 14,
    entity: {
      type: 'vehicle',
      id: 'VEH008',
      name: 'Mercedes Sprinter (BN21 WER)',
    },
    status: 'in-progress',
  },
  {
    id: 'alert3',
    type: 'CPC',
    severity: 'high',
    title: 'CPC Hours Required',
    detail: 'Driver needs to complete 7 hours of CPC training',
    daysRemaining: 5,
    entity: {
      type: 'driver',
      id: 'DRV003',
      name: 'Michael Johnson',
    },
    status: 'pending',
  },
  {
    id: 'alert4',
    type: 'License',
    severity: 'medium',
    title: 'License Check Required',
    detail: 'Quarterly DVLA license check due',
    daysRemaining: 10,
    entity: {
      type: 'driver',
      id: 'DRV012',
      name: 'Sarah Williams',
    },
    status: 'in-progress',
  },
  {
    id: 'alert5',
    type: 'Service',
    severity: 'low',
    title: 'Service Interval',
    detail: 'Regular service interval approaching',
    daysRemaining: 21,
    entity: {
      type: 'vehicle',
      id: 'VEH015',
      name: 'Iveco Daily (LK19 TRE)',
    },
    status: 'completed',
  },
];

function getSeverityColor(severity: AlertItem['severity']) {
  switch (severity) {
    case 'high':
      return 'bg-danger-50 text-danger-700 border-danger-200';
    case 'medium':
      return 'bg-warning-50 text-warning-700 border-warning-200';
    case 'low':
      return 'bg-accent-50 text-accent-700 border-accent-200';
  }
}

function getAlertIcon(type: AlertItem['type']) {
  switch (type) {
    case 'MOT':
    case 'Service':
      return <FileText className="h-4 w-4" />;
    case 'Insurance':
      return <AlertCircle className="h-4 w-4" />;
    case 'CPC':
    case 'License':
      return <Calendar className="h-4 w-4" />;
  }
}

function getStatusBadge(status?: AlertItem['status']) {
  if (!status) return null;
  
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="border-warning-200 text-warning-700 bg-warning-50">Pending</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="border-accent-200 text-accent-700 bg-accent-50">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="border-success-200 text-success-700 bg-success-50">Completed</Badge>;
  }
}

export function ComplianceAlerts() {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [alertsData, setAlertsData] = useState<AlertItem[]>(alerts);

  const handleAction = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setIsActionDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: AlertItem['status']) => {
    if (!selectedAlert) return;
    
    setAlertsData(prev => 
      prev.map(alert => 
        alert.id === selectedAlert.id ? { ...alert, status: newStatus } : alert
      )
    );
    
    setIsActionDialogOpen(false);
    toast({
      title: "Status updated",
      description: `Alert for ${selectedAlert.entity.name} marked as ${newStatus}`,
    });
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dashboard-title">Compliance Alerts</h3>
        <Link to={selectedAlert?.entity.type === 'vehicle' ? '/vehicle-compliance' : '/driver-compliance'}>
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
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
                    {alert.entity.type === 'vehicle' ? 'Vehicle: ' : 'Driver: '}
                    <span className="font-medium">{alert.entity.name}</span>
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
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {alert.daysRemaining} days
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 mt-2 text-xs hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  onClick={() => handleAction(alert)}
                >
                  <span>Action</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
            <DialogDescription>
              {selectedAlert?.entity.type === 'vehicle' ? 'Vehicle: ' : 'Driver: '} 
              {selectedAlert?.entity.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm mb-4">{selectedAlert?.detail}</p>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-warning-500" />
              <span className="text-sm font-medium">
                {selectedAlert?.daysRemaining} days remaining
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Status</h4>
              <div>
                {getStatusBadge(selectedAlert?.status)}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-warning-300 text-warning-700 hover:bg-warning-50"
                onClick={() => handleUpdateStatus('pending')}
              >
                Mark as Pending
              </Button>
              <Button 
                variant="outline"
                className="border-accent-300 text-accent-700 hover:bg-accent-50"
                onClick={() => handleUpdateStatus('in-progress')}
              >
                Mark In Progress
              </Button>
              <Button 
                className="bg-success-500 hover:bg-success-600 text-white"
                onClick={() => handleUpdateStatus('completed')}
              >
                Mark as Completed
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
