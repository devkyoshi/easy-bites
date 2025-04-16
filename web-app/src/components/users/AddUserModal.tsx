
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'driver' | 'staff'>('staff');
  const [departments, setDepartments] = useState<string[]>([]);

  // Additional fields for drivers
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [vehicleAssigned, setVehicleAssigned] = useState('');

  const departmentOptions = [
    'Operations',
    'Management',
    'Transport',
    'Customer Service',
    'Admin',
    'IT',
    'Dispatch',
    'Finance'
  ];

  const handleDepartmentChange = (department: string) => {
    setDepartments(
      departments.includes(department)
        ? departments.filter(d => d !== department)
        : [...departments, department]
    );
  };

  const handleSave = () => {
    if (!name || !email || !role || departments.length === 0) {
      return; // Basic validation
    }

    // In a real app, this would be an API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      name,
      email: email.includes('@') ? email : `${email}@sethsrishipping.co.uk`,
      role,
      status: 'active',
      lastLogin: new Date().toISOString(),
      departments,
      ...(role === 'driver' && {
        licenseNumber,
        licenseExpiry,
        vehicleAssigned
      })
    };

    onUserAdded(newUser);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('staff');
    setDepartments([]);
    setLicenseNumber('');
    setLicenseExpiry('');
    setVehicleAssigned('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3 flex items-center">
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user"
              />
              {!email.includes('@') && (
                <span className="ml-2 text-muted-foreground">@sethsrishipping.co.uk</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as 'admin' | 'driver' | 'staff')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver-specific fields */}
          {role === 'driver' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="licenseNumber" className="text-right">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="licenseExpiry" className="text-right">
                  License Expiry
                </Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleAssigned" className="text-right">
                  Vehicle Assigned
                </Label>
                <Input
                  id="vehicleAssigned"
                  value={vehicleAssigned}
                  onChange={(e) => setVehicleAssigned(e.target.value)}
                  className="col-span-3"
                  placeholder="Vehicle model (Registration)"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Departments
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-3">
              {departmentOptions.map((department) => (
                <div key={department} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`department-${department}`} 
                    checked={departments.includes(department)}
                    onCheckedChange={() => handleDepartmentChange(department)}
                  />
                  <Label 
                    htmlFor={`department-${department}`}
                    className="text-sm font-normal"
                  >
                    {department}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
