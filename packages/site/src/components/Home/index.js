import styled from "styled-components";

import Overview from "./Overview";

const Wrapper = styled.section`
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

export default function Home() {
  return (
    <Wrapper>
      <Overview />
    </Wrapper>
  );
}
