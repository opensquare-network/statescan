import io from "socket.io-client";
import { store } from "../store";
import { setOverview, setScanHeight } from "../store/reducers/chainSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_ROOM";

let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", { chain, data: chainStatusRoom });
    socket.emit("unsubscribe", { chain, data: overviewRoom });
    socket.disconnect();
  }

  socket = io(process.env.REACT_APP_SOCKET_IO_URL || "dev-api.statescan.io");
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", { chain, data: chainStatusRoom });
    socket.emit("subscribe", { chain, data: overviewRoom });

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setScanHeight(height));
    });
    socket.on("overview", (overview) => {
      store.dispatch(setOverview(overview));
    });
  });
}
