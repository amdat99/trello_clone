import React, { useState } from "react";
import Authentication from "./Authentication";
import Typography from "@mui/material/Typography";
import Inputs from "../../components/inputs/Inputs";
import Button from "@mui/material/Button";
import { requestHandler } from "../../helpers/requestHandler";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import { AltRouteTwoTone } from "@mui/icons-material";

function AuthenticationMain() {
  let show = true;
  const [formType, setShowFormType] = React.useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const onSubmit = ()=>{
    setLoading(true);
    requestHandler({ route: "auth/forgot", type: "post", body: {email} }).then((data) => {
      setLoading(false);
      if(data === "email sent success"){
        alert("Email link has been sent to your address");
      }
      else{
        return alert(data?.errors ? data.errors : 'data not found')
      }
    });
  }

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
              <Typography
                variant={"h6"}
                sx={{ textAlign: "center" }}
                color="primary"
              >
                Welcome to
              </Typography>
              <Typography
                variant={"h2"}
                sx={{ mb: 2, textAlign: "center" }}
                color="primary"
              >
                Tasker
              </Typography>
              <Grid container sx={{ mt: 4, justifyContent: "center" }}>
                <Button
                  sx={{ mr: 2 }}
                  onClick={() => setShowFormType("login")}
                  variant="contained"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => setShowFormType("register")}
                  variant="contained"
                >
                  Register
                </Button>
              </Grid>
            </Card>
          )}
          {formType === "Forgot Password" ? (
            <Card raised sx={cardStyles}>
              <Typography
                variant={"h5"}
                sx={{ textAlign: "center" }}
                color="primary"
              >
                Forgot password
              </Typography>
              <Grid container sx={{ mt: 4, justifyContent: "center" }}>
                <Box component="form" onSubmit={onSubmit} autoComplete="off">
                  <Inputs
                    key={"email"}
                    type={"email"}
                    label={"email"}
                    name={"email"}
                    value={email}
                    handleChange={setEmail}
                    placeholder={"jon.doe@example.com"}
                    // inputProps={input.minLength && { minLength: input.minLength }}
                    helperText={
                      "Please enter the email used to create your account"
                    }
                    required
                    error={"The email entered is not valid"}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    type={"submit"}
                    variant="contained"
                    disabled={loading}
                  >
                    {!loading ? "Submit" : <LinearProgress sx={{ mt: 1 }} />}
                  </Button>
                </Box>
              </Grid>
            </Card>
          ) : (
            <Authentication
              formType={formType}
              setShowFormType={setShowFormType}
            />
          )}
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
