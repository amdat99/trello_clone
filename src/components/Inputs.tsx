import React from "react";
import "./styles.css";

type inputProps = {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
};
function Inputs({ todo, setTodo, handleAdd }: inputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e) => {
        handleAdd(e);
        inputRef.current?.blur();
      }}
      className="input"
    >
      <input
        type="text"
        className="input__box"
        value={todo}
        placeholder="enter task"
        onChange={(e) => setTodo(e.target.value)}
        ref={inputRef}
      />
      <button type="submit" className="input_submit">
        Go
      </button>
    </form>
  );
}

export default Inputs;
