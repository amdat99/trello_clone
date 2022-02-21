import React from "react";
import { Card, Box, Divider } from "@mui/material/";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TableViewIcon from "@mui/icons-material/TableView";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
// import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";

function Sidebar({
  stickyMenu,
  setStickyMenu,
  setShowDetail,
  showDetail,
  navigate,
  orgName,
  boradName,
  landing = false,
}) {
  const spanStyle = showDetail || stickyMenu ? { display: "flex", marginLeft: "10px" } : { display: "none" };
  const divStyle = { display: "flex", flexDirection: "row", width: "200px", color: "primary" };

  const setView = (view) => {
    if (landing) {
      navigate(`/board/${orgName}?view=${view}`);
    } else {
      navigate(`/board/${orgName}?board=${boradName}&view=${view}`);
    }
  };

  return (
    <>
      <div style={{ width: "180px" }} onMouseOver={() => setShowDetail(true)} onMouseOut={() => setShowDetail(false)}>
        <Card raised sx={{ bgColor: "rgb(234, 238, 238)" }} className={stickyMenu ? "sideBar1" : "sideBar"}>
          <div style={{ position: "relative", right: "5px", marginTop: "5px" }}>
            {/* {showDetail && <Typography sx={{ mb: 1, ml: 0.5 }}>Menu</Typography>} */}
            <Box onClick={() => navigate("/")} sx={divStyle}>
              <CottageOutlinedIcon />
              <span style={spanStyle}>Home</span>
            </Box>
            <Divider />
            {!landing && (
              <>
                <Box onClick={() => setView("l")} sx={divStyle}>
                  <ViewKanbanIcon />
                  <span style={spanStyle}>Board View</span>
                </Box>
                <Divider />
              </>
            )}
            <Box onClick={() => setView("t")} sx={divStyle}>
              <TableViewIcon />
              <span style={spanStyle}>Table View</span>
            </Box>
            <Divider />
            <Box onClick={() => setView("a")} sx={divStyle}>
              <Inventory2Icon />
              <span style={spanStyle}>Archive View</span>
            </Box>
            <Divider />

            <Box
              style={{ zIndex: 999, position: "relative" }}
              onClick={() => {
                console.log("test");
              }}
            >
              <CorporateFareIcon />
            </Box>
          </div>

          <div style={{ position: "absolute", bottom: "0", left: "2px" }} onClick={() => setStickyMenu(!stickyMenu)}>
            <PushPinIcon color={stickyMenu ? "primary" : "secondary"} />
          </div>
        </Card>
      </div>
    </>
  );
}

export default Sidebar;
