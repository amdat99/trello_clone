import React, { useState } from "react";
import { Typography, Box, Chip } from "@mui/material/";
import AddIcon from "@mui/icons-material/Add";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import { Task } from "../models";

type Props = {
  taskData: Task;
};

function Tags({ taskData }: Props) {
  const [currentTagId, setCurrentTagId] = useState<null | number>(null);

  return (
    <>
      <Typography color="primary" variant="subtitle2" gutterBottom>
        Tags:
      </Typography>
      <Box
        className="hide-scroll "
        sx={{ maxHeight: "35%", overflow: "scroll", flexDirection: "row", display: "flex" }}
      >
        {taskData?.labels &&
          taskData.labels.map((label, i: number) => (
            <div onMouseLeave={() => setCurrentTagId(null)} onMouseOver={() => setCurrentTagId(i)} key={i}>
              <Chip
                sx={chipStyles("red")}
                label={label.name}
                onDelete={currentTagId === i ? () => setCurrentTagId(null) : null}
                deleteIcon={<ModeEditOutlineRoundedIcon color="secondary" />}
                size="small"
              />
            </div>
          ))}
        <AddIcon onClick={() => setCurrentTagId(null)} />
      </Box>
    </>
  );
}

const chipStyles = (color: string) => ({
  mr: 0.5,
  mt: 0.5,
  fontSize: 10,
  bgcolor: color,
  color: "white",
  cursor: "pointer",
  zIndex: 999,
  transition: "transform 0.3s cubic-bezier(0.25, 0.45, 0.45, 0.95)",

  ":hover": {
    transform: "scale(1.05)",
    ml: 0.1,
    transition: "transform 0.3s cubic-bezier(0.25, 0.45, 0.45, 0.95)",
  },
});

export default Tags;
