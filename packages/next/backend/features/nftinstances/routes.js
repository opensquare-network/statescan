const Router = require("koa-router");
const nftinstancesController = require("./nftinstances.controller");

const router = new Router();

router.get(
  "/nft/classes/:classId(\\d+)/instances",
  nftinstancesController.getNftInstancesByClassId
);
router.get(
  "/nft/classes/:classId(\\d+)_:classHeight(\\d+)/instances",
  nftinstancesController.getNftInstancesByClass
);
router.get(
  "/nft/classes/:classId(\\d+)/instances/:instanceId(\\d+)",
  nftinstancesController.getNftInstanceById
);
router.get(
  "/nft/classes/:classId(\\d+)/instances/:instanceId(\\d+)/timeline",
  nftinstancesController.getNftInstanceTimelineById
);
router.get(
  "/nft/classes/:classId(\\d+)_:classHeight(\\d+)/instances/:instanceId(\\d+)_:instanceHeight(\\d+)",
  nftinstancesController.getNftInstance
);
router.get(
  "/nft/classes/:classId(\\d+)_:classHeight(\\d+)/instances/:instanceId(\\d+)_:instanceHeight(\\d+)/timeline",
  nftinstancesController.getNftInstanceTimeline
);
router.get(
  "/nft/classes/:classId(\\d+)_:classHeight(\\d+)/instances/:instanceId(\\d+)_:instanceHeight(\\d+)/transfers",
  nftinstancesController.getNftInstanceTransfers
);

module.exports = router;
