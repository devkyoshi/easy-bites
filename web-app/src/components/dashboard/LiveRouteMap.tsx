
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Navigation, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'idle' | 'issue';
  ordersCount: number;
  eta: string;
  nextStop: string;
}

const driverData: Driver[] = [
  {
    id: 'D001',
    name: 'John Smith',
    vehicle: 'KN67 ZXC',
    location: { lat: 51.507, lng: -0.127 },
    status: 'active',
    ordersCount: 7,
    eta: '14:30',
    nextStop: '24 High Street, London'
  },
  {
    id: 'D002',
    name: 'Sarah Johnson',
    vehicle: 'LP19 TRE',
    location: { lat: 51.515, lng: -0.09 },
    status: 'active',
    ordersCount: 5,
    eta: '15:15',
    nextStop: '8 Church Lane, London'
  },
  {
    id: 'D003',
    name: 'Mike Davies',
    vehicle: 'KJ70 POP',
    location: { lat: 51.501, lng: -0.142 },
    status: 'issue',
    ordersCount: 6,
    eta: '14:45',
    nextStop: '156 Park Road, London'
  },
  {
    id: 'D004',
    name: 'Emma Wilson',
    vehicle: 'BN20 ABC',
    location: { lat: 51.495, lng: -0.11 },
    status: 'idle',
    ordersCount: 0,
    eta: 'N/A',
    nextStop: 'Returning to depot'
  }
];

export function LiveRouteMap() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };
  
  const getStatusBadge = (status: Driver['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="border-success-200 text-success-700 bg-success-50">Active</Badge>;
      case 'idle':
        return <Badge variant="outline" className="border-accent-200 text-accent-700 bg-accent-50">Idle</Badge>;
      case 'issue':
        return <Badge variant="outline" className="border-danger-200 text-danger-700 bg-danger-50">Issue</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Live Route Map</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Link to="/routes">
              <Button variant="outline" size="sm">
                View All Routes
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 h-[400px]">
          <div className="col-span-1 border-r border-border overflow-y-auto max-h-[400px]">
            <div className="p-3">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-medium">Active Drivers</h3>
                <Badge variant="outline">{driverData.length}</Badge>
              </div>
              <div className="space-y-2">
                {driverData.map((driver) => (
                  <div 
                    key={driver.id} 
                    className={`p-2 border rounded-md cursor-pointer transition-colors ${
                      selectedDriver?.id === driver.id 
                        ? 'bg-accent-50 border-accent-200' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">{driver.name}</div>
                      {getStatusBadge(driver.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Truck className="h-3 w-3 mr-1" /> 
                      {driver.vehicle}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{driver.nextStop}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>Orders: {driver.ordersCount}</span>
                      <span>ETA: {driver.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="relative h-[400px] bg-slate-100 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">Loading map...</div>
                </div>
              ) : (
                <>
                  {/* This is a placeholder for the actual map */}
                  <div className="absolute inset-0 bg-[url('https://i.imgur.com/MK4NUzI.png')] bg-cover bg-center" />
                  
                  {/* Selected Driver Info */}
                  {selectedDriver && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <Card className="p-3 shadow-lg bg-white/90 backdrop-blur-sm">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{selectedDriver.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              Vehicle: {selectedDriver.vehicle}
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(selectedDriver.status)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Navigation className="h-4 w-4 text-accent-500" />
                            <span>Next Stop: {selectedDriver.nextStop}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle className="h-4 w-4 text-warning-500" />
                            <span>ETA: {selectedDriver.eta}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                  
                  {/* Map Controls - For visual effect only */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <div className="bg-white p-2 rounded-md shadow-md">
                      <div className="grid grid-cols-2 gap-1">
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">+</button>
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">-</button>
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">↺</button>
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">⊕</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
