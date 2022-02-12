import { serverUrl } from "../helpers/urlConfig";
import io from "socket.io-client";
let socket: any;

export const initiateSocket = (room: string) => {
  socket = io(serverUrl, {
    transports: ["websocket"],
  });
  console.log(`Connecting socket`);
  if (socket && room) socket.emit("join", room);
};
export const disconnectSocket = () => {
  console.log("Disconnecting socket");
  if (socket) socket.disconnect();
};

export const sendRefetchReq = (fetchData: object) => {
  console.log("sending refetch request");
  if (socket) socket.emit("refetch", fetchData);
};

export const enterRefetchReq = (data) => {
  if (!socket) return;
  socket.on("refetch", (message: object) => {
    console.log("refetch request received");
    return data(null, message);
  });
};

export const sendBoardrefetchReq = (fetchData: object) => {
  console.log("sending refetch request");
  if (socket) socket.emit("inboard-refetch", fetchData);
};

export const enterBoardRefetchReq = (data) => {
  if (!socket) return;
  socket.on("inboard-refetch", (message: object) => {
    console.log("refetch request received");
    return data(null, message);
  });
};
