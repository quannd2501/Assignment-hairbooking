import { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";

import { getStylists, createStylist, updateStylist } from "../../services/api";

function AdminStylists() {
  const [stylists, setStylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStylist, setEditingStylist] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: "",
    specialization: "",
    image: "",
  });

  useEffect(() => {
    loadStylists();
  }, []);

  const loadStylists = async () => {
    try {
      const response = await getStylists();
      setStylists(response.data);
    } catch (error) {
      console.error("Error loading stylists:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = () => {
    setEditingStylist(null);

    setFormData({
      name: "",
      phone: "",
      experience: "",
      specialization: "",
      image: "",
    });

    setShowModal(true);
  };

  const handleEdit = (stylist) => {
    setEditingStylist(stylist);

    setFormData({
      name: stylist.name,
      phone: stylist.phone,
      experience: stylist.experience,
      specialization: stylist.specialization,
      image: stylist.image,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.experience ||
      !formData.specialization
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const stylistData = {
      ...formData,
      experience: Number(formData.experience),
    };

    try {
      if (editingStylist) {
        const response = await updateStylist(editingStylist.id, stylistData);

        setStylists((prev) =>
          prev.map((stylist) =>
            stylist.id === editingStylist.id ? response.data : stylist,
          ),
        );
      } else {
        const response = await createStylist({
          ...stylistData,
          status: "active",
        });

        setStylists((prev) => [...prev, response.data]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Stylist save error:", error);

      alert("Failed to save stylist.");
    }
  };

  const handleToggleStatus = async (stylist) => {
    const isDisabled = stylist.status === "disabled";

    const newStatus = isDisabled ? "active" : "disabled";

    const action = isDisabled ? "enable" : "disable";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this stylist?`,
    );

    if (!confirmAction) {
      return;
    }

    try {
      const response = await updateStylist(stylist.id, {
        status: newStatus,
      });

      setStylists((prev) =>
        prev.map((item) => (item.id === stylist.id ? response.data : item)),
      );
    } catch (error) {
      console.error("Stylist status error:", error);

      alert("Failed to update stylist status.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Manage Stylists</h2>
          <p>Manage salon stylists</p>
        </div>

        <Button variant="dark" onClick={handleAdd}>
          + Add Stylist
        </Button>
      </div>

      <Card className="admin-table-card">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {stylists.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No stylists found.
                  </td>
                </tr>
              ) : (
                stylists.map((stylist) => (
                  <tr key={stylist.id}>
                    <td>
                      <img
                        src={stylist.image}
                        alt={stylist.name}
                        className="admin-stylist-image"
                      />
                    </td>

                    <td>
                      <strong>{stylist.name}</strong>
                    </td>

                    <td>{stylist.phone}</td>

                    <td>{stylist.experience} years</td>

                    <td>{stylist.specialization}</td>

                    <td>
                      {stylist.status === "disabled" ? (
                        <span className="text-danger">Disabled</span>
                      ) : (
                        <span className="text-success">Active</span>
                      )}
                    </td>

                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleEdit(stylist)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant={
                          stylist.status === "disabled"
                            ? "outline-success"
                            : "outline-danger"
                        }
                        onClick={() => handleToggleStatus(stylist)}
                      >
                        {stylist.status === "disabled" ? "Enable" : "Disable"}
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
          <Modal.Title>
            {editingStylist ? "Edit Stylist" : "Add Stylist"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>

              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter stylist name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>

              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>

              <Form.Control
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>

              <Form.Control
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Haircut, Coloring..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>

              <Form.Control
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>

            <Button variant="dark" type="submit">
              {editingStylist ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminStylists;
