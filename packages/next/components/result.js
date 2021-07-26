import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  > span {
    padding-top: 2px;
  }
`;

export default function Result({ isSuccess }) {
  return (
    <Wrapper>
      <img
        src={isSuccess ? "/imgs/icons/success.svg" : "/imgs/icons/failure.svg"}
        alt="icon"
      />
      <span>{isSuccess ? "Success" : "Failure"}</span>
    </Wrapper>
  );
}
