import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Clock, 
  MessageSquare, 
  Package, 
  Send, 
  Truck, 
  User 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Comment {
  id: string;
  driverId: string;
  driverName: string;
  text: string;
  timestamp: Date;
  status?: string;
  photos?: string[];
}

interface DriverCommentsProps {
  orderId: string;
  initialComments?: Comment[];
  initialStatus?: string;
}

const DELIVERY_STATUSES = [
  { value: 'pending', label: 'Pending', badgeClass: 'border-warning-200 text-warning-700 bg-warning-50' },
  { value: 'assigned', label: 'Assigned', badgeClass: 'border-success-200 text-success-700 bg-success-50' },
  { value: 'en-route', label: 'En Route', badgeClass: 'border-info-200 text-info-700 bg-info-50' },
  { value: 'arrived', label: 'Arrived', badgeClass: 'border-accent-200 text-accent-700 bg-accent-50' },
  { value: 'delivering', label: 'Delivering', badgeClass: 'border-accent-200 text-accent-700 bg-accent-50' },
  { value: 'delayed', label: 'Delayed', badgeClass: 'border-amber-200 text-amber-700 bg-amber-50' },
  { value: 'completed', label: 'Completed', badgeClass: 'border-success-200 text-success-700 bg-success-50' },
  { value: 'failed', label: 'Failed', badgeClass: 'border-danger-200 text-danger-700 bg-danger-50' },
  { value: 'returned', label: 'Returned', badgeClass: 'border-danger-200 text-danger-700 bg-danger-50' }
];

const mockDrivers = [
  { id: 'drv1', name: 'John Smith' },
  { id: 'drv2', name: 'Sarah Johnson' },
  { id: 'drv3', name: 'Mike Davies' }
];

export function DriverComments({ 
  orderId, 
  initialComments = [], 
  initialStatus = 'pending' 
}: DriverCommentsProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(initialStatus);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const currentDriver = mockDrivers[0];

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      text: newComment,
      timestamp: new Date(),
      status: deliveryStatus
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the order."
    });
  };

  const handleStatusChange = (status: string) => {
    setDeliveryStatus(status);
    
    toast({
      title: "Status updated",
      description: `Order status updated to ${DELIVERY_STATUSES.find(s => s.value === status)?.label}`
    });
  };

  const handleAddPhoto = () => {
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      text: "Photo added",
      timestamp: new Date(),
      photos: ['/placeholder.svg']
    };
    
    setComments([...comments, newCommentObj]);
    
    toast({
      title: "Photo added",
      description: "Your photo has been added to the order."
    });
  };

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const statusDef = DELIVERY_STATUSES.find(s => s.value === status);
    if (!statusDef) return null;
    
    return (
      <Badge variant="outline" className={statusDef.badgeClass}>
        {statusDef.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Driver Updates & Status</span>
          {getStatusBadge(deliveryStatus)}
        </CardTitle>
        <CardDescription>
          Track delivery progress and communication for order #{orderId}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Update Delivery Status</label>
          <Select value={deliveryStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {deliveryStatus === 'delayed' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <label className="text-sm font-medium mb-2 block text-amber-800">Reason for Delay</label>
            <Textarea 
              placeholder="Explain why the delivery is delayed..."
              className="mt-1"
              rows={2}
            />
            <p className="text-xs text-amber-600 mt-2">
              Please provide details about when the order is expected to be completed
            </p>
          </div>
        )}
        
        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 p-1">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">{comment.driverName}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{comment.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                
                {comment.status && (
                  <div className="mt-2 mb-1">
                    <span className="text-xs text-gray-500 mr-2">Status changed to:</span>
                    {getStatusBadge(comment.status)}
                  </div>
                )}
                
                <p className="text-sm mt-2">{comment.text}</p>
                
                {comment.photos && comment.photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {comment.photos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 rounded overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleViewPhoto(photo)}
                      >
                        <img src={photo} alt="Delivery photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="space-y-3">
          <Textarea 
            placeholder="Add a comment or update about this delivery..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
          />
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleAddPhoto}>
              <Camera className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
            
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send Update
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Photo</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="flex justify-center">
              <img 
                src={selectedPhoto} 
                alt="Delivery photo" 
                className="max-w-full max-h-[500px] object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
