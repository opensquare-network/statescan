import styled, { css } from "styled-components";

const Name = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  word-break: break-all;
  ${(props) =>
    props.unrecognized
      ? css`
          color: #111111;
        `
      : css`
          color: rgba(17, 17, 17, 0.65);
        `};
  :hover {
    color: inherit;
  }
`;

export default function NftName({ name }) {
  return (
    <Name unrecognized={name}>
      {name || "[Unrecognized]"}
    </Name>
  );
}
