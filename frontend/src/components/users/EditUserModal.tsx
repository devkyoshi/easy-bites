
import { useState, useEffect } from 'react';
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (user: User) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<'admin' | 'driver' | 'staff'>(user.role);
  const [status, setStatus] = useState<'active' | 'inactive'>(user.status);
  const [departments, setDepartments] = useState<string[]>(user.departments);
  
  // Additional fields for drivers
  const [licenseNumber, setLicenseNumber] = useState(user.licenseNumber || '');
  const [licenseExpiry, setLicenseExpiry] = useState(user.licenseExpiry || '');
  const [vehicleAssigned, setVehicleAssigned] = useState(user.vehicleAssigned || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
      setDepartments(user.departments);
      setLicenseNumber(user.licenseNumber || '');
      setLicenseExpiry(user.licenseExpiry || '');
      setVehicleAssigned(user.vehicleAssigned || '');
    }
  }, [user]);

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

    const updatedUser: User = {
      ...user,
      name,
      email,
      role,
      status,
      departments,
      ...(role === 'driver' && {
        licenseNumber,
        licenseExpiry,
        vehicleAssigned
      })
    };

    onSave(updatedUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-role" className="text-right">
              Role
            </Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as 'admin' | 'driver' | 'staff')}
            >
              <SelectTrigger className="col-span-3" id="edit-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as 'active' | 'inactive')}
            >
              <SelectTrigger className="col-span-3" id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver-specific fields */}
          {role === 'driver' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-licenseNumber" className="text-right">
                  License Number
                </Label>
                <Input
                  id="edit-licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-licenseExpiry" className="text-right">
                  License Expiry
                </Label>
                <Input
                  id="edit-licenseExpiry"
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-vehicleAssigned" className="text-right">
                  Vehicle Assigned
                </Label>
                <Input
                  id="edit-vehicleAssigned"
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
                    id={`edit-department-${department}`} 
                    checked={departments.includes(department)}
                    onCheckedChange={() => handleDepartmentChange(department)}
                  />
                  <Label 
                    htmlFor={`edit-department-${department}`}
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
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
