const { chainStatusRoom, overviewRoom } = require("./constants");
const { getScanHeight, getOverview } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");

async function listenAndEmitInfo(io, chain) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      socket.join(room);

      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight(chain);
        io.to(room).emit("scanStatus", { height: scanHeight });
      } else if (room === overviewRoom) {
        const overview = getOverview(chain);
        io.to(room).emit("overview", overview);
      }
    });

    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });

  await feedScanStatus(chain, io);
  await feedOverview(chain, io);
}

function ioHandler(io) {
  ["westmint", "statemine"].forEach((chain) => {
    listenAndEmitInfo(io.of(`/${chain}`), chain);
  });
}

module.exports = {
  ioHandler,
};
