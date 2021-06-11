const Router = require("koa-router");
const blocksController = require("./blocks.controller");

const router = new Router();

router.get("/blocks/latest", blocksController.getLatestBlocks);
router.get("/blocks/height", blocksController.getBlockHeight);

module.exports = router;
