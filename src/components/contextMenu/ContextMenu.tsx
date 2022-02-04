import React from "react";
import Card from "@mui/material/Card";
import Grow from "@mui/material/Grow";

type Props = {
  x: number;
  y: number;
  children: React.ReactNode;
  showCtxMenu: boolean;
};

function ContextMenu({ x, y, children, showCtxMenu }: Props) {
  const actionStyles = {
    width: "70px",
    position: "fixed",
    zIndex: "999",
    left: x ? x.toString() + "px" : "",
    top: x ? y.toString() + "px" : "",
    marginTop: "1%",
    borderRadius: "5px",
    fontSize: "10px",
    padding: 1.5,
    flexDirection: "column",
    display: "flex",
  };
  return (
    showCtxMenu && (
      <Grow in={showCtxMenu}>
        <Card sx={actionStyles}>{children}</Card>
      </Grow>
    )
  );
}

export default ContextMenu;
