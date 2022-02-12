import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NotFound = () => (
  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
    <Typography variant="h2">404 - Not Found!</Typography>
    <Link to="/">
      <Button variant="contained">Go Home</Button>
    </Link>
  </div>
);

export default NotFound;
