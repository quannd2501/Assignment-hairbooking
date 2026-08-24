import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h4>Hair Booking</h4>
        <p>Admin Panel</p>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink to="/admin">Dashboard</NavLink>

        <NavLink to="/admin/services">Services</NavLink>

        <NavLink to="/admin/stylists">Stylists</NavLink>

        <NavLink to="/admin/appointments">Appointments</NavLink>

        <NavLink to="/admin/customers">Customers</NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user">
          <strong>{currentUser?.name}</strong>

          <small>Administrator</small>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
