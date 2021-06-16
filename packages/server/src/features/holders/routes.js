const Router = require("koa-router");
const holdersController = require("./holders.controller");

const router = new Router();

router.get("/holders/count", holdersController.getHoldersCount);
router.get("/holders/:address", holdersController.getHolder);
router.get(
  "/holders/:address/extrinsics",
  holdersController.getHolderExtrinsics
);
router.get("/holders/:address/transfers", holdersController.getHolderTransfers);

module.exports = router;
