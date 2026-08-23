import { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import { getUsers, getAppointments, updateUser } from "../../services/api";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const [usersResponse, appointmentsResponse] = await Promise.all([
        getUsers(),
        getAppointments(),
      ]);

      const customerList = usersResponse.data.filter(
        (user) => user.role === "customer",
      );

      setCustomers(customerList);
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const getBookingCount = (userId) => {
    return appointments.filter((appointment) => appointment.userId === userId)
      .length;
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(keyword) ||
      customer.email?.toLowerCase().includes(keyword) ||
      customer.phone?.toLowerCase().includes(keyword)
    );
  });
  const handleToggleStatus = async (customer) => {
    const isDisabled = customer.status === "disabled";

    const newStatus = isDisabled ? "active" : "disabled";

    const action = isDisabled ? "enable" : "disable";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this customer?`,
    );

    if (!confirmAction) {
      return;
    }

    try {
      const response = await updateUser(customer.id, {
        status: newStatus,
      });

      setCustomers((prev) =>
        prev.map((item) => (item.id === customer.id ? response.data : item)),
      );
    } catch (error) {
      console.error("Update customer status error:", error);

      alert("Failed to update customer status.");
    }
  };
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Manage Customers</h2>
          <p>View registered customers</p>
        </div>
      </div>

      <Card className="admin-table-card">
        <Card.Body>
          <Form.Control
            className="mb-4"
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>

                    <td>
                      <strong>{customer.name}</strong>
                    </td>

                    <td>{customer.email}</td>

                    <td>{customer.phone || "-"}</td>

                    <td>{getBookingCount(customer.id)}</td>
                    <td>
                      {customer.status === "disabled" ? (
                        <span className="text-danger">Disabled</span>
                      ) : (
                        <span className="text-success">Active</span>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => handleView(customer)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          customer.status === "disabled"
                            ? "outline-success"
                            : "outline-danger"
                        }
                        onClick={() => handleToggleStatus(customer)}
                      >
                        {customer.status === "disabled" ? "Enable" : "Disable"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedCustomer && (
            <>
              <p>
                <strong>ID:</strong> {selectedCustomer.id}
              </p>

              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>

              <p>
                <strong>Phone:</strong> {selectedCustomer.phone || "-"}
              </p>

              <p>
                <strong>Total Bookings:</strong>{" "}
                {getBookingCount(selectedCustomer.id)}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminCustomers;
