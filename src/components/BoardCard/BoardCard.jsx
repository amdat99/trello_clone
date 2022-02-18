import React from "react";
import { Typography, Box, ImageListItem } from "@mui/material";
import * as timeago from "timeago.js";
import { useNavigate } from "react-router-dom";
import { requestHandler } from "../../helpers/requestHandler";

const BoardCard = ({ item, currentOrg, recentBoards }) => {
  
  const navigate = useNavigate();

  const addRecentBoard = (board) => {
    if (recentBoards.length >= 10) {
      recentBoards.pop();
    }
    recentBoards.filter((recentBoard) => recentBoard.id !== board.id);
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

  return (
    <ImageListItem
      sx={{
        cursor: "pointer",
        width: "361px",
        height: "143px!important",
        borderRadius: "6px",
        overflow: "hidden",
        mr: "31px",
        boxShadow: "9px 10px 20px 0px #0000006b",
        transition: "all .5s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
      key={item.name}
      onClick={() => {
        addRecentBoard(item);
        navigate(`/board/${currentOrg}?board=${item.name}&view=l`);
      }}
    >
      <img
        style={{
          width: "100%",
          filter: " brightness(0.8) blur(.5)",
          height: "143px",
        }}
        src={`${item.image}`}
        srcSet={`${item.image}`}
        alt={item.name}
        loading="lazy"
      />
      <Box
        sx={{
          position: "absolute",
          color: "white",
          padding: "0 20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: " space-around",
        }}
      >
        <Box>
          <Typography style={{ fontSize: "14px", fontWeight: "lighter" }}>
            Members: {3} | Lists: {item.lists.length} | Attachments: {18}{" "}
          </Typography>
          <Typography sx={{ textTransform: "uppercase", fontWeight: "bold" }} variant="h5">
            {item.name}
          </Typography>
        </Box>
        <Typography style={{ fontSize: "14px", fontWeight: "lighter" }}>
          {`Updated ${timeago.format(item.updated_at)}`}
        </Typography>
      </Box>
    </ImageListItem>
  );
};

export default BoardCard;
