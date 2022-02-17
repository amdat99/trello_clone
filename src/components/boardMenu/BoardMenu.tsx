import React from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { MenuItem, Avatar, Card, IconButton, Tooltip, useMediaQuery } from "@mui/material/";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Inputs from "../inputs/Inputs";
import CreateModal from "../createModal/CreateModal";
import "../../App.css";
import { Board, User, CreateVal } from "../models";
import { CurrentListId, CreateType, Params } from "../../pages/board/Board";

type Props = {
  boards: Array<Board>;
  // fetchBoards: Function;
  currentBoard: Board;
  setCurrentBoard: (board: any) => void;
  user: User;
  createType: { data: CreateType; set: React.Dispatch<React.SetStateAction<CreateType>> };
  createValue: CreateVal;
  setCreateValue: React.Dispatch<React.SetStateAction<CreateVal>>;
  createBoard: Function;
  setCurrentList: React.Dispatch<React.SetStateAction<CurrentListId>>;
  currentList: CurrentListId;
  position: { x: number; y: number };
  params: Params;
};

function BoardMenu({
  boards,
  currentBoard,
  // fetchBoards,
  setCurrentBoard,
  position,
  user,
  createType,
  createBoard,
  createValue,
  setCreateValue,
  setCurrentList,
  currentList,
  params,
}: Props) {
  const [searchValue, setSearchValue] = React.useState("");
  const min1000 = useMediaQuery("(min-width:1000px)");
  const min600 = useMediaQuery("(min-width:600px)");
  const styles = makeStyles(min1000, min600);

  const onSetBoard = (board: Board) => {
    if (params.board !== board.name) {
      setCurrentBoard(board);
      params.navigate(`/board/${params.orgName}?board=${board.name}&view=l`);
    }
  };
  return (
    <Card sx={styles.card}>
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
          sx={{ minWidth: "20%", maxWidth: min600 ? "20%" : "35%", ml: 1, maxHeight: 1 }}
          value={currentBoard && currentBoard}
          defaultValue={""}
          handleChange={onSetBoard}
          disabled={!boards}
          size="small"
          label=" Boards"
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
        {min600 ? (
          <Inputs
            sx={{ minWidth: "40%", maxWidth: "50%", ml: 1 }}
            value={searchValue}
            handleChange={setSearchValue}
            placeholder="Search"
            type="search"
            size="small"
          />
        ) : (
          <>
            <IconButton
              aria-label="add-list"
              onClick={() => createType.set({ val: "list", onCtxMenu: false })}
              type="button"
            >
              <ManageSearchIcon />
            </IconButton>
          </>
        )}
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
          setCurrentList={setCurrentList}
          currentList={currentList}
          min600={min600}
        />
      </div>
    </Card>
  );
}
const makeStyles = (min1000: boolean, min600: boolean) => ({
  card: {
    width: min1000 ? 500 : min600 ? 500 : 355,
    height: 30,
    opacity: 0.8,
    minWidth: "300px",
    position: "absolute",
    top: 0,
    right: min600 ? "7%" : "1%",

    p: 1,
    ":hover": {
      boxShadow: 6,
      opacity: 0.9,
    },
  },
});

export default BoardMenu;
