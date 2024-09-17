import { Card, CardContent, Grid2, Typography, Button } from "@mui/material";
import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <Container className="mt-5">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid2 container spacing={3}>
        {/* Manage User Card */}
        <Grid2 item xs={12} md={6}>
          <Card>
            <CardContent>
              {/* <Typography variant="h6" gutterBottom>
                Manage Users
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Create and manage teams for your organization.
              </Typography> */}

              <Link to="/manage-users" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid2>

        {/* Manage Teams Card */}
        <Grid2 item xs={12} md={6}>
          <Card>
            <CardContent>
              {/* <Typography variant="h6" gutterBottom>
                Manage Teams
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Create and manage teams for your organization.
              </Typography> */}

              <Link to="/manage-teams" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary">
                  Manage Teams
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid2>

        {/* Manage Tasks Card */}
        <Grid2 item xs={12} md={6}>
          <Card>
            <CardContent>
              {/* <Typography variant="h6" gutterBottom>
                Manage Tasks
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Assign, update, or delete tasks for team members.
              </Typography> */}

              <Link to="/manage-tasks" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary">
                  Manage Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default AdminDashboard;
