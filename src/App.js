import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./admin/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Stylists from "./pages/Stylists";
import Booking from "./pages/Booking";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminServices from "./admin/pages/AdminServices";
import AdminStylists from "./admin/pages/AdminStylists";
import AdminAppointments from "./admin/pages/AdminAppointments";
import AdminCustomers from "./admin/pages/AdminCustomers";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* CUSTOMER */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route path="/services" element={<Services />} />

            <Route path="/services/:id" element={<ServiceDetail />} />

            <Route path="/stylists" element={<Stylists />} />

            <Route
              path="/booking"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-appointments"
              element={
                <PrivateRoute>
                  <MyAppointments />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="services" element={<AdminServices />} />

            <Route path="stylists" element={<AdminStylists />} />

            <Route path="appointments" element={<AdminAppointments />} />

            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
