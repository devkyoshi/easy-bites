import {
  Calendar,
  Clock,
  Database,
  FileSpreadsheet,
  Package,
  Search,
  Settings,
  Truck,
  User,
  Users,
  MapPin,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  return (
    <Sidebar className="bg-[#475569]">
      <SidebarHeader className="h-16 flex items-center px-4 bg-white">
        <div className="flex items-center justify-center w-full">
          <img
            src="/uploads/b0438800-875e-4908-8aab-6bb14d4997a8.png"
            alt="Seth Sri Shipping"
            className="h-10"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/"
                  className={cn(
                    window.location.pathname === "/" ? "bg-[#323e4c]" : ""
                  )}
                >
                  <Database className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/fleet"
                  className={cn(
                    window.location.pathname === "/fleet" ? "bg-[#323e4c]" : ""
                  )}
                >
                  <Truck className="h-5 w-5" />
                  <span>Fleet Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/drivers"
                  className={cn(
                    window.location.pathname === "/drivers"
                      ? "bg-[#323e4c]"
                      : ""
                  )}
                >
                  <Users className="h-5 w-5" />
                  <span>Driver Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/orders"
                  className={cn(
                    window.location.pathname === "/orders" ? "bg-[#323e4c]" : ""
                  )}
                >
                  <Package className="h-5 w-5" />
                  <span>Order Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/manifests"
                  className={cn(
                    window.location.pathname === "/manifests"
                      ? "bg-[#323e4c]"
                      : ""
                  )}
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>Manifest Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/routes"
                  className={cn(
                    window.location.pathname === "/routes" ? "bg-[#323e4c]" : ""
                  )}
                >
                  <MapPin className="h-5 w-5" />
                  <span>Route Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="/users"
                  className={cn(
                    window.location.pathname === "/users" ? "bg-[#323e4c]" : ""
                  )}
                >
                  <User className="h-5 w-5" />
                  <span>User Management</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/vehicle-compliance"
                    className={cn(
                      window.location.pathname === "/vehicle-compliance"
                        ? "bg-[#323e4c]"
                        : ""
                    )}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Vehicle Compliance</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/driver-compliance"
                    className={cn(
                      window.location.pathname === "/driver-compliance"
                        ? "bg-[#323e4c]"
                        : ""
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span>Driver Compliance</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/gdpr"
                    className={cn(
                      window.location.pathname === "/gdpr" ? "bg-[#323e4c]" : ""
                    )}
                  >
                    <Search className="h-5 w-5" />
                    <span>GDPR Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/reports"
                    className={cn(
                      window.location.pathname === "/reports"
                        ? "bg-[#323e4c]"
                        : ""
                    )}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/settings"
                    className={cn(
                      window.location.pathname === "/settings"
                        ? "bg-[#323e4c]"
                        : ""
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <div className="rounded-md bg-[#323e4c] p-3 text-xs">
          <p className="font-medium text-white mb-1">Need Help?</p>
          <p className="text-sidebar-foreground opacity-80">
            Contact our support team
          </p>
          <a
            href="mailto:info@sethsrishipping.co.uk"
            className="inline-block mt-2 text-[#CC0000] hover:underline"
          >
            info@sethsrishipping.co.uk
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
