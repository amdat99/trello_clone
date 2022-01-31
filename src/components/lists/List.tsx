import React, { useState } from "react";
import Inputs from "../inputs/Inputs";
import TodoList from "../todolist/TodoList";
import { Todo } from "../models";
import "../../App.css";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

const List: React.FC = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inProgressTodos, setInProgressTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      setTodos([...todos, { id: Date.now(), todo: todo, isDone: false }]);
    }
    setTodo("");
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    let add;
    let active = todos;
    let inprogresslist = inProgressTodos;
    let complete = doneTodos;

    if (source.droppableId === "todolist") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else if (source.droppableId === "inprogresslist") {
      add = inprogresslist[source.index];
      inprogresslist.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === "todolist") {
      active.splice(destination.index, 0, add);
    } else if (destination.droppableId === "inprogresslist") {
      inprogresslist.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }
    setDoneTodos(complete);
    setInProgressTodos(inprogresslist);
    setTodos(active);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Board</span>
        <form onSubmit={handleAdd}>
          <Inputs value={todo} handleChange={setTodo} type={"text"} />
          <button type="submit" className="input_submit">
            Go
          </button>
        </form>
        <div className="container">
          <Droppable droppableId="todolist">
            {(provided, snapshot) => (
              <div
                className={`todos ${snapshot.isDraggingOver ? "tododrop" : "todor"}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span>pending tasks</span>
                {todos?.map((todo, i) => (
                  <TodoList key={todo.id} todo={todo} setTodos={setTodos} todos={todos} i={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="inprogresslist">
            {(provided, snapshot) => (
              <div
                style={{ backgroundColor: "orange" }}
                className={`todos ${snapshot.isDraggingOver ? "tododrop" : "todor"}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span>In progress tasks</span>
                {inProgressTodos?.map((todo, i) => (
                  <TodoList key={todo.id} todo={todo} setTodos={setInProgressTodos} todos={inProgressTodos} i={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="removetodolist">
            {(provided, snapshot) => (
              <div
                style={{ backgroundColor: "red" }}
                className={`todos ${snapshot.isDraggingOver ? "tododrop" : "todor"}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span>Completed tasks</span>
                {doneTodos?.map((todo, i) => (
                  <TodoList key={todo.id} todo={todo} setTodos={setDoneTodos} todos={doneTodos} i={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default List;
