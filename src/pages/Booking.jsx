import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  createAppointment,
  getServices,
  getStylists,
  getAppointments,
} from "../services/api";

function Booking() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  const [selectedService, setSelectedService] = useState(serviceId || "");

  const [selectedStylist, setSelectedStylist] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    getServices()
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error loading services:", error);
      });

    getStylists()
      .then((response) => {
        setStylists(response.data);
      })
      .catch((error) => {
        console.error("Error loading stylists:", error);
      });

    getAppointments()
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error loading appointments:", error);
      });
  }, []);
  const service = services.find((item) => item.id === selectedService);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra thông tin bắt buộc
    if (!selectedService || !selectedStylist || !date || !time) {
      setMessage("Please complete all booking information.");
      return;
    }

    const today = new Date();

    const selectedDate = new Date(`${date}T00:00:00`);

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (selectedDate < todayOnly) {
      setMessage("Please select a valid date and time.");
      return;
    }

    if (date === today.toISOString().split("T")[0]) {
      const [hours, minutes] = time.split(":");

      const selectedTime = new Date();
      selectedTime.setHours(Number(hours), Number(minutes), 0, 0);

      if (selectedTime <= today) {
        setMessage("Please select a valid date and time.");
        return;
      }
    }

    const isBooked = appointments.some((appointment) => {
      return (
        appointment.stylistId === selectedStylist &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.status !== "cancelled"
      );
    });

    if (isBooked) {
      setMessage("This stylist is already booked at this time.");
      return;
    }

    if (!service) {
      setMessage("Please complete all booking information.");
      return;
    }

    const appointment = {
      userId: "u001",
      serviceId: selectedService,
      stylistId: selectedStylist,
      date: date,
      time: time,
      status: "pending",
      totalPrice: service.price,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    setMessage("");

    createAppointment(appointment)
      .then(() => {
        setMessage("Booking successful!");

        setTimeout(() => {
          navigate("/my-appointments");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error creating appointment:", error);
        setMessage("Booking failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="booking-page py-5">
      <div className="section-title">
        <h1>Book an Appointment</h1>
        <p>Choose your service, stylist, date and time</p>
      </div>

      <Row>
        <Col md={8} className="mx-auto">
          <Card className="booking-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Service */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>1. Choose Service</strong>
                  </Form.Label>

                  <Form.Select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">-- Select Service --</option>

                    {services.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.price.toLocaleString("vi-VN")}đ
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Selected service */}
                {service && (
                  <div className="selected-service mb-4">
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={service.image}
                          alt={service.name}
                          className="booking-service-image"
                        />
                      </Col>

                      <Col md={8}>
                        <h4>{service.name}</h4>

                        <p>{service.description}</p>

                        <p>
                          <strong>Price:</strong>{" "}
                          {service.price.toLocaleString("vi-VN")}đ
                        </p>

                        <p>
                          <strong>Duration:</strong> {service.duration} minutes
                        </p>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Stylist */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>2. Choose Stylist</strong>
                  </Form.Label>

                  <Form.Select
                    value={selectedStylist}
                    onChange={(e) => setSelectedStylist(e.target.value)}
                  >
                    <option value="">-- Select Stylist --</option>

                    {stylists.map((stylist) => (
                      <option key={stylist.id} value={stylist.id}>
                        {stylist.name} - {stylist.specialization}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Date */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>3. Choose Date</strong>
                  </Form.Label>

                  <Form.Control
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>

                {/* Time */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>4. Choose Time</strong>
                  </Form.Label>

                  <div className="time-slots">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={time === slot ? "dark" : "outline-secondary"}
                        className="time-slot"
                        onClick={() => setTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {/* Summary */}
                <div className="booking-summary">
                  <h4>Booking Summary</h4>

                  <div className="summary-row">
                    <span>Service</span>

                    <strong>{service ? service.name : "Not selected"}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Stylist</span>

                    <strong>
                      {selectedStylist
                        ? stylists.find((item) => item.id === selectedStylist)
                            ?.name
                        : "Not selected"}
                    </strong>
                  </div>

                  <div className="summary-row">
                    <span>Date</span>

                    <strong>{date || "Not selected"}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Time</span>

                    <strong>{time || "Not selected"}</strong>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>

                    <strong>
                      {service
                        ? service.price.toLocaleString("vi-VN") + "đ"
                        : "0đ"}
                    </strong>
                  </div>
                </div>

                {/* Message */}
                {message && <div className="booking-message">{message}</div>}

                {/* Submit */}
                <Button
                  type="submit"
                  className="confirm-booking-btn w-100 mt-4"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Booking;
