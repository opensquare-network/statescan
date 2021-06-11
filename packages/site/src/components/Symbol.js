import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export default function Symbol() {
  return (
    <Wrapper>
      <Icon src="/imgs/icons/default.svg" />
      OSN
    </Wrapper>
  );
}
