
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, Info } from 'lucide-react';

// This is a placeholder implementation of a map
// In a production app, you would integrate with a real mapping solution like Mapbox, Google Maps, or Leaflet
interface RouteMapProps {
  selectedDriverId?: string | null;
  automated?: boolean;
}

export function RouteMap({ selectedDriverId, automated = false }: RouteMapProps) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading map...</div>
      </div>
    );
  }
  
  // If no driver is selected, show instructions
  if (!selectedDriverId && !automated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-center p-6">
        <MapPin className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Route Selected</h3>
        <p className="text-slate-500 max-w-md">
          Select a driver from the list to visualize their route with the new delivery order.
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative h-full bg-slate-100 rounded-md overflow-hidden">
      {/* This is a placeholder for the actual map */}
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/MK4NUzI.png')] bg-cover bg-center opacity-90" />
      
      {/* Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <div className="grid grid-cols-2 gap-1">
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">+</button>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">-</button>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">↺</button>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100">⊕</button>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-md shadow-md">
          <div className="flex flex-col gap-1">
            <button className="flex items-center justify-center p-1 rounded hover:bg-slate-100">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </button>
            <button className="flex items-center justify-center p-1 rounded hover:bg-slate-100">
              <MapPin className="h-4 w-4 text-blue-500" />
            </button>
            <button className="flex items-center justify-center p-1 rounded hover:bg-slate-100">
              <Info className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Route Info */}
      <div className="absolute bottom-3 left-3 right-3">
        <Card className="p-3 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{automated ? 'Optimized Route' : 'Driver Route'}</h3>
              <div className="text-sm text-slate-500 mt-1">
                {automated
                  ? '3 drivers • 24 packages • 128 miles total'
                  : 'Est. delivery time: 14:30 - 15:00'}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {automated ? 'Algorithm-driven' : 'Manual Assignment'}
              </Badge>
              {automated && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Fuel Optimized
                </Badge>
              )}
            </div>
          </div>
          
          {/* Route Restrictions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3" />
              ULEZ Zone
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Congestion Charge
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center">
              <Info className="mr-1 h-3 w-3" />
              School Zone (8:00-9:30)
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
