const { setApi, setProvider, getProvider } = require("../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

async function setupApi() {
  const provider = new WsProvider(
    "wss://statemine.api.onfinality.io/public-ws",
    1000
  );
  const api = await ApiPromise.create({ provider });
  setProvider(provider);
  setApi(api);
}

async function disconnect() {
  const provider = getProvider();
  await provider.disconnect();
}

module.exports = {
  setupApi,
  disconnect,
};
