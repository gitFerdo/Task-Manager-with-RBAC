import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem, Select } from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", {
        username,
        password,
        role,
      });

      navigate("/login");
    } catch (err) {
      console.error(err.response.data.message);
    }
  };
  return (
    <Container>
      <h2 className="my-4">Register</h2>

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
        <Form.Group controlId="formRole" className="mt-3">
          <InputLabel>Role</InputLabel>

          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
