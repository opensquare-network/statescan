const Router = require("koa-router");
const homeController = require("./home.controller");

const router = new Router();

router.get("/search", homeController.search);
router.get("/search/autocomplete", homeController.searchAutoComplete);
router.get("/overview", homeController.getOverviewData);

module.exports = router;
