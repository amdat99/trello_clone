import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import Inputs from "../inputs/Inputs";
import ListContent from "./ListContent";
import ContextMenu from "../contextMenu/ContextMenu";
import { CreateVal, Board, User } from "../models";
import "../../App.css";

type Props = {
  fetchBoards: Function;
  createBoard: () => void;
  setCurrentResId: (id: string, rerender: number) => void;
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  currentResId: { id: string; rerender: number };
  stickyMenu: boolean;
  showCtxMenu: boolean;
  rerender: number;
  position: { x: number; y: number };
  createValue: CreateVal;
  setCreateValue: (val: CreateVal) => void;
  handleAdd: (e: React.FormEvent) => void;
  user: User;
  current: {
    board: Board;
    setBoard: (board: Board) => void;
    list: { id: string; has_tasks: boolean };
    setList: (list: { id: string; has_tasks: boolean }) => void;
  };
  createType: { data: string; set: (type: string) => void };
};
const List = ({
  createBoard,
  todo,
  setTodo,
  stickyMenu,
  position,
  showCtxMenu,
  createValue,
  setCreateValue,
  handleAdd,
  currentResId,
  setCurrentResId,
  rerender,
  fetchBoards,
  current,
  user,
  createType,
}: Props) => {
  const [todos, setTodos] = useState({});
  const [listData, setListData] = useState([]);

  const {
    data: lists,
    fetchData: fetchLists,
    error,
  } = useFetchData(
    { type: "post", route: "list/all", body: current.board && { board_id: current.board.id } },
    "list/all"
  );

  const min1000 = useMediaQuery("(min-width:1000px)");
  const min700 = useMediaQuery("(min-width:700px)");
  const createRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getLists = () => {
      let currentLists = [];
      if (lists && lists?.length) {
        lists.forEach((list) => {
          setTodos((prevTodos) => ({ ...prevTodos, [list.id]: [] }));
          currentLists.push(list);
        });
        setListData(currentLists);
      }
      // if (error?.errors === "no lists found") {
      //   setTodos({});
      //   setListData([]);
      // }
    };
    getLists();
  }, [lists, error, current.board]);

  useEffect(() => {
    if (current.board) {
      fetchLists();
    }
  }, [current.board]);

  const createList = () => {
    requestHandler({
      type: "post",
      route: "list/create",
      body: { board_id: current.board.id, name: createValue.name },
    }).then((response) => {
      if (response === "list created successfully") {
        console.log(response);
        fetchLists();
      } else {
        alert(response?.errors ? response.errors : "no data found");
      }
    });
  };

  const onDragEnd = (result: DropResult) => {
    let currentTodo;
    let prevId;
    let nextId;
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    if (source.droppableId === "board") {
      const sortObject = (o: { [x: string]: any }) =>
        Object.keys(o)
          .sort()
          .reduce((r, k) => ((r[k] = o[k]), r), {});
      return;
    } else {
      prevId = source.droppableId;
      nextId = destination.droppableId;
      currentTodo = todos[prevId].slice(source.index, source.index + 1)[0];
      todos[nextId].push(currentTodo);
      todos[prevId].splice(source.index, 1);
      console.log(prevId, nextId, currentTodo);
    }
    requestHandler({ type: "put", route: "task/update", body: { id: currentTodo.id, list_id: nextId } }).then(
      (response) => {
        if (response !== "task updated successfully") {
          todos[prevId].push(currentTodo);
          todos[nextId].splice(source.index, 1);
          alert(response?.errors ? response.errors : "no data found");
        } else {
          //@ts-ignore
          setCurrentResId({ id: nextId, rerender: rerender + 1 });
          //@ts-ignore
          setCurrentResId({ id: prevId, rerender: 0 });
        }
      }
    );
  };

  const onCreate = (e) => {
    e.preventDefault();
    createRef.current?.focus();
    createType.data == "list" ? createList() : createBoard();
  };

  const onHandleChange = (value, name) => {
    setCreateValue({ ...createValue, [name]: value });
  };
  const menuFunctions = [
    {
      name: "create list",
      func: () => {
        createType.set("list");
      },
    },
    {
      name: "create board",
      func: () => {
        createType.set("board");
      },
    },
  ];

  console.log(listData);

  const createInputs = [
    { name: "name", type: "text", required: true },
    { name: "image", type: "url" },
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

      <Modal open={createType.data !== ""} onClose={() => createType.set("")} onSubmit={onCreate}>
        <Box sx={{ position: "absolute", top: "40%", marginLeft: min1000 ? "40%" : "20%" }} component="form">
          <Card sx={{ p: 1, width: "300px" }}>
            {createInputs.map((input) => (
              <Inputs
                value={createValue[input.name]}
                type={input.type}
                handleChange={onHandleChange}
                label={"create " + input.name}
                name={input.name}
                required={input.required ? true : false}
                ref={createRef}
                sx={{ mt: 1 }}
              />
            ))}
          </Card>
          <Button type={"submit"} sx={{ mt: 1 }} variant="contained" size="small">
            Create
          </Button>
        </Box>
      </Modal>

      <Box m={2} ml={stickyMenu && min700 ? 27 : 4} width={min1000 ? (stickyMenu ? "95%" : "105%") : "95%"}>
        <Typography variant="h4" color={"white"} sx={{ ml: 0.8 }}>
          {current.board ? current.board?.name : "Board"}
        </Typography>

        {/* <button onClick={handleAdd} className="input_submit">
          Add
        </button> */}
        <div>
          {/* <Slide direction="down" in={list} mountOnEnter unmountOnExit> */}
          <Droppable droppableId="board" type="ROW" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="container ">
                {listData.length &&
                  listData.map((list, i) => (
                    <Draggable key={list.id} draggableId={list.id.toString()} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`todos hide-scroll`}
                        >
                          <Droppable key={list.id} droppableId={list.id} type="COLUMN" direction="vertical">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{ display: "flex", flexDirection: "column" }}
                              >
                                <Typography sx={{ opacity: 0.95 }}>{list.name}</Typography>
                                <ListContent
                                  list={list}
                                  todos={todos}
                                  setTodos={setTodos}
                                  rerender={rerender}
                                  currentResId={currentResId}
                                />
                                {provided.placeholder}
                                {current.list.id !== list.id && (
                                  <div style={{ opacity: "0.9" }}>
                                    <Button
                                      sx={{ textTransform: "none", fontSize: "12px" }}
                                      size={"small"}
                                      variant="text"
                                      startIcon={<AddTaskIcon />}
                                      onClick={() => {
                                        current.setList({ id: list.id, has_tasks: list.has_tasks });
                                      }}
                                    >
                                      Add Todo
                                    </Button>
                                  </div>
                                )}

                                {current.list.id === list.id && (
                                  <Box component={"form"} onSubmit={handleAdd}>
                                    <Inputs type="text" value={todo} handleChange={setTodo} />
                                    <Box>
                                      <Button type="submit" variant="contained" size="small">
                                        Add
                                      </Button>
                                      <IconButton onClick={() => current.setList({ id: "", has_tasks: false })}>
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
          {/* </Slide> */}
        </div>
      </Box>
    </DragDropContext>
  );
};

export default List;
