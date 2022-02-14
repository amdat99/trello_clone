import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useRequestStore } from "../store";
import { initiateSocket, disconnectSocket, enterRefetchReq, enterBoardRefetchReq } from "../sockets/orgSockets";

function useSocketController(room: string) {
  const setSocketData = useRequestStore((state) => state.setSocketData, shallow);
  useEffect(() => {
    if (room) {
      initiateSocket(room);
    }

    enterRefetchReq((err: null, data: { type: string; resId: string }) => {
      console.log(err);
      let prevMsg: string;
      if (data && !err && data.resId !== prevMsg) {
        setSocketData(data);
        prevMsg = data.resId;
      }
    });

    enterBoardRefetchReq((err: null, data: { type: string; id: string; resId: string; prevId?: string }) => {
      console.log(err);
      let prevMsg: string;
      if (data && !err && data.resId !== prevMsg) {
        setSocketData(data);
        prevMsg = data.resId;
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [room]);
  return [null];
}

export default useSocketController;
