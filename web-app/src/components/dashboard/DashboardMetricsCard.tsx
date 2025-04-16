
import { cn } from '@/lib/utils';

interface DashboardMetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

export function DashboardMetricsCard({
  title,
  value,
  change,
  icon,
  className,
}: DashboardMetricsCardProps) {
  return (
    <div className={cn("dashboard-card p-3 md:p-5 flex-1", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-navy-700">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  change.positive ? "text-success-600" : "text-danger-600"
                )}
              >
                {change.positive ? "+" : "-"}{change.value}
              </span>
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last week</span>
            </div>
          )}
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent-50 flex items-center justify-center">
          <div className="text-accent-500">{icon}</div>
        </div>
      </div>
    </div>
  );
}
