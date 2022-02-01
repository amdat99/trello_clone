import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Inputs from "../inputs/Inputs";
import TodoList from "../Task/Task";
import { Todo } from "../models";
import "../../App.css";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

const List: React.FC = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<any>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      todos["todo"].push({ id: Date.now(), todo: todo, isDone: false });
    }
    setTodo("");
  };

  const [boardIds, setBoardIds] = useState(["todo", "in-progress", "done"]);

  React.useEffect(() => {
    boardIds.forEach((boardId) => {
      setTodos((prevTodos) => ({ ...prevTodos, [boardId]: [] }));
    });
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    let prevId = source.droppableId;
    let nextId = destination.droppableId;

    let prevTodo = todos[prevId].slice(source.index, source.index + 1)[0];
    todos[nextId].push(prevTodo);
    todos[prevId].splice(source.index, 1);
  };

  console.log(todos);

  const addList = () => {
    const newId = Math.random().toString();
    setBoardIds([...boardIds, newId]);
    setTodos((prevTodos) => ({ ...prevTodos, [newId]: [] }));
  };
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
        <Box m={4} flex={1} sx={{ align: "center", flexDirection: "column" }}>
          <Typography variant="h4" color={"white"}>
            Board
          </Typography>
          <form onSubmit={handleAdd}>
            <Card
              sx={{
                width: "45%",
                flexDirection: "row",
                ":hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Inputs label="add" value={todo} handleChange={setTodo} type={"text"} />{" "}
            </Card>
            <button type="submit" className="input_submit">
              Add
            </button>
          </form>
          <button type="button" onClick={addList}>
            Add Column
          </button>

          <div className="container">
            {boardIds.map((id) => (
              <Droppable key={id} droppableId={id}>
                {(provided, snapshot) => (
                  <div
                    className={`todos ${snapshot.isDraggingOver ? "tododrop" : "todor"}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <span>{id}</span>
                    {todos[id] &&
                      todos[id].map((todo, i) => (
                        <TodoList key={todo.id} todo={todo} setTodos={setTodos} todos={todos} i={i} id={id} />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </Box>
      </div>
    </DragDropContext>
  );
};

export default List;
