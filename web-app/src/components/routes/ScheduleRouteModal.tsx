
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock, Truck, CalendarCheck, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoutesScheduled: () => void;
}

const scheduleFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  autoAssign: z.boolean().default(true),
  optimizeRoutes: z.boolean().default(true),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export function ScheduleRouteModal({ open, onOpenChange, onRoutesScheduled }: ScheduleRouteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      autoAssign: true,
      optimizeRoutes: true,
    },
  });

  const onSubmit = (data: ScheduleFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onRoutesScheduled();
      form.reset();
    }, 1500);
  };

  const pendingOrders = [
    { id: 1, consignment: "ORD-7825", customer: "Office Depot", location: "North London", packages: 3 },
    { id: 2, consignment: "ORD-7826", customer: "Park Lane Apartments", location: "North London", packages: 1 },
    { id: 3, consignment: "ORD-7827", customer: "Garden Centre", location: "East London", packages: 2 },
    { id: 4, consignment: "ORD-7828", customer: "Tech Solutions Ltd", location: "East London", packages: 2 },
  ];

  const availableDrivers = [
    { id: 1, name: "John Smith", vehicle: "Ford Transit (LX21 WER)", availability: "Full Day" },
    { id: 2, name: "Sarah Johnson", vehicle: "Mercedes Sprinter (KY21 PLX)", availability: "Morning" },
    { id: 3, name: "Raj Patel", vehicle: "Vauxhall Vivaro (CG20 TBL)", availability: "Full Day" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Routes</DialogTitle>
          <DialogDescription>
            Plan and schedule delivery routes for upcoming dates.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-6 py-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Date</FormLabel>
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
                              <span>Pick a date</span>
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
                          disabled={(date) => 
                            date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="autoAssign"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Auto-assign Orders</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Automatically assign orders to available drivers
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="optimizeRoutes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Optimize Routes</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Use AI to optimize routes for fuel efficiency
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Pending Orders ({pendingOrders.length})</h3>
                  <div className="max-h-[140px] overflow-y-auto space-y-2">
                    {pendingOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center text-sm p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{order.consignment}</div>
                          <div className="text-slate-500">{order.customer}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{order.location}</Badge>
                          <Badge>{order.packages} pkgs</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Available Drivers ({availableDrivers.length})</h3>
                  <div className="max-h-[140px] overflow-y-auto space-y-2">
                    {availableDrivers.map(driver => (
                      <div key={driver.id} className="flex justify-between items-center text-sm p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-slate-500">{driver.vehicle}</div>
                        </div>
                        <Badge variant="outline">{driver.availability}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Routes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
