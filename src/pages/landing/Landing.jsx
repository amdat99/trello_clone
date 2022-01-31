import React, { useState } from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [logout, user] = useUserStore((state) => [state.logout, state.user], shallow);
  const [testOrg, setTestOrg] = useState([]);
  const { data, fetchData, error, isFetching } = useFetchData(
    {
      type: "post",
      route: "org/user",
    },
    "org/user",
    true,
    true
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

  const enterOrg = (name) => {
    requestHandler({ route: "org/enter", type: "post", body: { name: name } }).then((data) => {
      if (data === "entered organisation successfully") {
        navigate(`/board/${name}`);
      } else {
        navigate("/");
        alert("error entering org");
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
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 10 }}>
      <Card sx={{ maxWidth: "60%", p: 2, position: "absolute", right: 10, top: 10 }}>
        <Button variant="contained" onClick={onLogout} sx={{ mr: 2 }}>
          Logout
        </Button>
      </Card>

      {data.length && (
        <>
          <Card sx={{ maxWidth: "60%", p: 2, position: "absolute", left: 10, top: 10 }}>
            <Typography variant="h6"> Organisations for {user.name} </Typography>
            {data.map((org) => (
              <Button onClick={() => enterOrg(org.name)} variant="contained" key={org.name}>
                {org.name}
              </Button>
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
