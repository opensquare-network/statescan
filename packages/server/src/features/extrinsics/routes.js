const Router = require("koa-router");
const extrinsicsController = require("./extrinsics.controller");

const router = new Router();

router.get("/extrinsics/latest", extrinsicsController.getLatestExtrinsics);
router.get("/extrinsics/count", extrinsicsController.getExtrinsicsCount);
router.get("/extrinsics/:indexOrHash", extrinsicsController.getExtrinsic);
router.get(
  "/extrinsics/:extrinsicHash/events",
  extrinsicsController.getExtrinsicEvents
);

module.exports = router;
