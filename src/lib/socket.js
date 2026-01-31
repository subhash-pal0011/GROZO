
// AGR HUME SOCKET KO CLINET SIDE MEA CHHIYE TO ISKE TRHUGH HI ACCESS KR SKTE HII.

import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
       if (!socket) {
              socket = io(process.env.NEXT_PUBLIC_NODE_SOCKET_URL, {
                     withCredentials: true,
                     transports: ["websocket"],
              });
       }
       return socket;
};