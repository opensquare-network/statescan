import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 113px;
  padding: 42px 0 42px 0;
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
    <Wrapper isCollapse={isCollapse}>
      <div>
        <img src="/imgs/icons/nodata.svg" alt="" />
      </div>
      <p>No data</p>
    </Wrapper>
  );
}
