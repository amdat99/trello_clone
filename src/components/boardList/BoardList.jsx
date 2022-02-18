import React from "react";

const BoardList = () => {
  return (
      <Box sx={{ mt: "40px" }}>
        <Typography sx={{ fontWeight: "bold" }}>RECENT BOARDS</Typography>
        <hr />
        <ImageList cols={4} sx={{ overflowY: "unset", margin: "10px 0" }}>
          {boards &&
            boards.map((item, index) => (
              <BoardCard
                index={index}
                currentOrg={currentOrg}
                item={item}
                recentBoards={recentBoards}
              />
            ))}
        </ImageList>
      </Box>
    
  );
};

export default BoardList;
