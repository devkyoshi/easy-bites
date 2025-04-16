
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, MapPin, Package, Check, UserPlus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AddDriverModal } from '@/components/drivers/AddDriverModal';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/contexts/LoadingContext';

interface Driver {
  id: string;
  name: string;
  workload: number;
  territory: string;
  specialization: string;
}

interface DriverAssignmentProps {
  drivers: Driver[];
  onDriverSelect: (driverId: string) => void;
  selectedDriverId: string | null;
}

// Sample drivers data
const sampleDrivers: Driver[] = [
  { id: 'D001', name: 'John Smith', workload: 3, territory: 'London', specialization: 'Standard Delivery' },
  { id: 'D002', name: 'Sarah Johnson', workload: 7, territory: 'Manchester', specialization: 'Heavy Goods' },
  { id: 'D003', name: 'Mike Davies', workload: 4, territory: 'Birmingham', specialization: 'Refrigerated' },
  { id: 'D004', name: 'Emma Wilson', workload: 9, territory: 'Leeds', specialization: 'Hazardous Materials' },
  { id: 'D005', name: 'Robert Brown', workload: 2, territory: 'Glasgow', specialization: 'International' },
];

export function DriverAssignment({ drivers = sampleDrivers, onDriverSelect, selectedDriverId }: DriverAssignmentProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [driversList, setDriversList] = useState<Driver[]>(drivers);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  
  useEffect(() => {
    setDriversList(drivers);
    setFilteredDrivers(drivers);
  }, [drivers]);
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilteredDrivers(
      driversList.filter(driver => 
        driver.name.toLowerCase().includes(value.toLowerCase()) ||
        driver.territory.toLowerCase().includes(value.toLowerCase()) ||
        driver.specialization.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleAddDriver = () => {
    setIsAddDriverModalOpen(true);
  };
  
  const handleDriverAdded = (newDriver: Driver) => {
    const updatedDrivers = [...driversList, newDriver];
    setDriversList(updatedDrivers);
    setFilteredDrivers(
      searchTerm 
        ? updatedDrivers.filter(driver => 
            driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.specialization.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : updatedDrivers
    );
    
    toast({
      title: "Driver Added",
      description: `${newDriver.name} has been added to your driver list.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Driver Assignment</h2>
        <Button size="sm" onClick={handleAddDriver}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Driver
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Assign a driver to this order based on their workload, territory, and specialization.
      </p>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          className="pl-8"
          placeholder="Search drivers by name, territory, or specialization"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
        {filteredDrivers.map(driver => (
          <Card 
            key={driver.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-slate-50 transition-colors",
              selectedDriverId === driver.id && "ring-2 ring-primary bg-slate-50"
            )}
            onClick={() => onDriverSelect(driver.id)}
          >
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-slate-600" />
                  <span className="font-medium">{driver.name}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                  <span>{driver.territory}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-slate-600">
                  <Package className="h-4 w-4 mr-1 text-slate-500" />
                  <span>{driver.specialization}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                {selectedDriverId === driver.id && (
                  <div className="mb-2 p-1 bg-primary rounded-full text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="mt-auto">
                  <p className="text-xs font-medium mb-1 text-right">Current Workload</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        driver.workload < 5 ? "bg-green-500" : 
                        driver.workload < 8 ? "bg-yellow-500" : 
                        "bg-red-500"
                      )}
                      style={{ width: `${(driver.workload / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredDrivers.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No drivers match your search criteria
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={() => onDriverSelect("")}>
          Clear Selection
        </Button>
        <Button onClick={() => selectedDriverId && onDriverSelect(selectedDriverId)}>
          Confirm Selection
        </Button>
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)}
        onDriverAdded={handleDriverAdded}
      />
    </div>
  );
}
