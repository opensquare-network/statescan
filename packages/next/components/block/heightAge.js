import InLink from "../inLink";
import MinorText from "../minorText";
import { timeDuration } from "../../utils";
import styled from "styled-components";
import Image from "next/image";

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

export default function HeightAge({ node, height, age, isFinalized = true }) {
  const imgUrl = `/imgs/icons/${
    isFinalized ? "check-green" : "circle-pending"
  }.svg`;

  return (
    <Wrapper>
      <img src="/imgs/icons/block.svg" alt="" />
      <FlexWrapper style={{ width: 160, marginLeft: 16 }}>
        <InLink to={`/block/${height}`}>
          <Link>{height.toLocaleString()}</Link>
        </InLink>
        <FlexWrapper style={{ width: 160, marginTop: 4 }}>
          <img src={imgUrl} alt="" style={{ marginRight: 6 }} width={20} />
          <MinorText>{timeDuration(age)}</MinorText>
        </FlexWrapper>
      </FlexWrapper>
    </Wrapper>
  );
}
