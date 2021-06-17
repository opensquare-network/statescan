import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

import store from "store";
import Layout from "./components/Layout";
import Root from "./components/Root";

axios.defaults.baseURL =
  process.env.REACT_APP_REQUEST_URL || "http://localhost:3213/";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Root />
            </Route>
            <Route path="/:node">
              <Layout />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
