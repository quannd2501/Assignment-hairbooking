import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h3>Hair Booking</h3>
        <p>Admin Panel</p>
      </div>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>

        <NavLink to="/admin/appointments">Appointments</NavLink>

        <NavLink to="/admin/services">Services</NavLink>

        <NavLink to="/admin/stylists">Stylists</NavLink>

        <NavLink to="/admin/customers">Customers</NavLink>
      </nav>
    </div>
  );
}

export default AdminSidebar;
