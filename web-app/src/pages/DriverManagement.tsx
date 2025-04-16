import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddDriverModal } from '@/components/drivers/AddDriverModal';

interface Driver {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  status: string;
  vehicle: string;
  licenseExpiry: string;
  cpcExpiry: string;
  profileImage?: string;
}

const driversData: Driver[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@setsfree.com',
    phone: '07700 900123',
    status: 'Active',
    vehicle: 'KN67 ZXC',
    licenseExpiry: '2025-06-15',
    cpcExpiry: '2024-01-30',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@setsfree.com',
    phone: '07700 900124',
    status: 'Active',
    vehicle: 'LP19 TRE',
    licenseExpiry: '2026-03-22',
    cpcExpiry: '2024-04-15',
  },
  {
    id: 3,
    name: 'Mike Davies',
    email: 'mike.davies@setsfree.com',
    phone: '07700 900125',
    status: 'Active',
    vehicle: 'KJ70 POP',
    licenseExpiry: '2024-11-10',
    cpcExpiry: '2023-12-05',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@setsfree.com',
    phone: '07700 900126',
    status: 'On Leave',
    vehicle: 'Unassigned',
    licenseExpiry: '2025-08-18',
    cpcExpiry: '2024-07-20',
  },
  {
    id: 5,
    name: 'David Taylor',
    email: 'david.taylor@setsfree.com',
    phone: '07700 900127',
    status: 'Suspended',
    vehicle: 'Unassigned',
    licenseExpiry: '2024-09-30',
    cpcExpiry: '2024-02-28',
  }
];

export default function DriverManagement() {
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(driversData);

  const handleDriverAdded = (newDriver: Driver) => {
    setDrivers(prev => [...prev, newDriver]);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Driver Management"
        subtitle="Manage your delivery drivers and their compliance status"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <Button size="sm" onClick={() => setIsAddDriverModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </>
        }
      />

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-title">Driver Roster</h3>
          <div className="flex items-center gap-2">
            <select className="border border-gray-200 rounded-md text-sm px-3 py-1.5">
              <option>All Statuses</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Suspended</option>
            </select>
            <select className="border border-gray-200 rounded-md text-sm px-3 py-1.5">
              <option>All Vehicles</option>
              <option>Assigned</option>
              <option>Unassigned</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>CPC Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
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
                    <span className="font-medium">{driver.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{driver.email}</div>
                    <div className="text-gray-500">{driver.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      driver.status === 'Active' ? 'bg-success-500' : 
                      driver.status === 'On Leave' ? 'bg-warning-500' : 
                      'bg-danger-500'
                    }
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>{driver.vehicle}</TableCell>
                <TableCell>{new Date(driver.licenseExpiry).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(driver.cpcExpiry).toLocaleDateString()}
                    {new Date(driver.cpcExpiry) < new Date() && (
                      <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)}
        onDriverAdded={handleDriverAdded}
      />
    </MainLayout>
  );
}
