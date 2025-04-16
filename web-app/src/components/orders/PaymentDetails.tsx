
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// This would normally come from an API or context
// Here we're using the same structure as in PackageOptionsManager
const getPackageOptions = () => [
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
];

interface PaymentDetailsProps {
  isCompact?: boolean;
}

export function PaymentDetails({ isCompact = false }: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [includePackageFee, setIncludePackageFee] = useState(true);
  const [packageType, setPackageType] = useState('1');
  const [packageOptions, setPackageOptions] = useState(getPackageOptions());
  
  // Calculate fees based on selections
  const baseFee = 15.00;
  const selectedPackage = packageOptions.find(pkg => pkg.id === packageType);
  const packageFee = includePackageFee && selectedPackage ? selectedPackage.price : 0;
  const totalFee = baseFee + packageFee;

  return (
    <div className={`space-y-6 ${isCompact ? '' : 'p-4'}`}>
      {!isCompact && <h3 className="text-lg font-medium mb-2">Payment & Package Details</h3>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <h4 className="font-medium">Package Options</h4>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="packageFee" 
              checked={includePackageFee} 
              onCheckedChange={setIncludePackageFee}
            />
            <Label htmlFor="packageFee">Include Package Fee</Label>
          </div>
          
          {includePackageFee && (
            <div className="space-y-3 pt-2">
              <Select value={packageType} onValueChange={setPackageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  {packageOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} (£{option.price.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-gray-500">
                {selectedPackage?.description || "Select a package type"}
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-4 space-y-4">
          <h4 className="font-medium">Payment Method</h4>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit" id="credit" />
              <Label htmlFor="credit">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="account" id="account" />
              <Label htmlFor="account">Account Balance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice">Invoice Customer</Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === 'invoice' && (
            <div className="space-y-3 pt-2">
              <Label htmlFor="poNumber">Purchase Order Number</Label>
              <Input id="poNumber" placeholder="Enter PO number" />
            </div>
          )}
        </Card>
      </div>
      
      <Card className="p-4">
        <h4 className="font-medium mb-4">Order Summary</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Shipping Fee</span>
            <span>£{baseFee.toFixed(2)}</span>
          </div>
          
          {includePackageFee && selectedPackage && (
            <div className="flex justify-between text-sm">
              <span>{selectedPackage.name}</span>
              <span>£{selectedPackage.price.toFixed(2)}</span>
            </div>
          )}
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>£{totalFee.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
