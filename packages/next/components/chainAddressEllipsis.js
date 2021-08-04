import styled, { css } from "styled-components";
import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import ExplorerLink from "./explorerLink";
import { useTheme } from "utils/hooks";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}
`;

export default function AddressEllipsis({ chain, address }) {
  const theme = useTheme();

  return (
    <Tooltip content={address} isCopy>
      <ExplorerLink chain={chain} href={`/account/${address}`}>
        <MonoText>
          <StyledLink themecolor={theme.color} cursor={"true"}>
            {addressEllipsis(address)}
          </StyledLink>
        </MonoText>
      </ExplorerLink>
    </Tooltip>
  );
}
