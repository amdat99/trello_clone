import React from "react";
import { Typography, Box, ImageList } from "@mui/material";

import BoardCard from "../../components/boardCard/BoardCard";
const BoardList = (props) => {
  return (
    <Box sx={{ mt: "40px" }}>
      <Typography sx={{ fontWeight: "bold" }}>{props.listTitle}</Typography>
      <hr />
      <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
        {props.boardList &&
          props.boardList.map((item, index) => (
            <BoardCard
              index={index}
              currentOrg={props.currentOrg}
              item={item}
              recentBoards={props.recentBoards}
              boardSize={props.boardListSize}
            />
          ))}
      </ImageList>
    </Box>
  );
};

export default BoardList;
