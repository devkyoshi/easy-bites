
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const vehicleCategoryOptions = [
  { value: 'small_van', label: 'Small Van' },
  { value: 'medium_van', label: 'Medium Van' },
  { value: 'large_van', label: 'Large Van' },
  { value: 'hgv', label: 'HGV' },
  { value: 'refrigerated', label: 'Refrigerated' },
  { value: 'motorbike', label: 'Motorbike' },
];

const fuelTypeOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'lpg', label: 'LPG' },
];

const vehicleStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'out_of_service', label: 'Out of Service' },
];

const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, { message: 'Registration number is required' })
    .max(10)
    .regex(/^[A-Z0-9 ]+$/, {
      message: 'Registration number must be uppercase letters and numbers',
    }),
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  fuelType: z.string().min(1, { message: 'Fuel type is required' }),
  loadCapacity: z.string().optional(),
  motExpiryDate: z.date({
    required_error: 'MOT expiry date is required',
  }),
  taxExpiryDate: z.date({
    required_error: 'Tax expiry date is required',
  }),
  insuranceExpiryDate: z.date({
    required_error: 'Insurance expiry date is required',
  }),
  assignedDriver: z.string().optional(),
  notes: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export function AddVehicleForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues: Partial<VehicleFormValues> = {
    status: 'active',
    notes: '',
    assignedDriver: 'Unassigned',
  };

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  const onSubmit = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    
    // This is where you would typically send data to your API
    console.log('Submitting vehicle data:', data);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Vehicle added successfully',
        description: `${data.make} ${data.model} (${data.registrationNumber}) has been added to the fleet.`,
      });
      onClose();
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. AB12 CDE"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ford" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Transit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fuelTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loadCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Capacity (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1200" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedDriver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Driver</FormLabel>
                <FormControl>
                  <Input placeholder="Unassigned" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>MOT Expiry *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Road Tax Expiry *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insuranceExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Insurance Expiry *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about the vehicle"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Add Vehicle
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
