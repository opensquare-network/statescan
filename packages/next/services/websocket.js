import io from "socket.io-client";
import { store } from "../store";
import { setOverview, setScanHeight } from "../store/reducers/chainSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_ROOM";

let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", chainStatusRoom);
    socket.emit("unsubscribe", overviewRoom);
    socket.disconnect();
  }

  socket = io(new URL(`/${chain}`, process.env.NEXT_PUBLIC_API_END_POINT).href);
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", chainStatusRoom);
    socket.emit("subscribe", overviewRoom);

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setScanHeight(height));
    });
    socket.on("overview", (overview) => {
      store.dispatch(setOverview(overview));
    });
  });
}
