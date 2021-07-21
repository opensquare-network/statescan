import styled from "styled-components";
import { useSelector } from "react-redux";
import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { themeSelector } from "store/reducers/themeSlice";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  cursor: pointer;
`;

export default function AddressEllipsis({ address, to }) {
  const theme = useSelector(themeSelector);

  return (
    <Tooltip content={address} isCopy>
      {to ? (
        <Link href={to} passHref>
          <MonoText>
            <StyledLink themecolor={theme.color}>
              {addressEllipsis(address)}
            </StyledLink>
          </MonoText>
        </Link>
      ) : (
        <MonoText>
          <StyledLink themecolor={theme.color}>
            {addressEllipsis(address)}
          </StyledLink>
        </MonoText>
      )}
    </Tooltip>
  );
}
