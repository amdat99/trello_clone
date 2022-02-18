import { requestHandler } from "./requestHandler";
import { User, Board } from "../components/models";

export const onAssignUserToBoard = (
  user: { user_name?: string; color?: string; name?: string },
  board: Board,
  callback: Function
) => {
  const assigned_users = board.assigned_users;
  assigned_users.push({ name: user.user_name, color: user.color });
  requestHandler({
    type: "put",
    route: "board/assignuser",
    body: { id: board.id, assigned_users: JSON.stringify(assigned_users), name: user.user_name },
  }).then((response: any) => {
    if (response === "user assigned successfully") {
      callback();
    } else {
      assigned_users.pop();
      alert(response?.errors ? response.errors : "no data found");
    }
  });
};
