import React from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
// import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";

function Sidebar({ stickyMenu, setStickyMenu, setShowDetail, showDetail, navigate }) {
  return (
    <div
      onMouseOver={() => setShowDetail(true)}
      onMouseOut={() => setShowDetail(false)}
      onClick={() => setStickyMenu(!stickyMenu)}
    >
      <Card sx={{ bgColor: "rgb(234, 238, 238)" }} className={stickyMenu ? "sideBar1" : "sideBar"}>
        <div style={{ position: "relative", right: "5px", marginTop: "5px" }}>
          {/* {showDetail && <Typography sx={{ mb: 1, ml: 0.5 }}>Menu</Typography>} */}
          <div onClick={() => navigate("/")} style={{ display: "flex", flexDirection: "row" }}>
            <CottageOutlinedIcon />
            <span style={showDetail || stickyMenu ? { display: "flex", marginLeft: "10px" } : { display: "none" }}>
              Home
            </span>
          </div>
          <div onClick={() => console.log("test")}>
            <CorporateFareIcon />
          </div>
          <Divider sx={{ borderColor: "black" }} absolute />
          <div
            style={{ zIndex: 999, position: "relative" }}
            onClick={() => {
              console.log("test");
            }}
          >
            <CorporateFareIcon />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Sidebar;
