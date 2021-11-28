const { ApiPromise, WsProvider } = require("@polkadot/api");

let provider = null;
let api = null;

async function getApi() {
  if (!api) {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error("WS_ENDPOINT not set");
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint, 1000);
    api = await ApiPromise.create({ provider });
  }

  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

// For test
function setApi(targetApi) {
  api = targetApi;
}

// for test
function setProvider(p) {
  provider = p;
}

// for test
function getProvider() {
  return provider;
}

function isApiConnected() {
  return provider && provider.isConnected;
}

module.exports = {
  getApi,
  setProvider,
  getProvider,
  disconnect,
  setApi,
  isApiConnected,
};
