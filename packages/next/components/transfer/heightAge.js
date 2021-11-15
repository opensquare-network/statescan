import InLink from "../inLink";
import MinorText from "../minorText";
import { timeDuration } from "../../utils";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 240px;
  height: 72px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Link = styled.span`
  font-weight: 600;
`;

export default function HeightAge({
  age,
  isEvent,
  blockHeight,
  extrinsicIndex,
}) {
  return (
    <Wrapper>
      <img src="/imgs/icons/transfer.svg" alt="" />
      <FlexWrapper style={{ width: 160, marginLeft: 16 }}>
        {isEvent ? (
          <InLink to={`/block/${blockHeight}`}>
            <Link>{blockHeight.toLocaleString()}</Link>
          </InLink>
        ) : (
          <InLink to={`/extrinsic/${blockHeight}-${extrinsicIndex}`}>
            <Link>{`${blockHeight.toLocaleString()}-${extrinsicIndex}`}</Link>
          </InLink>
        )}
        <FlexWrapper style={{ width: 160, marginTop: 4 }}>
          <img
            src="/imgs/icons/check-green.svg"
            alt=""
            style={{ marginRight: 6 }}
            width={16}
          />
          <MinorText>{timeDuration(age)}</MinorText>
        </FlexWrapper>
      </FlexWrapper>
    </Wrapper>
  );
}
