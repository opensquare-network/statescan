const Router = require("koa-router");

const router = new Router();

const chainFeatureRouters = [
  require("./features/blocks/routes"),
  require("./features/extrinsics/routes"),
  require("./features/transfers/routes"),
  require("./features/assets/routes"),
  require("./features/holders/routes"),
  require("./features/addresses/routes"),
];

const commonFeatureRouters = [];

module.exports = (app) => {
  for (const r of commonFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }

  for (const r of chainFeatureRouters) {
    router.use(
      "/:chain(kusama|rococo|westen)",
      r.routes(),
      r.allowedMethods({ throw: true })
    );
  }
  app.use(router.routes());
};
