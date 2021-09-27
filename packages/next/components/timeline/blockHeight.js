import styled from "styled-components";
import { p_12_normal, text_dark_minor } from "../../styles/textStyles";
import BlockIcon from "../../public/imgs/icons/simpleBlock.svg";

const Wrapper = styled.p`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  ${p_12_normal};
  ${text_dark_minor};
  svg {
    margin-right: 4px;
  }
`;

export default function BlockHeight({ height }) {
  if (!height) {
    return null;
  }
  return (
    <Wrapper>
      <BlockIcon />
      {height}
    </Wrapper>
  );
}
