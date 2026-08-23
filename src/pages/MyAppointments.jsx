import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  getAppointments,
  getServices,
  getStylists,
  updateAppointment,
  getReviews,
  createReview,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function MyAppointments() {
  const navigate = useNavigate();

  const { currentUser, isLoggedIn } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reviewMessage, setReviewMessage] = useState({});
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    Promise.all([getAppointments(), getServices(), getStylists(), getReviews()])
      .then(
        ([
          appointmentResponse,
          serviceResponse,
          stylistResponse,
          reviewResponse,
        ]) => {
          const userAppointments = appointmentResponse.data.filter(
            (appointment) => appointment.userId === currentUser.id,
          );

          setAppointments(userAppointments);
          setServices(serviceResponse.data);
          setStylists(stylistResponse.data);
          setReviews(reviewResponse.data);
        },
      )
      .catch((error) => {
        console.error("Error loading appointments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoggedIn, currentUser, navigate]);

  // Lấy tên service
  const getServiceName = (serviceId) => {
    const service = services.find((item) => item.id === serviceId);

    return service ? service.name : "Unknown Service";
  };

  // Lấy tên stylist
  const getStylistName = (stylistId) => {
    const stylist = stylists.find((item) => item.id === stylistId);

    return stylist ? stylist.name : "Unknown Stylist";
  };

  // Format giá
  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };

  // Màu status
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";

      case "completed":
        return "primary";

      case "cancelled":
        return "danger";

      case "pending":
      default:
        return "warning";
    }
  };

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await updateAppointment(appointmentId, {
        status: "cancelled",
      });

      // Cập nhật lại giao diện
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment,
        ),
      );
    } catch (error) {
      console.error("Cancel appointment error:", error);

      alert("Failed to cancel appointment. Please try again.");
    }
  };
  const getAppointmentReview = (appointmentId) => {
    return reviews.find((review) => review.appointmentId === appointmentId);
  };
  const handleReview = async (appointment) => {
    const rating = reviewRatings[appointment.id];
    const comment = reviewComments[appointment.id];

    if (!rating || !comment?.trim()) {
      setReviewMessage((prev) => ({
        ...prev,
        [appointment.id]: "Please provide rating and comment.",
      }));

      return;
    }

    try {
      const newReview = {
        appointmentId: appointment.id,
        userId: currentUser.id,
        serviceId: appointment.serviceId,
        rating: Number(rating),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const response = await createReview(newReview);

      setReviews((prev) => [...prev, response.data]);

      setReviewMessage((prev) => ({
        ...prev,
        [appointment.id]: "Review submitted successfully!",
      }));
    } catch (error) {
      console.error("Review error:", error);

      setReviewMessage((prev) => ({
        ...prev,
        [appointment.id]: "Failed to submit review.",
      }));
    }
  };
  // Loading
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h4>Loading appointments...</h4>
      </Container>
    );
  }

  return (
    <Container className="my-appointments-page py-5">
      {/* TITLE */}
      <div className="section-title mb-4">
        <h2>My Appointments</h2>

        <p>Manage your hair appointments</p>
      </div>

      {/* NO APPOINTMENT */}
      {appointments.length === 0 ? (
        <Card className="empty-appointment-card">
          <Card.Body className="text-center">
            <h4>No appointments yet</h4>

            <p>You haven't booked any appointments.</p>

            <Button variant="dark" onClick={() => navigate("/services")}>
              Book an Appointment
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {appointments.map((appointment) => (
            <Col md={6} lg={4} key={appointment.id} className="mb-4">
              <Card className="appointment-card h-100">
                <Card.Body>
                  {/* SERVICE + STATUS */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      {getServiceName(appointment.serviceId)}
                    </h5>

                    <Badge bg={getStatusVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>

                  {/* STYLIST */}
                  <p>
                    <strong>Stylist:</strong>{" "}
                    {getStylistName(appointment.stylistId)}
                  </p>

                  {/* DATE */}
                  <p>
                    <strong>Date:</strong> {appointment.date}
                  </p>

                  {/* TIME */}
                  <p>
                    <strong>Time:</strong> {appointment.time}
                  </p>

                  {/* PRICE */}
                  <p>
                    <strong>Total:</strong>{" "}
                    {formatPrice(appointment.totalPrice)}
                  </p>

                  {/* CANCEL */}
                  {appointment.status === "pending" && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                  {appointment.status === "completed" &&
                    !getAppointmentReview(appointment.id) && (
                      <div className="review-box mt-3">
                        <hr />

                        <h6>Leave a Review</h6>

                        <Form.Select
                          className="mb-2"
                          value={reviewRatings[appointment.id] || ""}
                          onChange={(e) =>
                            setReviewRatings((prev) => ({
                              ...prev,
                              [appointment.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Choose rating</option>

                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>

                          <option value="4">⭐⭐⭐⭐ Good</option>

                          <option value="3">⭐⭐⭐ Average</option>

                          <option value="2">⭐⭐ Poor</option>

                          <option value="1">⭐ Very Poor</option>
                        </Form.Select>

                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Write your review..."
                          value={reviewComments[appointment.id] || ""}
                          onChange={(e) =>
                            setReviewComments((prev) => ({
                              ...prev,
                              [appointment.id]: e.target.value,
                            }))
                          }
                        />

                        {reviewMessage[appointment.id] && (
                          <small className="d-block mt-2">
                            {reviewMessage[appointment.id]}
                          </small>
                        )}

                        <Button
                          variant="dark"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleReview(appointment)}
                        >
                          Submit Review
                        </Button>
                      </div>
                    )}
                  {appointment.status === "completed" &&
                    getAppointmentReview(appointment.id) && (
                      <div className="review-submitted mt-3">
                        <hr />

                        <h6>Your Review</h6>

                        <p>
                          {"⭐".repeat(
                            getAppointmentReview(appointment.id).rating,
                          )}
                        </p>

                        <p>{getAppointmentReview(appointment.id).comment}</p>
                      </div>
                    )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyAppointments;
