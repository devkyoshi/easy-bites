
import {
  Calendar,
  MapPin,
  Package,
  Settings,
  Truck,
  User,
  Users,
  Phone,
  BarChart3,
  Clock,
  Timer,
  Hourglass,
  Smartphone
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardMetricsCard } from '@/components/dashboard/DashboardMetricsCard';
import { FleetOverview } from '@/components/dashboard/FleetOverview';
import { OrderAlerts } from '@/components/dashboard/OrderAlerts';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { LiveRouteMap } from '@/components/dashboard/LiveRouteMap';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleExportReports = () => {
    toast({
      title: "Exporting reports",
      description: "Your reports are being generated and will download shortly."
    });
    // In a real app, this would trigger the actual export process
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-700">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, here's what's happening with your fleet today.
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <Button variant="outline" size="sm" onClick={handleExportReports}>
            <Calendar className="mr-2 h-4 w-4" />
            {!isMobile ? 'Export Reports' : 'Export'}
          </Button>
          <Link to="/orders/new">
            <Button size="sm">
              <Package className="mr-2 h-4 w-4" />
              {!isMobile ? 'New Order' : 'Add'}
            </Button>
          </Link>
          <Link to="/mobile-driver">
            <Button size="sm" variant="secondary">
              <Smartphone className="mr-2 h-4 w-4" />
              {!isMobile ? 'Driver App' : 'App'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards - Moved to the top */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        <DashboardMetricsCard
          title="Total Vehicles"
          value="55"
          change={{ value: "3", positive: true }}
          icon={<Truck className="h-6 w-6" />}
        />
        <DashboardMetricsCard
          title="Active Drivers"
          value="42"
          change={{ value: "2", positive: true }}
          icon={<Users className="h-6 w-6" />}
        />
        <DashboardMetricsCard
          title="Pending Orders"
          value="37"
          change={{ value: "5", positive: false }}
          icon={<Package className="h-6 w-6" />}
        />
        <DashboardMetricsCard
          title="Deliveries Today"
          value="128"
          change={{ value: "12%", positive: true }}
          icon={<MapPin className="h-6 w-6" />}
        />
      </div>

      {/* Live Route Map */}
      <div className="mb-6">
        <LiveRouteMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <OrderAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <FleetOverview />
        </div>
        <div className="space-y-5">
          {/* Enhanced Order Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>Today's Order Stats</span>
                <span className="text-sm font-normal text-gray-500">
                  {new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-success-600" />
                      <span className="text-sm font-medium">Delivered</span>
                    </div>
                    <span className="text-sm font-medium text-success-700">78%</span>
                  </div>
                  <Progress value={78} className="h-2 bg-gray-100" indicatorClassName="bg-success-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-info-600" />
                      <span className="text-sm font-medium">In Transit</span>
                    </div>
                    <span className="text-sm font-medium text-info-700">15%</span>
                  </div>
                  <Progress value={15} className="h-2 bg-gray-100" indicatorClassName="bg-info-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Hourglass className="h-4 w-4 mr-2 text-warning-600" />
                      <span className="text-sm font-medium">Delayed</span>
                    </div>
                    <span className="text-sm font-medium text-warning-700">5%</span>
                  </div>
                  <Progress value={5} className="h-2 bg-gray-100" indicatorClassName="bg-warning-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-danger-600" />
                      <span className="text-sm font-medium">Issues</span>
                    </div>
                    <span className="text-sm font-medium text-danger-700">2%</span>
                  </div>
                  <Progress value={2} className="h-2 bg-gray-100" indicatorClassName="bg-danger-500" />
                </div>
                
                <div className="pt-2 grid grid-cols-2 gap-3 border-t">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Total Orders Today</div>
                    <div className="text-xl font-semibold mt-1">184</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">On-Time Rate</div>
                    <div className="text-xl font-semibold mt-1">93%</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Avg. Delivery Time</div>
                    <div className="text-xl font-semibold mt-1">2.3 hrs</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Customer Rating</div>
                    <div className="text-xl font-semibold mt-1">4.8/5.0</div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <Link to="/orders">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <BarChart3 className="mr-2 h-4 w-4 text-accent-500" />
                      <span>View Detailed Reports</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="dashboard-card">
            <h3 className="dashboard-title">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/fleet">
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 sm:h-24 text-navy-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                  <Truck className="h-6 w-6 mb-1 sm:h-8 sm:w-8 sm:mb-2 text-accent-500" />
                  <span className="text-xs sm:text-sm">Add Vehicle</span>
                </Button>
              </Link>
              <Link to="/drivers">
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 sm:h-24 text-navy-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                  <User className="h-6 w-6 mb-1 sm:h-8 sm:w-8 sm:mb-2 text-accent-500" />
                  <span className="text-xs sm:text-sm">Add Driver</span>
                </Button>
              </Link>
              <Link to="/orders/new">
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 sm:h-24 text-navy-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                  <Package className="h-6 w-6 mb-1 sm:h-8 sm:w-8 sm:mb-2 text-accent-500" />
                  <span className="text-xs sm:text-sm">Create Order</span>
                </Button>
              </Link>
              <Link to="/routes">
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 sm:h-24 text-navy-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                  <MapPin className="h-6 w-6 mb-1 sm:h-8 sm:w-8 sm:mb-2 text-accent-500" />
                  <span className="text-xs sm:text-sm">Manage Routes</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
