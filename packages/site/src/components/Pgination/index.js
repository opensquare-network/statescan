import styled, { css } from "styled-components";

import { ReactComponent as ArrowLeft } from "./arrow-left.svg";
import { ReactComponent as ArrowRight } from "./arrow-right.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

const Nav = styled.div`
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

const Item = styled.div`
  cursor: pointer;
  width: 30px;
  height: 28px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  :hover {
    background: #f4f4f4;
    color: #111111;
  }
  ${(p) =>
    p.active &&
    css`
      background: #fee4ef !important;
      color: #f22279 !important;
      cursor: auto;
    `}
`;

const Ellipsis = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  & + & {
    display: none;
  }
`;

const PAGE_OFFSET = 1;

export default function Pagination({ page, pageSize, total, setPage }) {
  page = page + PAGE_OFFSET;
  const totalPages = Math.ceil(total / pageSize)
    ? Math.ceil(total / pageSize)
    : 1;

  const prePage = () => {
    if (page === 1) return;
    setPage(page - 1 - PAGE_OFFSET);
  };

  const nextPage = () => {
    if (page === totalPages) return;
    setPage(page + 1 - PAGE_OFFSET);
  };

  return (
    <Wrapper>
      <Nav disabled={page === 1} onClick={prePage}>
        <ArrowLeft />
      </Nav>
      {Array.from(Array(totalPages)).map((_, index) =>
        index + 1 !== 1 &&
        index + 1 !== totalPages &&
        Math.abs(index + 1 - page) >= 2 ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <Item
            onClick={() => {
              if (page === index + 1) return;
              setPage(index + 1 - PAGE_OFFSET);
            }}
            key={index}
            active={page === index + 1}
          >
            {index + 1}
          </Item>
        )
      )}
      <Nav disabled={page === totalPages} onClick={nextPage}>
        <ArrowRight />
      </Nav>
    </Wrapper>
  );
}
