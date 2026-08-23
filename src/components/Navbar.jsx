import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="navbar-custom">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand">
          ✂️ Hair Booking
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/services">
              Services
            </Nav.Link>

            <Nav.Link as={Link} to="/stylists">
              Stylists
            </Nav.Link>

            <Nav.Link as={Link} to="/my-appointments">
              My Appointments
            </Nav.Link>

            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;