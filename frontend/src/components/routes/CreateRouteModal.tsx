
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import { MapPin, Truck, User, Package, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteCreated: () => void;
}

const routeFormSchema = z.object({
  driver: z.string({
    required_error: "Please select a driver",
  }),
  vehicle: z.string({
    required_error: "Please select a vehicle",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  orderSelection: z.enum(["all", "manual"]).default("all"),
  orders: z.array(z.string()).optional(),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

// Sample orders for demonstration
const sampleOrders = [
  { id: "1", consignment: "ORD-7825", customer: "Office Depot", location: "North London", packages: 3 },
  { id: "2", consignment: "ORD-7826", customer: "Park Lane Apartments", location: "North London", packages: 1 },
  { id: "3", consignment: "ORD-7827", customer: "Garden Centre", location: "East London", packages: 2 },
  { id: "4", consignment: "ORD-7828", customer: "Tech Solutions Ltd", location: "East London", packages: 2 },
  { id: "5", consignment: "ORD-7829", customer: "City Hospital", location: "Central London", packages: 4 },
  { id: "6", consignment: "ORD-7830", customer: "Business Center", location: "West London", packages: 3 },
];

export function CreateRouteModal({ open, onOpenChange, onRouteCreated }: CreateRouteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      driver: "",
      vehicle: "",
      startTime: "",
      orderSelection: "all",
      orders: [],
    },
  });

  const orderSelection = form.watch("orderSelection");

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
    form.setValue("orders", selectedOrders);
  };

  const onSubmit = (data: RouteFormValues) => {
    setIsLoading(true);
    
    // Include selected orders in submission if manual selection
    if (data.orderSelection === "manual") {
      data.orders = selectedOrders;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onRouteCreated();
      form.reset();
      setSelectedOrders([]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Route</DialogTitle>
          <DialogDescription>
            Set up a new delivery route with driver and order assignments.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-6 py-4">
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="orders">Order Selection</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="driver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" /> Driver
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a driver" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">John Smith</SelectItem>
                              <SelectItem value="2">Sarah Johnson</SelectItem>
                              <SelectItem value="3">Raj Patel</SelectItem>
                              <SelectItem value="4">Emma Williams</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Truck className="h-4 w-4" /> Vehicle
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="v1">Ford Transit (LX21 WER)</SelectItem>
                              <SelectItem value="v2">Mercedes Sprinter (KY21 PLX)</SelectItem>
                              <SelectItem value="v3">Vauxhall Vivaro (CG20 TBL)</SelectItem>
                              <SelectItem value="v4">Nissan NV200 (LE22 XVF)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="orders">
                  <FormField
                    control={form.control}
                    name="orderSelection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Package className="h-4 w-4" /> Order Selection Method
                        </FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setIsOrdersOpen(value === "manual");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Pending Orders</SelectItem>
                            <SelectItem value="manual">Manual Selection</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {orderSelection === "all" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Available Order Groups</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <span>All Pending Orders</span>
                          <Badge>12 orders</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <span>North London Region</span>
                          <Badge>5 orders</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <span>South London Region</span>
                          <Badge>3 orders</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <span>East London Region</span>
                          <Badge>4 orders</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {orderSelection === "manual" && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Select Orders Manually</h4>
                      <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {sampleOrders.map(order => (
                          <div 
                            key={order.id} 
                            className={`flex items-center justify-between p-2 border rounded-md ${
                              selectedOrders.includes(order.id) ? "border-blue-500 bg-blue-50" : ""
                            }`}
                            onClick={() => toggleOrderSelection(order.id)}
                          >
                            <div className="flex items-center">
                              <Checkbox 
                                checked={selectedOrders.includes(order.id)}
                                onCheckedChange={() => toggleOrderSelection(order.id)}
                                className="mr-2"
                              />
                              <div>
                                <div className="font-medium">{order.consignment}</div>
                                <div className="text-sm text-gray-500">{order.customer}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{order.location}</Badge>
                              <Badge>{order.packages} pkgs</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm">
                        {selectedOrders.length} orders selected
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="rounded-md bg-slate-50 p-4">
                <h4 className="font-medium mb-2">Route Preview</h4>
                <div className="text-sm text-slate-500">
                  {form.watch("driver") ? (
                    <>Selected driver: {form.watch("driver")}<br /></>
                  ) : (
                    "Select a driver, vehicle and orders to see a preview of the route."
                  )}
                </div>
                <div className="h-[160px] w-full rounded-md bg-slate-100 mt-2 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-slate-300" />
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
                {isLoading ? "Creating..." : "Create Route"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
