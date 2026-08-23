import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Stylists from "./pages/Stylists";
import Booking from "./pages/Booking";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

        <Route path="/stylists" element={<Stylists />} />

        <Route path="/booking" element={<Booking />} />

        <Route
          path="/my-appointments"
          element={<MyAppointments />}
        />

        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;