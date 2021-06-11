const Router = require("koa-router");
const assetsController = require("./assets.controller");

const router = new Router();

router.get("/assets/latest", assetsController.getLatestAssets);
router.get("/assets/count", assetsController.getAssetsCount);

module.exports = router;
