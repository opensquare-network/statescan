import InLink from "../inLink";

export default function NftLink({ nftClass, nftInstance, children }) {
  if (!nftClass) return null;

  if (nftInstance) {
    // NFT instance link
    const isDestroyed = nftClass.isDestroyed || nftInstance.isDestroyed;
    const classId = isDestroyed
      ? `${nftClass.classId}_${nftClass.indexer.blockHeight}`
      : nftClass.classId;
    const instanceId = isDestroyed
      ? `${nftInstance.instanceId}_${nftInstance.indexer.blockHeight}`
      : nftInstance.instanceId;
    return (
      <InLink
        to={`/nft/class/${classId}/instance/${instanceId}`}
      >{children}</InLink>
    );
  } else {
    // NFT class link
    const isDestroyed = nftClass.isDestroyed;
    const classId = isDestroyed
      ? `${nftClass.classId}_${nftClass.indexer.blockHeight}`
      : nftClass.classId;
    return (
      <InLink
        to={`/nft/class/${classId}`}
      >{children}</InLink>
    );
  }
}
