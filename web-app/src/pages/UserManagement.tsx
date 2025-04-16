
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from '@/components/users/UserList';
import { AddUserModal } from '@/components/users/AddUserModal';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'admin' | 'driver' | 'staff'>('all');
  const { toast } = useToast();
  
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="User Management"
        subtitle="Manage system users, permissions, and access levels"
        actions={
          <Button size="sm" onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            onValueChange={(value) => setUserTypeFilter(value as 'all' | 'admin' | 'driver' | 'staff')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="driver">Drivers</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <UserList filter="all" />
            </TabsContent>
            <TabsContent value="admin">
              <UserList filter="admin" />
            </TabsContent>
            <TabsContent value="driver">
              <UserList filter="driver" />
            </TabsContent>
            <TabsContent value="staff">
              <UserList filter="staff" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={(user) => {
          toast({
            title: "User Added",
            description: `${user.name} has been added as ${user.role}`,
          });
          setIsAddUserModalOpen(false);
        }}
      />
    </MainLayout>
  );
}
