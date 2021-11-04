import { addressEllipsis, time } from "../../utils";
import Address from "../address";
import NftInfo from "../nftInfo";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  
  > div{
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
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
`

export default function Preview({NFTClass}) {
  console.log(NFTClass.details)
  return <Wrapper>
    <img
      src={`https://ipfs-sh.decoo-cloud.cn/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
      width={480} alt=""/>

    <NftInfo
      data={{
        title: NFTClass?.ipfsMetadata?.name ?? "Unrecognized",
        description:
          NFTClass?.ipfsMetadata?.description ?? "Unrecognized",
      }}
    />

    <Row>
      <Field>Created Time</Field>
      <Value>{time(NFTClass.indexer.blockTime)}</Value>
    </Row>

    <Row>
      <Field>Owner</Field>
      <Value><Address address={addressEllipsis(NFTClass?.details?.owner)}/></Value>
    </Row>

    <Row>
      <Field>Instance</Field>
      <Value>{NFTClass?.details?.instances}</Value>
    </Row>

    <a href={`/nft/classes/${NFTClass?.classId}`}>Detail</a>
  </Wrapper>
}
