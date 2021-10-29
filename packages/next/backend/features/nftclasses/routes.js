const Router = require("koa-router");
const nftclassesController = require("./nftclasses.controller");

const router = new Router();

router.get("/nftclasses", nftclassesController.getNftClasses);
router.get("/nftclasses/:classId(\\d+)", nftclassesController.getNftClassById);
router.get(
  "/nftclasses/:classId(\\d+)_:blockHeight(\\d+)",
  nftclassesController.getNftClass
);

module.exports = router;
