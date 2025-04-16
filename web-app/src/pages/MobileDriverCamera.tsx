
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Image, CheckCircle, X, Truck, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';
import { useMobileDriverActions, Delivery } from '@/hooks/use-mobile-driver';
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

const MobileDriverCamera = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { completeDelivery } = useMobileDriverActions();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  
  // Get current delivery from location state or use default
  const currentDelivery = location.state?.delivery || { 
    id: "ORD-12345",
    customer: "John Doe",
    address: "Sample Address",
    status: "in-progress",
    time: "10:30 AM - 11:30 AM",
    packages: 1,
    distance: "1.0 miles",
    instructions: ""
  };
  
  const handleTakePhoto = () => {
    setPhotoTaken(true);
    // In a real app, this would access the camera API
  };

  const handleStartSave = () => {
    setShowSaveConfirmation(true);
  };

  const handleSavePhoto = () => {
    setShowSaveConfirmation(false);
    setIsSaving(true);
    
    // Mark the current delivery as completed
    completeDelivery(currentDelivery.id, currentDelivery as Delivery);
    
    toast({
      title: "Photo saved",
      description: "Delivery proof has been uploaded and delivery completed"
    });
    
    // Start exit animation
    setExitAnimation(true);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      // Navigate back to the driver app home to see the next delivery
      navigate('/mobile-driver', { 
        state: { 
          showEntryAnimation: true,
          fromCompletedDelivery: true
        } 
      });
    }, 600);
  };

  return (
    <MobileLayout>
      <div className={`flex flex-col min-h-screen ${exitAnimation ? 'animate-fade-out' : ''}`}>
        {/* Camera Header */}
        <div className="bg-sethsri-red text-white p-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/mobile-driver')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Delivery Proof</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Camera viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {photoTaken ? (
            // Photo preview
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <Image className="h-24 w-24 text-gray-500" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10" 
                  onClick={() => setPhotoTaken(false)}
                  disabled={isSaving}
                >
                  <X className="h-6 w-6 mr-2" />
                  Retake
                </Button>
                <Button 
                  className="bg-success-500 hover:bg-success-600 text-white" 
                  onClick={handleStartSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Camera UI
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-24 w-24 text-gray-700 opacity-20" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center">
                <Button 
                  onClick={handleTakePhoto} 
                  size="icon" 
                  className="h-16 w-16 rounded-full bg-white hover:bg-gray-100 border-4 border-sethsri-red"
                >
                  <Camera className="h-8 w-8 text-sethsri-red" />
                </Button>
              </div>
              
              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <div className="bg-sethsri-darkgray bg-opacity-80 text-white px-4 py-1.5 rounded-full text-sm">
                  Delivery Proof Photo
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver')}>
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Deliveries</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/map')}>
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Map</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto text-sethsri-red" onClick={() => navigate('/mobile-driver/camera')}>
            <Camera className="h-5 w-5" />
            <span className="text-xs mt-1">Camera</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/profile')}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>

        {/* Save Photo Confirmation Dialog */}
        <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Delivery Photo</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to save this photo as delivery proof?
                This will complete the current delivery for {currentDelivery.customer}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSavePhoto}
                className="bg-sethsri-red text-white hover:bg-sethsri-red/90"
              >
                Save Photo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default MobileDriverCamera;
