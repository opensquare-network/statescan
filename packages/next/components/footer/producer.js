import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
`;

export default function Producer() {
  return (
    <Wrapper>
      <Text>{`© ${new Date().getFullYear()} statemint`}</Text>
      <Text>·</Text>
      <Text>Powered by</Text>
      <img src="/imgs/logo-opensquare.svg" alt="opensquare" />
    </Wrapper>
  );
}
