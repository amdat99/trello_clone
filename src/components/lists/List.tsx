import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import shallow from "zustand/shallow";
import Inputs from "../inputs/Inputs";
import TodoList from "../Task/Task";
import MenuItem from "@mui/material/MenuItem";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import { useUserStore } from "../../store";
import { Todo, Board } from "../models";
import "../../App.css";

type Props = {
  taskId: string;
  boards: Array<Board>;
  fetchBoards: Function;
  createBoard: () => void;
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
};
const List = ({ taskId, boards, fetchBoards, createBoard, todo, setTodo }: Props) => {
  const [todos, setTodos] = useState<object>({});
  const [currentBoard, setCurrentBoard] = useUserStore((state) => [state.currentBoard, state.setCurrentBoard], shallow);
  const {
    data: lists,
    fetchData: fetchLists,
    error,
  } = useFetchData(
    {
      type: "post",
      route: "list/all",
      body: currentBoard && { board_id: currentBoard.id },
    },
    "list/all"
  );
  const min1000 = useMediaQuery("(min-width:1000px)");
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(lists[0].name);
    if (todo) {
      todos[lists[0].name].push({ id: Date.now(), todo: todo, isDone: false });
    }
    setTodo("");
  };

  console.log(todos);

  const [boardIds, setBoardIds] = useState([]);

  useEffect(() => {
    const getLists = () => {
      let currentLists = [];
      if (lists && !error?.errors) {
        setTodos({});
        lists.forEach((list) => {
          setTodos((prevTodos) => ({ ...prevTodos, [list.name]: [] }));
          currentLists.push(list.name);
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
    if (currentBoard?.id) {
      fetchLists();
    }
  }, [currentBoard]);

  const createList = () => {
    requestHandler({ type: "post", route: "list/create", body: { board_id: currentBoard.id, name: todo } }).then(
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
  console.log(lists);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    if (source.droppableId === "board") {
      const sortObject = (o) =>
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

  console.log("d", currentBoard);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="background"
        style={{
          backgroundImage:
            "url(" +
            "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        }}
      >
        <Box m={2} ml={8} width={min1000 ? "105%" : "95%"}>
          <Typography variant="h4" color={"white"}>
            {currentBoard ? currentBoard?.name : "Board"}
          </Typography>
          <Box component="form" onSubmit={handleAdd} sx={{ flexDirection: "row", display: "flex" }}>
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
                  <Inputs
                    value={currentBoard}
                    handleChange={setCurrentBoard}
                    select={true}
                    label={"select board"}
                    size="small"
                  >
                    {boards.map((option) => (
                      // @ts-ignore
                      <MenuItem key={option.public_id} value={option}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Inputs>
                )}
                <Button sx={buttonStyles} size="small" type="button" onClick={createBoard}>
                  Create board
                </Button>
                <Button size="small" type="button" onClick={createList} sx={buttonStyles}>
                  Create List
                </Button>
              </div>
            </Card>
          </Box>
          <button onClick={handleAdd} className="input_submit">
            Add
          </button>
          <div className="container">
            <Droppable droppableId="board" type="ROW" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="container">
                  {boardIds.length &&
                    boardIds.map((id, i) => (
                      <Draggable key={id} draggableId={id.toString()} index={i}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`todos `}
                          >
                            <Droppable key={id} droppableId={id} type="COLUMN" direction="vertical">
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                  <span>{id}</span>
                                  {todos[id] &&
                                    todos[id].map((todo, i) => (
                                      <TodoList
                                        key={todo.id}
                                        todo={todo}
                                        setTodos={setTodos}
                                        todos={todos}
                                        i={i}
                                        id={id}
                                      />
                                    ))}
                                  {provided.placeholder}
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
      </div>
    </DragDropContext>
  );
};
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

export default List;
