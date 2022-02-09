import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { requestHandler } from "../../helpers/requestHandler";
import useFetchData from "../../hooks/useFetchData";
import useMousePosition from "../../hooks/useMousePosition";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import List from "../../components/lists/List";
import BoardMenu from "../../components/boardMenu/BoardMenu";
import Sidebar from "../../components/sidebar/Sidebar";
import ContextMenu from "components/contextMenu/ContextMenu";
import { Board as BoardType, List as ListType } from "../../components/models";

export type CurrentListId = {
  data: any;
  rerender?: boolean;
  has_tasks: boolean;
};

export type CreateType = {
  val: string;
  onCtxMenu?: boolean;
};

export type Params = {
  board: string;
  taskId: string;
  orgName: string;
  navigate: Function;
};

const Board: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { x, y } = useMousePosition();
  let params = useParams();
  const [todo, setTodo] = useState("");
  const [createValue, setCreateValue] = useState({ name: "", image: "" });
  const [createType, setCreateType] = useState({ val: "", onCtxMenu: false });
  const [currentResId, setCurrentResId] = useState({ id: "", rerender: 0 });
  const [showDetail, setShowDetail] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCtxMenu, setCtxShowMenu] = useState(false);
  const [currentList, setCurrentList] = useState<CurrentListId>({ data: null, has_tasks: false, rerender: false });
  const [currentBoard, setCurrentBoard, user] = useUserStore(
    (state) => [state.currentBoard, state.setCurrentBoard, state.user],
    shallow
  );
  const { data: boards, fetchData: fetchBoards } = useFetchData(
    {
      type: "post",
      route: "board/all",
    },
    "board/all"
  );
  let background =
    "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  let orgName = params.orgName;
  const taskId = searchParams.get("task");
  const board = searchParams.get("board");

  useEffect(() => {
    let notMounted = false;
    const checkOrgAndFetchBoards = () => {
      requestHandler({ route: "org/enter", type: "post", body: { name: orgName } }).then((data) => {
        if (data !== "entered organisation successfully") {
          navigate("/");
          alert("error entering org");
        } else {
          fetchBoards();
        }
      });
    };
    if (!notMounted) checkOrgAndFetchBoards();
    return () => {
      notMounted = true;
    };
  }, []);

  useEffect(() => {
    if (board && boards && currentBoard?.name !== board) {
      boards.forEach((b: BoardType) => {
        if (b.name === board) {
          setCurrentBoard(b);
        }
      });
    }
  }, [boards, board]);

  const createBoard = () => {
    requestHandler({
      route: "board/create",
      type: "post",
      body: { name: createValue.name, image: createValue.image },
    }).then((data) => {
      if (data === "board created successfully") {
        fetchBoards();
      } else {
        alert(data?.errors ? data.errors : "no data found");
      }
    });
  };
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (Math.random() / Math.random()).toString();
    let currentTasks = currentList.data[0]?.tasks ? currentList.data[0].tasks : [];
    currentTasks.push({ id, name: todo, assigned_users: [{ name: user.name, color: user.color }] });
    requestHandler({
      type: "post",
      route: "task/create",
      body: {
        name: todo,
        list_id: currentList.data[0].id,
        id: id,
        tasks: JSON.stringify(currentTasks),
        board_name: currentBoard.name,
        created_by: user.name,
        assigned_users: JSON.stringify([{ name: user.name, color: user.color }]),
        updateList: !currentList.has_tasks ? true : false,
        labels: JSON.stringify([{ name: currentList.data[0].name, color: "info", id }]),
        task_activity: JSON.stringify([
          {
            message: `${user.name} created this task on ${currentList.data[0].name}`,
            name: user.name,
            color: user.color,
            date: new Date().toLocaleString(),
          },
        ]),
      },
    }).then((res) => {
      if (res === "task created successfully") {
        setCurrentResId({ id: currentList.data.id, rerender: Date.now() });
      } else {
        alert(res?.errors ? res.errors : "something went wrong");
      }
    });
    setTodo("");
  };
  const onShowCtxMenu = () => {
    const yPosition = y > window.innerHeight - 135 ? y - 135 : y;
    const xPosition = x > window.innerWidth - 100 ? x - 100 : x;
    setPosition({ x: xPosition, y: yPosition });
    setCtxShowMenu(true);
  };

  const menuFunctions = [
    {
      name: "create list",
      type: "list",
    },
    {
      name: "create board",
      type: "board",
    },
  ];

  return (
    <Box
      className="background"
      onDoubleClick={onShowCtxMenu}
      onClick={() => (showCtxMenu ? setCtxShowMenu(false) : () => {})}
      sx={{
        backgroundImage: currentBoard?.image ? "url(" + currentBoard.image + ")" : "url(" + background + ")",
      }}
    >
      <ContextMenu x={position.x} y={position.y} showCtxMenu={showCtxMenu}>
        {menuFunctions.map((func) => (
          <div key={func.name}>
            <Button
              size="small"
              onClick={() => setCreateType({ val: func.type, onCtxMenu: true })}
              sx={{ textTransform: "none" }}
            >
              {func.name}
            </Button>
            <Divider />
          </div>
        ))}
      </ContextMenu>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <BoardMenu
          boards={boards}
          setCurrentBoard={setCurrentBoard}
          position={position}
          // fetchBoards={fetchBoards}
          currentBoard={currentBoard?.data}
          user={user}
          createType={{ data: createType, set: setCreateType }}
          params={{ board, orgName, taskId, navigate }}
          createValue={createValue}
          setCreateValue={setCreateValue}
          createBoard={createBoard}
          setCurrentList={setCurrentList}
          currentList={currentList}
        />
      </Box>
      <List
        todo={todo}
        currentResId={currentResId}
        setCurrentResId={setCurrentResId}
        handleAdd={handleAdd}
        user={user}
        setTodo={setTodo}
        params={{ board, orgName, taskId, navigate }}
        stickyMenu={stickyMenu}
        createValue={createValue}
        current={{ board: currentBoard, setBoard: setCurrentBoard, list: currentList, setList: setCurrentList }}
      />
      <Sidebar
        setStickyMenu={setStickyMenu}
        stickyMenu={stickyMenu}
        setShowDetail={setShowDetail}
        showDetail={showDetail}
        navigate={navigate}
      />
    </Box>
  );
};

export default Board;
