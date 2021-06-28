import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./components/Layout";
import Root from "./components/Root";
import Toast from "./components/Toast/index";
import { nodeSelector, setStoredOrDefaultNode } from "store/reducers/nodeSlice";
import { connect } from "services/websocket";

axios.defaults.baseURL =
  process.env.REACT_APP_REQUEST_URL || "http://localhost:3213/";

const queryClient = new QueryClient();

function App() {
  const node = useSelector(nodeSelector);
  connect(node);

  const dispatch = useDispatch();
  dispatch(setStoredOrDefaultNode());

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Root />
          </Route>
          <Route path="/:node">
            <Layout />
          </Route>
          <Redirect to="/404" />
        </Switch>
      </Router>
      <Toast />
    </QueryClientProvider>
  );
}

export default App;
