import styled, { css } from "styled-components";
import { useTheme } from "utils/hooks";

const Name = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  ${(props) =>
    props.unrecognized
      ? css`
          color: #111111;
        `
      : css`
          color: rgba(17, 17, 17, 0.65);
        `};
  :hover {
    color: ${(props) => props.color ?? "inherit"};
  }
`;

export default function NftName({ name }) {
  const theme = useTheme();

  return (
    <Name color={theme?.color} unrecognized={name}>
      {name || "[Unrecognized]"}
    </Name>
  );
}
