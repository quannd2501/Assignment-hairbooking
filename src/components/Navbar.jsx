import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();

  const { currentUser, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="main-navbar"
    >
      <Container>

        {/* LOGO */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-logo"
        >
          Hair Booking
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">

          {/* MENU */}
          <Nav className="me-auto">

            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/services">
              Services
            </Nav.Link>

            <Nav.Link as={Link} to="/stylists">
              Stylists
            </Nav.Link>

            {isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/my-appointments"
              >
                My Appointments
              </Nav.Link>
            )}

          </Nav>

          {/* RIGHT SIDE */}
          <Nav className="align-items-lg-center">

            {!isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                >
                  Login
                </Nav.Link>

                <Button
                  as={Link}
                  to="/register"
                  className="register-header-btn"
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <span className="user-welcome">
                  Hi, {currentUser.name}
                </span>

                <Button
                  variant="outline-dark"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}

          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;