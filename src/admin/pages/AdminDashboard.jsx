import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import {
  getAppointments,
  getServices,
  getUsers,
} from "../../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([
      getUsers(),
      getAppointments(),
      getServices(),
    ])
      .then(
        ([
          userResponse,
          appointmentResponse,
          serviceResponse,
        ]) => {
          setUsers(userResponse.data);
          setAppointments(appointmentResponse.data);
          setServices(serviceResponse.data);
        }
      )
      .catch((error) => {
        console.error(
          "Error loading dashboard:",
          error
        );
      });
  }, []);

  const customers = users.filter(
    (user) => user.role === "customer"
  );

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending"
  );

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed"
  );

  const revenue = completedAppointments.reduce(
    (total, appointment) =>
      total + Number(appointment.totalPrice || 0),
    0
  );

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const getServiceName = (serviceId) => {
    const service = services.find(
      (item) => item.id === serviceId
    );

    return service
      ? service.name
      : "Unknown Service";
  };

  const recentAppointments = [
    ...appointments,
  ]
    .sort((a, b) => {
      return (
        new Date(`${b.date}T${b.time}`) -
        new Date(`${a.date}T${a.time}`)
      );
    })
    .slice(0, 5);

  return (
    <Container fluid className="admin-dashboard">

      <div className="admin-page-title">
        <h2>Dashboard</h2>
        <p>
          Welcome to Hair Booking Admin Panel
        </p>
      </div>

      <Row className="g-4 mb-4">

        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <p>Total Customers</p>
              <h3>{customers.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <p>Total Appointments</p>
              <h3>{appointments.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <p>Pending Booking</p>
              <h3>{pendingAppointments.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <p>Revenue</p>
              <h3>{formatPrice(revenue)}</h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <Card className="admin-table-card">

        <Card.Body>

          <h5 className="mb-4">
            Recent Appointments
          </h5>

          {recentAppointments.length === 0 ? (
            <p className="text-muted">
              No appointments found.
            </p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {recentAppointments.map(
                  (appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        {appointment.userId}
                      </td>

                      <td>
                        {getServiceName(
                          appointment.serviceId
                        )}
                      </td>

                      <td>
                        {appointment.date}
                      </td>

                      <td>
                        {appointment.time}
                      </td>

                      <td>
                        {appointment.status}
                      </td>

                      <td>
                        {formatPrice(
                          Number(
                            appointment.totalPrice
                          )
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          )}

        </Card.Body>
      </Card>

    </Container>
  );
}

export default AdminDashboard;