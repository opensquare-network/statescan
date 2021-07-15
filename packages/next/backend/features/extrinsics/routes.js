const Router = require("koa-router");
const extrinsicsController = require("./extrinsics.controller");

const router = new Router();

router.get("/extrinsics", extrinsicsController.getExtrinsics);
router.get("/extrinsics/latest", extrinsicsController.getLatestExtrinsics);
router.get("/extrinsics/count", extrinsicsController.getExtrinsicsCount);
router.get("/extrinsics/modules", extrinsicsController.getExtrinsicModules);
router.get(
  "/extrinsics/modules/:moduleName/methods",
  extrinsicsController.getExtrinsicModuleMethods
);
router.get("/extrinsics/:indexOrHash", extrinsicsController.getExtrinsic);
router.get(
  "/extrinsics/:indexOrHash/events",
  extrinsicsController.getExtrinsicEvents
);
router.get(
  "/extrinsics/:indexOrHash/transfers",
  extrinsicsController.getExtrinsicTransfers
);

module.exports = router;
