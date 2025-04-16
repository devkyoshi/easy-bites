import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentDetails } from './PaymentDetails';
import { Save, Plus, Truck, Clock, Package, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageDimensions } from './PackageDimensions';
import { AddressAutocomplete } from './AddressAutocomplete';
import { TimeWindow } from './TimeWindow';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DriverAssignment } from './DriverAssignment';
import { RichMediaRemarks } from './RichMediaRemarks';
import { OrderStatus } from './OrderStatus';
import { DriverComments } from './DriverComments';

const orderFormSchema = z.object({
  consignmentNo: z.string().min(1, "Consignment number is required"),
  pieces: z.coerce.number().min(1, "Number of pieces must be at least 1"),
  weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  bagNo: z.string().min(1, "Bag number is required"),
  serviceInfo: z.string().optional(),
  remarks: z.string().optional(),
  driverId: z.string().optional(),
  
  length: z.coerce.number().min(0, "Length must be a positive number").optional(),
  width: z.coerce.number().min(0, "Width must be a positive number").optional(),
  height: z.coerce.number().min(0, "Height must be a positive number").optional(),
  contentsCategory: z.string().optional(),
  
  serviceLevel: z.enum(["sameDay", "nextDay", "economy"]),
  priority: z.enum(["standard", "express", "critical"]).default("standard"),
  
  collectionTimeStart: z.string().optional(),
  collectionTimeEnd: z.string().optional(),
  deliveryTimeStart: z.string().optional(),
  deliveryTimeEnd: z.string().optional(),
  
  actualCollectionTimeStart: z.string().optional(),
  actualCollectionTimeEnd: z.string().optional(),
  actualDeliveryTimeStart: z.string().optional(),
  actualDeliveryTimeEnd: z.string().optional(),
  
  completionStatus: z.string().default("pending"),
  paymentStatus: z.string().default("unpaid"),
  signedBy: z.string().optional(),
  
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  paymentDueDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  
  consignorName: z.string().min(1, "Consignor name is required"),
  consignorStreet: z.string().min(1, "Street is required"),
  consignorCity: z.string().min(1, "City is required"),
  consignorCountry: z.string().min(1, "Country is required"),
  consignorPostcode: z.string().optional(),
  consignorPhone: z.string().optional(),
  
  consigneeName: z.string().min(1, "Consignee name is required"),
  consigneeStreet: z.string().min(1, "Street is required"),
  consigneeCity: z.string().min(1, "City is required"),
  consigneeCountry: z.string().min(1, "Country is required"),
  consigneePostcode: z.string().min(1, "Postcode is required for UK delivery"),
  consigneePhone: z.string().optional(),
  
  attachments: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      name: z.string(),
      url: z.string(),
      thumbnailUrl: z.string().optional(),
      size: z.number(),
      createdAt: z.date()
    })
  ).default([])
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const DRIVERS = [
  { id: "1", name: "John Smith", workload: 8, territory: "North London", specialization: "Heavy Goods" },
  { id: "2", name: "Sarah Johnson", workload: 5, territory: "South London", specialization: "Express" },
  { id: "3", name: "Raj Patel", workload: 7, territory: "East London", specialization: "Standard" },
  { id: "4", name: "Emma Williams", workload: 3, territory: "West London", specialization: "Fragile Items" },
  { id: "5", name: "Fahad Khan", workload: 6, territory: "Central London", specialization: "Refrigerated" },
];

const CONTENT_CATEGORIES = [
  { id: "food", name: "Food & Perishables" },
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing & Textiles" },
  { id: "documents", name: "Documents" },
  { id: "fragile", name: "Fragile Items" },
  { id: "medical", name: "Medical Supplies" },
  { id: "hazardous", name: "Hazardous Materials" },
  { id: "other", name: "Other" },
];

interface OrderFormProps {
  onFormChange?: (data: any) => void;
}

export function OrderForm({ onFormChange }: OrderFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  const defaultValues: Partial<OrderFormValues> = {
    currency: "GBP",
    consignorCountry: "UK",
    consigneeCountry: "UK",
    pieces: 1,
    serviceLevel: "nextDay",
    priority: "standard",
    completionStatus: "pending",
    paymentStatus: "unpaid",
    attachments: []
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onFormChange) {
        onFormChange(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);
    
    const isDuplicate = false; // In real implementation, check against existing orders
    
    if (isDuplicate) {
      toast({
        title: "Duplicate order detected",
        description: "An order with similar details already exists.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      console.log(data);
      toast({
        title: "Order created",
        description: `Consignment ${data.consignmentNo} has been created successfully.`,
      });
      setIsSubmitting(false);
    }, 1000);
  }

  const handleDriverSelect = (driverId: string) => {
    form.setValue("driverId", driverId);
    setSelectedDriverId(driverId);
    setShowDriverDialog(false);
    
    toast({
      title: "Driver assigned",
      description: `Notification sent to ${DRIVERS.find(d => d.id === driverId)?.name}.`,
    });
  };

  const selectedDriver = selectedDriverId ? DRIVERS.find(d => d.id === selectedDriverId) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="order">Order Details</TabsTrigger>
            <TabsTrigger value="package">Package Info</TabsTrigger>
            <TabsTrigger value="addresses">Addresses & Times</TabsTrigger>
            <TabsTrigger value="remarks">Remarks & Media</TabsTrigger>
            <TabsTrigger value="status">Status & Invoice</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="driver-updates">Driver Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="consignmentNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consignment No. *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 005901729141" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pieces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pieces *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Enter number of pieces" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0.1" placeholder="Enter weight in kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceLevel"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Service Level *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sameDay" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Same-Day Delivery
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="nextDay" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Next-Day Delivery
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="economy" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Economy (2-3 Days)
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Priority Level *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="standard" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Standard
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="express" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Express
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="critical" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Critical
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., FLOUR, COCONUT POWDER, BISCUITS, CHIPS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="Enter monetary value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GBP, USD, EUR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bagNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bag No. *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bag number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Info</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EXP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="package" className="space-y-6">
            <PackageDimensions form={form} contentCategories={CONTENT_CATEGORIES} />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Consignor Details (Sender)</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="consignorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name/Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., UPR COURIER SERVICE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignorPostcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode *</FormLabel>
                        <FormControl>
                          <AddressAutocomplete 
                            value={field.value || ''} 
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            onAddressSelect={(address) => {
                              form.setValue("consignorStreet", address.street);
                              form.setValue("consignorCity", address.city);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignorStreet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5A, GALPOTHA STREET" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignorCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., COLOMBO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignorCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., UK - United Kingdom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignorPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+44 7777 123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Collection Time Window</h4>
                    <TimeWindow
                      startFieldName="collectionTimeStart"
                      endFieldName="collectionTimeEnd"
                      form={form}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Consignee Details (Recipient)</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="consigneeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name/Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., A SVASABTHAKUMARAN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneePostcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode *</FormLabel>
                        <FormControl>
                          <AddressAutocomplete 
                            value={field.value || ''} 
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            onAddressSelect={(address) => {
                              form.setValue("consigneeStreet", address.street);
                              form.setValue("consigneeCity", address.city);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneeStreet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 111 CD ORMERSWELLS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneeCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., LANESOUTHALL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneeCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., GB - United Kingdom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consigneePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+44 7777 123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Delivery Time Window</h4>
                    <TimeWindow
                      startFieldName="deliveryTimeStart"
                      endFieldName="deliveryTimeEnd"
                      form={form}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="remarks" className="space-y-6">
            <RichMediaRemarks 
              form={form} 
              remarksFieldName="remarks" 
              attachmentsFieldName="attachments" 
            />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <OrderStatus form={form} />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentDetails />
          </TabsContent>

          <TabsContent value="shipping">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Shipping Assignment</h3>
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <h4 className="text-sm font-medium">Driver Assignment</h4>
                  
                  {selectedDriver ? (
                    <div className="p-4 border rounded-md bg-slate-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{selectedDriver.name}</p>
                          <p className="text-sm text-muted-foreground">Territory: {selectedDriver.territory}</p>
                          <p className="text-sm text-muted-foreground">Specialization: {selectedDriver.specialization}</p>
                        </div>
                        <Button variant="outline" onClick={() => setShowDriverDialog(true)}>
                          Change Driver
                        </Button>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium">Current Workload</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div 
                            className={cn(
                              "h-2.5 rounded-full",
                              selectedDriver.workload < 5 ? "bg-green-500" : 
                              selectedDriver.workload < 8 ? "bg-yellow-500" : 
                              "bg-red-500"
                            )}
                            style={{ width: `${(selectedDriver.workload / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full h-32 border-dashed"
                      onClick={() => setShowDriverDialog(true)}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Truck className="w-10 h-10 text-muted-foreground" />
                        <span>Assign a Driver</span>
                      </div>
                    </Button>
                  )}
                  
                  <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
                    <DialogContent className="max-w-3xl">
                      <DriverAssignment 
                        drivers={DRIVERS} 
                        onDriverSelect={handleDriverSelect} 
                        selectedDriverId={selectedDriverId}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-md border border-blue-100">
                  <Truck className="text-blue-500 mr-3 h-5 w-5" />
                  <p className="text-sm text-blue-700">
                    Assigning a driver at order creation is optional. You can also assign or reassign drivers later.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="driver-updates">
            <div className="space-y-6">
              <DriverComments 
                orderId={form.getValues('consignmentNo') || 'New Order'} 
                initialStatus={form.getValues('completionStatus')}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Order"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
