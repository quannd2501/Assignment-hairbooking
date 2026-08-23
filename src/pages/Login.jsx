import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");

    // Validate
    if (!email || !password) {
      setMessage("Please complete all login information.");
      return;
    }

    setLoading(true);

    loginUser(email, password)
      .then((response) => {
        const users = response.data;

        if (users.length === 0) {
          setMessage("Email or password is incorrect.");
          return;
        }

        const user = users[0];
        login(user);

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage("Login failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="login-page py-5">
      <Card className="login-card mx-auto">
        <Card.Body>
          <div className="login-title">
            <h1>Welcome Back</h1>
            <p>Login to your Hair Booking account</p>
          </div>

          <Form onSubmit={handleSubmit}>
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

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
              />
            </Form.Group>

            {/* MESSAGE */}
            {message && <div className="login-message">{message}</div>}

            {/* LOGIN */}
            <Button
              type="submit"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
