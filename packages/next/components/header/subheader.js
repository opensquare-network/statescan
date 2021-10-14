import { useState, useEffect } from "react";
import styled from "styled-components";
import { nodes } from "utils/constants";
import SearchL from "components/search/search-l";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 40px 0 16px;

  > :not(:first-child) {
    margin-top: 32px;
  }

  @media screen and (max-width: 900px) {
    align-items: stretch;
    margin: 24px 0 0;
    > :not(:first-child) {
      margin-top: 24px;
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  color: #111111;
  margin: 0;
  white-space: nowrap;
  @media screen and (max-width: 900px) {
    font-size: 24px;
    line-height: 24px;
  }
`;

export default function Subheader({ node }) {
  const [name, setName] = useState();

  useEffect(() => {
    setName(nodes.find((item) => item.value === node)?.name);
  }, [node]);

  return (
    <Container>
      <Wrapper>
        <Title>{name} Explorer</Title>
        <SearchL node={node} />
      </Wrapper>
    </Container>
  );
}
