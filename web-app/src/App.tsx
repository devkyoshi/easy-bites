
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { LoadingBar } from "@/components/ui/loading-bar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FleetManagement from "./pages/FleetManagement";
import DriverManagement from "./pages/DriverManagement";
import OrderManagement from "./pages/OrderManagement";
import VehicleCompliance from "./pages/VehicleCompliance";
import DriverCompliance from "./pages/DriverCompliance";
import GdprManagement from "./pages/GdprManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NewOrder from "./pages/NewOrder";
import UserManagement from "./pages/UserManagement";
import ManifestManagement from "./pages/ManifestManagement";
import RouteManagement from "./pages/RouteManagement";
import MobileDriverApp from "./pages/MobileDriverApp";
import MobileDriverMap from "./pages/MobileDriverMap";
import MobileDriverCamera from "./pages/MobileDriverCamera";
import MobileDriverProfile from "./pages/MobileDriverProfile";
import MobileDriverOrderDetail from "./pages/MobileDriverOrderDetail";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoadingIndicator />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Fleet Management Routes */}
              <Route path="/fleet" element={<FleetManagement />} />
              <Route path="/fleet/vehicle/:id" element={<FleetManagement />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/orders/new" element={<NewOrder />} />
              <Route path="/orders/edit/:id" element={<NewOrder />} />
              <Route path="/manifests" element={<ManifestManagement />} />
              <Route path="/routes" element={<RouteManagement />} />
              
              {/* Mobile Driver App Routes */}
              <Route path="/mobile-driver" element={<MobileDriverApp />} />
              <Route path="/mobile-driver/map" element={<MobileDriverMap />} />
              <Route path="/mobile-driver/camera" element={<MobileDriverCamera />} />
              <Route path="/mobile-driver/profile" element={<MobileDriverProfile />} />
              <Route path="/mobile-driver/order/:orderId" element={<MobileDriverOrderDetail />} />
              
              {/* Compliance Routes */}
              <Route path="/vehicle-compliance" element={<VehicleCompliance />} />
              <Route path="/driver-compliance" element={<DriverCompliance />} />
              <Route path="/gdpr" element={<GdprManagement />} />
              
              {/* System Routes */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<UserManagement />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
};

// Loading indicator component that uses our context
function LoadingIndicator() {
  const { isLoading } = useLoading();
  return <LoadingBar isLoading={isLoading} />;
}

export default App;
