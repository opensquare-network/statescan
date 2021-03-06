import styled, { css } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import ArrowLeft from "./arrow-left.svg";
import ArrowRight from "./arrow-right.svg";
import { encodeURIQuery, calcPagination } from "../../utils";
import { useTheme } from "utils/hooks";
import { PAGE_OFFSET } from "utils/constants";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

const Nav = styled.a`
  cursor: pointer;
  width: 30px;
  height: 28px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    stroke-opacity: 0.65;
  }
  :hover {
    background: #f4f4f4;
    > svg {
      stroke-opacity: 1;
    }
  }
  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;
      background: #fafafa !important;
      > svg {
        stroke-opacity: 0.35 !important;
      }
    `}
`;

const Item = styled.a`
  padding: 0 8px;
  cursor: pointer;
  min-width: 30px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  :hover {
    background: #f4f4f4;
    color: #111111;
  }
  ${(p) =>
    p.active &&
    css`
      background: ${(p) => p.themecolorSecondary} !important;
      color: ${(p) => p.themecolor} !important;
      cursor: auto;
    `}
`;

const Ellipsis = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  & + & {
    display: none;
  }
`;

export default function Pagination({ page, pageSize, total }) {
  const router = useRouter();
  const theme = useTheme();

  const {
    page: newPage,
    totalPages,
    prevPage,
    nextPage,
  } = calcPagination({
    offset: PAGE_OFFSET,
    page,
    pageSize,
    total,
  });

  page = newPage;

  return (
    <Wrapper>
      <Link
        href={`${router.pathname}?${encodeURIQuery({
          ...router.query,
          page: prevPage,
        })}`}
        passHref
      >
        <Nav disabled={page === 1}>
          <ArrowLeft />
        </Nav>
      </Link>

      {Array.from(Array(totalPages)).map((_, index) =>
        index + 1 !== 1 &&
        index + 1 !== totalPages &&
        Math.abs(index + 1 - page) >= 2 ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <Link
            key={index}
            href={`${router.pathname}?${encodeURIQuery({
              ...router.query,
              page: index + 1 + 1 - PAGE_OFFSET,
            })}`}
            passHref
          >
            <Item
              active={page === index + 1}
              themecolor={theme.color}
              themecolorSecondary={theme.colorSecondary}
            >
              {index + 1}
            </Item>
          </Link>
        )
      )}
      <Link
        href={`${router.pathname}?${encodeURIQuery({
          ...router.query,
          page: nextPage,
        })}`}
        passHref
      >
        <Nav disabled={page === totalPages}>
          <ArrowRight />
        </Nav>
      </Link>
    </Wrapper>
  );
}
