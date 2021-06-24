const Router = require("koa-router");
const addressesController = require("./addresses.controller");

const router = new Router();

router.get("/addresses/count", addressesController.getAddressCount);
router.get("/addresses/:address", addressesController.getAddress);
router.get(
  "/addresses/:address/extrinsics",
  addressesController.getAddressExtrinsics
);
router.get("/addresses/:address/assets", addressesController.getAddressAssets);

module.exports = router;
