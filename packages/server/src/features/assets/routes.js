const Router = require("koa-router");
const assetsController = require("./assets.controller");

const router = new Router();

router.get("/assets/latest", assetsController.getLatestAssets);
router.get("/assets/count", assetsController.getAssetsCount);
router.get("/assets", assetsController.getAssets);
router.get(
  "/assets/:assetId(\\d+)_:blockHeight(\\d+)",
  assetsController.getAsset
);
router.get(
  "/assets/:assetId(\\d+)_:blockHeight(\\d+)/transfers",
  assetsController.getAssetTransfers
);
router.get(
  "/assets/:assetId(\\d+)_:blockHeight(\\d+)/holders",
  assetsController.getAssetHolders
);

module.exports = router;
