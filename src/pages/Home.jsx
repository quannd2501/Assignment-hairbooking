import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { getServices } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [services, setServices] = useState([]);

  const { currentUser, isLoggedIn } = useAuth();

  useEffect(() => {
    getServices()
      .then((response) => {
        setServices(response.data.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error loading services:", error);
      });
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="hero">
        <Container>
          <Row className="align-items-center">

            <Col md={6}>
              {isLoggedIn && currentUser && (
                <p className="welcome-text">
                  Welcome, {currentUser.name}!
                </p>
              )}

              <h1>Beautiful Hair, Beautiful You</h1>

              <p>
                Book your favorite hair service with our
                professional stylists.
              </p>

              <Button
                as={Link}
                to={isLoggedIn ? "/services" : "/login"}
                className="btn-book"
              >
                Book Appointment
              </Button>

            </Col>

            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df"
                alt="Hair Salon"
                className="hero-image"
              />
            </Col>

          </Row>
        </Container>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="services-section">
        <Container>

          <div className="section-title">
            <h2>Our Services</h2>

            <p>
              Choose the perfect service for your hair
            </p>
          </div>

          <Row>
            {services.map((service) => (
              <Col
                md={4}
                key={service.id}
                className="mb-4"
              >
                <Card className="service-card h-100">

                  <Card.Img
                    variant="top"
                    src={service.image}
                    alt={service.name}
                  />

                  <Card.Body>
                    <Card.Title>
                      {service.name}
                    </Card.Title>

                    <h5 className="price">
                      {formatPrice(service.price)}
                    </h5>

                    <Button
                      as={Link}
                      to={`/services/${service.id}`}
                      variant="dark"
                    >
                      View Detail
                    </Button>
                  </Card.Body>

                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-3">
            <Button
              as={Link}
              to="/services"
              variant="outline-dark"
            >
              View All Services
            </Button>
          </div>

        </Container>
      </section>
    </div>
  );
}

export default Home;