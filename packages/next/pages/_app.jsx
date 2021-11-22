import { useEffect } from "react";
import { Provider } from "react-redux";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";
import { store } from "../store";
import { useNode } from "utils/hooks";

import "semantic-ui-css/semantic.min.css";
import "nprogress/nprogress.css";
import "styles/globals.css";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", (url, { shallow }) => !shallow && NProgress.start());
Router.events.on("routeChangeComplete", (url, { shallow }) => !shallow && NProgress.done());
Router.events.on("routeChangeError", (url, { shallow }) => !shallow && NProgress.done());

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
        <title>Kusama & Polkadot Asset Explorer</title>
        <meta
          name="description"
          content="Statescan allows you to explorer and search the Kusama | Polkadot blockchain for assets."
        />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
