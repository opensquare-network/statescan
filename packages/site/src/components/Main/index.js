import styled from "styled-components";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";

import Container from "components/Container";
import Home from "components/Home";
import Assets from "components/Assets";

const Wrapper = styled.main`
  flex-grow: 1;
  margin-top: 32px;
`;

export default function Main() {
  let { path } = useRouteMatch();

  return (
    <Wrapper>
      <Container>
        <Switch>
          <Route exact path={path}>
            <Home />
          </Route>
          <Route exact path={`${path}/block/:id`}>
            <div>block</div>
          </Route>
          <Route exact path={`${path}/extrinsic/:id`}>
            <div>extrinsic</div>
          </Route>
          <Route exact path={`${path}/address/:id`}>
            <div>address</div>
          </Route>
          <Route exact path={`${path}/assets`}>
            <Assets />
          </Route>
          <Route exact path={`${path}/asset/:id`}>
            <div>asset</div>
          </Route>
          <Redirect to="/" />
        </Switch>
      </Container>
    </Wrapper>
  );
}
