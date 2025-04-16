
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative w-80 md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-gray-50 border-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-sethsri-red text-white">
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-auto">
                <div className="border-b border-gray-100 px-4 py-3 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-warning-100 p-2">
                      <Bell className="h-4 w-4 text-warning-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vehicle MOT Expiring</p>
                      <p className="text-xs text-gray-500">
                        Ford Transit KN67 ZXC MOT expires in 14 days
                      </p>
                      <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-100 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-danger-100 p-2">
                      <Bell className="h-4 w-4 text-danger-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Driver CPC Expired</p>
                      <p className="text-xs text-gray-500">
                        John Smith's CPC qualification has expired
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-success-100 p-2">
                      <Bell className="h-4 w-4 text-success-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Order Created</p>
                      <p className="text-xs text-gray-500">
                        Order #SF56823 has been created and requires assignment
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <Button variant="link" className="w-full text-xs justify-center text-sethsri-blue">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-sethsri-blue text-white">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">Admin Manager</p>
                  <p className="text-xs text-gray-500">Operations</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
