const { ApiPromise, WsProvider } = require("@polkadot/api");
const { currentChain, CHAINS } = require("./envvars");

let provider = null;
let api = null;

const defaultRocEndPoint = "wss://statemint-rococo-rpc.parity.io/";
const defaultKsmEndPoint = "wss://statemine.kusama.elara.patract.io/";
const defaultDotEndPoint = "wss://statemine.polkadot.elara.patract.io/";

async function getApi() {
  if (!api) {
    const chain = currentChain();

    if (chain === CHAINS.POLKADOT) {
      ws_endpoint = process.env.WS_DOT_ENDPOINT || defaultDotEndPoint;
    } else if (chain === CHAINS.KUSAMA) {
      ws_endpoint = process.env.WS_KSM_ENDPOINT || defaultKsmEndPoint;
    } else {
      ws_endpoint = process.env.WS_ROC_ENDPOINT || defaultRocEndPoint;
    }

    provider = new WsProvider(ws_endpoint);
    api = await ApiPromise.create({ provider });
  }

  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

module.exports = {
  getApi,
  disconnect,
};
