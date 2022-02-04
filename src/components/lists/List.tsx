import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import shallow from "zustand/shallow";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import { useUserStore } from "../../store";
import Inputs from "../inputs/Inputs";
import Task from "../Task/Task";
import ListContent from "./ListContent";
import ContextMenu from "../contextMenu/ContextMenu";
import BoardMenu from "../boardMenu/BoardMenu";
import { Todo, Board } from "../models";
import "../../App.css";

type Props = {
  taskId: string;
  boards: Array<Board>;
  fetchBoards: Function;
  createBoard: () => void;
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  stickyMenu: boolean;
  showCtxMenu: boolean;
  position: { x: number; y: number };
  createValue: string;
  setCreateValue: React.Dispatch<React.SetStateAction<string>>;
};
const List = ({
  taskId,
  boards,
  createBoard,
  todo,
  setTodo,
  stickyMenu,
  position,
  showCtxMenu,
  createValue,
  setCreateValue,
  fetchBoards,
}: Props) => {
  const [todos, setTodos] = useState({});
  const [createType, setCreateType] = useState("");
  const [currentListId, setCurrentListId] = useState("");
  const [currentResId, setCurrentResId] = useState("");
  const [currentBoard, setCurrentBoard, user] = useUserStore(
    (state) => [state.currentBoard, state.setCurrentBoard, state.user],
    shallow
  );
  const [boardIds, setBoardIds] = useState([]);
  const {
    data: lists,
    fetchData: fetchLists,
    error,
  } = useFetchData(
    { type: "post", route: "list/all", body: currentBoard && { board_id: currentBoard.id } },
    "list/all"
  );

  const min1000 = useMediaQuery("(min-width:1000px)");
  const min700 = useMediaQuery("(min-width:700px)");
  const createRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getLists = () => {
      let currentLists = [];
      if (lists && !error?.errors) {
        setTodos({});
        lists.forEach((list) => {
          setTodos((prevTodos) => ({ ...prevTodos, [list.id]: [] }));
          currentLists.push(list);
        });
        setBoardIds(currentLists);
      }
      if (error?.errors === "no lists found") {
        setTodos({});
        setBoardIds([]);
      }
    };
    getLists();
  }, [lists, error, currentBoard]);

  useEffect(() => {
    if (currentBoard) {
      fetchLists();
    }
  }, [currentBoard]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    requestHandler({
      type: "post",
      route: "task/create",
      body: { name: todo, list_id: currentListId, assigned_users: JSON.stringify([user.name]) },
    }).then((res) => {
      if (res === "task created successfully") {
        // fetchTasks();
      } else {
        alert(res?.errors ? res.errors : "something went wrong");
      }
    });
    // if (todo) {
    //   todos[lists[0].id].push({ id: Date.now(), todo: todo, isDone: false });
    // }
    setTodo("");
  };

  const createList = () => {
    requestHandler({ type: "post", route: "list/create", body: { board_id: currentBoard.id, name: createValue } }).then(
      (response) => {
        if (response === "list created successfully") {
          console.log(response);
          fetchLists();
        } else {
          alert(response?.errors ? response.errors : "no data found");
        }
      }
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    if (source.droppableId === "board") {
      const sortObject = (o: { [x: string]: any }) =>
        Object.keys(o)
          .sort()
          .reduce((r, k) => ((r[k] = o[k]), r), {});
      console.log(source, destination);

      console.log(sortObject(todos));
      return;
    } else {
      let prevId = source.droppableId;
      let nextId = destination.droppableId;
      console.log(result);
      let currentTodo = todos[prevId].slice(source.index, source.index + 1)[0];
      todos[nextId].push(currentTodo);
      todos[prevId].splice(source.index, 1);
    }
  };

  const onCreate = (e) => {
    e.preventDefault();
    createRef.current?.focus();
    createType == "list" ? createList() : createBoard();
  };
  const menuFunctions = [
    {
      name: "create list",
      func: () => {
        setCreateType("list");
      },
    },
    {
      name: "create board",
      func: () => {
        setCreateType("board");
      },
    },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ContextMenu x={position.x} y={position.y} showCtxMenu={showCtxMenu}>
        {menuFunctions.map((func) => (
          <div key={func.name}>
            <Button size="small" onClick={func.func} sx={{ textTransform: "none" }}>
              {func.name}
            </Button>
            <Divider />
          </div>
        ))}
      </ContextMenu>

      <Modal open={createType !== ""} onClose={() => setCreateType("")} onSubmit={onCreate}>
        <Box sx={{ position: "absolute", top: "40%", right: "40%" }} component="form">
          <Card sx={{ p: 1 }}>
            <Inputs value={createValue} handleChange={setCreateValue} label={"create " + createType} ref={createRef} />
          </Card>
          <Button type={"submit"} sx={{ mt: 1 }} variant="contained" size="small">
            Create
          </Button>
        </Box>
      </Modal>

      <Box m={2} ml={stickyMenu && min700 ? 27 : 4} width={min1000 ? (stickyMenu ? "95%" : "105%") : "95%"}>
        <Typography variant="h4" color={"white"}>
          {currentBoard ? currentBoard?.name : "Board"}
        </Typography>
        <Box component="form" onSubmit={handleAdd} sx={{ flexDirection: "row", display: "flex" }}>
          <BoardMenu
            boards={boards}
            setCurrentBoard={setCurrentBoard}
            fetchBoards={fetchBoards}
            setCreateType={setCreateType}
            todo={todo}
            setTodo={setTodo}
            currentBoard={currentBoard}
          />
        </Box>

        <button onClick={handleAdd} className="input_submit">
          Add
        </button>
        <div>
          <Droppable droppableId="board" type="ROW" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="container">
                {boardIds.length &&
                  boardIds.map((id, i) => (
                    <Draggable key={id.id} draggableId={id.id.toString()} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`todos `}
                        >
                          <Droppable key={id.id} droppableId={id.id} type="COLUMN" direction="vertical">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{ display: "flex", flexDirection: "column" }}
                              >
                                <Typography sx={{ ml: 1 }}>{id.name}</Typography>
                                <ListContent id={id} todos={todos} setTodos={setTodos} />
                                {provided.placeholder}
                                {currentListId !== id.id && (
                                  <Button
                                    sx={{ mr: min1000 ? 15 : "75%", textTransform: "none" }}
                                    size={"small"}
                                    variant="text"
                                    startIcon={<AddTaskIcon />}
                                    onClick={() => {
                                      setCurrentListId(id.id);
                                    }}
                                  >
                                    Add Todo
                                  </Button>
                                )}
                                {currentListId === id.id && (
                                  <Box component={"form"} onSubmit={handleAdd}>
                                    <Inputs type="text" value={todo} handleChange={setTodo} />
                                    <Box>
                                      <Button type="submit" variant="contained" size="small">
                                        Add
                                      </Button>
                                      <IconButton onClick={() => setCurrentListId("")}>
                                        <CloseIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
              </div>
            )}
          </Droppable>
        </div>
      </Box>
    </DragDropContext>
  );
};

export default List;
