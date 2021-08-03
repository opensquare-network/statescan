const Router = require("koa-router");
const identitiesController = require("./identities.controller");

const router = new Router();

router.get("/identities/:address", identitiesController.getIdentity);

module.exports = router;
