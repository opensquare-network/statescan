const Router = require("koa-router");
const nftclassesController = require("./nftclasses.controller");

const router = new Router();

router.get("/nft/classes", nftclassesController.getNftClasses);
router.get("/nft/classes/:classId(\\d+)", nftclassesController.getNftClassById);
router.get(
  "/nft/classes/:classId(\\d+)/timeline",
  nftclassesController.getNftClassTimelineById
);
router.get(
  "/nft/classes/:classId(\\d+)_:blockHeight(\\d+)",
  nftclassesController.getNftClass
);
router.get(
  "/nft/classes/:classId(\\d+)_:blockHeight(\\d+)/timeline",
  nftclassesController.getNftClassTimeline
);

module.exports = router;
