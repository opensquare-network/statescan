const Router = require("koa-router");
const nftinstancesController = require("./nftinstances.controller");

const router = new Router();

router.get("/nftclasses/:classId(\\d+)/instances", nftinstancesController.getNftInstancesByClassId);
router.get("/nftclasses/:classId(\\d+)_:classHeight(\\d+)/instances", nftinstancesController.getNftInstancesByClass);
router.get("/nftclasses/:classId(\\d+)/instances/:instanceId(\\d+)", nftinstancesController.getNftInstanceById);
router.get(
  "/nftclasses/:classId(\\d+)_:classHeight(\\d+)/instances/:instanceId(\\d+)_:instanceHeight(\\d+)",
  nftinstancesController.getNftInstance
);

module.exports = router;
