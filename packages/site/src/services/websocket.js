import io from "socket.io-client";
import store from "../store";
import { setScanHeight } from "../store/reducers/chainSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";

let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", { chain, data: chainStatusRoom });
    socket.disconnect();
  }

  socket = io(process.env.REACT_APP_SOCKET_IO_URL || "api.statescan.com");
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", { chain, data: chainStatusRoom });

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setScanHeight(height));
    });
  });
}
