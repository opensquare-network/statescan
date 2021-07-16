const { ApiPromise, WsProvider } = require("@polkadot/api");
const { currentChain, CHAINS } = require("./envvars");

let provider = null;
let api = null;

const defaultRocEndPoint = "wss://statemint-rococo-rpc.parity.io/";
const defaultKsmEndPoint = "wss://statemine.kusama.elara.patract.io/";
const defaultWndEndPoint = "wss://westmint-rpc.polkadot.io/";

async function getApi() {
  if (!api) {
    const chain = currentChain();

    let wsEndpoint = process.env.WS_ROC_ENDPOINT || defaultRocEndPoint;
    if (chain === CHAINS.STATEMINE) {
      wsEndpoint = process.env.WS_KSM_ENDPOINT || defaultKsmEndPoint;
    } else if (chain === CHAINS.WESTMINT) {
      wsEndpoint = process.env.WS_WND_ENDPOINT || defaultWndEndPoint;
    }

    console.log(`Connect to endpoint:`, wsEndpoint);

    provider = new WsProvider(wsEndpoint);
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
