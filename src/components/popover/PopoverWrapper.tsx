import React from "react";
import Popover from "@mui/material/Popover";
import { useMediaQuery } from "@mui/material";

function PopoverWrapper({ position, children, open, anchor, onClose, onContext = false, ml = 0, styles = null }) {
  const min1200 = useMediaQuery("(min-width:1200px)");
  const max800 = useMediaQuery("(max-width:800px)");
  const ctxStyles = {
    position: "fixed",
    zIndex: 999,
    ml: ml,
    left: position.x ? position.x.toString() - (max800 ? 370 : 920) + "px" : "",
    top: position.x ? position.y.toString() + "px" : "",
  };
  return (
    <Popover
      open={open}
      anchorEl={anchor}
      transitionDuration={{ enter: 300, exit: 0 }}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={
        onContext
          ? ctxStyles
          : styles
          ? styles
          : {
              marginTop: "40px",
              zIndex: 999,
              left: min1200 ? "11rem" : max800 ? "-3rem" : "1rem",
              ml: ml,
            }
      }
    >
      {children}
    </Popover>
  );
}

export default PopoverWrapper;
