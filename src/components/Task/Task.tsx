import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { MdDone } from "react-icons/md";
import { Task as TaskProps } from "../models";
import "./styles.css";

type Props = {
  todo: TaskProps;
  setTodos: React.Dispatch<React.SetStateAction<object>>;
  todos: object;
  i: number;
  id: string;
};
function Task({ todo, setTodos, todos, i, id }: Props) {
  const [onEdit, setOnEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(todo.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDone = (id: number) => {
    // setTodos(
    //   todos.map((todo) => {
    //     if (todo.id === id) {
    //       todo.isDone = true;
    //     }
    //     return todo;
    //   })
    // );
  };
  const handleDelete = (taskId: number) => {
    const currentTodo = todos[id].filter((todo) => todo.id !== taskId);
    setTodos({ ...todos, [id]: currentTodo });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    todos[id].forEach((todoData) => {
      if (todoData.id === todo.id) {
        todoData.todo = editTodo;
        todoData.isDone = false;
      }
    });

    setOnEdit(false);
  };

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [onEdit]);
  return (
    <>
      {todo?.id && todo?.id !== undefined && (
        <Draggable draggableId={todo.id.toString()} index={i}>
          {(provided) => (
            <form
              onClick={() => alert("open task modal")}
              onSubmit={(e) => handleEdit(e)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className="todos__single">
                {onEdit ? (
                  <input ref={inputRef} type="text" value={editTodo} onChange={(e) => setEditTodo(e.target.value)} />
                ) : (
                  <Typography className="todos__single--text">{todo.name}</Typography>
                )}
                <div>
                  {/* <span className="icon" onClick={() => handleDone(parseInt(todo.id))}>
                    <MdDone className={todo.status !== "" ? "done" : ""} />
                  </span> */}
                  {/* {todo. && (
                  <span className="icon" onClick={() => revertDone(todo.id)}>
                    <AiOutlinePullRequest />
                  </span>
                )} */}
                  <span
                    className="icon"
                    onClick={() => {
                      setOnEdit(!onEdit);
                      inputRef.current?.focus();
                    }}
                  >
                    <AiFillEdit />
                  </span>
                  {/* <span className="icon" onClick={() => handleDelete(parseInt(todo.id))}>
                    <AiFillDelete />
                  </span> */}
                </div>
                {onEdit && <button type="submit">Edit</button>}
              </Card>
            </form>
          )}
        </Draggable>
      )}
    </>
  );
}

export default Task;
