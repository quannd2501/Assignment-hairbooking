import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { getStylists } from "../services/api";

function Stylists() {
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    getStylists()
      .then((response) => {
        setStylists(response.data);
      })
      .catch((error) => {
        console.error("Error loading stylists:", error);
      });
  }, []);

  return (
    <Container className="stylists-page py-5">
      <div className="section-title">
        <h1>Our Stylists</h1>
        <p>Meet our professional hair stylists</p>
      </div>

      <Row>
        {stylists.map((stylist) => (
          <Col md={4} className="mb-4" key={stylist.id}>
            <Card className="stylist-card h-100">
              <Card.Img
                variant="top"
                src={stylist.image}
                alt={stylist.name}
              />

              <Card.Body>
                <Card.Title>{stylist.name}</Card.Title>

                <p className="stylist-specialization">
                  {stylist.specialization}
                </p>

                <Card.Text>
                  {stylist.description}
                </Card.Text>

                <p>
                  <strong>Experience:</strong>{" "}
                  {stylist.experience} years
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {stylist.phone}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Stylists;