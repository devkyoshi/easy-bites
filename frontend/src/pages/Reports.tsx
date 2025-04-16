
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Truck,
  Users,
  Package,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  Pie,
  Cell
} from 'recharts';

// Sample data for charts
const deliveryData = [
  { month: 'Jan', delivered: 450, failed: 22 },
  { month: 'Feb', delivered: 480, failed: 25 },
  { month: 'Mar', delivered: 520, failed: 30 },
  { month: 'Apr', delivered: 540, failed: 28 },
  { month: 'May', delivered: 570, failed: 27 },
  { month: 'Jun', delivered: 610, failed: 32 },
  { month: 'Jul', delivered: 590, failed: 29 },
  { month: 'Aug', delivered: 620, failed: 31 },
  { month: 'Sep', delivered: 650, failed: 33 },
  { month: 'Oct', delivered: 630, failed: 30 },
  { month: 'Nov', delivered: 680, failed: 34 },
  { month: 'Dec', delivered: 720, failed: 36 },
];

const fuelData = [
  { month: 'Jan', cost: 12800, mileage: 15200 },
  { month: 'Feb', cost: 13500, mileage: 16300 },
  { month: 'Mar', cost: 14200, mileage: 16800 },
  { month: 'Apr', cost: 14800, mileage: 17500 },
  { month: 'May', cost: 15500, mileage: 18200 },
  { month: 'Jun', cost: 16300, mileage: 19100 },
  { month: 'Jul', cost: 15800, mileage: 18700 },
  { month: 'Aug', cost: 16100, mileage: 19200 },
  { month: 'Sep', cost: 16500, mileage: 19600 },
  { month: 'Oct', cost: 16200, mileage: 19300 },
  { month: 'Nov', cost: 17000, mileage: 20100 },
  { month: 'Dec', cost: 17500, mileage: 20800 },
];

const vehicleTypeData = [
  { name: 'Small Vans', value: 15 },
  { name: 'Medium Vans', value: 25 },
  { name: 'Large Vans', value: 10 },
  { name: 'HGVs', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const reports = [
  {
    id: 1,
    name: 'Monthly Operations Summary',
    description: 'Comprehensive overview of all operations for the month',
    icon: <BarChart3 className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-11-15',
    frequency: 'Monthly'
  },
  {
    id: 2,
    name: 'Fleet Compliance Status',
    description: 'Current compliance status for all vehicles',
    icon: <Truck className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-11-18',
    frequency: 'Weekly'
  },
  {
    id: 3,
    name: 'Driver Performance',
    description: 'Performance metrics for all active drivers',
    icon: <Users className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-11-18',
    frequency: 'Weekly'
  },
  {
    id: 4,
    name: 'Delivery Success Rate',
    description: 'Analysis of successful vs failed deliveries',
    icon: <Package className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-11-17',
    frequency: 'Daily'
  },
  {
    id: 5,
    name: 'Compliance Violations',
    description: 'Detailed report of all compliance issues',
    icon: <AlertTriangle className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-11-18',
    frequency: 'Weekly'
  },
  {
    id: 6,
    name: 'Fuel Consumption Analysis',
    description: 'Fuel usage and cost analysis across the fleet',
    icon: <TrendingUp className="h-5 w-5 text-accent-500" />,
    lastRun: '2023-10-31',
    frequency: 'Monthly'
  },
];

export default function Reports() {
  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Generate and view analytics reports for your operations"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
            <Button size="sm">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Delivery Performance (12 Months)</CardTitle>
            <CardDescription>Monthly successful vs failed deliveries</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deliveryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivered" name="Successful Deliveries" fill="#4f46e5" />
                <Bar dataKey="failed" name="Failed Deliveries" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fuel Cost vs Mileage (12 Months)</CardTitle>
            <CardDescription>Monthly fuel expenditure and mileage correlation</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={fuelData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="cost" name="Fuel Cost (£)" stroke="#4f46e5" />
                <Line yAxisId="right" type="monotone" dataKey="mileage" name="Total Mileage" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vehicle Fleet Composition</CardTitle>
            <CardDescription>Distribution of vehicle types in the fleet</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Reports</CardTitle>
            <CardDescription>Run or download standard reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-accent-50 flex items-center justify-center">
                      {report.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{report.name}</h4>
                      <p className="text-xs text-gray-500">{report.description}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-500">Last run: {new Date(report.lastRun).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">Frequency: {report.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
