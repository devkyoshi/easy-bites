
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, Phone } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { PackageOptionsManager } from '@/components/settings/PackageOptionsManager';

export default function Settings() {
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  const handleSaveChanges = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };
  
  return (
    <MainLayout>
      <PageHeader
        title="Settings"
        subtitle="Configure system preferences and account settings"
        actions={
          <Button size="sm" onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        }
      />
      
      {showSaveMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          Settings saved successfully!
        </div>
      )}

      <Tabs defaultValue="company">
        <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Seth Sri Shipping Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNumber">Company Registration Number</Label>
                  <Input id="companyNumber" defaultValue="12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input id="vatNumber" defaultValue="GB123456789" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" defaultValue="+44 7479 389 689" placeholder="+44 7777 123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="info@sethsrishipping.co.uk" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Registered Address</Label>
                  <Textarea 
                    id="address" 
                    defaultValue="102 Priestswood Avenue, Bracknell, England, RG42 1XQ"
                    rows={3} 
                  />
                </div>

                {/* Driver's Hotline section - newly added */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <Label className="font-medium text-base">Driver's Hotline</Label>
                  </div>
                  <p className="text-sm text-gray-500">Contact numbers for driver support</p>
                  
                  <div className="grid gap-3 mt-2">
                    <div className="grid grid-cols-5 gap-2">
                      <Label htmlFor="emergencyPhone" className="col-span-2 self-center">Emergency:</Label>
                      <Input 
                        id="emergencyPhone" 
                        className="col-span-3" 
                        defaultValue="+44 7700 900123"
                      />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <Label htmlFor="techSupportPhone" className="col-span-2 self-center">Technical Support:</Label>
                      <Input 
                        id="techSupportPhone" 
                        className="col-span-3" 
                        defaultValue="+44 7700 900456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <Label htmlFor="routeAssistancePhone" className="col-span-2 self-center">Route Assistance:</Label>
                      <Input 
                        id="routeAssistancePhone" 
                        className="col-span-3" 
                        defaultValue="+44 7700 900789"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Package Options</CardTitle>
                  <CardDescription>
                    Manage package types and pricing for customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PackageOptionsManager />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>
                    Customize your system settings and defaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <select 
                      id="timezone"
                      className="w-full rounded-md border border-input px-3 py-2"
                      defaultValue="Europe/London"
                    >
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="Europe/Paris">Paris (CET/CEST)</option>
                      <option value="America/New_York">New York (EST/EDT)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select 
                      id="dateFormat"
                      className="w-full rounded-md border border-input px-3 py-2"
                      defaultValue="dd/MM/yyyy"
                    >
                      <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Compliance Alerts</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="motAlerts">MOT Expiry Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify days before expiry</p>
                      </div>
                      <Input 
                        id="motAlerts" 
                        defaultValue="30" 
                        className="w-20 text-right" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="licenseAlerts">Driver License Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify days before expiry</p>
                      </div>
                      <Input 
                        id="licenseAlerts" 
                        defaultValue="45" 
                        className="w-20 text-right" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Configure user accounts and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minLength" className="text-sm">Minimum Password Length</Label>
                      <Input 
                        id="minLength" 
                        defaultValue="10" 
                        className="w-20 text-right" 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="requireUpper" defaultChecked />
                      <Label htmlFor="requireUpper" className="text-sm">Require uppercase letters</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="requireNumbers" defaultChecked />
                      <Label htmlFor="requireNumbers" className="text-sm">Require numbers</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="requireSpecial" defaultChecked />
                      <Label htmlFor="requireSpecial" className="text-sm">Require special characters</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Security</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="twoFactor" defaultChecked />
                      <Label htmlFor="twoFactor" className="text-sm">
                        Enforce two-factor authentication
                      </Label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sessionTimeout" className="text-sm">Session Timeout (minutes)</Label>
                      <Input 
                        id="sessionTimeout" 
                        defaultValue="30" 
                        className="w-20 text-right" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordExpiry" className="text-sm">Password Expiry (days)</Label>
                      <Input 
                        id="passwordExpiry" 
                        defaultValue="90" 
                        className="w-20 text-right" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  Define user roles and their associated permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Roles</Label>
                  
                  <div className="border rounded-md">
                    <div className="p-3 border-b flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Administrator</h4>
                        <p className="text-sm text-gray-500">Full system access</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="p-3 border-b flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Fleet Manager</h4>
                        <p className="text-sm text-gray-500">Vehicle and driver management</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="p-3 border-b flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dispatcher</h4>
                        <p className="text-sm text-gray-500">Order and routing management</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Compliance Officer</h4>
                        <p className="text-sm text-gray-500">Regulatory and GDPR compliance</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button size="sm" className="mt-3">Add New Role</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Connections</CardTitle>
                <CardDescription>
                  Manage connections to external systems and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Royal Mail PAF API</h4>
                        <p className="text-sm text-gray-500">UK address validation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 items-center">
                        <Switch id="rmApi" defaultChecked />
                      </div>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">DVLA License Check</h4>
                        <p className="text-sm text-gray-500">Driver license verification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 items-center">
                        <Switch id="dvlaApi" defaultChecked />
                      </div>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3H15M3 8H21M14 21H10M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Vehicle Telematics</h4>
                        <p className="text-sm text-gray-500">Live vehicle tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 items-center">
                        <Switch id="telematicsApi" />
                      </div>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 14V12M12 6H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Traffic & Weather API</h4>
                        <p className="text-sm text-gray-500">Route conditions and alerts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 items-center">
                        <Switch id="weatherApi" defaultChecked />
                      </div>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline">Add New Integration</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure email, SMS, and in-app notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Compliance Notifications</h3>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="vehicleExpiry" className="text-sm font-medium">Vehicle Document Expiry</Label>
                          <p className="text-sm text-gray-500">MOT, tax, and insurance</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Switch id="emailVehicleExpiry" defaultChecked />
                            <Label htmlFor="emailVehicleExpiry" className="text-xs">Email</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="smsVehicleExpiry" />
                            <Label htmlFor="smsVehicleExpiry" className="text-xs">SMS</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="appVehicleExpiry" defaultChecked />
                            <Label htmlFor="appVehicleExpiry" className="text-xs">In-app</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="driverExpiry" className="text-sm font-medium">Driver Qualification Expiry</Label>
                          <p className="text-sm text-gray-500">License, CPC, and tachograph</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Switch id="emailDriverExpiry" defaultChecked />
                            <Label htmlFor="emailDriverExpiry" className="text-xs">Email</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="smsDriverExpiry" defaultChecked />
                            <Label htmlFor="smsDriverExpiry" className="text-xs">SMS</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="appDriverExpiry" defaultChecked />
                            <Label htmlFor="appDriverExpiry" className="text-xs">In-app</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Operations Notifications</h3>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newOrders" className="text-sm font-medium">New Orders</Label>
                          <p className="text-sm text-gray-500">When new delivery orders are created</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Switch id="emailNewOrders" defaultChecked />
                            <Label htmlFor="emailNewOrders" className="text-xs">Email</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="smsNewOrders" />
                            <Label htmlFor="smsNewOrders" className="text-xs">SMS</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="appNewOrders" defaultChecked />
                            <Label htmlFor="appNewOrders" className="text-xs">In-app</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="deliveryIssues" className="text-sm font-medium">Delivery Issues</Label>
                          <p className="text-sm text-gray-500">When problems occur with deliveries</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Switch id="emailDeliveryIssues" defaultChecked />
                            <Label htmlFor="emailDeliveryIssues" className="text-xs">Email</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="smsDeliveryIssues" defaultChecked />
                            <Label htmlFor="smsDeliveryIssues" className="text-xs">SMS</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="appDeliveryIssues" defaultChecked />
                            <Label htmlFor="appDeliveryIssues" className="text-xs">In-app</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="vehicleIssues" className="text-sm font-medium">Vehicle Maintenance Alerts</Label>
                          <p className="text-sm text-gray-500">When vehicles require maintenance</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Switch id="emailVehicleIssues" defaultChecked />
                            <Label htmlFor="emailVehicleIssues" className="text-xs">Email</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="smsVehicleIssues" />
                            <Label htmlFor="smsVehicleIssues" className="text-xs">SMS</Label>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch id="appVehicleIssues" defaultChecked />
                            <Label htmlFor="appVehicleIssues" className="text-xs">In-app</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">General Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="digestEmail" defaultChecked />
                        <div>
                          <Label htmlFor="digestEmail" className="text-sm font-medium">Daily Digest Email</Label>
                          <p className="text-sm text-gray-500">Receive a summary of all notifications daily</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="quietHours" />
                        <div>
                          <Label htmlFor="quietHours" className="text-sm font-medium">Enable Quiet Hours</Label>
                          <p className="text-sm text-gray-500">No notifications during specified hours</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quietStart" className="text-sm">Quiet Hours Start</Label>
                          <Input id="quietStart" type="time" defaultValue="20:00" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quietEnd" className="text-sm">Quiet Hours End</Label>
                          <Input id="quietEnd" type="time" defaultValue="07:00" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
