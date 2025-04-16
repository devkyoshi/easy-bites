
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Shield, Search, Trash2, Clock, UserX, Info, Eye, X, AlertTriangle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GdprRecord {
  id: string;
  customerName: string;
  email: string;
  dataType: string;
  retentionPeriod: string;
  collectedDate: string;
  expiryDate: string;
  consentStatus: string;
  processingPurpose: string;
}

const gdprData: GdprRecord[] = [
  {
    id: 'GD001',
    customerName: 'John Smith',
    email: 'john.smith@example.com',
    dataType: 'Personal Data',
    retentionPeriod: '3 years',
    collectedDate: '2022-05-12',
    expiryDate: '2025-05-12',
    consentStatus: 'Active',
    processingPurpose: 'Delivery Services'
  },
  {
    id: 'GD002',
    customerName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    dataType: 'Contact Information',
    retentionPeriod: '2 years',
    collectedDate: '2021-11-20',
    expiryDate: '2023-11-20',
    consentStatus: 'Expired',
    processingPurpose: 'Marketing'
  },
  {
    id: 'GD003',
    customerName: 'Robert Brown',
    email: 'robert.brown@example.com',
    dataType: 'Financial Data',
    retentionPeriod: '5 years',
    collectedDate: '2023-01-05',
    expiryDate: '2028-01-05',
    consentStatus: 'Active',
    processingPurpose: 'Billing'
  },
  {
    id: 'GD004',
    customerName: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    dataType: 'Delivery Address',
    retentionPeriod: '3 years',
    collectedDate: '2022-09-30',
    expiryDate: '2025-09-30',
    consentStatus: 'Active',
    processingPurpose: 'Delivery Services'
  },
  {
    id: 'GD005',
    customerName: 'Michael Davis',
    email: 'michael.davis@example.com',
    dataType: 'Consent Records',
    retentionPeriod: '6 years',
    collectedDate: '2020-03-15',
    expiryDate: '2023-12-01',
    consentStatus: 'Renewal Required',
    processingPurpose: 'All Services'
  },
  {
    id: 'GD006',
    customerName: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    dataType: 'Personal Data',
    retentionPeriod: '3 years',
    collectedDate: '2022-07-10',
    expiryDate: '2025-07-10',
    consentStatus: 'Withdrawn',
    processingPurpose: 'Marketing'
  }
];

export default function GdprManagement() {
  const { toast } = useToast();
  const [records, setRecords] = useState<GdprRecord[]>(gdprData);
  const [filter, setFilter] = useState<string>('All Statuses');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GdprRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  // Consent dialog states
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [deliveryConsent, setDeliveryConsent] = useState<boolean>(false);
  const [billingConsent, setBillingConsent] = useState<boolean>(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);

  // Calculate GDPR statistics
  const totalRecords = records.length;
  const activeConsent = records.filter(r => r.consentStatus === 'Active').length;
  const expiringConsent = records.filter(r => r.consentStatus === 'Renewal Required').length;
  const expiredConsent = records.filter(r => r.consentStatus === 'Expired' || r.consentStatus === 'Withdrawn').length;
  
  const consentCompliance = Math.round((activeConsent / totalRecords) * 100);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredRecords = filter === 'All Statuses' 
    ? records 
    : records.filter(record => record.consentStatus === filter);

  const handleViewRecord = (record: GdprRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (record: GdprRecord) => {
    setSelectedRecord(record);
    setDeleteReason('');
    setConfirmDelete(false);
    setIsDeleteDialogOpen(true);
  };

  const handleConsentClick = (record: GdprRecord) => {
    setSelectedRecord(record);
    // Set initial consent values based on the record
    setMarketingConsent(record.processingPurpose.includes('Marketing'));
    setDeliveryConsent(record.processingPurpose.includes('Delivery'));
    setBillingConsent(record.processingPurpose.includes('Billing'));
    setAnalyticsConsent(record.processingPurpose.includes('Analytics'));
    setIsConsentDialogOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (!selectedRecord || !confirmDelete || !deleteReason.trim()) return;
    
    // Remove the record
    setRecords(records.filter(r => r.id !== selectedRecord.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Data deleted",
      description: `${selectedRecord.customerName}'s data has been scheduled for deletion.`,
    });
  };

  const handleConsentSubmit = () => {
    if (!selectedRecord) return;
    
    // Build new processing purpose string
    const purposes = [];
    if (marketingConsent) purposes.push('Marketing');
    if (deliveryConsent) purposes.push('Delivery Services');
    if (billingConsent) purposes.push('Billing');
    if (analyticsConsent) purposes.push('Analytics');
    
    const newProcessingPurpose = purposes.length > 0 ? purposes.join(', ') : 'None';
    const newStatus = purposes.length > 0 ? 'Active' : 'Withdrawn';
    
    // Update the record
    const updatedRecords = records.map(record => 
      record.id === selectedRecord.id 
        ? {
            ...record,
            processingPurpose: newProcessingPurpose,
            consentStatus: newStatus
          } 
        : record
    );
    
    setRecords(updatedRecords);
    setIsConsentDialogOpen(false);
    
    toast({
      title: "Consent updated",
      description: `${selectedRecord.customerName}'s consent preferences have been updated.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="GDPR Management"
        subtitle="Manage customer data consent and privacy compliance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Generate GDPR Report
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Records
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-5 w-5 text-accent-500" />
              Consent Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{consentCompliance}%</div>
            <div className="text-sm text-gray-500">active consent records</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-warning-500" />
              Expiring Consent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiringConsent}</div>
            <div className="text-sm text-gray-500">require renewal</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserX className="mr-2 h-5 w-5 text-danger-500" />
              Withdrawn/Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiredConsent}</div>
            <div className="text-sm text-gray-500">inactive records</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRecords}</div>
            <div className="text-sm text-gray-500">customer data records</div>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-title">Customer Data Records</h3>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Renewal Required">Renewal Required</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative ml-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search records..." className="pl-8 h-9 w-48" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Collected</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Consent Status</TableHead>
              <TableHead>Processing Purpose</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono text-xs">{record.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{record.customerName}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                  </div>
                </TableCell>
                <TableCell>{record.dataType}</TableCell>
                <TableCell>{new Date(record.collectedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(record.expiryDate).toLocaleDateString()}
                    {new Date(record.expiryDate) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      record.consentStatus === 'Active' ? 'bg-success-500' : 
                      record.consentStatus === 'Renewal Required' ? 'bg-warning-500' : 
                      record.consentStatus === 'Expired' ? 'bg-danger-500' :
                      'bg-slate-500'
                    }
                  >
                    {record.consentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {record.processingPurpose}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleConsentClick(record)}>
                    <Shield className="h-4 w-4 mr-1" />
                    Consent
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger-500" onClick={() => handleDeleteClick(record)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>GDPR Record Details</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedRecord.customerName}</h3>
                  <div className="text-sm text-muted-foreground">{selectedRecord.email}</div>
                </div>
                <Badge 
                  className={
                    selectedRecord.consentStatus === 'Active' ? 'bg-success-500' : 
                    selectedRecord.consentStatus === 'Renewal Required' ? 'bg-warning-500' : 
                    selectedRecord.consentStatus === 'Expired' ? 'bg-danger-500' :
                    'bg-slate-500'
                  }
                >
                  {selectedRecord.consentStatus}
                </Badge>
              </div>
              
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="consent">Consent Information</TabsTrigger>
                  <TabsTrigger value="history">Audit History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Record ID</h4>
                      <p className="font-mono">{selectedRecord.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data Type</h4>
                      <p>{selectedRecord.dataType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Collected Date</h4>
                      <p>{new Date(selectedRecord.collectedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Expiry Date</h4>
                      <p>{new Date(selectedRecord.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Retention Period</h4>
                      <p>{selectedRecord.retentionPeriod}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Processing Purpose</h4>
                      <p>{selectedRecord.processingPurpose}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="consent" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Consent Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium">Marketing Communications</span>
                          <Badge variant={selectedRecord.processingPurpose.includes('Marketing') ? 'default' : 'outline'}>
                            {selectedRecord.processingPurpose.includes('Marketing') ? 'Consented' : 'Not Consented'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium">Delivery Services</span>
                          <Badge variant={selectedRecord.processingPurpose.includes('Delivery') ? 'default' : 'outline'}>
                            {selectedRecord.processingPurpose.includes('Delivery') ? 'Consented' : 'Not Consented'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium">Billing & Payment</span>
                          <Badge variant={selectedRecord.processingPurpose.includes('Billing') ? 'default' : 'outline'}>
                            {selectedRecord.processingPurpose.includes('Billing') ? 'Consented' : 'Not Consented'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Analytics & Improvements</span>
                          <Badge variant={selectedRecord.processingPurpose.includes('Analytics') ? 'default' : 'outline'}>
                            {selectedRecord.processingPurpose.includes('Analytics') ? 'Consented' : 'Not Consented'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p>Last consent update: <span className="font-medium">{new Date(selectedRecord.collectedDate).toLocaleDateString()}</span></p>
                        <p>Consent obtained via: <span className="font-medium">Web Form</span></p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="text-sm text-gray-500 italic text-center py-10">
                    Audit history records will appear here when changes are made to this record.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRecord && (
              <Button 
                variant="default" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleConsentClick(selectedRecord);
                }}
              >
                Manage Consent
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Record Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-danger-600">Delete Data Record</DialogTitle>
            <DialogDescription>
              This will permanently remove the customer's data and generate a deletion certificate.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="bg-danger-50 border border-danger-200 rounded-md p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-danger-500 flex-shrink-0" />
                  <div className="text-sm text-danger-700">
                    <p className="font-medium">Warning</p>
                    <p>This action cannot be undone. All associated data for {selectedRecord.customerName} will be permanently deleted.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deleteReason">Reason for Deletion</Label>
                <Textarea 
                  id="deleteReason" 
                  placeholder="e.g., Customer request, data no longer needed, etc."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="confirmDelete" 
                  checked={confirmDelete}
                  onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
                />
                <Label htmlFor="confirmDelete" className="text-sm text-danger-700">
                  I confirm I want to permanently delete this data record
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSubmit}
              disabled={!confirmDelete || !deleteReason.trim()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consent Management Dialog */}
      <Dialog open={isConsentDialogOpen} onOpenChange={setIsConsentDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Consent Preferences</DialogTitle>
            <DialogDescription>
              Update data processing consents for this customer
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="flex items-center mb-4">
                <h3 className="text-md font-medium">{selectedRecord.customerName}</h3>
                <span className="text-sm text-muted-foreground ml-2">({selectedRecord.email})</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="marketing" 
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                    />
                    <div className="grid gap-1.5">
                      <Label className="font-medium" htmlFor="marketing">Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send promotional offers, newsletters and service updates
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="delivery" 
                      checked={deliveryConsent}
                      onCheckedChange={(checked) => setDeliveryConsent(checked as boolean)}
                    />
                    <div className="grid gap-1.5">
                      <Label className="font-medium" htmlFor="delivery">Delivery Services</Label>
                      <p className="text-sm text-muted-foreground">
                        Process personal data for delivery of goods and services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="billing" 
                      checked={billingConsent}
                      onCheckedChange={(checked) => setBillingConsent(checked as boolean)}
                    />
                    <div className="grid gap-1.5">
                      <Label className="font-medium" htmlFor="billing">Billing & Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Process payment information and store financial records
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="analytics" 
                      checked={analyticsConsent}
                      onCheckedChange={(checked) => setAnalyticsConsent(checked as boolean)}
                    />
                    <div className="grid gap-1.5">
                      <Label className="font-medium" htmlFor="analytics">Analytics & Improvements</Label>
                      <p className="text-sm text-muted-foreground">
                        Use data to improve services and analyze usage patterns
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Consent Verification</p>
                      <p>Ensure you have proper authorization to make these changes. All consent changes are logged for audit purposes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConsentSubmit}>
              <Shield className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
