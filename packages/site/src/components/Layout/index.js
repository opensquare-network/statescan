import styled from "styled-components";

import Header from "components/Header";
import Main from "components/Main";
import Footer from "components/Footer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
`;

export default function Layout() {
  return (
    <Wrapper>
      <Header />
      <Main />
      <Footer />
    </Wrapper>
  );
}
