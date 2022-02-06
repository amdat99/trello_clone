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
import CreateModal from "../createModal/CreateModal";
import "../../App.css";
import { Board, User, CreateVal } from "../models";
import { CurrentListId, CreateType } from "../../pages/board/Board";

type Props = {
  boards: Array<Board>;
  // fetchBoards: Function;
  currentBoard: Board;
  setCurrentBoard: (board: any) => void;
  orgName: string;
  user: User;
  createType: { data: CreateType; set: React.Dispatch<React.SetStateAction<CreateType>> };
  createValue: CreateVal;
  setCreateValue: React.Dispatch<React.SetStateAction<CreateVal>>;
  createBoard: Function;
  setCurrentListId: React.Dispatch<React.SetStateAction<CurrentListId>>;
  currentListId: CurrentListId;
  position: { x: number; y: number };
};

function BoardMenu({
  boards,
  currentBoard,
  // fetchBoards,
  setCurrentBoard,
  position,
  orgName,
  user,
  createType,
  createBoard,
  createValue,
  setCreateValue,
  setCurrentListId,
  currentListId,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = React.useState("");
  const boardName = searchParams.get("board");

  const onSetBoard = (board: Board) => {
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
        <Inputs
          sx={{ maxWidth: "50%", ml: 1, maxHeight: 1 }}
          value={currentBoard && currentBoard}
          defaultValue={{}}
          handleChange={onSetBoard}
          disabled={!boards}
          size="small"
          label="Select board"
          select={boards ? true : false}
        >
          {boards &&
            boards.map((option) => (
              // @ts-ignore
              <MenuItem key={option.public_id} value={option}>
                {option.name}
              </MenuItem>
            ))}
        </Inputs>
        <Inputs
          sx={{ maxWidth: "50%", ml: 1 }}
          value={searchValue}
          handleChange={setSearchValue}
          placeholder="Search"
          type="search"
          size="small"
        />
        <Tooltip title="Create board" placement="bottom">
          <IconButton
            aria-label="add-board"
            type="button"
            onClick={() => createType.set({ val: "board", onCtxMenu: false })}
          >
            <DashboardCustomizeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create List" placement="bottom">
          <IconButton
            aria-label="add-list"
            onClick={() => createType.set({ val: "list", onCtxMenu: false })}
            type="button"
          >
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
        <CreateModal
          position={position}
          createType={createType}
          createValue={createValue}
          setCreateValue={setCreateValue}
          createBoard={createBoard}
          setCurrentListId={setCurrentListId}
          currentListId={currentListId}
        />
      </div>
    </Card>
  );
}

const cardStyles = {
  width: "35%",
  height: 30,
  opacity: 0.8,
  minWidth: "300px",
  position: "absolute",
  top: 0,
  right: "10%",
  p: 1,
  ":hover": {
    boxShadow: 6,
    opacity: 0.9,
  },
};

export default BoardMenu;
