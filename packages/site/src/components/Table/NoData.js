import styled, { css } from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  height: 113px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
  ${(p) =>
    p.isCollapse &&
    css`
      height: 192px !important;
    `}
`;

export default function NoData({ isCollapse }) {
  return (
    <Wrapper isCollapse={isCollapse}>Opps, there is no data here.</Wrapper>
  );
}
