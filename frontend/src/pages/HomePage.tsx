import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Headset, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            alt="hero-bg"
            src="/home-hero-bg.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <NavBar />

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center text-white px-4 lg:w-1/2 lg:ml-auto lg:items-start lg:px-16">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-2 max-w-3xl mx-auto lg:mx-0">
              Safe Food Delivery
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
              Order your favorite food from your favorite restaurants and get it
              delivered to your doorstep
            </p>
          </div>

          <div className="space-y-6 text-center lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <Button
                className="px-10 py-5 text-lg bg-black rounded-full hover:bg-gray-900 cursor-pointer"
                size={"sm"}
              >
                <span>Order Now</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <div className="text-xl font-bold">Logo</div>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2 justify-between ">
            <div className={"flex flex-row"}>
              <Button
                variant={"link"}
                className="hover:text-gray-200 transition-colors flex items-center gap-2 no-underline cursor-pointer"
              >
                <Store className={"w-5 h-5"} />
                Stores
              </Button>
              <Button
                variant={"link"}
                className="hover:text-gray-200 transition-colors flex items-center gap-2 no-underline cursor-pointer"
              >
                <Headset className={"h-5 w-5"} />
                <p> Contact Us</p>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                className="rounded-full cursor-pointer"
                onClick={() => navigate("/auth/login")}
                size={"sm"}
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                className="rounded-full cursor-pointer"
                size={"sm"}
              >
                Sign Up
              </Button>
            </div>
          </div>
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-200 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden bg-black px-2 pt-2 pb-3 space-y-1">
          <button className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-200 transition-colors">
            Our Menu
          </button>
          <button className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-200 transition-colors">
            Stores
          </button>
          <button className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-200 transition-colors">
            Contact Us
          </button>
          <div className="mt-3 space-y-2">
            <Button className="w-full rounded-full cursor-pointer" size={"sm"}>
              Sign In
            </Button>
            <Button
              variant="secondary"
              className="w-full rounded-full cursor-pointer"
              size={"sm"}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
