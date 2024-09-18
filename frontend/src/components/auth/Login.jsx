import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { Alert, Container, TextField } from "@mui/material";
import { Button, Form } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error message

    try {
      const response = await axios.post("/auth/login", { username, password });

      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);

      // Navigate based on role received from server
      if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (response.data.role === "manager") {
        navigate("/manager-dashboard");
      } else if (response.data.role === "employee") {
        navigate("/employee-dashboard");
      } else {
        // If role doesn't match any known roles, show error message
        setError("Invalid role. Please contact admin.");
      }
    } catch (err) {
      // Set error message if login fails
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Container>
      <h2 className="my-4">Login</h2>

      {/* Error message */}
      {error && (
        <Alert severity="error" className="my-3">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
