const {
  chainStatusRoom,
  overviewRoom,
  firstPageBlocksRoom,
} = require("./constants");
const { getScanHeight, getOverview, getFirstPageBlocks } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");
const { feedFirstPageBlocks } = require("./firstPageBlocks");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      socket.join(room);

      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(room).emit("scanStatus", { height: scanHeight });
      } else if (room === overviewRoom) {
        const overview = getOverview();
        io.to(room).emit("overview", overview);
      } else if (room === firstPageBlocksRoom) {
        const firstPageBlocks = getFirstPageBlocks();
        io.to(firstPageBlocksRoom).emit("firstPageBlocks", firstPageBlocks);
      }
    });

    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });

  await feedScanStatus(io);
  await feedOverview(io);
  await feedFirstPageBlocks(io);
}

module.exports = {
  listenAndEmitInfo,
};
