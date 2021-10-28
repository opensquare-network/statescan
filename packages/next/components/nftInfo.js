import styled from "styled-components";

import ExternalLink from "./externalLink";
import Tooltip from "./tooltip";
import {
  h4_24_bold,
  text_dark_major,
  text_dark_minor,
} from "../styles/textStyles";

const Wrapper = styled.div`
  padding-left: 40px;
  margin-top: 8px;
  ${text_dark_minor};

  .title {
    ${h4_24_bold};
    ${text_dark_major};
  }

  @media screen and (max-width: 700px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-top: 16px;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f8f8f8;
  margin: 24px 24px 16px;
`;

export default function NftInfo({ data }) {
  // if (!data) return null;
  return (
    <>
      <Wrapper>
        <div className="title">{data?.title}</div>
        {data?.description && (
          <div className="content">{data?.description}</div>
        )}
        {!data?.description && (
          <div className="noinfo">No more description.</div>
        )}
      </Wrapper>
      <Divider />
    </>
  );
}
