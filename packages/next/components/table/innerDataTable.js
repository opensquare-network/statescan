import styled, { css } from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0px;
  border-radius: 4px;
`;

const StyledTr = styled.tr`
  :last-child {
    > td {
      border-width: 1px 1px 1px 0px;
      :first-child {
        border-width: 1px 1px 1px 1px;
      }
    }
  }
`;

const StyledTd = styled.td`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;

  padding: 14px 24px !important;
  height: 48px;
  border-style: solid;
  border-width: 1px 1px 0 0;
  border-color: #eeeeee;
  background-color: #ffffff;

  :first-child {
    border-width: 1px 1px 0 1px;
  }
`;

export default function InnerDataTable({ data }) {
  return (
    <StyledTable>
      {Object.keys(data).map((fieldName) => {
        const fieldValue = data[fieldName];

        let content = null;
        if (Array.isArray(fieldValue)) {
          content = fieldValue.map((val) => <div>{val}</div>);
        } else if (typeof fieldValue === "object") {
          content = JSON.stringify(data[fieldName], null, 2);
        } else {
          content = fieldValue;
        }

        return (
          <StyledTr>
            <StyledTd style={{ whiteSpace: "nowrap", width: 160 }}>
              {fieldName}
            </StyledTd>
            <StyledTd>{content}</StyledTd>
          </StyledTr>
        );
      })}
    </StyledTable>
  );
}
