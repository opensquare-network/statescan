import styled from "styled-components";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";

import Container from "components/Container";
import Home from "components/Home";
import Block from "components/Block";
import Extrinsic from "components/Extrinsic";
import Address from "components/Address";
import Assets from "components/Assets";
import Asset from "components/Asset";

const Wrapper = styled.main`
  flex-grow: 1;
  margin-top: 24px;
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
            <Block />
          </Route>
          <Route exact path={`${path}/extrinsic/:id`}>
            <Extrinsic />
          </Route>
          <Route exact path={`${path}/address/:id`}>
            <Address />
          </Route>
          <Route exact path={`${path}/assets`}>
            <Assets />
          </Route>
          <Route exact path={`${path}/asset/:id`}>
            <Asset />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Container>
    </Wrapper>
  );
}
