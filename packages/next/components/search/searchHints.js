import styled from "styled-components";
import Link from "next/link";

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  margin-top: 4px;
  max-height: 292px;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  z-index: 99;
  overflow-y: auto;
`;

const Title = styled.div`
  padding: 8px 16px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

const BlockItem = styled.div`
  min-height: 48px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  cursor: pointer;
  :hover {
    background-color: #fafafa;
  }
`;

const BlockWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const AssetItem = styled.div`
  min-height: 48px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;
  :hover {
    background-color: #fafafa;
  }
`;

const AssetWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  flex-basis: 112px;
  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const AssetName = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
`;

const IndexWrapper = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  margin-left: auto;
`;

export default function SearchHints({ hints, focus }) {
  if (!focus) return null;
  if (!hints || (hints.assets?.length === 0 && hints.blocks?.length === 0))
    return null;

  return (
    <Wrapper>
      {hints.blocks?.length > 0 && (
        <>
          <Title>BLOCKS</Title>
          {hints.blocks.map((item, index) => (
            <Link href={`/block/${item.header?.number}`} key={index} passHref>
              <BlockItem>
                <BlockWrapper>
                  <img src="/imgs/icons/latest-blocks.svg" alt="" />
                  <div>Block</div>
                </BlockWrapper>
                <IndexWrapper>{`#${item.header?.number}`}</IndexWrapper>
              </BlockItem>
            </Link>
          ))}
        </>
      )}
      {hints.assets?.length > 0 && (
        <>
          <Title>ASSETS</Title>
          {hints.assets.map((item, index) => (
            <Link href={`/asset/${item.assetId}`} key={index} passHref>
              <AssetItem>
                <AssetWrapper>
                  <img src="/imgs/token-icons/unknown.svg" alt="" />
                  <div>{item.symbol}</div>
                </AssetWrapper>
                <AssetName>{item.name}</AssetName>
                <IndexWrapper>{`#${item.assetId}`}</IndexWrapper>
              </AssetItem>
            </Link>
          ))}
        </>
      )}
    </Wrapper>
  );
}
