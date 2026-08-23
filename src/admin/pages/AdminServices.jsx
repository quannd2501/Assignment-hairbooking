import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../services/api";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
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
    setEditingService(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "",
      image: "",
    });

    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);

    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      image: service.image,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.category
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const serviceData = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
    };

    try {
      if (editingService) {
        const response = await updateService(
          editingService.id,
          serviceData
        );

        setServices((prev) =>
          prev.map((service) =>
            service.id === editingService.id
              ? response.data
              : service
          )
        );
      } else {
        const response = await createService(
          serviceData
        );

        setServices((prev) => [
          ...prev,
          response.data,
        ]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Service save error:", error);
      alert("Failed to save service.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteService(id);

      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (error) {
      console.error(
        "Service delete error:",
        error
      );

      alert("Failed to delete service.");
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h2>Manage Services</h2>
          <p>Manage salon services</p>
        </div>

        <Button variant="dark" onClick={handleAdd}>
          + Add Service
        </Button>
      </div>

      <Card className="admin-table-card">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <img
                      src={service.image}
                      alt={service.name}
                      className="admin-service-image"
                    />
                  </td>

                  <td>
                    <strong>{service.name}</strong>
                  </td>

                  <td>{service.category}</td>

                  <td>
                    {formatPrice(service.price)}
                  </td>

                  <td>
                    {service.duration} minutes
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() =>
                        handleEdit(service)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() =>
                        handleDelete(service.id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingService
              ? "Edit Service"
              : "Add Service"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>

            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter service name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Duration (minutes)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Haircut, Color, Treatment..."
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
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button variant="dark" type="submit">
              {editingService ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminServices;