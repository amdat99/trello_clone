import React, { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { requestHandler } from "../../helpers/requestHandler";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";

function Landing(props) {
  const [logout, user] = useUserStore((state) => [state.logout, state.user], shallow);
  const [testOrg, setTestOrg] = useState([]);
  const { data, fetchData, error, isFetching } = useFetchData(
    {
      type: "post",
      route: "org/user",
    },
    "org/user",
    false
  );

  React.useEffect(() => {
    fetchData();
    requestHandler({ route: "org/all", type: "post" }).then((res) => {
      if (res && !res.errors && res?.length) {
        setTestOrg(res);
      }
    });
  }, []);

  const onLogout = () => {
    requestHandler({ route: "auth/logout", type: "post" }).then((data) => {
      if (data === "logged out successfully") {
        logout();
      } else {
        alert("error logging out");
      }
    });
  };

  const addToOrg = (name) => {
    requestHandler({ route: "org/adduser", type: "post", body: { name, profile_id: user.profile_id } }).then((res) => {
      if (res === "user added successfully") {
        fetchData();
      } else {
        alert(res?.errors ? res.errors : "error adding to org");
      }
    });
  };
  // for reference:
  console.log(error, isFetching);
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 10 }}>
      <Button
        variant="contained"
        onClick={onLogout}
        sx={{ mr: 2, maxWidth: "60%", position: "absolute", right: 10, top: 10 }}
      >
        Logout
      </Button>

      {data && (
        <>
          <Card sx={{ maxWidth: "60%", p: 2, position: "absolute", left: 10, top: 10 }}>
            {user && <Typography variant="h6"> Organisations for {user.name} </Typography>}
            {data.map((org) => (
              <Link to={`/board/${org.name}`} key={org.name}>
                <Button variant="contained">{org.name}</Button>
              </Link>
            ))}
          </Card>
        </>
      )}

      <Card sx={{ maxWidth: "60%", p: 3, ml: 2, position: "absolute", right: 10, top: "15%" }}>
        <List component="nav" aria-label="orgsanisations">
          <Typography variant="caption" gutterBottom>
            Add user to org- (for testing only admins would be<br></br> able to add a user once in a orgnisation
            currently all users are admin)
          </Typography>
          <Divider />
          {testOrg.length > 0 &&
            testOrg.map((org) => (
              <div key={org.name}>
                <ListItemButton onClick={() => addToOrg(org.name)}>
                  <ListItemIcon>
                    <CorporateFareIcon />
                  </ListItemIcon>
                  <ListItemText primary={org.name} />
                </ListItemButton>
                <Divider />
              </div>
            ))}
        </List>
      </Card>
    </Box>
  );
}

export default Landing;
