import React from "react";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Inputs from "../inputs/Inputs";

function CreateModal({ createType, createBoard, createValue, setCreateValue, setCurrentListId, currentListId }) {
  const min1000 = useMediaQuery("(min-width:1000px)");
  const createInputs = [
    { name: "name", type: "text", required: true },
    { name: "image", type: "url" },
  ];
  const onHandleChange = (value: string, name: string) => {
    setCreateValue({ ...createValue, [name]: value });
  };

  const onCreate = (e) => {
    e.preventDefault();
    createType.data === "board"
      ? createBoard()
      : setCurrentListId({ ...currentListId, rerender: !currentListId.rerender });
  };
  return (
    <Modal open={createType.data !== ""} onClose={() => createType.set("")} onSubmit={onCreate}>
      <Box sx={{ position: "absolute", top: "40%", marginLeft: min1000 ? "40%" : "20%" }} component="form">
        <Card sx={{ p: 1, width: "300px" }}>
          {createInputs.map((input) => (
            <Inputs
              key={input.name}
              value={createValue[input.name]}
              type={input.type}
              handleChange={onHandleChange}
              label={"create " + input.name}
              name={input.name}
              required={input.required ? true : false}
              sx={{ mt: 1 }}
            />
          ))}
        </Card>
        <Button type={"submit"} sx={{ mt: 1 }} variant="contained" size="small">
          Create
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateModal;
