import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { getServiceById } from "../services/api";

function ServiceDetail() {
  const { id } = useParams();

  const [service, setService] = useState(null);

  useEffect(() => {
    getServiceById(id)
      .then((response) => {
        setService(response.data);
      })
      .catch((error) => {
        console.error("Error loading service:", error);
      });
  }, [id]);

  if (!service) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );
  }

  return (
    <Container className="service-detail py-5">
      <Row className="align-items-center">
        <Col md={6}>
          <img
            src={service.image}
            alt={service.name}
            className="service-detail-image"
          />
        </Col>

        <Col md={6}>
          <div className="service-detail-content">
            <h1>{service.name}</h1>

            <p className="service-category">
              {service.category}
            </p>

            <h3 className="service-price">
              {service.price.toLocaleString("vi-VN")}đ
            </h3>

            <p className="service-description">
              {service.description}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {service.duration} minutes
            </p>

            <div className="mt-4">
              <Button
                as={Link}
                to={`/booking?serviceId=${service.id}`}
                className="btn-book me-2"
              >
                Book Now
              </Button>

              <Button
                as={Link}
                to="/services"
                variant="outline-dark"
              >
                Back to Services
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ServiceDetail;