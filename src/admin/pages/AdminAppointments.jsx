import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Table,
} from "react-bootstrap";

import {
  getAppointments,
  getServices,
  getStylists,
  getUsers,
  updateAppointment,
} from "../../services/api";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAppointments(),
      getServices(),
      getStylists(),
      getUsers(),
    ])
      .then(
        ([
          appointmentResponse,
          serviceResponse,
          stylistResponse,
          userResponse,
        ]) => {
          setAppointments(appointmentResponse.data);
          setServices(serviceResponse.data);
          setStylists(stylistResponse.data);
          setUsers(userResponse.data);
        }
      )
      .catch((error) => {
        console.error(
          "Error loading admin appointments:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getCustomerName = (userId) => {
    const user = users.find(
      (item) => item.id === userId
    );

    return user ? user.name : "Unknown Customer";
  };

  const getServiceName = (serviceId) => {
    const service = services.find(
      (item) => item.id === serviceId
    );

    return service
      ? service.name
      : "Unknown Service";
  };

  const getStylistName = (stylistId) => {
    const stylist = stylists.find(
      (item) => item.id === stylistId
    );

    return stylist
      ? stylist.name
      : "Unknown Stylist";
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };

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

  const updateStatus = async (
    appointmentId,
    newStatus
  ) => {
    try {
      await updateAppointment(appointmentId, {
        status: newStatus,
      });

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: newStatus,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(
        "Update appointment error:",
        error
      );

      alert(
        "Failed to update appointment."
      );
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h4>Loading appointments...</h4>
      </Container>
    );
  }

  return (
    <Container className="admin-appointments-page py-5">

      <div className="section-title mb-4">
        <h2>Manage Appointments</h2>

        <p>
          Manage customer appointments
        </p>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            No appointments found.
          </Card.Body>
        </Card>
      ) : (
        <Card className="admin-table-card">

          <Card.Body>

            <Table
              responsive
              hover
              className="align-middle"
            >
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Stylist</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map(
                  (appointment) => (
                    <tr key={appointment.id}>

                      <td>
                        {getCustomerName(
                          appointment.userId
                        )}
                      </td>

                      <td>
                        {getServiceName(
                          appointment.serviceId
                        )}
                      </td>

                      <td>
                        {getStylistName(
                          appointment.stylistId
                        )}
                      </td>

                      <td>
                        {appointment.date}
                      </td>

                      <td>
                        {appointment.time}
                      </td>

                      <td>
                        {formatPrice(
                          appointment.totalPrice
                        )}
                      </td>

                      <td>
                        <Badge
                          bg={getStatusVariant(
                            appointment.status
                          )}
                        >
                          {appointment.status}
                        </Badge>
                      </td>

                      <td>
                        <div className="admin-action-buttons">

                          {appointment.status ===
                            "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "confirmed"
                                  )
                                }
                              >
                                Confirm
                              </Button>

                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "cancelled"
                                  )
                                }
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {appointment.status ===
                            "confirmed" && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  "completed"
                                )
                              }
                            >
                              Complete
                            </Button>
                          )}

                          {appointment.status ===
                            "completed" && (
                            <span className="text-muted">
                              Completed
                            </span>
                          )}

                          {appointment.status ===
                            "cancelled" && (
                            <span className="text-muted">
                              Cancelled
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </Table>

          </Card.Body>
        </Card>
      )}

    </Container>
  );
}

export default AdminAppointments;