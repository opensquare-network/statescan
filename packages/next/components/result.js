import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

export default function Result({ isSuccess, noText = false }) {
  return (
    <Wrapper>
      <img
        src={isSuccess === undefined || isSuccess === null
              ? "/imgs/icons/unknown.svg"
              : isSuccess
              ? "/imgs/icons/success.svg"
              : "/imgs/icons/failure.svg"}
        alt="icon"
      />
      {!noText && (isSuccess === undefined || isSuccess === null
                    ? "Unknown"
                    : isSuccess
                    ? "Success"
                    : "Failure"
                    )}
    </Wrapper>
  );
}
