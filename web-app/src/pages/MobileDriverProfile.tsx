
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Truck, MapPin, Camera, FileText, LogOut, Settings, Calendar, Clock, Award, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const MobileDriverProfile = () => {
  const navigate = useNavigate();
  
  // Sample driver data for demonstration
  const driver = {
    name: "John Smith",
    id: "DRV-001",
    email: "john.smith@example.com",
    phone: "07700 900123",
    vehicle: "KN67 ZXC",
    licenseExpiry: "2025-06-15",
    cpcExpiry: "2024-01-30",
    joinedDate: "2022-03-15",
    rating: 4.8,
    completedDeliveries: 1243,
    avatarUrl: ""
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Profile Header */}
        <div className="bg-sethsri-red text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/mobile-driver')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Driver Profile</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => {}}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Driver Info */}
          <div className="flex flex-col items-center justify-center mt-2">
            <Avatar className="h-24 w-24 border-2 border-white mb-3">
              {driver.avatarUrl ? (
                <AvatarImage src={driver.avatarUrl} alt={driver.name} />
              ) : (
                <AvatarFallback className="bg-sethsri-darkgray text-2xl text-white">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-xl font-bold">{driver.name}</h2>
            <Badge variant="outline" className="mt-1 bg-sethsri-darkgray border-gray-400 text-white">
              ID: {driver.id}
            </Badge>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-4 space-y-4 bg-gray-50">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-xl font-bold text-sethsri-red">{driver.completedDeliveries}</div>
              <div className="text-xs text-gray-500">Deliveries</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-xl font-bold text-warning-500">{driver.rating}</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-xl font-bold text-success-500">97%</div>
              <div className="text-xs text-gray-500">On-Time</div>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <h3 className="text-lg font-medium text-sethsri-darkgray">Contact Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-sethsri-red mr-3" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-sethsri-red mr-3" />
                <span>{driver.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <h3 className="text-lg font-medium text-sethsri-darkgray">Vehicle Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-sethsri-red mr-3" />
                <span>Vehicle: {driver.vehicle}</span>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Information */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <h3 className="text-lg font-medium text-sethsri-darkgray">Compliance Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-sethsri-red mr-3" />
                  <span>Driver's License</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Valid until {new Date(driver.licenseExpiry).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-sethsri-red mr-3" />
                  <span>CPC Certificate</span>
                </div>
                <Badge className={
                  new Date(driver.cpcExpiry) < new Date() 
                  ? "bg-red-100 text-red-800 hover:bg-red-200" 
                  : "bg-green-100 text-green-800 hover:bg-green-200"
                }>
                  {new Date(driver.cpcExpiry) < new Date() ? "Expired" : "Valid until"} {new Date(driver.cpcExpiry).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-sethsri-red mr-3" />
                <span>Joined: {new Date(driver.joinedDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Log Out Button */}
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-sethsri-red hover:bg-red-50 hover:text-sethsri-red"
            onClick={() => navigate('/')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver')}>
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Deliveries</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/map')}>
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Map</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto" onClick={() => navigate('/mobile-driver/camera')}>
            <Camera className="h-5 w-5" />
            <span className="text-xs mt-1">Camera</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto text-sethsri-red" onClick={() => navigate('/mobile-driver/profile')}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileDriverProfile;
