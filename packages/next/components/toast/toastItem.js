import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { removeToast } from "store/reducers/toastSlice";
import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  padding: 12px 16px;
  background: #ffffff;
  ${card_border};
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const ToastItem = ({ type, message, id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 2000);
  });

  if (!message) return null;
  return (
    <Wrapper>
      <img src={`/imgs/icons/toast-${type}.svg`} alt="icon" />
      <div>{message}</div>
    </Wrapper>
  );
};

export default ToastItem;
