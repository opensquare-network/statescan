import styled from "styled-components";
import Background from "./background";
import Header from "components/header";
import Main from "components/main";
import Footer from "components/footer";
import Toast from "components/toast";
import { createGlobalStyle } from "styled-components";
import { useTheme } from "utils/hooks";

const GlobalStyle = createGlobalStyle`
  #nprogress .bar {
    background: ${(p) => p.thmeColor};
  }

  #nprogress .peg {
    box-shadow: 0 0 10px ${(p) => p.thmeColor}, 0 0 5px ${(p) => p.thmeColor};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout({ node, children }) {
  const theme = useTheme();

  return (
    <>
      <GlobalStyle thmeColor={theme.color} />
      <Background />
      <Wrapper>
        <Header node={node} />
        <Main>{children}</Main>
        <Footer />
        <Toast />
      </Wrapper>
    </>
  );
}
