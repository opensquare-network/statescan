const { extractAuthor } = require("@polkadot/api-derive/type/util");
const { getApi } = require("../api");

async function getBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const [block, events, validators] = await Promise.all([
    api.rpc.chain.getBlock(blockHash),
    api.query.system.events.at(blockHash),
    api.query.session.validators.at(blockHash),
  ]);

  const digest = api.registry.createType(
    "Digest",
    block.block.header.digest,
    true
  );
  const author = extractAuthor(digest, validators);

  return {
    block,
    events,
    author,
  };
}

module.exports = {
  getBlockFromNode,
};
