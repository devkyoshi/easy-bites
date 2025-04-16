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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface VehicleData {
  id: number;
  regNumber: string;
  make: string;
  model: string;
  motExpiry: string;
  taxExpiry: string;
  insuranceExpiry: string;
  serviceDate: string;
  nextServiceDue: string;
  status: string;
}

const complianceData: VehicleData[] = [
  {
    id: 1,
    regNumber: 'KN67 ZXC',
    make: 'Ford',
    model: 'Transit',
    motExpiry: '2023-12-15',
    taxExpiry: '2024-02-28',
    insuranceExpiry: '2024-01-10',
    serviceDate: '2023-09-20',
    nextServiceDue: '2024-03-20',
    status: 'Compliant'
  },
  {
    id: 2,
    regNumber: 'BD71 ABP',
    make: 'Mercedes',
    model: 'Sprinter',
    motExpiry: '2024-01-20',
    taxExpiry: '2024-03-15',
    insuranceExpiry: '2024-02-05',
    serviceDate: '2023-07-15',
    nextServiceDue: '2024-01-15',
    status: 'Warning'
  },
  {
    id: 3,
    regNumber: 'LP19 TRE',
    make: 'Renault',
    model: 'Kangoo',
    motExpiry: '2023-11-30',
    taxExpiry: '2024-01-15',
    insuranceExpiry: '2023-12-22',
    serviceDate: '2023-06-10',
    nextServiceDue: '2023-12-10',
    status: 'Expired'
  },
  {
    id: 4,
    regNumber: 'WP22 OLK',
    make: 'Iveco',
    model: 'Daily',
    motExpiry: '2024-03-10',
    taxExpiry: '2024-04-22',
    insuranceExpiry: '2024-03-30',
    serviceDate: '2023-08-05',
    nextServiceDue: '2024-02-05',
    status: 'Compliant'
  },
  {
    id: 5,
    regNumber: 'KJ70 POP',
    make: 'Vauxhall',
    model: 'Vivaro',
    motExpiry: '2024-02-15',
    taxExpiry: '2024-05-01',
    insuranceExpiry: '2024-04-10',
    serviceDate: '2023-10-12',
    nextServiceDue: '2024-04-12',
    status: 'Compliant'
  }
];

export default function VehicleCompliance() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleData[]>(complianceData);
  const [filter, setFilter] = useState<string>('All Statuses');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  
  const [motExpiry, setMotExpiry] = useState<Date | undefined>(undefined);
  const [taxExpiry, setTaxExpiry] = useState<Date | undefined>(undefined);
  const [insuranceExpiry, setInsuranceExpiry] = useState<Date | undefined>(undefined);
  const [serviceDate, setServiceDate] = useState<Date | undefined>(undefined);
  const [nextServiceDue, setNextServiceDue] = useState<Date | undefined>(undefined);

  const totalVehicles = vehicles.length;
  const compliantCount = vehicles.filter(v => v.status === 'Compliant').length;
  const warningCount = vehicles.filter(v => v.status === 'Warning').length;
  const expiredCount = vehicles.filter(v => v.status === 'Expired').length;
  
  const compliantPercentage = Math.round((compliantCount / totalVehicles) * 100);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredVehicles = filter === 'All Statuses' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === filter);

  const handleUpdateClick = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setMotExpiry(new Date(vehicle.motExpiry));
    setTaxExpiry(new Date(vehicle.taxExpiry));
    setInsuranceExpiry(new Date(vehicle.insuranceExpiry));
    setServiceDate(new Date(vehicle.serviceDate));
    setNextServiceDue(new Date(vehicle.nextServiceDue));
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedVehicle) return;
    
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === selectedVehicle.id 
        ? {
            ...vehicle,
            motExpiry: motExpiry ? format(motExpiry, 'yyyy-MM-dd') : vehicle.motExpiry,
            taxExpiry: taxExpiry ? format(taxExpiry, 'yyyy-MM-dd') : vehicle.taxExpiry,
            insuranceExpiry: insuranceExpiry ? format(insuranceExpiry, 'yyyy-MM-dd') : vehicle.insuranceExpiry,
            serviceDate: serviceDate ? format(serviceDate, 'yyyy-MM-dd') : vehicle.serviceDate,
            nextServiceDue: nextServiceDue ? format(nextServiceDue, 'yyyy-MM-dd') : vehicle.nextServiceDue,
            status: calculateStatus(
              motExpiry || new Date(vehicle.motExpiry),
              taxExpiry || new Date(vehicle.taxExpiry),
              insuranceExpiry || new Date(vehicle.insuranceExpiry)
            )
          } 
        : vehicle
    );
    
    setVehicles(updatedVehicles);
    setIsUpdateDialogOpen(false);
    
    toast({
      title: "Vehicle updated",
      description: `${selectedVehicle.regNumber} has been updated successfully.`,
    });
  };

  const calculateStatus = (mot: Date, tax: Date, insurance: Date): string => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    if (mot < today || tax < today || insurance < today) {
      return 'Expired';
    }
    
    if (mot < thirtyDaysFromNow || tax < thirtyDaysFromNow || insurance < thirtyDaysFromNow) {
      return 'Warning';
    }
    
    return 'Compliant';
  };

  return (
    <MainLayout>
      <PageHeader
        title="Vehicle Compliance"
        subtitle="Monitor and manage your fleet's regulatory compliance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-success-500" />
              Compliant Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{compliantCount}</div>
            <div className="text-sm text-gray-500">of {totalVehicles} vehicles</div>
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
            <CardTitle className="text-lg">Fleet Compliance</CardTitle>
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
          <h3 className="dashboard-title">Vehicle Compliance Status</h3>
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
              <Input placeholder="Search vehicles..." className="pl-8 h-9 w-48" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg Number</TableHead>
              <TableHead>Make & Model</TableHead>
              <TableHead>MOT Expiry</TableHead>
              <TableHead>Tax Expiry</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead>Next Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.regNumber}</TableCell>
                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(vehicle.motExpiry).toLocaleDateString()}
                    {new Date(vehicle.motExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(vehicle.taxExpiry).toLocaleDateString()}
                    {new Date(vehicle.taxExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                    {new Date(vehicle.insuranceExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(vehicle.serviceDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(vehicle.nextServiceDue).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      vehicle.status === 'Compliant' ? 'bg-success-500' : 
                      vehicle.status === 'Warning' ? 'bg-warning-500' : 
                      'bg-danger-500'
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleUpdateClick(vehicle)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Update Vehicle Compliance</DialogTitle>
            <DialogDescription>
              Update the compliance documents for this vehicle.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedVehicle.regNumber}</h3>
                <Badge 
                  className={
                    selectedVehicle.status === 'Compliant' ? 'bg-success-500' : 
                    selectedVehicle.status === 'Warning' ? 'bg-warning-500' : 
                    'bg-danger-500'
                  }
                >
                  {selectedVehicle.status}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {selectedVehicle.make} {selectedVehicle.model}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="motExpiry">MOT Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="motExpiry"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !motExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {motExpiry ? format(motExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={motExpiry}
                        onSelect={setMotExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxExpiry">Tax Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="taxExpiry"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !taxExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {taxExpiry ? format(taxExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={taxExpiry}
                        onSelect={setTaxExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="insuranceExpiry"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !insuranceExpiry && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {insuranceExpiry ? format(insuranceExpiry, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={insuranceExpiry}
                        onSelect={setInsuranceExpiry}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Last Service Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="serviceDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !serviceDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {serviceDate ? format(serviceDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={serviceDate}
                        onSelect={setServiceDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nextServiceDue">Next Service Due</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="nextServiceDue"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !nextServiceDue && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {nextServiceDue ? format(nextServiceDue, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={nextServiceDue}
                        onSelect={setNextServiceDue}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
