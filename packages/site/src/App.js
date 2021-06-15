import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import store from "store";
import Layout from "./components/Layout";
import Redirect from "./components/Redirect";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect />
          </Route>
          <Route exact path="/:node">
            <Layout />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
