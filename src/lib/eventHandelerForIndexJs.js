// Is function ka kaam:

// Next.js se Node + Socket server ko API ke through

// event trigger karna (specific user ya sabhi users ke liye)

import axios from "axios";

const eventHandlerForIndexJs = async ({ socketId, event, data }) => {
       try {
              await axios.post(
                     `${process.env.NEXT_PUBLIC_NODE_SOCKET_URL}/notifyRoute`,{socketId,event,data,}
              );
       } catch (error) {
              console.error(
                     "eventHandlerForIndexJs error:",
                     error.response?.data || error.message
              );
       }
};

export default eventHandlerForIndexJs;
