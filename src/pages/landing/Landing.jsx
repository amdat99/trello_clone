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
  Card,
  ListItemIcon,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import * as timeago from "timeago.js";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import Sidebar from "../../components/sidebar/Sidebar";
import { requestHandler } from "../../helpers/requestHandler";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import boardIcon from "../../assets/images/icons/BORADS_icon.png";
import background from "../../assets/images/background.png";
import BoardCard from "../../components/BoardCard/BoardCard";

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

  const { data: recentBoards, fetchData: fetchRecentBoards } = useFetchData(
    {
      type: "post",
      route: "profile/recentboards",
    },
    "profile/recentboards"
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
    fetchRecentBoards();
  }, [currentOrg]);

  useEffect(() => {
    const checkOrgAndFetchBoards = () => {
      requestHandler({
        route: "org/enter",
        type: "post",
        body: { name: currentOrg },
      }).then((data) => {
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

  console.log(recentBoards);
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
    requestHandler({
      route: "org/adduser",
      type: "post",
      body: { name, profile_id: user.profile_id },
    }).then((res) => {
      if (res === "user added successfully") {
        fetchData();
      } else {
        alert(res?.errors ? res.errors : "error adding to org");
      }
    });
  };

  const addRecentBoard = (board) => {
    if (recentBoards.length >= 10) {
      recentBoards.pop();
    }
    recentBoards.unshift({ image: board.image, name: board.name, id: board.id });
    requestHandler({
      route: "profile/updateboards",
      type: "put",
      body: { recent_boards: JSON.stringify(recentBoards) },
    }).then((res) => {
      if (res === "board updated successfully") {
        console.log("worked");
      } else {
        alert(res?.errors ? res.errors : "error adding recent board");
      }
    });
  };
  // for reference:
  return (
    <>
      <Box
        sx={{
          width: "80%",
          justifyContent: "unset",
          margin: "0 auto",
          mt: "5vh",
        }}
      >
        <img src={background} style={{ position: "fixed", zIndex: "-1", top: "0", left: "0" }} />
        <Button
          variant="contained"
          onClick={onLogout}
          sx={{
            mr: 2,
            maxWidth: "60%",
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          Logout
        </Button>
        {data && (
          <>
            <Card
              sx={{
                maxWidth: "60%",
                p: 2,
                position: "absolute",
                right: "10%",
                top: 100,
              }}
            >
              {user && <Typography variant="h6"> Organizations for {user.name} </Typography>}
              {data.map((org) => (
                // <Link to={`/board/${org.name}`} key={org.name}>
                <span onClick={() => setCurrentOrg(org.name)} key={org.name}>
                  <Button variant="contained">{org.name}</Button>
                </span>
              ))}
            </Card>
          </>
        )}
        {currentOrg && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src={boardIcon} />
              <Box>
                <Typography
                  style={{
                    fontSize: "11px",
                    marginLeft: "4px",
                    marginBottom: "-10px",
                  }}
                >
                  WORKSPACE
                </Typography>
                <Typography color="primary" variant="h2">
                  Boards
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <InputLabel id="select-workspace">Workspace</InputLabel>
                <Select
                  sx={{ width: "250px", mr: "10px" }}
                  placeholder="Select Workspace"
                  labelId="select-workspace"
                  value=""
                  label="Workspace"
                  onChange={() => {}}
                >
                  <MenuItem value="">Workspace One</MenuItem>
                  <MenuItem value="">Workspace Two</MenuItem>
                  <MenuItem value="">Workspace Three</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined">New Board</Button>
            </Box>
          </Box>
        )}
        <Box sx={{ mt: "40px" }}>
          <Typography sx={{ fontWeight: "bold" }}>ACTIVE BOARDS</Typography>
          <hr />
          <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
            {boards && boards.map((item) => <BoardCard currentOrg={currentOrg} item={item} />)}
          </ImageList>
        </Box>
        <Box sx={{ mt: "40px" }}>
          <Typography sx={{ fontWeight: "bold" }}>All BOARDS</Typography>
          <hr />
          <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
            {boards && boards.map((item) => <BoardCard currentOrg={currentOrg} item={item} />)}
          </ImageList>
        </Box>
        <Card
          sx={{
            maxWidth: "60%",
            p: 3,
            ml: 2,
            position: "absolute",
            right: 10,
            top: "55%",
          }}
        >
          <List component="nav" aria-label="orgsanisations">
            <Typography variant="caption" gutterBottom>
              Add user to org- (for testing only admins would be<br></br> able to add a user once in a organization
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
