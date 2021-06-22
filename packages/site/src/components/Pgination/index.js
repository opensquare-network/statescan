import styled, { css } from "styled-components";

import { ReactComponent as ArrowLeft } from "./arrow-left.svg";
import { ReactComponent as ArrowRight } from "./arrow-right.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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
    `}
`;

const PAGE_OFFSET = 1;

export default function Pagination({ page, pageSize, total, setPageNum }) {
  page = page + PAGE_OFFSET;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Wrapper>
      <Nav>
        <ArrowLeft />
      </Nav>
      {Array.from(Array(totalPages)).map((_, index) => (
        <Item active={page === index + 1}>{index + 1}</Item>
      ))}
      <Nav>
        <ArrowRight />
      </Nav>
    </Wrapper>
  );
}
