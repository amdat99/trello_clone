import React, { useState, useEffect } from "react";
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

function AuthenticationMain() {
  const styles = makeStyles();
  const [formType, setShowFormType] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  // const [deviceInfo, setDeviceInfo] = useState(null);
  const [inputNotChanged, setInputNotChanged] = useState(true);

  // useEffect(() => {
  //   if (formType === "Forgot Password") {
  //     try {
  //       fetch("https://geolocation-db.com/json/").then((data) => setDeviceInfo(data.json()));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, [formType]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    requestHandler({ route: "auth/forgot", type: "post", body: { email } }).then((data) => {
      setLoading(false);
      if (data === "email sent success") {
        alert("Email link has been sent to your address");
      } else {
        return alert(data?.errors ? data.errors : "data not found");
      }
    });
  };

  const handleChange = (value) => {
    setEmail(value);
    if (inputNotChanged) setInputNotChanged(false);
  };

  return (
    <div
      className="background"
      style={{
        backgroundImage:
          "url(" +
          "https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      }}
    >
      <Grow in={true}>
        <Box sx={styles.box}>
          {formType === "" && (
            <Card raised sx={styles.card}>
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
          {formType === "Forgot Password" ? (
            <Card raised sx={styles.card}>
              <Typography variant={"h5"} sx={{ textAlign: "center" }} color="primary">
                Forgot password
              </Typography>
              <Grid container sx={{ mt: 4, justifyContent: "center" }}>
                <Box component="form" onSubmit={onSubmit} autoComplete="off">
                  <Inputs
                    type={"email"}
                    label={"email"}
                    name={"email"}
                    value={email}
                    handleChange={handleChange}
                    placeholder={"jon.doe@example.com"}
                    helperText={"Please enter the email used to create your account"}
                    required
                    error={inputNotChanged ? false : !/(.+)@(.+){2,}\.(.+){2,}/.test(email)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type={"submit"} variant="contained" disabled={loading}>
                      {!loading ? "Submit" : <LinearProgress sx={{ mt: 1 }} />}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowFormType("");
                      }}
                      variant={"outlined"}
                    >
                      Go back
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Card>
          ) : (
            <Authentication formType={formType} setShowFormType={setShowFormType} styles={styles} />
          )}
        </Box>
      </Grow>
    </div>
  );
}

export const makeStyles = () => ({
  card: {
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
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthenticationMain;
