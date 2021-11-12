import styled from "styled-components";
import { addressEllipsis, time } from "../../utils";
import Address from "../address";
import NftInfo from "../nftInfo";
import SquareBoxComponent from "../squareBox";
import NFTImage from "./NFTImage";

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

  a {
    margin-top: 8px;
    width: 100%;
    border-radius: 8px;
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


export default function Preview({NFT, IpfsMeta}) {
  return <Wrapper>
    <div style={{width: "100%", marginBottom: "24px"}}>
      <SquareBoxComponent>
        <NFTImage ipfsMataData={IpfsMeta}/>
      </SquareBoxComponent>
    </div>

    <NftInfo
      data={{
        title: IpfsMeta?.name ?? "[Unrecognized]",
        description: IpfsMeta?.description ?? "-",
      }}
    />

    <Row>
      <Field>Created Time</Field>
      <Value>{time(NFT?.indexer?.blockTime)}</Value>
    </Row>

    <Row>
      <Field>Owner</Field>
      <Value><Address address={addressEllipsis(NFT?.details?.owner)}/></Value>
    </Row>

    {
      NFT?.details?.instances > -1 && <Row>
        <Field>Instance</Field>
        <Value>{NFT?.details?.instances}</Value>
      </Row>
    }

    {
      NFT?.instanceId ?
        <a href={`/nft/classes/${NFT?.classId}/instances/${NFT.instanceId}`}>Detail</a> :
        <a href={`/nft/classes/${NFT?.classId}`}>Detail</a>
    }
  </Wrapper>
}
