const Router = require("koa-router");
const eventsController = require("./events.controller");

const router = new Router();

router.get("/events", eventsController.getEvents);
router.get(
  "/events/allmodulemethods",
  eventsController.getAllEventModuleMethods
);
router.get("/events/modules", eventsController.getEventModules);
router.get(
  "/events/modules/:moduleName/methods",
  eventsController.getEventModuleMethods
);
router.get("/events/:blockHeight-:eventSort", eventsController.getEvent);

module.exports = router;
