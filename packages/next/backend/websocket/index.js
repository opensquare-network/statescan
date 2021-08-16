const {
  chainStatusRoom,
  overviewRoom,
  firstPageBlocksRoom,
} = require("./constants");
const { getScanHeight, getOverview, getFirstPageBlocks } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");
const { feedFirstPageBlocks } = require("./firstPageBlocks");

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
      } else if (room === firstPageBlocksRoom) {
        const firstPageBlocks = getFirstPageBlocks(chain);
        io.to(firstPageBlocksRoom).emit("firstPageBlocks", firstPageBlocks);
      }
    });

    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });

  await feedScanStatus(chain, io);
  await feedOverview(chain, io);
  await feedFirstPageBlocks(chain, io);
}

function ioHandler(io) {
  ["westmint", "statemine"].forEach((chain) => {
    listenAndEmitInfo(io.of(`/${chain}`), chain);
  });
}

module.exports = {
  ioHandler,
};
