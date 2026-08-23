import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { getUsers, registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Validate empty fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Please complete all registration information.");
      return;
    }

    // Validate password
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Check existing email
      const response = await getUsers();

      const existingUser = response.data.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        setMessage("This email is already registered.");
        return;
      }

      // Create user
      const newUser = {
        name,
        email,
        password,
        phone,
        role: "customer",
      };

      await registerUser(newUser);

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="register-page py-5">
      <Card className="register-card mx-auto">
        <Card.Body>

          <div className="register-title">
            <h1>Create Account</h1>
            <p>Join Hair Booking today</p>
          </div>

          <Form onSubmit={handleSubmit}>

            {/* NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* PHONE */}
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>

              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* CONFIRM PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* MESSAGE */}
            {message && (
              <div className="register-message">
                {message}
              </div>
            )}

            {/* REGISTER */}
            <Button
              type="submit"
              className="register-btn w-100"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Register"}
            </Button>

          </Form>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;