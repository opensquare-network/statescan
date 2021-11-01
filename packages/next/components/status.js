import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: inline-block;
  padding: 4px 12px;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  border-radius: 4px;
  ${(p) =>
    css`
      background-color: ${p.bg};
    `};
`;

export default function Status({ status }) {
  if (!status) {
    return null;
  }
  let bg = `#3765DC`;
  switch (status) {
    case "Active":
      bg = `#52CC8A`;
      break;
    case "Frozen":
      break;
    case "Destroyed":
      bg = `#EE4444`;
      break;
    default:
      break;
  }
  return <Wrapper bg={bg}>{status}</Wrapper>;
}
