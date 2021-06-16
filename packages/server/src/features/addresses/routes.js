const Router = require("koa-router");
const addressesController = require("./addresses.controller");

const router = new Router();

router.get("/addresses/:address", addressesController.getAddress);
router.get(
  "/addresses/:address/extrinsics",
  addressesController.getAddressExtrinsics
);

module.exports = router;
