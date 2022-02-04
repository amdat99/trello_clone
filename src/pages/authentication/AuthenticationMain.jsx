import React from "react";
import Authentication from "./Authentication";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";

function AuthenticationMain({}) {
  let show = true;
  const [formType, setShowFormType] = React.useState("");
  return (
    <div
      className="background"
      style={{
        backgroundImage:
          "url(" +
          "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      }}
    >
      <Grow in={show}>
        <Box sx={boxStyles}>
          {formType === "" && (
            <Card raised sx={cardStyles}>
              <Typography variant={"h6"} sx={{ textAlign: "center" }} color="primary">
                Welcome to
              </Typography>
              <Typography variant={"h2"} sx={{ mb: 2, textAlign: "center" }} color="primary">
                Tasker
              </Typography>
              <Grid container sx={{ mt: 4, justifyContent: "center" }}>
                <Button sx={{ mr: 2 }} onClick={() => setShowFormType("login")} variant="contained">
                  Sign in
                </Button>
                <Button onClick={() => setShowFormType("register")} variant="contained">
                  Register
                </Button>
              </Grid>
            </Card>
          )}
          <Authentication formType={formType} setShowFormType={setShowFormType} />
        </Box>
      </Grow>
    </div>
  );
}

const cardStyles = {
  minWidth: 300,
  maxWidth: 300,
  maxHeight: "67vh",
  p: 4,
  mt: "20vh",
  mb: "20vh",
  zIndex: 999,
  position: "relative",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
};

const boxStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default AuthenticationMain;
