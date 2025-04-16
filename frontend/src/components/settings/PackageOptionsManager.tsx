
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

type PackageOption = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export function PackageOptionsManager() {
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([
    {
      id: '1',
      name: 'Standard Package',
      price: 2.50,
      description: 'Standard packaging for regular items'
    },
    {
      id: '2',
      name: 'Premium Package',
      price: 5.00,
      description: 'Enhanced packaging with extra protection'
    },
    {
      id: '3',
      name: 'Express Package',
      price: 7.50,
      description: 'Premium packaging with priority handling'
    }
  ]);

  const addPackageOption = () => {
    const newId = String(Date.now());
    setPackageOptions([
      ...packageOptions,
      {
        id: newId,
        name: 'New Package Option',
        price: 0.00,
        description: 'Describe this package option'
      }
    ]);
  };

  const updatePackageOption = (id: string, field: keyof PackageOption, value: string | number) => {
    setPackageOptions(
      packageOptions.map(option => 
        option.id === id 
          ? { ...option, [field]: value } 
          : option
      )
    );
  };

  const removePackageOption = (id: string) => {
    setPackageOptions(packageOptions.filter(option => option.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {packageOptions.map((option) => (
          <div key={option.id} className="flex flex-col space-y-3 p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor={`name-${option.id}`}>Package Name</Label>
                <Input 
                  id={`name-${option.id}`}
                  value={option.name}
                  onChange={(e) => updatePackageOption(option.id, 'name', e.target.value)}
                  placeholder="Enter package name"
                />
              </div>
              <div className="space-y-1 w-24">
                <Label htmlFor={`price-${option.id}`}>Price (£)</Label>
                <Input 
                  id={`price-${option.id}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={option.price}
                  onChange={(e) => updatePackageOption(option.id, 'price', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`desc-${option.id}`}>Description</Label>
              <Textarea 
                id={`desc-${option.id}`}
                value={option.description}
                onChange={(e) => updatePackageOption(option.id, 'description', e.target.value)}
                placeholder="Describe this package option"
                rows={2}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removePackageOption(option.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" onClick={addPackageOption} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Package Option
      </Button>
    </div>
  );
}
