import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DashboardPage } from "@/pages/dashboard/DashboardPage.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/auth/login/LoginPage.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";

const AppRoutingContent = () => {
  return (
    <Routes>
      <Route path={"/"} element={<HomePage />} />
      <Route path={"/auth/*"}>
        <Route path={"login"} element={<LoginPage />} />
      </Route>
      <Route path={"/dashboard/*"} element={<DashboardPage />}>
        <Route path={""} element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export const AppRouting = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutingContent />
      </AuthProvider>
    </BrowserRouter>
  );
};
