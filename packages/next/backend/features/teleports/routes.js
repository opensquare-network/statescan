const Router = require("koa-router");
const teleportsController = require("./teleports.controller");

const router = new Router();

router.get("/teleports/in", teleportsController.getTeleportsIn);
router.get("/teleports/out", teleportsController.getTeleportsOut);

module.exports = router;
