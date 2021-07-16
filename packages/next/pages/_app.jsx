import { Provider } from "react-redux";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";

import { store } from "../store";

import "nprogress/nprogress.css";
import "styles/globals.css";
import { useNode } from "utils/hooks";
import { useEffect } from "react";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const node = useNode();
  useEffect(() => {
    if (node) {
      localStorage.setItem("node", node);
    }
  }, [node]);

  return (
    <>
      <Head>
        <title>Kusama | Polkadot Asset Explorer</title>
        <meta
          name="description"
          content="Statescan allows you to explorer and search the Kusama | Polkadot blockchain for assets."
        />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
