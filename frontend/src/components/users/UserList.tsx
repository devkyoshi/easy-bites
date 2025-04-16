
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditUserModal } from './EditUserModal';
import { DeleteUserConfirmation } from './DeleteUserConfirmation';
import { UserCog, Trash2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import { ResetPasswordModal } from './ResetPasswordModal';

// Demo data - in a real app, this would come from an API or context
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin Manager',
    email: 'admin@sethsrishipping.co.uk',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-10-15T14:30:00',
    departments: ['Operations', 'Management'],
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@sethsrishipping.co.uk',
    role: 'driver',
    status: 'active',
    lastLogin: '2023-10-14T09:15:00',
    departments: ['Transport'],
    licenseNumber: 'SMITH91234567JD9XY',
    licenseExpiry: '2024-05-20',
    vehicleAssigned: 'Ford Transit (KN67 ZXC)'
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@sethsrishipping.co.uk',
    role: 'staff',
    status: 'active',
    lastLogin: '2023-10-15T10:45:00',
    departments: ['Customer Service', 'Admin']
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael.brown@sethsrishipping.co.uk',
    role: 'driver',
    status: 'inactive',
    lastLogin: '2023-09-28T08:20:00',
    departments: ['Transport'],
    licenseNumber: 'BROWN88765432MB8AB',
    licenseExpiry: '2023-11-15',
    vehicleAssigned: 'Mercedes Sprinter (LD21 WXY)'
  },
  {
    id: '5',
    name: 'Emma Taylor',
    email: 'emma.taylor@sethsrishipping.co.uk',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-10-14T16:10:00',
    departments: ['IT', 'Management']
  },
  {
    id: '6',
    name: 'David Jones',
    email: 'david.jones@sethsrishipping.co.uk',
    role: 'staff',
    status: 'active',
    lastLogin: '2023-10-13T11:30:00',
    departments: ['Dispatch', 'Admin']
  }
];

interface UserListProps {
  filter: 'all' | 'admin' | 'driver' | 'staff';
}

export function UserList({ filter }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.role === filter);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      toast({
        title: "User Deleted",
        description: `${selectedUser.name} has been removed from the system.`,
      });
      setIsDeleteModalOpen(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s information has been updated.`,
    });
    setIsEditModalOpen(false);
  };

  const handlePasswordReset = () => {
    if (selectedUser) {
      toast({
        title: "Password Reset",
        description: `A password reset link has been sent to ${selectedUser.email}.`,
      });
      setIsResetPasswordModalOpen(false);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === 'admin' ? 'default' : 
                    user.role === 'driver' ? 'secondary' : 'outline'
                  }>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{user.departments.join(', ')}</TableCell>
                <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditUser(user)}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleResetPassword(user)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <>
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={selectedUser}
            onSave={updateUser}
          />

          <DeleteUserConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            userName={selectedUser.name}
          />

          <ResetPasswordModal
            isOpen={isResetPasswordModalOpen}
            onClose={() => setIsResetPasswordModalOpen(false)}
            onReset={handlePasswordReset}
            userName={selectedUser.name}
            userEmail={selectedUser.email}
          />
        </>
      )}
    </div>
  );
}
