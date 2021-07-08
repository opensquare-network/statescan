import { Provider } from "react-redux";

import App from "./app";
import store from "store";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <App>
        <Component {...pageProps} />
      </App>
    </Provider>
  );
}

export default MyApp;
