
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
import { AddVehicleModal } from '@/components/fleet/AddVehicleModal';

const fleetData = [
  {
    id: 1,
    regNumber: 'KN67 ZXC',
    make: 'Ford',
    model: 'Transit',
    category: 'Medium Van',
    status: 'Active',
    motExpiry: '2023-12-15',
    taxExpiry: '2024-02-28',
    driver: 'John Smith'
  },
  {
    id: 2,
    regNumber: 'BD71 ABP',
    make: 'Mercedes',
    model: 'Sprinter',
    category: 'Large Van',
    status: 'Maintenance',
    motExpiry: '2024-01-20',
    taxExpiry: '2024-03-15',
    driver: 'Unassigned'
  },
  {
    id: 3,
    regNumber: 'LP19 TRE',
    make: 'Renault',
    model: 'Kangoo',
    category: 'Small Van',
    status: 'Active',
    motExpiry: '2023-11-30',
    taxExpiry: '2024-01-15',
    driver: 'Sarah Johnson'
  },
  {
    id: 4,
    regNumber: 'WP22 OLK',
    make: 'Iveco',
    model: 'Daily',
    category: 'Large Van',
    status: 'Out of Service',
    motExpiry: '2024-03-10',
    taxExpiry: '2024-04-22',
    driver: 'Unassigned'
  },
  {
    id: 5,
    regNumber: 'KJ70 POP',
    make: 'Vauxhall',
    model: 'Vivaro',
    category: 'Medium Van',
    status: 'Active',
    motExpiry: '2024-02-15',
    taxExpiry: '2024-05-01',
    driver: 'Mike Davies'
  }
];

export default function FleetManagement() {
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredFleetData = fleetData.filter(vehicle => {
    const matchesCategory = categoryFilter === 'All Categories' || vehicle.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Statuses' || vehicle.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleOpenAddVehicleModal = () => {
    setIsAddVehicleModalOpen(true);
  };

  const handleCloseAddVehicleModal = () => {
    setIsAddVehicleModalOpen(false);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Fleet Management"
        subtitle="Manage your delivery vehicles and their compliance status"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <Button size="sm" onClick={handleOpenAddVehicleModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </>
        }
      />

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-title">Vehicle Inventory</h3>
          <div className="flex items-center gap-2">
            <select 
              className="border border-gray-200 rounded-md text-sm px-3 py-1.5"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>
              <option>Small Van</option>
              <option>Medium Van</option>
              <option>Large Van</option>
              <option>HGV</option>
            </select>
            <select 
              className="border border-gray-200 rounded-md text-sm px-3 py-1.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Maintenance</option>
              <option>Out of Service</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg Number</TableHead>
              <TableHead>Make & Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MOT Expiry</TableHead>
              <TableHead>Tax Expiry</TableHead>
              <TableHead>Assigned Driver</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFleetData.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.regNumber}</TableCell>
                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                <TableCell>{vehicle.category}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      vehicle.status === 'Active' ? 'bg-success-500' : 
                      vehicle.status === 'Maintenance' ? 'bg-warning-500' : 
                      'bg-danger-500'
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(vehicle.motExpiry).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(vehicle.taxExpiry).toLocaleDateString()}</TableCell>
                <TableCell>{vehicle.driver}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddVehicleModal 
        isOpen={isAddVehicleModalOpen} 
        onClose={handleCloseAddVehicleModal} 
      />
    </MainLayout>
  );
}
