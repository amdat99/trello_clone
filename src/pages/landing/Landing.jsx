import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Card,
  ListItemIcon,
} from "@mui/material";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import Sidebar from "../../components/sidebar/Sidebar";
import { requestHandler } from "../../helpers/requestHandler";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";

function Landing() {
  const navigate = useNavigate();
  const [logout, user, currentOrg, setCurrentOrg] = useUserStore(
    (state) => [state.logout, state.user, state.currentOrg, state.setCurrentOrg],
    shallow
  );
  const [testOrg, setTestOrg] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { data, fetchData, error, isFetching } = useFetchData(
    {
      type: "post",
      route: "org/user",
    },
    "org/user",
    false
  );
  const { data: boards, fetchData: fetchBoards } = useFetchData(
    {
      type: "post",
      route: "board/all",
    },
    "board/all"
  );

  useEffect(() => {
    fetchData();
    requestHandler({ route: "org/all", type: "post" }).then((res) => {
      if (res && !res.errors && res?.length) {
        setTestOrg(res);
      }
    });
  }, []);

  useEffect(() => {
    const checkOrgAndFetchBoards = () => {
      requestHandler({ route: "org/enter", type: "post", body: { name: currentOrg } }).then((data) => {
        if (data !== "entered organisation successfully") {
          alert("error entering org");
        } else {
          fetchBoards();
        }
      });
    };

    if (currentOrg) {
      checkOrgAndFetchBoards();
    }
  }, [currentOrg]);

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
  console.log(data, isFetching);
  return (
    <>
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
            <Card sx={{ maxWidth: "60%", p: 2, position: "absolute", right: "10%", top: 10 }}>
              {user && <Typography variant="h6"> Organisations for {user.name} </Typography>}
              {data.map((org) => (
                // <Link to={`/board/${org.name}`} key={org.name}>
                <span onClick={() => setCurrentOrg(org.name)} key={org.name}>
                  <Button variant="contained">{org.name}</Button>
                </span>
              ))}
            </Card>
          </>
        )}
        <Box>
          {currentOrg && (
            <Typography sx={{ position: "absolute", top: 20, left: "4%" }} color="primary" variant="h6">
              Boards for {currentOrg}
            </Typography>
          )}

          <ImageList cols={4} sx={{ position: "absolute", left: "4%", top: 40 }}>
            {boards &&
              boards.map((item) => (
                <ImageListItem
                  sx={{ cursor: "pointer" }}
                  key={item.name}
                  onClick={() => navigate(`/board/${currentOrg}?board=${item.name}&view=l`)}
                >
                  <img
                    style={{ width: "200px", height: "100px", margin: "4px" }}
                    src={`${item.image}`}
                    srcSet={`${item.image}`}
                    alt={item.name}
                    loading="lazy"
                  />
                  <ImageListItemBar title={item.name} subtitle={<span>{item.created_at}</span>} position="below" />
                </ImageListItem>
              ))}
          </ImageList>
        </Box>
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
      <Sidebar
        setStickyMenu={setStickyMenu}
        stickyMenu={stickyMenu}
        setShowDetail={setShowDetail}
        showDetail={showDetail}
        navigate={navigate}
        setView={() => {}}
      />
    </>
  );
}

export default Landing;
