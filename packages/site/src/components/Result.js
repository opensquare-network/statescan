import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

export default function Result({ isSuccess }) {
  return (
    <Wrapper>
      <img
        src={isSuccess ? "/imgs/icons/success.svg" : "/imgs/icons/failure.svg"}
        alt="icon"
      />
      {isSuccess ? "Success" : "Failure"}
    </Wrapper>
  );
}
