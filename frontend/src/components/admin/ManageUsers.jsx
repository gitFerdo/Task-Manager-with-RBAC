import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
    role: "",
    team: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/all");
      setUsers(response.data);
      setError(""); // Reset error on success
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unknown error occurred."
      );
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("/team/all");
      setTeams(response.data);
      setError(""); // Reset error on success
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unknown error occurred."
      );
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setCurrentUser({
      username: "",
      password: "",
      role: "",
      team: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      await axios.post("/auth/register", currentUser);
      toast.success("User created successfully");
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Failed to create user");
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred."
      );
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/user/delete/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user");
        setError(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred."
        );
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Manage Users</h2>

      {/* Error message */}
      {error && (
        <Alert severity="error" className="my-3">
          {error}
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New User
      </Button>

      {/* Users Table */}
      <TableContainer component={Paper} className="mt-3">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.team ? user.team.name : "N/A"}</TableCell>
                <TableCell>
                  <Link
                    to={`/edit-user/${user._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="outlined" color="secondary" size="small">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteUser(user._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Create New User</h2>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={currentUser.username}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={currentUser.password}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>

            <Select
              name="role"
              value={currentUser.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Team</InputLabel>

            <Select
              name="team"
              value={currentUser.team}
              onChange={handleChange}
              label="Team"
            >
              <MenuItem value="">None</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
            className="mt-3"
          >
            Create
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default ManageUsers;
