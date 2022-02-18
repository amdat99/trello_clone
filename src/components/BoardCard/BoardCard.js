import React from "react";
import {
  Typography,
  Box,
  ImageListItem,
} from "@mui/material";
import * as timeago from "timeago.js";
import { useNavigate } from "react-router-dom";


const BoardCard = ({item, currentOrg})=>{
    const navigate = useNavigate();
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
                  onClick={() =>
                    navigate(`/board/${currentOrg}?board=${item.name}&view=l`)
                  }
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
                      <Typography
                        style={{ fontSize: "14px", fontWeight: "lighter" }}
                      >
                        Members: {3} | Lists: {5} | Attachments: {18}{" "}
                      </Typography>
                      <Typography
                        sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                        variant="h5"
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography
                      style={{ fontSize: "14px", fontWeight: "lighter" }}
                    >
                      {`Updated ${timeago.format(item.updated_at)}`}
                    </Typography>
                  </Box>
                </ImageListItem>
    )
}

export default BoardCard