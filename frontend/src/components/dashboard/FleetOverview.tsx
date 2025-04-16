
import { Battery, Calendar, TrendingDown, TrendingUp, Truck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VehicleStatus {
  status: 'active' | 'maintenance' | 'breakdown' | 'idle';
  count: number;
  color: string;
}

const vehicleStatuses: VehicleStatus[] = [
  { status: 'active', count: 32, color: 'bg-success-500' },
  { status: 'maintenance', count: 8, color: 'bg-warning-500' },
  { status: 'breakdown', count: 3, color: 'bg-danger-500' },
  { status: 'idle', count: 12, color: 'bg-gray-300' },
];

const totalVehicles = vehicleStatuses.reduce(
  (acc, current) => acc + current.count,
  0
);

export function FleetOverview() {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="dashboard-title">Fleet Overview</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="mr-1 h-3 w-3" />
          <span>Updated 10 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Utilization Rate</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-lg font-semibold">76%</p>
                <span className="flex items-center text-xs font-medium text-success-600">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  4%
                </span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent-100 flex items-center justify-center">
              <Truck className="h-5 w-5 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Maintenance Cost</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-lg font-semibold">£5,234</p>
                <span className="flex items-center text-xs font-medium text-danger-600">
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                  8%
                </span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent-100 flex items-center justify-center">
              <Battery className="h-5 w-5 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-600 mb-2">Vehicle Status</h4>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className="h-full flex">
          {vehicleStatuses.map((status, index) => (
            <div
              key={status.status}
              className={status.color}
              style={{
                width: `${(status.count / totalVehicles) * 100}%`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {vehicleStatuses.map((status) => (
          <div key={status.status} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full ${status.color} mr-2`}
              ></div>
              <span className="text-sm capitalize">{status.status}</span>
            </div>
            <span className="text-sm font-medium">
              {status.count}{' '}
              <span className="text-gray-500 text-xs">
                ({Math.round((status.count / totalVehicles) * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
