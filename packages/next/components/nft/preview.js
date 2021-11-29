import { Modal } from "semantic-ui-react";
import styled from "styled-components";
import { addressEllipsis, time } from "../../utils";
import Address from "../address";
import NftInfo from "../nftInfo";
import SquareBoxComponent from "../squareBox";
import NFTImage from "./NFTImage";
import NftLink from "./nftLink";
import { useKeyPress } from "utils/hooks";
import { useEffect } from "react";

const MyModal = styled(Modal)`
  > div {
    box-shadow: none;
    border: none;
  }

  padding: 24px;

  a {
    display: block;
    background-color: #000000;
    font-family: Inter, serif;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 44px;
    color: #ffffff;
    :hover {
      color: #ffffff;
    }
    text-align: center;
  }
`;

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
`;

const Row = styled.div`
  margin-bottom: 16px;
  width: 50%;
`;

const Field = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

const Value = styled.div`
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
`;

const ButtonWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  button {
    all: unset;
    border: 1px solid #dddddd;
  }
  a {
    border: 1px solid #000000;
  }
  button,
  a {
    cursor: pointer;
    border-radius: 8px;
    text-align: center;
    height: 42px;
    flex-grow: 1;
  }
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

export default function Preview({ open, nftClass, nftInstance, closeFn }) {
  const nftObject = nftInstance ?? nftClass;
  const nftMetadata = nftInstance?.nftMetadata ?? nftClass?.nftMetadata;

  const pressEscape = useKeyPress("Escape");

  useEffect(() => {
    if (pressEscape) {
      closeFn();
    }
  }, [pressEscape, closeFn]);

  return (
    <MyModal open={open} size="tiny">
      <Wrapper>
        <div style={{ width: "100%", marginBottom: "24px" }}>
          <SquareBoxComponent background={nftMetadata?.background}>
            <NFTImage nftMetadata={nftMetadata} />
          </SquareBoxComponent>
        </div>

        <NftInfo
          data={{
            title: nftMetadata?.name ?? "[Unrecognized]",
            description: nftMetadata?.description ?? "-",
          }}
        />

        <Row>
          <Field>Created Time</Field>
          <Value>{time(nftObject?.indexer?.blockTime)}</Value>
        </Row>

        <Row>
          <Field>Owner</Field>
          <Value>
            <Address to={`/account/${nftObject?.details?.owner}`} address={addressEllipsis(nftObject?.details?.owner)} />
          </Value>
        </Row>

        {!nftInstance && (
          <Row>
            <Field>Instance</Field>
            <Value>{nftClass?.details?.instances}</Value>
          </Row>
        )}

        <ButtonWrapper>
          <button onClick={closeFn}>Close</button>
          <NftLink nftClass={nftClass} nftInstance={nftInstance}>
            Detail
          </NftLink>
        </ButtonWrapper>
      </Wrapper>
    </MyModal>
  );
}
