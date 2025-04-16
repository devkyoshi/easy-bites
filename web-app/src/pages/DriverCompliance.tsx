
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, AlertTriangle, CheckCircle, Clock, Search, Plus, Edit, Calendar, X } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DriverComplianceData {
  id: number;
  name: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  cpcExpiry: string;
  digitalTachoExpiry: string;
  medicalDue: string;
  profileImage?: string;
  status: string;
}

const driversData: DriverComplianceData[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@setsfree.com',
    licenseNumber: 'SMITH91275JD9TK',
    licenseExpiry: '2025-06-15',
    cpcExpiry: '2024-01-30',
    digitalTachoExpiry: '2025-03-12',
    medicalDue: '2024-08-25',
    status: 'Compliant'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@setsfree.com',
    licenseNumber: 'JOHNS98765TS4GH',
    licenseExpiry: '2026-03-22',
    cpcExpiry: '2023-11-15',
    digitalTachoExpiry: '2024-09-30',
    medicalDue: '2024-05-10',
    status: 'Warning'
  },
  {
    id: 3,
    name: 'Mike Davies',
    email: 'mike.davies@setsfree.com',
    licenseNumber: 'DAVIE87123JY5DF',
    licenseExpiry: '2024-11-10',
    cpcExpiry: '2023-10-05',
    digitalTachoExpiry: '2024-07-18',
    medicalDue: '2025-01-15',
    status: 'Expired'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@setsfree.com',
    licenseNumber: 'WILSO56234ED3CV',
    licenseExpiry: '2025-08-18',
    cpcExpiry: '2024-07-20',
    digitalTachoExpiry: '2025-02-28',
    medicalDue: '2024-11-30',
    status: 'Compliant'
  },
  {
    id: 5,
    name: 'David Taylor',
    email: 'david.taylor@setsfree.com',
    licenseNumber: 'TAYLO43876BN7JK',
    licenseExpiry: '2024-09-30',
    cpcExpiry: '2023-09-28',
    digitalTachoExpiry: '2024-05-15',
    medicalDue: '2023-12-10',
    status: 'Expired'
  }
];

export default function DriverCompliance() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<DriverComplianceData[]>(driversData);
  const [filter, setFilter] = useState<string>('All Statuses');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverComplianceData | null>(null);
  
  // Form state for updating driver
  const [licenseExpiry, setLicenseExpiry] = useState<Date | undefined>(undefined);
  const [cpcExpiry, setCpcExpiry] = useState<Date | undefined>(undefined);
  const [digitalTachoExpiry, setDigitalTachoExpiry] = useState<Date | undefined>(undefined);
  const [medicalDue, setMedicalDue] = useState<Date | undefined>(undefined);

  // Calculate compliance statistics
  const totalDrivers = drivers.length;
  const compliantCount = drivers.filter(d => d.status === 'Compliant').length;
  const warningCount = drivers.filter(d => d.status === 'Warning').length;
  const expiredCount = drivers.filter(d => d.status === 'Expired').length;
  
  const compliantPercentage = Math.round((compliantCount / totalDrivers) * 100);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredDrivers = filter === 'All Statuses' 
    ? drivers 
    : drivers.filter(driver => driver.status === filter);

  const handleUpdateClick = (driver: DriverComplianceData) => {
    setSelectedDriver(driver);
    setLicenseExpiry(new Date(driver.licenseExpiry));
    setCpcExpiry(new Date(driver.cpcExpiry));
    setDigitalTachoExpiry(new Date(driver.digitalTachoExpiry));
    setMedicalDue(new Date(driver.medicalDue));
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedDriver) return;
    
    const updatedDrivers = drivers.map(driver => 
      driver.id === selectedDriver.id 
        ? {
            ...driver,
            licenseExpiry: licenseExpiry ? format(licenseExpiry, 'yyyy-MM-dd') : driver.licenseExpiry,
            cpcExpiry: cpcExpiry ? format(cpcExpiry, 'yyyy-MM-dd') : driver.cpcExpiry,
            digitalTachoExpiry: digitalTachoExpiry ? format(digitalTachoExpiry, 'yyyy-MM-dd') : driver.digitalTachoExpiry,
            medicalDue: medicalDue ? format(medicalDue, 'yyyy-MM-dd') : driver.medicalDue,
            // Calculate new status based on dates
            status: calculateStatus(
              licenseExpiry || new Date(driver.licenseExpiry),
              cpcExpiry || new Date(driver.cpcExpiry),
              digitalTachoExpiry || new Date(driver.digitalTachoExpiry),
              medicalDue || new Date(driver.medicalDue)
            )
          } 
        : driver
    );
    
    setDrivers(updatedDrivers);
    setIsUpdateDialogOpen(false);
    
    toast({
      title: "Driver updated",
      description: `${selectedDriver.name}'s compliance information has been updated.`,
    });
  };

  // Helper function to calculate compliance status
  const calculateStatus = (license: Date, cpc: Date, tacho: Date, medical: Date): string => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    // Check if any documents are expired
    if (license < today || cpc < today || tacho < today || medical < today) {
      return 'Expired';
    }
    
    // Check if any documents are expiring within 30 days
    if (license < thirtyDaysFromNow || cpc < thirtyDaysFromNow || 
        tacho < thirtyDaysFromNow || medical < thirtyDaysFromNow) {
      return 'Warning';
    }
    
    return 'Compliant';
  };

  return (
    <MainLayout>
      <PageHeader
        title="Driver Compliance"
        subtitle="Monitor and manage your drivers' regulatory compliance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-success-500" />
              Compliant Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{compliantCount}</div>
            <div className="text-sm text-gray-500">of {totalDrivers} drivers</div>
            <Progress value={compliantPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-warning-500" />
              Upcoming Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{warningCount}</div>
            <div className="text-sm text-gray-500">renewals within 30 days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-danger-500" />
              Expired Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiredCount}</div>
            <div className="text-sm text-gray-500">require immediate attention</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Driver Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{compliantPercentage}%</div>
            <div className="text-sm text-gray-500">overall compliance rate</div>
            <Progress value={compliantPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-title">Driver Compliance Status</h3>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative ml-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search drivers..." className="pl-8 h-9 w-48" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>CPC Expiry</TableHead>
              <TableHead>Digital Tacho</TableHead>
              <TableHead>Medical Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {driver.profileImage ? (
                        <AvatarImage src={driver.profileImage} alt={driver.name} />
                      ) : (
                        <AvatarFallback className="bg-accent-500 text-white">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{driver.licenseNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(driver.licenseExpiry).toLocaleDateString()}
                    {new Date(driver.licenseExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(driver.cpcExpiry).toLocaleDateString()}
                    {new Date(driver.cpcExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(driver.digitalTachoExpiry).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(driver.medicalDue).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      driver.status === 'Compliant' ? 'bg-success-500' : 
                      driver.status === 'Warning' ? 'bg-warning-500' : 
                      'bg-danger-500'
                    }
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleUpdateClick(driver)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Driver Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Driver Compliance</DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {selectedDriver.profileImage ? (
                    <AvatarImage src={selectedDriver.profileImage} alt={selectedDriver.name} />
                  ) : (
                    <AvatarFallback className="bg-accent-500 text-white text-lg">
                      {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedDriver.name}</h3>
                  <div className="text-sm text-muted-foreground">{selectedDriver.email}</div>
                </div>
                <Badge 
                  className={
                    selectedDriver.status === 'Compliant' ? 'bg-success-500 ml-auto' : 
                    selectedDriver.status === 'Warning' ? 'bg-warning-500 ml-auto' : 
                    'bg-danger-500 ml-auto'
                  }
                >
                  {selectedDriver.status}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                License Number: <span className="font-mono">{selectedDriver.licenseNumber}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !licenseExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {licenseExpiry ? format(licenseExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={licenseExpiry}
                        onSelect={setLicenseExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpcExpiry">CPC Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !cpcExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {cpcExpiry ? format(cpcExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={cpcExpiry}
                        onSelect={setCpcExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digitalTachoExpiry">Digital Tachograph Expiry</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !digitalTachoExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {digitalTachoExpiry ? format(digitalTachoExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={digitalTachoExpiry}
                        onSelect={setDigitalTachoExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalDue">Medical Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !medicalDue && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {medicalDue ? format(medicalDue, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={medicalDue}
                        onSelect={setMedicalDue}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">Compliance Warning</p>
                    <p>Ensure all uploaded documents are authentic and match the expiry dates entered. Non-compliance can result in fines and penalties.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
