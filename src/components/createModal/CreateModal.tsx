import React from "react";
import Card from "@mui/material/Card";
// import Modal from "@mui/material/Modal";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Inputs from "../inputs/Inputs";

function CreateModal({
  createType,
  createBoard,
  createValue,
  setCreateValue,
  setCurrentListId,
  currentListId,
  position,
}) {
  const min1200 = useMediaQuery("(min-width:1200px)");
  const max800 = useMediaQuery("(max-width:800px)");

  const createInputs = [
    { name: "name", type: "text", required: true },
    { name: "image", type: "url" },
  ];
  const onHandleChange = (value: string, name: string) => {
    setCreateValue({ ...createValue, [name]: value });
  };

  const onCreate = (e) => {
    e.preventDefault();
    createType.data.val === "board"
      ? createBoard()
      : setCurrentListId({ ...currentListId, rerender: !currentListId.rerender });
  };

  const ctxStyles = {
    position: "fixed",
    zIndex: "999",
    left: position.x ? position.x.toString() - (max800 ? 370 : 720) + "px" : "",
    top: position.x ? position.y.toString() + "px" : "",
  };
  return (
    <Popover
      open={createType.data.val}
      anchorEl={createType.data.val}
      onClose={() => createType.set({ val: "", onCtxMenu: false })}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={
        createType.data.onCtxMenu
          ? ctxStyles
          : { marginTop: "40px", left: min1200 ? "10rem" : max800 ? "-3rem" : "1rem" }
      }
    >
      {/* <Modal open={createType.data} onClose={() => createType.set("")}> */}
      <Box sx={{ p: 2 }} component="form" onSubmit={onCreate}>
        <Card sx={{ p: 1, width: "300px" }}>
          {createInputs.map((input) => (
            <Inputs
              key={input.name}
              value={createValue[input.name]}
              type={input.type}
              handleChange={onHandleChange}
              label={input.name}
              name={input.name}
              required={input.required ? true : false}
              sx={{ mt: 1 }}
            />
          ))}
        </Card>
        <Button type={"submit"} sx={{ mt: 1 }} variant="contained" size="small">
          Create {createType.data.val}
        </Button>
      </Box>
      {/* </Modal> */}
    </Popover>
  );
}

export default CreateModal;
