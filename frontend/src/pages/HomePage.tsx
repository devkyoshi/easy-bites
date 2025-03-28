import { Button } from "@/components/ui/button.tsx";

import { NavBar } from "@/components/NavigationBar.tsx";

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
