const Router = require("koa-router");
const pricesController = require("./prices.controller");

const router = new Router();

router.get(
  "/:chain(westmint|statemine|statemint|litmus)/prices/daily",
  pricesController.getDailyPrices
);

module.exports = router;
