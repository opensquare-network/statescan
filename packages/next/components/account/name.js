import styled from "styled-components";

const Text = styled.span`
  display: block;
  width: 152px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default function Name({ name }) {
  return <Text title={name}>{name}</Text>;
}
