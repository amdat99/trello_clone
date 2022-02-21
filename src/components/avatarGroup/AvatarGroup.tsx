import React from "react";
import { Tooltip, Avatar } from "@mui/material";

type Props = {
  users: { name?: string; user_name?: string; color: string }[];
  size?: number;
};
function AvatarGroup({ users, size = 25 }: Props) {
  return (
    <>
      {users.map((user, i: React.Key) => (
        <Tooltip title={user.name || user.user_name} placement="bottom" key={i}>
          <Avatar sx={{ width: size, height: size, mr: 0.7, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
            {user.name[0].toUpperCase() || user.user_name[0].toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
    </>
  );
}

export default AvatarGroup;
