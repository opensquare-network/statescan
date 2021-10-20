import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  margin-top: 4px;
  max-height: 292px;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  height: 200px;
  z-index: 99;
`;

export default function SearchHints({ hints, focus }) {
  if (!focus) return null;

  return <Wrapper>search hints</Wrapper>;
}
