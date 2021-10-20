import styled from "styled-components";

import JsonDisplay from "./jsonDisplay";

const Wrapper = styled.div``;

const Divider = styled.div`
  margin: 18px 24px;
  background: #f8f8f8;
  height: 1px;
`;

const Title = styled.div`
  padding: 8px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const JsonDisplayWrapper = styled.div`
  padding: 8px 24px;
`;

export default function JsonAttributes({ title, data, type }) {
  return (
    <Wrapper>
      <Divider />
      <Title>{title}</Title>
      <JsonDisplayWrapper>
        <JsonDisplay data={data} type={type} />
      </JsonDisplayWrapper>
    </Wrapper>
  );
}
