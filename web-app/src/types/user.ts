
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'staff';
  status: 'active' | 'inactive';
  lastLogin: string;
  departments: string[];
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleAssigned?: string;
}
