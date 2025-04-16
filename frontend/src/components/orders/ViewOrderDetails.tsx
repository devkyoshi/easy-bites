
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Package, MapPin, Clock, User, Phone, Truck, AlertTriangle, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RouteMap } from "./RouteMap";

interface ViewOrderDetailsProps {
  orderData: any;
  onEdit: () => void;
}

export function ViewOrderDetails({ orderData, onEdit }: ViewOrderDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  
  // If no order data, show placeholder
  if (!orderData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Order Data Available</h3>
        <p className="text-muted-foreground mb-6">
          There's no order data to view. Please switch to edit mode to create an order.
        </p>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Switch to Edit Mode
        </Button>
      </div>
    );
  }
  
  // Helper function to render a field
  const renderField = (label: string, value: any, icon?: any) => (
    <div className="mb-4">
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Order Reference: {orderData?.consignmentNo || "New Order"}
          </h2>
          <div className="flex items-center mt-2 space-x-2">
            <Badge 
              className={cn(
                orderData?.completionStatus === "completed" ? "bg-success-500" : 
                orderData?.completionStatus === "in-progress" ? "bg-accent-500" : 
                "bg-warning-500" 
              )}
            >
              {orderData?.completionStatus || "Pending"}
            </Badge>
            
            <Badge 
              variant="outline" 
              className={cn(
                orderData?.paymentStatus === "paid" ? "border-success-500 text-success-700" : 
                "border-warning-500 text-warning-700"
              )}
            >
              {orderData?.paymentStatus || "Unpaid"}
            </Badge>
            
            <Badge 
              variant="outline" 
              className={cn(
                orderData?.serviceLevel === "sameDay" ? "border-accent-500 text-accent-700" : 
                orderData?.serviceLevel === "nextDay" ? "border-info-500 text-info-700" : 
                "border-gray-300 text-gray-700"
              )}
            >
              {orderData?.serviceLevel === "sameDay" ? "Same-Day Delivery" : 
               orderData?.serviceLevel === "nextDay" ? "Next-Day Delivery" : 
               orderData?.serviceLevel === "economy" ? "Economy" : "Standard Service"}
            </Badge>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Order
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="package">Package Info</TabsTrigger>
          <TabsTrigger value="remarks">Remarks & Attachments</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Consignment No.", orderData?.consignmentNo, <FileText className="h-3 w-3" />)}
            {renderField("Pieces", orderData?.pieces, <Package className="h-3 w-3" />)}
            {renderField("Weight", orderData?.weight ? `${orderData?.weight} kg` : null)}
            {renderField("Description", orderData?.description)}
            {renderField("Value", orderData?.value ? `${orderData?.currency || 'GBP'} ${orderData?.value}` : null)}
            {renderField("Bag No.", orderData?.bagNo)}
            {renderField("Service Info", orderData?.serviceInfo)}
          </div>
        </TabsContent>
        
        <TabsContent value="addresses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-accent-500" />
                Collection Address
              </h3>
              <div className="space-y-3">
                <p className="font-medium">{orderData?.consignorName}</p>
                <p>{orderData?.consignorStreet}</p>
                <p>{orderData?.consignorCity}, {orderData?.consignorPostcode}</p>
                <p>{orderData?.consignorCountry}</p>
                {orderData?.consignorPhone && (
                  <p className="flex items-center mt-2">
                    <Phone className="h-3 w-3 mr-2" />
                    {orderData?.consignorPhone}
                  </p>
                )}
                
                {(orderData?.collectionTimeStart || orderData?.collectionTimeEnd) && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      Collection Window
                    </h4>
                    <p>
                      {orderData?.collectionTimeStart || "Any time"} - {orderData?.collectionTimeEnd || "Any time"}
                    </p>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-success-500" />
                Delivery Address
              </h3>
              <div className="space-y-3">
                <p className="font-medium">{orderData?.consigneeName}</p>
                <p>{orderData?.consigneeStreet}</p>
                <p>{orderData?.consigneeCity}, {orderData?.consigneePostcode}</p>
                <p>{orderData?.consigneeCountry}</p>
                {orderData?.consigneePhone && (
                  <p className="flex items-center mt-2">
                    <Phone className="h-3 w-3 mr-2" />
                    {orderData?.consigneePhone}
                  </p>
                )}
                
                {(orderData?.deliveryTimeStart || orderData?.deliveryTimeEnd) && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      Delivery Window
                    </h4>
                    <p>
                      {orderData?.deliveryTimeStart || "Any time"} - {orderData?.deliveryTimeEnd || "Any time"}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="package" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Package Dimensions</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {renderField("Length", orderData?.length ? `${orderData?.length} cm` : null)}
                {renderField("Width", orderData?.width ? `${orderData?.width} cm` : null)}
                {renderField("Height", orderData?.height ? `${orderData?.height} cm` : null)}
              </div>
              {renderField("Contents Category", orderData?.contentsCategory)}
              {renderField("Total Weight", orderData?.weight ? `${orderData?.weight} kg` : null)}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Package Preview</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md">
                {orderData?.length && orderData?.width && orderData?.height ? (
                  <div className="relative">
                    <div 
                      className="bg-blue-100 border border-blue-300 rounded-sm"
                      style={{
                        width: `${Math.min(200, orderData.length * 2)}px`,
                        height: `${Math.min(200, orderData.height * 2)}px`,
                        transform: 'perspective(500px) rotateY(15deg) rotateX(15deg)'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 text-sm">
                        <Package className="h-6 w-6 mb-2" />
                      </div>
                    </div>
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      {orderData.length} × {orderData.width} × {orderData.height} cm
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>No dimension data available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="remarks" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Remarks</h3>
            <div className="mb-6 p-4 bg-slate-50 rounded-md min-h-[100px]">
              {orderData?.remarks ? (
                <p>{orderData.remarks}</p>
              ) : (
                <p className="text-muted-foreground italic">No remarks added</p>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4">Attachments</h3>
            {orderData?.attachments && orderData.attachments.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {orderData.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="border rounded-md p-2">
                    <div className="h-24 bg-slate-100 rounded flex items-center justify-center mb-2">
                      {attachment.thumbnailUrl ? (
                        <img src={attachment.thumbnailUrl} alt={attachment.name} className="max-h-full object-contain" />
                      ) : (
                        <FileText className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(attachment.size / 1024)} KB
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No attachments</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Truck className="mr-2 h-4 w-4" />
                Driver Assignment
              </h3>
              
              {orderData?.driverId ? (
                <div className="p-4 border rounded-md bg-slate-50">
                  <p className="font-medium">
                    {/* Replace with actual driver name lookup based on ID */}
                    {orderData.driverId === "1" ? "John Smith" :
                     orderData.driverId === "2" ? "Sarah Johnson" :
                     orderData.driverId === "3" ? "Raj Patel" :
                     orderData.driverId === "4" ? "Emma Williams" :
                     orderData.driverId === "5" ? "Fahad Khan" : "Unknown Driver"}
                  </p>
                  <p className="text-sm text-muted-foreground">Driver ID: {orderData.driverId}</p>
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-md bg-slate-50 text-center">
                  <Truck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">No driver assigned</p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-4">Route Map</h4>
                <div className="h-[300px] border rounded-md overflow-hidden">
                  <RouteMap selectedDriverId={orderData?.driverId} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Delivery Status</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Completion Status</h4>
                  <Badge 
                    className={cn(
                      "px-3 py-1.5",
                      orderData?.completionStatus === "completed" ? "bg-success-500" : 
                      orderData?.completionStatus === "in-progress" ? "bg-accent-500" : 
                      "bg-warning-500" 
                    )}
                  >
                    {orderData?.completionStatus || "Pending"}
                  </Badge>
                </div>
                
                {orderData?.signedBy && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Signed By</h4>
                    <p>{orderData.signedBy}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Timeline</h4>
                  <div className="space-y-4">
                    {/* This would ideally be populated from actual event data */}
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-success-500"></div>
                        <div className="h-12 w-0.5 bg-slate-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                      </div>
                      <div>
                        <p className="font-medium text-slate-400">Awaiting Collection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Payment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Payment Status</h4>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "px-3 py-1.5",
                    orderData?.paymentStatus === "paid" ? "border-success-500 text-success-700" : 
                    "border-warning-500 text-warning-700"
                  )}
                >
                  {orderData?.paymentStatus || "Unpaid"}
                </Badge>
                
                {orderData?.invoiceNumber && (
                  <div className="mt-4">
                    {renderField("Invoice Number", orderData.invoiceNumber)}
                    {renderField("Invoice Date", new Date(orderData.invoiceDate).toLocaleDateString())}
                    {renderField("Payment Due Date", new Date(orderData.paymentDueDate).toLocaleDateString())}
                    {renderField("Payment Method", orderData.paymentMethod)}
                  </div>
                )}
              </div>
              
              <div className="p-4 border rounded-md bg-slate-50">
                <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>£{(orderData?.value || 0) * 0.1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance</span>
                    <span>£{(orderData?.value || 0) * 0.02}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>£{(orderData?.value || 0) * 0.024}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>£{((orderData?.value || 0) * 0.144).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
