import React, { useState } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ImageListItem from "@mui/material/ImageListItem";
import Inputs from "../inputs/Inputs";
import PopoverWrapper from "../popover/PopoverWrapper";

function CreateModal({
  createType,
  createBoard,
  createValue,
  setCreateValue,
  setCurrentList,
  currentList,
  position,
  min600,
}) {
  const [currentImage, setCurrentImage] = useState("");
  const [imageChecked, setImageChecked] = useState(false);
  const createInputs = [
    { name: "name", type: "text", required: true },
    { name: "image", type: "url" },
  ];
  const onHandleChange = (value: string, name: string) => {
    setCreateValue({ ...createValue, [name]: value });
  };

  const onCreate = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setCurrentImage(createValue.image);
    if (createValue.image && !currentImage) return;
    createType.data.val === "board"
      ? createBoard()
      : setCurrentList({ ...currentList, rerender: !currentList.rerender });
  };

  const imageNotValid = () => {
    setCurrentImage("");
    setImageChecked(false);
    if (createValue.image) alert("Image not valid");
  };
  return (
    <PopoverWrapper
      open={createType?.data?.val !== ""}
      anchor={createType?.data?.val !== ""}
      position={position}
      onContext={createType?.data?.onCtxMenu}
      ml={createType?.data?.val === "board" ? (min600 ? 11 : 0) : min600 ? 15.5 : 5}
      onClose={() => createType.set({ val: "", onCtxMenu: false })}
    >
      <Card sx={{ p: 1, width: "300px" }}>
        <Box sx={{ p: 1 }} component="form" onSubmit={onCreate}>
          {createType.data?.val === "list" || createType.data?.val === "board"
            ? createInputs.map((input) => (
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
              ))
            : null}
          <ImageListItem>
            {currentImage && (
              <img
                onLoad={() => setImageChecked(true)}
                src={createValue.image}
                onError={imageNotValid}
                loading="lazy"
              />
            )}
          </ImageListItem>
          {createType.data?.val !== "users" && (
            <Button type={"submit"} sx={{ mt: 1, textTransform: "none" }} variant="contained" size="small">
              {createValue.image && !imageChecked ? "Check Image" : `Add ${createType.data?.val}`}
            </Button>
          )}
        </Box>
      </Card>
    </PopoverWrapper>
  );
}

export default CreateModal;
