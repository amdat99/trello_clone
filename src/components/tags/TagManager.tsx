import React, { useState } from "react";
import { Card, Typography, Button, Box, Tooltip } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import PopoverWrapper from "../popover/PopoverWrapper";
import Inputs from "../inputs/Inputs";

type TagData = {
  name: string;
  color: string;
};

type Props = {
  tagData: TagData;
  showTagManager: boolean;
  setShowTagManager: Function;
  position: { x: number; y: number };
  setTagData: (data: TagData) => void;
  onUpdateTag: Function;
  edit: any;
  setEdit: Function;
};
function TagManager({
  showTagManager,
  setShowTagManager,
  position,
  tagData,
  setTagData,
  onUpdateTag,
  edit,
  setEdit,
}: Props) {
  const min1000 = useMediaQuery("(min-width:1000px)");
  const [delCheck, setDelCheck] = useState(false);

  const tagInputs = [
    { name: "name", type: "text", required: true },
    { name: "color", type: "color" },
  ];

  React.useEffect(() => {
    if (edit) {
      setTagData({ name: edit.name, color: edit.color });
    }
  }, [edit]);

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onUpdateTag(false);
  };

  return (
    <>
      <PopoverWrapper
        open={showTagManager}
        anchor={showTagManager}
        onClose={() => {
          setShowTagManager(false);
          edit && setEdit(null);
          delCheck && setDelCheck(false);
        }}
        position={position}
        styles={{
          top: position.y.toString() + "px",
          position: "fixed",
          left: min1000 ? "225px" : "50px",
        }}
      >
        <Card sx={{ p: 1, width: "200px" }}>
          <Typography>{edit ? "Edit" : "Create"}Tag</Typography>
          <Box component="form" onSubmit={onSubmit}>
            {tagInputs.map((input: { name: string; type: string; required?: boolean }, i: number) => (
              <Inputs
                key={i}
                value={tagData[input.name]}
                type={input.type}
                handleChange={(val) => setTagData({ ...tagData, [input.name]: val })}
                label={input.name}
                name={input.name}
                required={input.required ? true : false}
                sx={{ mt: 1 }}
              />
            ))}
            <Button type={"submit"} sx={{ mt: 1, textTransform: "none" }} variant="contained" size="small">
              {edit ? "Edit" : "Create"} Tag
            </Button>
            {edit && (
              <>
                <Button
                  onClick={() => (delCheck ? onUpdateTag(true) : setDelCheck(true))}
                  color="error"
                  sx={{ mt: 1, ml: 1, textTransform: "none" }}
                  variant="contained"
                  size="small"
                >
                  {delCheck ? "Are you sure ?" : "Delete Tag"}
                </Button>
                {delCheck && (
                  <Tooltip title="Go back">
                    <ArrowBackOutlinedIcon
                      sx={{ height: 15, position: "absolute", mt: 2, cursor: "pointer" }}
                      onClick={() => setDelCheck(false)}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        </Card>
      </PopoverWrapper>
    </>
  );
}

export default TagManager;
