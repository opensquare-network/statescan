import styled from "styled-components";

import {
  h4_24_bold,
  text_dark_major,
  text_dark_minor,
} from "../styles/textStyles";

const Wrapper = styled.div`
  padding-left: 24px;
  margin-top: 24px;
  ${text_dark_minor};

  .title {
    ${h4_24_bold};
    ${text_dark_major};
  }
  .content {
    margin-top: 16px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: rgba(17, 17, 17, 0.65);
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
      <Divider className="divider" />
    </>
  );
}
