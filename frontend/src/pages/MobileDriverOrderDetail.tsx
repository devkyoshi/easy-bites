
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Camera, CheckCircle, Clock, FileText, MapPin, 
  MessageSquare, PackageOpen, Send, Truck, User, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DeliveryStatus,
  Delivery,
  useMobileDriverActions 
} from '@/hooks/use-mobile-driver';

const MobileDriverOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    updateOrderStatus, 
    addOrderNote, 
    addAttachment, 
    getOrderStatus,
    getOrderNotes,
    completeDelivery 
  } = useMobileDriverActions();

  const [newNote, setNewNote] = useState('');
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);

  // Sample order data - in a real app, you'd fetch this from an API
  const order = {
    id: orderId || 'UNKNOWN',
    address: "15 Oxford Street, London W1D 1AP",
    customer: "Jane Doe",
    time: "10:30 AM - 11:30 AM",
    packages: 2,
    distance: "1.2 miles",
    instructions: "Leave with neighbor if not home",
    phone: "+44 123 456 7890",
    email: "jane.doe@example.com"
  };

  const currentStatus = getOrderStatus(order.id);
  const orderNotes = getOrderNotes(order.id);

  const handleStatusChange = (status: DeliveryStatus) => {
    updateOrderStatus(order.id, status);
    setShowStatusDialog(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addOrderNote(order.id, newNote);
      setNewNote('');
    }
  };

  const handleTakePhoto = () => {
    // In a real app, this would access the camera
    addAttachment(order.id, 'photo', '/placeholder.svg');
    setShowPhotoDialog(false);
  };

  const handleCompleteDelivery = () => {
    setShowCompletionDialog(false);
    setExitAnimation(true);
    
    // Mark as completed
    completeDelivery(order.id, {
      id: order.id,
      address: order.address,
      customer: order.customer,
      status: "completed",
      time: order.time,
      packages: order.packages,
      distance: order.distance,
      instructions: order.instructions,
      completedAt: new Date()
    });
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate('/mobile-driver', { 
        state: { 
          showEntryAnimation: true, 
          fromCompletedDelivery: true,
          showCompletedTab: true  // Signal to show the completed tab
        } 
      });
    }, 600);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    const statusMap: Record<DeliveryStatus, { label: string, className: string }> = {
      "pending": { label: "Pending", className: "bg-gray-100 text-gray-800" },
      "in-progress": { label: "In Progress", className: "bg-sethsri-blue text-white" },
      "completed": { label: "Completed", className: "bg-success-500 text-white" },
      "failed": { label: "Failed", className: "bg-sethsri-red text-white" },
      "delayed": { label: "Delayed", className: "bg-amber-400 text-amber-800" }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <MobileLayout>
      <div className={`flex flex-col min-h-screen pb-16 ${exitAnimation ? 'animate-fade-out' : 'animate-fade-in'}`}>
        {/* Header */}
        <div className="bg-sethsri-red text-white p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-sethsri-red/80 mr-2"
              onClick={() => navigate('/mobile-driver')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Order Details</h1>
              <p className="text-sm text-red-100">Order #{order.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Delivery Status</CardTitle>
                {getStatusBadge(currentStatus)}
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => setShowStatusDialog(true)}
              >
                Change Status
              </Button>
              
              {currentStatus !== "completed" && (
                <Button 
                  className="flex-1 bg-success-500 hover:bg-success-600" 
                  onClick={() => setShowCompletionDialog(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Order Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-sethsri-red mr-2 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{order.address}</div>
                    <div className="text-sm text-gray-500">{order.distance} away</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <div className="font-medium">{order.customer}</div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <div className="font-medium">{order.time}</div>
                </div>
                
                <div className="flex items-center">
                  <PackageOpen className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                  <div className="font-medium">{order.packages} Package{order.packages > 1 ? 's' : ''}</div>
                </div>

                {order.instructions && (
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-gray-500 mr-2 mt-0.5 shrink-0" />
                    <div className="text-sm">{order.instructions}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes and Attachments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="add">Add New</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                  {orderNotes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                      <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p>No notes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {orderNotes.map(note => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="text-sm text-gray-500">
                              {formatDateTime(note.timestamp)}
                            </div>
                          </div>
                          <p className="mt-1">{note.text}</p>
                          
                          {note.attachments && note.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {note.attachments.map((attachment, index) => (
                                <div 
                                  key={index} 
                                  className="w-16 h-16 rounded overflow-hidden border"
                                >
                                  {attachment.type === 'photo' && (
                                    <img 
                                      src={attachment.content || '/placeholder.svg'} 
                                      alt="Attachment" 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  {attachment.type === 'document' && (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <FileText className="h-8 w-8 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="add">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a note about this delivery..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowPhotoDialog(true)}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                      
                      <Button
                        className="flex-1"
                        disabled={!newNote.trim()}
                        onClick={handleAddNote}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Navigation - kept the same but updated to use Seth Sri red color */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver')}>
            <Truck className="h-5 w-5 text-sethsri-red" />
            <span className="text-xs mt-1 text-sethsri-red">Deliveries</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/map')}>
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Map</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/camera')}>
            <Camera className="h-5 w-5" />
            <span className="text-xs mt-1">Camera</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/profile')}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>

        {/* Photo Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Take Photo</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-6 bg-gray-100 rounded-md">
              <Camera className="h-24 w-24 text-gray-400" />
            </div>
            <p className="text-sm text-center text-gray-500">
              In a real app, this would access your camera
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleTakePhoto}>
                Take Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Delivery Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sethsri-blue border-blue-200 bg-blue-50"
                onClick={() => handleStatusChange("in-progress")}
              >
                <Truck className="mr-2 h-5 w-5" />
                In Progress
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-green-700 border-green-200 bg-green-50"
                onClick={() => handleStatusChange("completed")}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Completed
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-amber-700 border-amber-200 bg-amber-50"
                onClick={() => handleStatusChange("delayed")}
              >
                <Clock className="mr-2 h-5 w-5" />
                Delayed
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-700 border-red-200 bg-red-50"
                onClick={() => handleStatusChange("failed")}
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Failed
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complete Delivery Confirmation */}
        <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Delivery</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this delivery as complete?
                You may be asked to take a photo for proof of delivery.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCompleteDelivery}
                className="bg-success-500 text-white hover:bg-success-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Delivery
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default MobileDriverOrderDetail;
