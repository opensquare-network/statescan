import styled from "styled-components";

import Select from "./select";

const Wrapper = styled.div`
  background: #fafafa;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 20px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Total = styled.div`
  white-space: nowrap;
  flex-grow: 1;
  margin-right: 24px;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  :not(:last-child) {
    margin-right: 24px;
  }
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

export default function Filter({ total, data }) {
  return (
    <Wrapper>
      <Total>{total}</Total>
      {(data || []).map((item, index) => (
        <SelectWrapper key={index}>
          <div>{item.name}</div>
          <Select value={item.value} options={item.options} text={item.text} />
        </SelectWrapper>
      ))}
    </Wrapper>
  );
}
