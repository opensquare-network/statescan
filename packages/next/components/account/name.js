import styled from "styled-components";


const Text = styled.span`
  display: inline-block;
  width: 152px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export default function Name({name, width = 152}) {
  return <Text>{name}</Text>
}
