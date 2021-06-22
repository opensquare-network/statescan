const Router = require("koa-router");
const pricesController = require("./prices.controller");

const router = new Router();

router.get("/prices/monthly", pricesController.getMonthlyPrices);

module.exports = router;
