import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getServices } from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  useEffect(() => {
    getServices()
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error loading services:", error);
      });
  }, []);

  const filteredServices = services
    .filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((service) => {
      if (category === "All") {
        return true;
      }

      return service.category === category;
    })
    .sort((a, b) => {
      if (sort === "low") {
        return a.price - b.price;
      }

      if (sort === "high") {
        return b.price - a.price;
      }

      return 0;
    });

  return (
    <Container className="services-page py-5">
      <div className="section-title">
        <h1>Our Services</h1>
        <p>Choose the best service for your hair</p>
      </div>

      {/* Search / Filter / Sort */}
      <Row className="mb-4">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Haircut">Haircut</option>
            <option value="Color">Color</option>
            <option value="Styling">Styling</option>
            <option value="Treatment">Treatment</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort by price</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Services */}
      <Row>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Col md={4} className="mb-4" key={service.id}>
              <Card className="service-card h-100">
                <Card.Img
                  variant="top"
                  src={service.image}
                  alt={service.name}
                />

                <Card.Body>
                  <Card.Title>{service.name}</Card.Title>

                  <Card.Text>{service.description}</Card.Text>

                  <p className="price">
                    {service.price.toLocaleString("vi-VN")}đ
                  </p>

                  <p>Duration: {service.duration} minutes</p>

                  <div className="service-buttons">
                    <Button
                      as={Link}
                      to={`/services/${service.id}`}
                      variant="outline-dark"
                    >
                      View Detail
                    </Button>

                    <Button
                      as={Link}
                      to={`/booking?serviceId=${service.id}`}
                      className="btn-book"
                    >
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center py-5">
              <h4>No services found</h4>
              <p>Try another search or category.</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Services;
