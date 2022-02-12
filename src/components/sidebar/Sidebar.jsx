import React from "react";
import { Card, Box, Divider } from "@mui/material/";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import TableViewIcon from "@mui/icons-material/TableView";
// import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";

function Sidebar({ stickyMenu, setStickyMenu, setShowDetail, showDetail, navigate }) {
  const spanStyle = showDetail || stickyMenu ? { display: "flex", marginLeft: "10px" } : { display: "none" };
  const divStyle = { display: "flex", flexDirection: "row", width: "200px" };

  return (
    <>
      <div style={{ width: "180px" }} onMouseOver={() => setShowDetail(true)} onMouseOut={() => setShowDetail(false)}>
        <Card sx={{ bgColor: "rgb(234, 238, 238)" }} className={stickyMenu ? "sideBar1" : "sideBar"}>
          <div style={{ position: "relative", right: "5px", marginTop: "5px" }}>
            {/* {showDetail && <Typography sx={{ mb: 1, ml: 0.5 }}>Menu</Typography>} */}
            <div onClick={() => navigate("/")} style={divStyle}>
              <CottageOutlinedIcon />
              <span style={spanStyle}>Home</span>
            </div>
            <Divider gutterBottom />

            <div onClick={() => console.log("test")} style={divStyle}>
              <TableViewIcon />
              <span style={spanStyle}>Table View</span>
            </div>
            <Divider gutterBottom />

            <div
              style={{ zIndex: 999, position: "relative" }}
              onClick={() => {
                console.log("test");
              }}
            >
              <CorporateFareIcon />
            </div>
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
