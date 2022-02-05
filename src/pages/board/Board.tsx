import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { requestHandler } from "../../helpers/requestHandler";
import useFetchData from "../../hooks/useFetchData";
import useMousePosition from "../../hooks/useMousePosition";
import { useUserStore } from "../../store";
import shallow from "zustand/shallow";
import List from "../../components/lists/List";
import BoardMenu from "../../components/boardMenu/BoardMenu";
import Sidebar from "../../components/sidebar/Sidebar";
import { BorderHorizontal } from "@mui/icons-material";

const Board: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { x, y } = useMousePosition();
  let params = useParams();
  const [todo, setTodo] = useState("");
  const [rerender, setRerender] = useState(0);
  const [createValue, setCreateValue] = useState({ name: "", image: "" });
  const [currentResId, setCurrentResId] = useState({ id: "", rerender: 0 });
  const [showDetail, setShowDetail] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [createType, setCreateType] = useState("");
  const [showCtxMenu, setCtxShowMenu] = useState(false);
  const [currentListId, setCurrentListId] = useState({ id: "", has_tasks: false });
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
  console.log(currentBoard);
  console.log(currentBoard);
  useEffect(() => {
    if (board && boards && currentBoard.name !== board) {
      boards.forEach((b) => {
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
    requestHandler({
      type: "post",
      route: "task/create",
      body: {
        name: todo,
        list_id: currentListId.id,
        assigned_users: JSON.stringify([user.name]),
        updateList: !currentListId.has_tasks ? true : false,
      },
    }).then((res) => {
      if (res === "task created successfully") {
        setCurrentResId({ id: currentListId.id, rerender: Date.now() });
      } else {
        alert(res?.errors ? res.errors : "something went wrong");
      }
    });
    // if (todo) {
    //   todos[lists[0].id].push({ id: Date.now(), todo: todo, isDone: false });
    // }
    setTodo("");
  };
  const onShowCtxMenu = () => {
    setPosition({ x, y });
    setCtxShowMenu(true);
  };

  return (
    <Box
      className="background"
      onDoubleClick={onShowCtxMenu}
      onClick={() => (showCtxMenu ? setCtxShowMenu(false) : () => {})}
      sx={{
        backgroundImage: currentBoard?.image ? "url(" + currentBoard.image + ")" : "url(" + background + ")",
      }}
    >
      <Box component="form" onSubmit={handleAdd} sx={{ flexDirection: "row", display: "flex" }}>
        <BoardMenu
          boards={boards}
          setCurrentBoard={setCurrentBoard}
          fetchBoards={fetchBoards}
          setCreateType={setCreateType}
          orgName={orgName}
          currentBoard={currentBoard.data}
          user={user}
        />
      </Box>
      <List
        fetchBoards={fetchBoards}
        createBoard={createBoard}
        todo={todo}
        position={position}
        currentResId={currentResId}
        //@ts-ignore: typescipt thinks rerender = boolean ? but it's actually a int
        setCurrentResId={setCurrentResId}
        user={user}
        rerender={rerender}
        handleAdd={handleAdd}
        showCtxMenu={showCtxMenu}
        setTodo={setTodo}
        stickyMenu={stickyMenu}
        createValue={createValue}
        setCreateValue={setCreateValue}
        createType={{ data: createType, set: setCreateType }}
        current={{ board: currentBoard, setBoard: setCurrentBoard, list: currentListId, setList: setCurrentListId }}
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
