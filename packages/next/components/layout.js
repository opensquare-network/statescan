import styled from "styled-components";
import { useDispatch } from "react-redux";

import Background from "./background";
import Header from "components/header";
import Main from "components/main";
import Footer from "components/footer";
import Toast from "components/toast";
import {
  nodes,
  DEFAULT_THEME_COLOR,
  DEFAULT_THEME_COLOR_SECONDARY,
  DEFAULT_THEME_BUTTON_COLOR,
  DEFAULT_THEME_LOGO,
} from "utils/constants";
import { setTheme } from "store/reducers/themeSlice";
import { createGlobalStyle } from "styled-components";

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
  const dispatch = useDispatch();
  const nodeConfig = (nodes || []).find((item) => item.value === node);
  const color = nodeConfig?.color ?? DEFAULT_THEME_COLOR;
  const colorSecondary =
    nodeConfig?.colorSecondary ?? DEFAULT_THEME_COLOR_SECONDARY;
  const buttonColor = nodeConfig?.buttonColor ?? DEFAULT_THEME_BUTTON_COLOR;
  const logo = nodeConfig?.logo ?? DEFAULT_THEME_LOGO;
  dispatch(
    setTheme({
      color,
      colorSecondary,
      buttonColor,
      logo,
    })
  );

  return (
    <>
      <GlobalStyle thmeColor={color} />
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
