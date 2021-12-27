const { findBlockApi, getApi } = require("@statescan/common");
const { extractAuthor } = require("@polkadot/api-derive/type/util");

async function getBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const blockApi = await findBlockApi(blockHash);

  const promises = [
    api.rpc.chain.getBlock(blockHash),
    blockApi.query.system.events(),
  ];

  if (blockApi.query.session?.validators) {
    promises.push(blockApi.query.session.validators());
  }

  const [block, events, validators] = await Promise.all(promises);

  let author = null;
  if (validators) {
    const digest = api.registry.createType(
      "Digest",
      block.block.header.digest,
      true
    );

    author = extractAuthor(digest, validators);
  }

  return {
    block,
    events,
    author,
  };
}

module.exports = {
  getBlockFromNode,
};
