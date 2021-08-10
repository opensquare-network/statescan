import debounce from "lodash/debounce";
import axios from "axios";

const cachedIdentities = new Map();
let pendingQueries = new Map();

const delayQuery = debounce(() => {
  const pending = pendingQueries;
  if (pending.size < 1) {
    return;
  }
  pendingQueries = new Map();

  const chainAddresses = {};
  const idNames = [...pending.keys()];
  const idNameSplits = idNames.map(item => item.split("/"));
  for (const [chain, address] of idNameSplits) {
    if (!chainAddresses[chain]) {
      chainAddresses[chain] = [];
    }
    chainAddresses[chain].push(address);
  }

  for (const chain of Object.keys(chainAddresses)) {
    const addresses = chainAddresses[chain];
    if (addresses.size < 1) {
      continue;
    }

    axios
      .post(`https://identity.statescan.io/${chain}/identities`, { addresses })
      .then(({ data }) => {
        const identities = new Map(data.map(item => [item.address, item]));

        for (const [idName, [, resolve, reject]] of pending) {
          const [chainOfIdName, addrOfIdName] = idName.split("/");
          if (chainOfIdName !== chain) {
            continue;
          }
          const identity = identities.get(addrOfIdName) || null;
          if (identity) {
            cachedIdentities.set(idName, identity);
          }
          if (resolve) {
            resolve(identity);
          }
        }
    });
  }
}, 0);

export function fetchIdentity(chain, address) {
  const idName = `${chain}/${address}`;
  if (cachedIdentities.has(idName)) {
    return Promise.resolve(cachedIdentities.get(idName));
  }

  const pending = pendingQueries;

  if (!pending.has(idName)) {
    pending.set(idName, [
      new Promise((resolve, reject) => setTimeout(() => {
        const promise = pending.get(idName);
        promise.push(resolve, reject);
        delayQuery(chain);
      }, 0))
    ]);
  }

  return pending.get(idName)[0];
}
