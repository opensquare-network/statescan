const Router = require("koa-router");
const addressesController = require("./addresses.controller");

const router = new Router();

router.get("/addresses", addressesController.getAddresses);
router.get("/addresses/count", addressesController.getAddressCount);
router.get("/addresses/:address", addressesController.getAddress);
router.get(
  "/addresses/:address/extrinsics",
  addressesController.getAddressExtrinsics
);
router.get("/addresses/:address/assets", addressesController.getAddressAssets);
router.get(
  "/addresses/:address/transfers",
  addressesController.getAddressTransfers
);
router.get(
  "/addresses/:address/teleports/in",
  addressesController.getAddressTeleportsIn
);
router.get(
  "/addresses/:address/teleports/out",
  addressesController.getAddressTeleportsOut
);

router.get(
  "/addresses/:address/nft/instances",
  addressesController.getAddressNftInstances
);
router.get(
  "/addresses/:address/nft/transfers",
  addressesController.getAddressNftTransfers
);


module.exports = router;
