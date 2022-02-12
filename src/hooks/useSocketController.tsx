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

    enterRefetchReq((err: null, data: { type: string; id: string }) => {
      console.log(err);
      let prevMsg: any = {};
      if (data && !err && data !== prevMsg) {
        setSocketData(data);
      }
    });

    enterBoardRefetchReq((err: null, data: { type: string; id: string; resId: string; prevId?: string }) => {
      console.log(err);
      let prevMsg: any = {};
      if (data && !err && data !== prevMsg) {
        setSocketData(data);
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [room]);
  return [null];
}

export default useSocketController;
