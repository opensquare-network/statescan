import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  > :not(:first-child) {
    margin-left: 8px;
  }

  @media screen and (max-width: 600px) {
    justify-content: center;
    flex-wrap: wrap;
    div {
      flex-wrap: nowrap;
    }
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
      <Wrapper>
        <Text>{`© ${new Date().getFullYear()} Statescan`}</Text>
        <Text>·</Text>
        <Text>Powered by</Text>
        <a href="https://www.opensquare.network/" target="_blank" rel="noreferrer">
          <img src="/imgs/logo-opensquare.svg" alt="opensquare" />
        </a>
      </Wrapper>
      <Wrapper>
        <Text>· &nbsp;Funded by</Text>
        <a href="https://kusama.network/" target="_blank" rel="noreferrer">
          <img src="/imgs/logo-kusamadotreasury.svg" alt="kusama dotreasury" />
        </a>
      </Wrapper>
    </Wrapper>
  );
}
