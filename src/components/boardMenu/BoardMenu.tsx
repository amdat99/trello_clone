import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Inputs from "../inputs/Inputs";
import "../../App.css";
import { Board } from "../models";

type Props = {
  boards: Array<Board>;
  fetchBoards: Function;
  setCreateType: React.Dispatch<React.SetStateAction<string>>;
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  currentBoard: Board;
  setCurrentBoard: (board: any) => void;
};

function BoardMenu({ boards, todo, setTodo, currentBoard, setCurrentBoard, setCreateType }: Props) {
  return (
    <Card sx={cardStyles}>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <Inputs
          select={false}
          label="add"
          value={todo}
          handleChange={setTodo}
          type={"text"}
          sx={{ mr: 1 }}
          size="small"
        />
        {boards && (
          <Inputs value={currentBoard} handleChange={setCurrentBoard} select={true} label={"select board"} size="small">
            {boards.map((option) => (
              // @ts-ignore
              <MenuItem key={option.public_id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </Inputs>
        )}
        <Button sx={buttonStyles} size="small" type="button" onClick={() => setCreateType("board")}>
          Create board
        </Button>
        <Button size="small" type="button" onClick={() => setCreateType("list")} sx={buttonStyles}>
          Create List
        </Button>
      </div>
    </Card>
  );
}

const cardStyles = {
  width: "35%",
  height: 30,
  opacity: 0.93,
  minWidth: "300px",
  position: "absolute",
  top: 0,
  right: "10%",
  p: 1,
  ":hover": {
    boxShadow: 6,
  },
};

const buttonStyles = {
  fontSize: 10,
  height: 30,
};

const menuStyles = {
  fontSize: 11,
  position: "relative",
};

export default BoardMenu;
