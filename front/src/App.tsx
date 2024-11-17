import LoginPage from "./pages/Sign/LoginPage";
import Index from "./pages/Index";
import { RegisterPage } from "./pages/Sign/RegisterPage";
import SideBar from "./components/layout/sidebar";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import AuthProvider from "./providers/AuthProvider";
import AuthProviderLoader from "./providers/AuthProviderLoader";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";

import LocalGamePage from "./pages/LocalGame/LocalGame";
import LocalGameLoader from "./pages/LocalGame/LocalGameLoader";

import ErrorPage from "./pages/ErrorPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />} loader={AuthProviderLoader} errorElement={<ErrorPage/>}>
      <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>} errorElement={<ErrorPage/>}>
        <Route path="/" element={<SideBar />} errorElement={<ErrorPage/>}>
          <Route index element={<Index />} />
          <Route path="multygame" element={<LocalGamePage />} loader={LocalGameLoader}/>
        </Route>
      </Route>

      {/* public routes */}
      <Route path="/login" element={<LoginPage></LoginPage>}/>
      <Route path="/register" element={<RegisterPage />}/>
    </Route>
  )
);