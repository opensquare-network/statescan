const Router = require("koa-router");
const blocksController = require("./blocks.controller");

const router = new Router();

router.get("/blocks", blocksController.getBlocks);
router.get("/blocks/height", blocksController.getBlockHeight);
router.get("/blocks/:heightOrHash", blocksController.getBlock);
router.get(
  "/blocks/:heightOrHash/extrinsics",
  blocksController.getBlockExtrinsics
);
router.get("/blocks/:heightOrHash/events", blocksController.getBlockEvents);
router.get("/blocks/fromtime/:blockTime", blocksController.getBlockFromTime);

module.exports = router;
