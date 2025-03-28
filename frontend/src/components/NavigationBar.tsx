import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Headset, Menu, Store, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.tsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 text-black backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold tracking-tight">Easy</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Button
                variant={"ghost"}
                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                Stores
              </Button>
              <Button
                variant={"ghost"}
                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <Headset className="h-5 w-5" />
                Contact Us
              </Button>
            </div>
            {currentUser ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4 ml-6">
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="rounded-full px-6 hover:shadow-md"
                >
                  Sign In
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full px-6 bg-gray-100 hover:bg-white hover:shadow-md"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <X className={"w-5 h-5"} />
              ) : (
                <Menu className={"w-5 h-5"} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden bg-white/95 px-4 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            <Button variant={"ghost"} className="justify-start text-md">
              Stores
            </Button>
            <Button variant={"ghost"} className="justify-start text-md">
              Contact Us
            </Button>
            {currentUser && (
              <Button
                variant={"ghost"}
                className="justify-start text-md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>

          {!currentUser && (
            <div className="pt-4 space-y-3">
              <Button className="w-full rounded-full text-md py-5">
                Sign In
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-full text-md py-5 bg-gray-100"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const UserMenu = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
