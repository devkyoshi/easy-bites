
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Package, Clock, User, Truck, Calendar, CheckCircle, PhoneCall, Navigation, RefreshCw, Camera, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useMobileDriverActions, Delivery } from '@/hooks/use-mobile-driver';
import { useToast } from '@/hooks/use-toast';
import { CompletedDeliveriesList } from '@/components/mobile/CompletedDeliveriesList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

const MobileDriverApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { startDelivery, completeDelivery, reportIssue, getOrderStatus, getCompletedDeliveries } = useMobileDriverActions();
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [showEntryAnimation, setShowEntryAnimation] = useState(
    location.state?.showEntryAnimation || false
  );

  // Clear location state after using it
  useEffect(() => {
    if (location.state?.showEntryAnimation) {
      // Clear the entry animation flag after a delay
      const timer = setTimeout(() => {
        setShowEntryAnimation(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Sample data for demonstration
  const driver = {
    name: "John Smith",
    id: "DRV-001",
    vehicle: "KN67 ZXC",
    avatarUrl: "",
    status: "active"
  };

  const todayDeliveries = [
    { 
      id: "ORD-12345", 
      address: "15 Oxford Street, London W1D 1AP", 
      customer: "Jane Doe", 
      status: "in-progress",
      time: "10:30 AM - 11:30 AM",
      packages: 2,
      distance: "1.2 miles",
      instructions: "Leave with neighbor if not home"
    },
    { 
      id: "ORD-12346", 
      address: "27 Camden High St, London NW1 7JE", 
      customer: "Robert Brown", 
      status: "pending",
      time: "12:00 PM - 1:00 PM",
      packages: 1,
      distance: "3.5 miles",
      instructions: "Call before delivery"
    },
    { 
      id: "ORD-12347", 
      address: "42 Kensington High St, London W8 5SF", 
      customer: "Alice Smith", 
      status: "pending",
      time: "2:30 PM - 3:30 PM",
      packages: 3,
      distance: "5.1 miles",
      instructions: ""
    }
  ];
  
  // State to track which delivery is currently active
  const [currentDeliveryIndex, setCurrentDeliveryIndex] = useState(0);
  const completedDeliveriesFromHook = getCompletedDeliveries();
  const completedDeliveries = completedDeliveriesFromHook.length;
  const totalDeliveries = todayDeliveries.length + completedDeliveries;

  // Update current delivery based on the index
  const currentDelivery = {...todayDeliveries[currentDeliveryIndex]};
  const savedStatus = getOrderStatus(currentDelivery.id);
  if (savedStatus) {
    currentDelivery.status = savedStatus;
  }

  // Check if we should automatically move to the next delivery
  useEffect(() => {
    if (location.state?.fromCompletedDelivery && currentDeliveryIndex < todayDeliveries.length - 1) {
      const nextIndex = currentDeliveryIndex + 1;
      setCurrentDeliveryIndex(nextIndex);
    }
  }, [location.state?.fromCompletedDelivery]);

  // Handler for the Next Stop button
  const handleNextStop = () => {
    if (currentDelivery.status === "in-progress") {
      // If already in progress, open complete confirmation dialog
      setShowCompleteConfirmation(true);
    } else {
      // If not started yet, open start confirmation dialog
      setShowStartConfirmation(true);
    }
  };

  // Handler for confirming start delivery
  const handleConfirmStart = () => {
    setShowStartConfirmation(false);
    startDelivery(currentDelivery.id);
  };

  // Handler for confirming complete delivery
  const handleConfirmComplete = () => {
    setShowCompleteConfirmation(false);
    setIsCompleting(true);
    
    // Mark as completed
    completeDelivery(currentDelivery.id, currentDelivery as Delivery);
    
    // After a delay for animation, move to the next delivery if available
    setTimeout(() => {
      setIsCompleting(false);
      if (currentDeliveryIndex < todayDeliveries.length - 1) {
        const nextIndex = currentDeliveryIndex + 1;
        setCurrentDeliveryIndex(nextIndex);
        toast({
          title: "Next delivery loaded",
          description: `Now showing delivery for ${todayDeliveries[nextIndex].customer}`
        });
      } else {
        toast({
          title: "All deliveries completed",
          description: "Great job! You've completed all assigned deliveries."
        });
      }
    }, 600);
  };

  // Navigate to camera with delivery info
  const navigateToCamera = () => {
    navigate('/mobile-driver/camera', { state: { delivery: currentDelivery } });
  };

  // Navigate to map with delivery info
  const navigateToMap = () => {
    navigate('/mobile-driver/map', { state: { delivery: currentDelivery } });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-sethsri-red text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Driver App</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-sethsri-red/80"
              onClick={() => {}}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          {/* Driver Info */}
          <div className="flex items-center space-x-3 mt-2">
            <Avatar className="h-14 w-14 border-2 border-white">
              {driver.avatarUrl ? (
                <AvatarImage src={driver.avatarUrl} alt={driver.name} />
              ) : (
                <AvatarFallback className="bg-sethsri-gray text-lg">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{driver.name}</div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="bg-sethsri-gray border-gray-400 text-white">
                  {driver.id}
                </Badge>
                <Badge variant="outline" className="bg-success-500 border-success-400 text-white">
                  Active
                </Badge>
              </div>
              <div className="text-sm mt-1">Vehicle: {driver.vehicle}</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm font-semibold">{completedDeliveries}/{totalDeliveries} Deliveries</span>
          </div>
          <Progress 
            value={(completedDeliveries / totalDeliveries) * 100} 
            className="h-2.5"
            indicatorClassName="bg-sethsri-red"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="current">Current Deliveries</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto pb-24">
          {/* Current Deliveries Tab */}
          {activeTab === "current" && (
            <>
              {/* Current/Next Delivery */}
              {todayDeliveries.length > 0 && (
                <Card 
                  className={`border-l-4 border-l-sethsri-red shadow-sm hover:shadow-md transition-shadow ${
                    showEntryAnimation ? 'animate-scale-in' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-start">
                      <span>Current Delivery</span>
                      <Badge className={currentDelivery.status === "in-progress" ? "bg-warning-500" : "bg-sethsri-blue"}>
                        {currentDelivery.status === "in-progress" ? "In Progress" : "Next Stop"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-sethsri-red mr-2 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium">{currentDelivery.address}</div>
                          <div className="text-sm text-gray-500">{currentDelivery.distance} away</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-sethsri-gray mr-2 shrink-0" />
                        <div className="font-medium">{currentDelivery.customer}</div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-sethsri-gray mr-2 shrink-0" />
                        <div className="font-medium">{currentDelivery.time}</div>
                      </div>
                      
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-sethsri-gray mr-2 shrink-0" />
                        <div className="font-medium">{currentDelivery.packages} Package{currentDelivery.packages > 1 ? 's' : ''}</div>
                      </div>

                      {currentDelivery.instructions && (
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-sethsri-gray mr-2 mt-0.5 shrink-0" />
                          <div className="text-sm">{currentDelivery.instructions}</div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Button 
                          className="flex-1 bg-sethsri-blue hover:bg-sethsri-blue/90" 
                          onClick={navigateToMap}
                        >
                          <Navigation className="mr-1 h-4 w-4" />
                          Navigate
                        </Button>
                        
                        <Button 
                          className="flex-1 bg-sethsri-red hover:bg-sethsri-red/90"
                          onClick={handleNextStop}
                          disabled={isCompleting}
                        >
                          {isCompleting ? (
                            'Completing...'
                          ) : currentDelivery.status === "in-progress" ? (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Complete
                            </>
                          ) : (
                            <>
                              <Truck className="mr-1 h-4 w-4" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-sethsri-blue text-sethsri-blue hover:bg-sethsri-blue/10"
                          onClick={() => {}}
                        >
                          <PhoneCall className="mr-1 h-4 w-4" />
                          Call Customer
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-sethsri-gray text-sethsri-gray hover:bg-sethsri-gray/10"
                          onClick={() => navigate(`/mobile-driver/order/${currentDelivery.id}`)}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Add Notes
                        </Button>
                      </div>

                      <Button
                        className="w-full bg-success-500 hover:bg-success-600 mt-2"
                        onClick={navigateToCamera}
                      >
                        <Camera className="mr-1 h-4 w-4" />
                        Take Delivery Photo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Upcoming Deliveries */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-sethsri-gray">Upcoming Deliveries</h2>
                <div className="space-y-3">
                  {todayDeliveries.slice(currentDeliveryIndex + 1).map((delivery) => (
                    <Card key={delivery.id} className="hover:border-sethsri-red/20 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{delivery.customer}</h3>
                          <Badge variant="outline" className="text-xs text-sethsri-blue border-sethsri-blue/30">
                            {delivery.time}
                          </Badge>
                        </div>
                        
                        <div className="text-sm flex items-start mb-1.5">
                          <MapPin className="h-4 w-4 text-sethsri-red mr-1.5 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{delivery.address}</span>
                        </div>
                        
                        <div className="text-sm flex items-center space-x-4">
                          <span className="flex items-center">
                            <Package className="h-4 w-4 text-sethsri-gray mr-1.5" />
                            {delivery.packages}
                          </span>
                          <span className="flex items-center">
                            <Navigation className="h-4 w-4 text-sethsri-gray mr-1.5" />
                            {delivery.distance}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost" 
                          className="w-full mt-2 text-sethsri-blue hover:bg-sethsri-blue/10"
                          onClick={() => navigate(`/mobile-driver/order/${delivery.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Today's Summary */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-sethsri-gray">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-md hover:shadow-sm transition-shadow">
                      <div className="text-sm text-gray-600">Completed</div>
                      <div className="text-2xl font-bold text-sethsri-blue">{completedDeliveries}</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-md hover:shadow-sm transition-shadow">
                      <div className="text-sm text-gray-600">Pending</div>
                      <div className="text-2xl font-bold text-warning-500">{todayDeliveries.length}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-md hover:shadow-sm transition-shadow">
                      <div className="text-sm text-gray-600">On-Time</div>
                      <div className="text-2xl font-bold text-success-500">100%</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-md hover:shadow-sm transition-shadow">
                      <div className="text-sm text-gray-600">Distance</div>
                      <div className="text-2xl font-bold text-purple-700">9.8mi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Completed Deliveries Tab */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-sethsri-gray">Completed Deliveries</h2>
              <CompletedDeliveriesList 
                deliveries={completedDeliveriesFromHook}
                onSelect={(delivery) => {
                  navigate(`/mobile-driver/order/${delivery.id}`);
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
          <Button variant="ghost" className="flex flex-col h-auto text-sethsri-red" onClick={() => navigate('/mobile-driver')}>
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Deliveries</span>
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

        {/* Start Confirmation Dialog */}
        <AlertDialog open={showStartConfirmation} onOpenChange={setShowStartConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start Delivery</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to start the delivery to {currentDelivery.customer}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmStart}
                className="bg-sethsri-red text-white hover:bg-sethsri-red/90"
              >
                Start Delivery
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Complete Confirmation Dialog */}
        <AlertDialog open={showCompleteConfirmation} onOpenChange={setShowCompleteConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Delivery</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this delivery as completed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmComplete}
                className="bg-sethsri-red text-white hover:bg-sethsri-red/90"
              >
                Complete Delivery
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
};

export default MobileDriverApp;
