import Link from "next/link";
import styled from "styled-components";
import { useTheme } from "utils/hooks";

const Wrapper = styled.span`
  cursor: pointer;
  :hover {
    color: ${(p) => p.color};
    * {
      color: ${(p) => p.color};
    }
  }
`;

export default function SymbolLink({ children, assetId, destroyedAt = null, createdAt = null }) {
  const theme = useTheme();
  return assetId !== null && assetId !== undefined ? (
    <Wrapper color={theme.color}>
      <Link href={`/asset/${assetId}${destroyedAt ? `_${createdAt.blockHeight}` : ""}`} passHref>
        {children}
      </Link>
    </Wrapper>
  ) : (
    <>{children}</>
  );
}
