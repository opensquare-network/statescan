const Router = require("koa-router");
const eventsController = require("./events.controller");

const router = new Router();

router.get("/events", eventsController.getEvents);

module.exports = router;
