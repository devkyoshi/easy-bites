
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Layers, Navigation, Crosshair, MapPin, Truck, Camera, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useMobileDriverActions, Delivery } from '@/hooks/use-mobile-driver';
import { useToast } from '@/hooks/use-toast';
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

const MobileDriverMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getOrderStatus, completeDelivery } = useMobileDriverActions();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);

  // Get current delivery from location state or use default
  const nextDelivery = location.state?.delivery || {
    id: "ORD-12345", 
    customer: "Jane Doe",
    address: "15 Oxford Street, London",
    distance: "1.2 miles",
    time: "7 mins",
    packages: 1,
    status: "in-progress",
    instructions: ""
  };

  const handleViewDetails = () => {
    // Navigate to the specific order details page
    navigate(`/mobile-driver/order/${nextDelivery.id}`);
  };

  const handleNextStop = () => {
    setShowConfirmation(true);
  };

  const handleConfirmNextStop = () => {
    setShowConfirmation(false);
    setIsCompleting(true);
    
    // Complete the current delivery
    completeDelivery(nextDelivery.id, nextDelivery as Delivery);
    
    // Show success notification
    toast({
      title: "Delivery completed",
      description: "Moving to next delivery"
    });
    
    // Start exit animation
    setExitAnimation(true);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      // Navigate back to the driver app home which shows current delivery details
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
        {/* Map Header */}
        <div className="bg-sethsri-red text-white p-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/mobile-driver')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Route Map</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => {}}
          >
            <Layers className="h-5 w-5" />
          </Button>
        </div>

        {/* Map container */}
        <div className="relative flex-1 bg-gray-200">
          {/* Placeholder for actual map integration */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapPin className="h-12 w-12 text-sethsri-red" />
            <p className="text-sethsri-darkgray mt-2">Map would be displayed here</p>
            <p className="text-xs text-sethsri-gray mt-1">In a real app, use a mapping library like Mapbox or Google Maps</p>
          </div>

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col space-y-2">
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-md bg-white hover:bg-gray-100">
              <Navigation className="h-5 w-5 text-sethsri-red" />
            </Button>
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-md bg-white hover:bg-gray-100">
              <Crosshair className="h-5 w-5 text-sethsri-blue" />
            </Button>
          </div>

          {/* Bottom route info */}
          <div className="absolute bottom-24 left-4 right-4">
            <Card className="shadow-lg border-t-4 border-sethsri-red animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{nextDelivery.customer}</h3>
                    <p className="text-sm text-sethsri-gray">{nextDelivery.address}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-sethsri-red" />
                      <span className="mr-3">{nextDelivery.distance}</span>
                      <Clock className="h-4 w-4 mr-1 text-sethsri-red" />
                      <span>{nextDelivery.time}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleNextStop}
                    className="bg-sethsri-red hover:bg-sethsri-red/90 text-white"
                    disabled={isCompleting}
                  >
                    {isCompleting ? 'Completing...' : 'Next Stop'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver')}>
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Deliveries</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto text-sethsri-red" onClick={() => navigate('/mobile-driver/map')}>
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

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Next Stop</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to complete this delivery and proceed to the next stop?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmNextStop}
                className="bg-sethsri-red text-white hover:bg-sethsri-red/90"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default MobileDriverMap;
