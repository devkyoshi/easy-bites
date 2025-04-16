import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Check, CreditCard, Mail, Send } from "lucide-react";
import { TimeWindow } from "./TimeWindow";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface OrderStatusProps {
  form: UseFormReturn<any>;
}

export function OrderStatus({ form }: OrderStatusProps) {
  const { toast } = useToast();
  
  const completionStatuses = [
    { value: "pending", label: "Pending", className: "text-warning-700" },
    { value: "assigned", label: "Assigned", className: "text-success-700" },
    { value: "in-transit", label: "In Transit", className: "text-accent-700" },
    { value: "delayed", label: "Delayed", className: "text-amber-700" },
    { value: "delivered", label: "Delivered", className: "text-success-700" },
    { value: "failed", label: "Failed", className: "text-danger-700" },
    { value: "cancelled", label: "Cancelled", className: "text-danger-700" }
  ];
  
  const paymentStatuses = [
    { value: "unpaid", label: "Unpaid" },
    { value: "invoice-sent", label: "Invoice Sent" },
    { value: "partially-paid", label: "Partially Paid" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" }
  ];

  const handleSendInvoice = () => {
    toast({
      title: "Invoice sent",
      description: "The invoice has been sent to customer@sethsrishipping.co.uk",
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Payment reminder sent",
      description: "A payment reminder has been sent to accounts@sethsrishipping.co.uk",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Order Status</h3>
      
      <Tabs defaultValue="completion">
        <TabsList className="mb-4">
          <TabsTrigger value="completion">Completion Status</TabsTrigger>
          <TabsTrigger value="payment">Payment Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completion" className="space-y-6">
          <FormField
            control={form.control}
            name="completionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {completionStatuses.map((status) => (
                      <SelectItem 
                        key={status.value} 
                        value={status.value}
                        className={status.className}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Actual Collection Time</FormLabel>
            <TimeWindow
              startFieldName="actualCollectionTimeStart"
              endFieldName="actualCollectionTimeEnd"
              form={form}
            />
          </div>
          
          <div>
            <FormLabel>Actual Delivery Time</FormLabel>
            <TimeWindow
              startFieldName="actualDeliveryTimeStart"
              endFieldName="actualDeliveryTimeEnd"
              form={form}
            />
          </div>
          
          <FormField
            control={form.control}
            name="signedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signed By</FormLabel>
                <FormControl>
                  <Input placeholder="Name of person who signed for delivery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("completionStatus") === "delayed" && (
            <FormField
              control={form.control}
              name="delayReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="Reason for delay (e.g., Driver will complete next day)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("completionStatus") === "delayed" && (
            <FormField
              control={form.control}
              name="expectedCompletionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Completion Date</FormLabel>
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
                            format(new Date(field.value), "PPP")
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
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6">
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
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
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., INV-2023-0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Date</FormLabel>
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
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Due Date</FormLabel>
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
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                        <FormControl>
                          <RadioGroupItem value="bank-transfer" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Bank Transfer
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                        <FormControl>
                          <RadioGroupItem value="credit-card" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Credit Card
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Cash
                        </FormLabel>
                      </FormItem>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={handleSendInvoice}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={handleSendReminder}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Payment Reminder
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
