const Router = require("koa-router");
const teleportsController = require("./teleports.controller");

const router = new Router();

router.get("/teleports", teleportsController.getTeleports);
router.get("/teleports/:indexOrHash", teleportsController.getTeleport);

module.exports = router;
