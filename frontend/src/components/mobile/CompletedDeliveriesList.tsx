
import React from 'react';
import { format } from 'date-fns';
import { Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Delivery } from '@/hooks/use-mobile-driver';

interface CompletedDeliveriesListProps {
  deliveries: Delivery[];
  onSelect?: (delivery: Delivery) => void;
}

export const CompletedDeliveriesList = ({ 
  deliveries, 
  onSelect 
}: CompletedDeliveriesListProps) => {
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p>No completed deliveries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery) => (
        <Card 
          key={delivery.id} 
          className="hover:shadow-md transition-shadow animate-fade-in"
          onClick={() => onSelect?.(delivery)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{delivery.customer}</h3>
                  <Badge className="bg-success-500">Completed</Badge>
                </div>
                
                <p className="text-sm text-sethsri-gray mt-1">{delivery.address}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1 text-sethsri-gray" />
                    {delivery.completedAt ? (
                      format(new Date(delivery.completedAt), 'MMM d, h:mm a')
                    ) : (
                      delivery.time
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-1 text-sethsri-gray" />
                    {delivery.packages} {delivery.packages === 1 ? 'package' : 'packages'}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-sm flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 text-sethsri-red" />
                  {delivery.distance}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
