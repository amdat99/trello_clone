import React, { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Tooltip, Avatar, Box, Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import useFetchData from "../../hooks/useFetchData";

function AddAssignedUsers({ onAssignUser }) {
  const { data: users, fetchData: fetchUsers } = useFetchData(
    {
      type: "post",
      route: "profile/orguser",
    },
    "profile/orguser"
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="body1">Members</Typography>
      <Divider sx={{ mb: 1 }} />

      {users &&
        users.map((option) => (
          <Box key={option.public_id}>
            <MenuItem dense divider value={option} onClick={() => onAssignUser(option)}>
              <Tooltip title={option.user_name} placement="bottom" key={option.user_name}>
                <Avatar sx={{ width: 20, height: 20, mr: 0.7, bgcolor: "red", fontSize: 15, mb: 0.5 }}>
                  {option.user_name[0].toUpperCase()}
                </Avatar>
              </Tooltip>
              {option.user_name}
            </MenuItem>
          </Box>
        ))}
    </Card>
  );
}

export default AddAssignedUsers;
