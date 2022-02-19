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
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import Sidebar from "../../components/sidebar/Sidebar";
import { requestHandler } from "../../helpers/requestHandler";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import boardIcon from "../../assets/images/icons/BORADS_icon.png";
import background from "../../assets/images/background.png";
import BoardCard from "../../components/boardCard/BoardCard";

function Landing() {
  const navigate = useNavigate();
  const [logout, user, currentOrg, setCurrentOrg] = useUserStore(
    (state) => [state.logout, state.user, state.currentOrg, state.setCurrentOrg],
    shallow
  );
  const [testOrg, setTestOrg] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [activeBoards, setActiveBoards] = useState([]);
  const { data, fetchData } = useFetchData(
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
    let currentActiveBoards = [];
    if (boards) {
      boards.forEach((board) => {
        board.assigned_users.forEach((boardUser) => {
          if (boardUser.name === user.name) {
            currentActiveBoards.push(board);
          }
        });
      });
      setActiveBoards(currentActiveBoards);
    }
  }, [boards]);

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
                value={currentOrg}
                label="Workspace"
              >
                {data &&
                  data.map((item) => {
                    return (
                      <MenuItem onClick={() => setCurrentOrg(item.name)} key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Button variant="outlined">New Board</Button>
          </Box>
        </Box>

        <Box sx={{ mt: "40px" }}>
          <Typography sx={{ fontWeight: "bold" }}>RECENT BOARDS</Typography>
          <hr />
          <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
            {recentBoards &&
              currentOrg &&
              recentBoards.map((item, index) => (
                <BoardCard index={index} currentOrg={currentOrg} item={item} recentBoards={recentBoards} />
              ))}
          </ImageList>
        </Box>
        <Box sx={{ mt: "40px" }}>
          <Typography sx={{ fontWeight: "bold" }}>All BOARDS</Typography>
          <hr />
          <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
            {boards &&
              boards.map((item, index) => (
                <BoardCard key={index} currentOrg={currentOrg} item={item} recentBoards={recentBoards} />
              ))}
          </ImageList>
        </Box>
        <Box sx={{ mt: "40px" }}>
          <Typography sx={{ fontWeight: "bold" }}>ACTIVE BOARDS</Typography>
          <hr />
          <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
            {boards &&
              activeBoards.map((item, index) => (
                <BoardCard key={index} currentOrg={currentOrg} item={item} recentBoards={recentBoards} />
              ))}
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
        orgName={currentOrg}
        setShowDetail={setShowDetail}
        showDetail={showDetail}
        navigate={navigate}
        setView={() => {}}
        landing={true}
      />
    </>
  );
}

export default Landing;
