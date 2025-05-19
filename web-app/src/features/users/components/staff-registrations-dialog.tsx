import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { getAllStaffRegistrations, approveStaffRegistration, rejectStaffRegistration } from '@/services/admin-service.ts'
import { StaffRegistrationResponse } from '@/services/admin-service.ts'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffRegistrationsDialog({ open, onOpenChange }: Props) {
  const [staffRegistrations, setStaffRegistrations] = useState<StaffRegistrationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      fetchStaffRegistrations()
    }
  }, [open])

  const fetchStaffRegistrations = async () => {
    try {
      setLoading(true)
      const registrations = await getAllStaffRegistrations()
      // Filter out already approved registrations
      const pendingRegistrations = registrations.filter(reg => !reg.isApproved)
      setStaffRegistrations(pendingRegistrations)
    } catch (error) {
      toast.error('Failed to fetch staff registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id)
      await approveStaffRegistration(id)
      // Remove the approved registration from the list
      setStaffRegistrations(prev => prev.filter(reg => reg.id !== id))
      toast.success('Staff registration approved successfully')
    } catch (error) {
      toast.error('Failed to approve staff registration')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: number) => {
    try {
      setProcessingId(id)
      await rejectStaffRegistration(id)
      // Remove the rejected registration from the list
      setStaffRegistrations(prev => prev.filter(reg => reg.id !== id))
      toast.success('Staff registration rejected successfully')
    } catch (error) {
      toast.error('Failed to reject staff registration')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Staff Registration Requests</DialogTitle>
          <DialogDescription>
            Approve or reject staff registration requests.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading staff registrations...</p>
          </div>
        ) : staffRegistrations.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>No pending staff registrations found.</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>{`${registration.user.firstName} ${registration.user.lastName}`}</TableCell>
                    <TableCell>{registration.user.username}</TableCell>
                    <TableCell>{registration.user.email}</TableCell>
                    <TableCell>{registration.user.role}</TableCell>
                    <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => handleApprove(registration.id)}
                        disabled={processingId === registration.id}
                      >
                        {processingId === registration.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleReject(registration.id)}
                        disabled={processingId === registration.id}
                      >
                        {processingId === registration.id ? 'Processing...' : 'Reject'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}