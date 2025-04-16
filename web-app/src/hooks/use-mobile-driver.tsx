
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type DeliveryStatus = "pending" | "in-progress" | "completed" | "failed" | "delayed";
export type AttachmentType = "photo" | "document" | "note";

export interface Attachment {
  id: string;
  type: AttachmentType;
  content: string;
  timestamp: Date;
}

export interface OrderNote {
  id: string;
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Delivery {
  id: string;
  address: string;
  customer: string;
  status: DeliveryStatus;
  time: string;
  packages: number;
  distance: string;
  instructions: string;
  completedAt?: Date;
}

export function useMobileDriverActions() {
  const { toast } = useToast();
  const [orderNotes, setOrderNotes] = useState<Record<string, OrderNote[]>>({});
  const [orderStatuses, setOrderStatuses] = useState<Record<string, DeliveryStatus>>({});
  const [completedDeliveries, setCompletedDeliveries] = useState<Delivery[]>([]);

  const startDelivery = (orderId: string) => {
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: "in-progress"
    }));
    
    toast({
      title: "Delivery started",
      description: `You've started the delivery for order ${orderId}`
    });
    // In a real app, this would make an API call to update the delivery status
  };

  const completeDelivery = (orderId: string, deliveryDetails?: Delivery) => {
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: "completed"
    }));
    
    // Add to completed deliveries
    if (deliveryDetails) {
      setCompletedDeliveries(prev => [
        {
          ...deliveryDetails,
          status: "completed",
          completedAt: new Date()
        },
        ...prev
      ]);
    }
    
    toast({
      title: "Delivery completed",
      description: `You've successfully completed delivery ${orderId}`
    });
    // In a real app, this would make an API call to mark the delivery as complete
  };

  const reportIssue = (orderId: string) => {
    toast({
      title: "Issue reported",
      description: `Your issue with delivery ${orderId} has been reported`
    });
    // In a real app, this would open a form to report issues
  };

  const updateOrderStatus = (orderId: string, status: DeliveryStatus) => {
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: status
    }));
    
    toast({
      title: "Status updated",
      description: `Order ${orderId} status updated to ${status}`
    });
    // In a real app, this would make an API call to update the delivery status
  };

  const addOrderNote = (orderId: string, text: string) => {
    const newNote: OrderNote = {
      id: `note-${Date.now()}`,
      text,
      timestamp: new Date()
    };
    
    setOrderNotes(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newNote]
    }));
    
    toast({
      title: "Note added",
      description: "Your note has been added to the order"
    });
    // In a real app, this would make an API call to save the note
  };

  const addAttachment = (orderId: string, type: AttachmentType, content: string = "") => {
    const newAttachment: Attachment = {
      id: `attachment-${Date.now()}`,
      type,
      content,
      timestamp: new Date()
    };
    
    // If there's no existing note, create one with this attachment
    if (!orderNotes[orderId] || orderNotes[orderId].length === 0) {
      const newNote: OrderNote = {
        id: `note-${Date.now()}`,
        text: type === "note" ? content : `Added ${type}`,
        timestamp: new Date(),
        attachments: [newAttachment]
      };
      
      setOrderNotes(prev => ({
        ...prev,
        [orderId]: [...(prev[orderId] || []), newNote]
      }));
    } else {
      // Add attachment to the most recent note
      const notes = [...(orderNotes[orderId] || [])];
      const lastNote = notes[notes.length - 1];
      
      const updatedNote = {
        ...lastNote,
        attachments: [...(lastNote.attachments || []), newAttachment]
      };
      
      notes[notes.length - 1] = updatedNote;
      
      setOrderNotes(prev => ({
        ...prev,
        [orderId]: notes
      }));
    }
    
    toast({
      title: `${type === 'photo' ? 'Photo' : type === 'document' ? 'Document' : 'Attachment'} added`,
      description: `Your ${type} has been added to the order`
    });
    // In a real app, this would make an API call to upload and save the attachment
  };

  const getOrderStatus = (orderId: string): DeliveryStatus => {
    return orderStatuses[orderId] || "pending";
  };

  const getOrderNotes = (orderId: string): OrderNote[] => {
    return orderNotes[orderId] || [];
  };

  const getCompletedDeliveries = (): Delivery[] => {
    return completedDeliveries;
  };

  return {
    startDelivery,
    completeDelivery,
    reportIssue,
    updateOrderStatus,
    addOrderNote,
    addAttachment,
    getOrderStatus,
    getOrderNotes,
    getCompletedDeliveries
  };
}
