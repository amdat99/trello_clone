import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Inputs from "../inputs/Inputs";
import "../../App.css";
import { Board, User } from "../models";

type Props = {
  boards: Array<Board>;
  fetchBoards: Function;
  setCreateType: React.Dispatch<React.SetStateAction<string>>;
  currentBoard: Board;
  setCurrentBoard: (board: any) => void;
  orgName: string;
  user: User;
};

function BoardMenu({ boards, currentBoard, setCurrentBoard, setCreateType, orgName, user }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = React.useState("");
  const boardName = searchParams.get("board");

  const onSetBoard = (board: any) => {
    if (boardName !== board.name) {
      setCurrentBoard(board);
      navigate(`/board/${orgName}?board=${board.name}`);
    }
  };
  return (
    <Card sx={cardStyles}>
      <div style={{ flexDirection: "row", display: "flex" }}>
        {/* <Inputs
          select={false}
          label="add"
          value={todo}
          handleChange={setTodo}
          type={"text"}
          sx={{ mr: 1 }}
          size="small"
        /> */}
        {boards && (
          <Inputs
            sx={{ maxWidth: "50%", ml: 1, maxHeight: 1 }}
            value={currentBoard && currentBoard}
            defaultValue="Search"
            handleChange={onSetBoard}
            disabled={!boards}
            size="small"
            label="Select board"
            select={true}
          >
            {boards.map((option) => (
              // @ts-ignore
              <MenuItem key={option.public_id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </Inputs>
        )}
        <Inputs
          sx={{ maxWidth: "50%", ml: 1 }}
          value={searchValue}
          handleChange={setSearchValue}
          placeholder="Search"
          type="search"
          size="small"
        />
        <Tooltip title="Create board" placement="bottom">
          <IconButton aria-label="add-board" type="button" onClick={() => setCreateType("board")}>
            <DashboardCustomizeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create List" placement="bottom">
          <IconButton aria-label="add-list" onClick={() => setCreateType("list")} type="button">
            <PlaylistAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" placement="bottom">
          <IconButton aria-label="settings" type="button">
            <SettingsApplicationsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={user.name} placement="bottom">
          <Avatar sx={{ width: 25, height: 25, mt: 0.7, ml: 0.5, bgcolor: user.color }}>
            {user.name[0].toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
    </Card>
  );
}

const cardStyles = {
  width: "35%",
  height: 30,
  opacity: 0.9,
  minWidth: "300px",
  position: "absolute",
  top: 0,
  right: "10%",
  p: 1,
  ":hover": {
    boxShadow: 6,
  },
};

export default BoardMenu;
