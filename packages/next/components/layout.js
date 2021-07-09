import styled from "styled-components";

import Background from "./background";
import Header from "components/header";
import Main from "components/main";
import Footer from "components/footer";
import Toast from "components/toast";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout({ children }) {
  return (
    <>
      <Background />
      <Wrapper>
        <Header />
        <Main>{children}</Main>
        <Footer />
        <Toast />
      </Wrapper>
    </>
  );
}
