import ReactJson from "react-json-view";
import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid #eeeeee;
  background-color: #ffffff;
  padding: 16px;
  overflow-x: auto;
`;

export default function JsonView({ src }) {
  return (
    <Wrapper>
      <ReactJson
        src={src}
        theme="bright:inverted"
        iconStyle="circle"
        enableClipboard={false}
        collapseStringsAfterLength={false}
        displayDataTypes={false}
        name={false}
      />
    </Wrapper>
  );
}
