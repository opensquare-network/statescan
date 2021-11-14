import styled from "styled-components";
import { addressEllipsis, time } from "../../utils";
import Address from "../address";
import NftInfo from "../nftInfo";
import SquareBoxComponent from "../squareBox";
import NFTImage from "./NFTImage";
import { Button } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  > div {
    padding: 0;
  }

  img {
    object-fit: contain;
  }

  .divider {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`

const Row = styled.div`
  margin-bottom: 16px;
  width: 50%;
`

const Field = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`

const Value = styled.div`
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
`

const ButtonWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  button {
    all: unset;
    border: 1px solid #DDDDDD;
  }
  a{
    border: 1px solid #000000;
  }
  button, a {
    cursor: pointer;
    border-radius: 8px;
    text-align: center;
    width: 230px;
    height: 42px;
  }
`

export default function Preview({ nftClass, nftInstance, closeFn }) {
  const nftObject = nftInstance ?? nftClass;
  const ipfsMetadata = nftInstance?.ipfsMetadata ?? nftClass?.ipfsMetadata;

  return <Wrapper>
    <div style={{width: "100%", marginBottom: "24px"}}>
      <SquareBoxComponent>
        <NFTImage ipfsMataData={ipfsMetadata}/>
      </SquareBoxComponent>
    </div>

    <NftInfo
      data={{
        title: ipfsMetadata?.name ?? "[Unrecognized]",
        description: ipfsMetadata?.description ?? "-",
      }}
    />

    <Row>
      <Field>Created Time</Field>
      <Value>{time(nftObject?.indexer?.blockTime)}</Value>
    </Row>

    <Row>
      <Field>Owner</Field>
      <Value><Address address={addressEllipsis(nftObject?.details?.owner)}/></Value>
    </Row>

    {
      !nftInstance && <Row>
        <Field>Instance</Field>
        <Value>{nftClass?.details?.instances}</Value>
      </Row>
    }

    <ButtonWrapper>
      <button onClick={closeFn}>Close</button>
      {
        nftInstance ?
          <a href={`/nft/classes/${nftInstance?.classId}/instances/${nftInstance.instanceId}`}>Detail</a> :
          <a href={`/nft/classes/${nftClass?.classId}`}>Detail</a>
      }
    </ButtonWrapper>
  </Wrapper>
}
