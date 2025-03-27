import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Headset, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 flex justify-end items-center">
          <img
            alt="hero-bg"
            src="/home-bg.jpg"
            className="hidden md:block h-[85%] w-[100%] object-contain object-center lg:object-right-bottom transition-all duration-300 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
        </div>

        <NavBar />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl lg:max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-snug lg:leading-[1.2]">
              Have a{" "}
              <span className="text-primary drop-shadow-md">Healthy Meal</span>{" "}
              before you do anything
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl">
              Eating breakfast is a nice way of saying thank you to your body.
              All happiness depends on a leisurely breakfast.
            </p>

            <div className="space-y-4">
              <p className="text-lg md:text-xl font-medium text-gray-800">
                Want to{" "}
                <span className="text-primary font-semibold">Order</span> your
                meal?
              </p>
              <Button
                className="px-12 py-6 text-lg rounded-full bg-black hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg"
                size={"sm"}
              >
                Order Now
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
    <nav className="absolute top-0 left-0 right-0 z-50 text-black backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold tracking-tight">
              {import.meta.env.VITE_APPNAME as string}
            </div>
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
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-7 h-7 text-gray-800"
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
        <div className="md:hidden bg-white/95 px-4 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            <Button variant={"ghost"} className="justify-start text-lg">
              Stores
            </Button>
            <Button variant={"ghost"} className="justify-start text-lg">
              Contact Us
            </Button>
          </div>
          <div className="pt-4 space-y-3">
            <Button className="w-full rounded-full text-lg py-5">
              Sign In
            </Button>
            <Button
              variant="secondary"
              className="w-full rounded-full text-lg py-5 bg-gray-100"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
