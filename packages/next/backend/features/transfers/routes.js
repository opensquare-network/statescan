const Router = require("koa-router");
const transfersController = require("./transfers.controller");

const router = new Router();

router.get("/transfers", transfersController.getTransfers);
router.get("/transfers/:extrinsicHash", transfersController.getTransfer);

module.exports = router;
