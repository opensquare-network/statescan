const Router = require("koa-router");
const transfersController = require("./transfers.controller");

const router = new Router();

router.get("/transfers/latest", transfersController.getLatestTransfers);
router.get("/transfers/count", transfersController.getTransfersCount);

module.exports = router;
