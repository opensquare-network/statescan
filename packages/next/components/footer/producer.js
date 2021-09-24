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
        <Image
          src="/imgs/logo-opensquare.svg"
          width={118}
          height={20}
          alt="opensquare"
        />
      </Wrapper>
      <Wrapper>
        <Text>· &nbsp;Funded by</Text>
        <Image
          src="/imgs/logo-kusamadotreasury.svg"
          width={130}
          height={20}
          alt="kusama dotreasury"
        />
      </Wrapper>
    </Wrapper>
  );
}
