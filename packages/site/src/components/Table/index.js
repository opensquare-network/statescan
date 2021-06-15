import styled from "styled-components";

const Title = styled.h4`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: #111111;
  margin: 0 0 24px;
`;

const StyledTable = styled.table`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-spacing: 0px;
  border-radius: 8px;
  thead {
    background: #fafafa;
  }
  th {
    padding: 14px 24px;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: rgba(17, 17, 17, 0.35);
    text-align: left;
  }
  tbody {
    margin-top: 8px;
    tr {
      position: relative;
    }
    tr:not(:last-child)::after {
      content: "";
      position: absolute;
      height: 1px;
      background: #fafafa;
      left: 24px;
      right: 24px;
      bottom: 0;
    }
    td {
      padding: 14px 24px;
      font-size: 15px;
      line-height: 20px;
      color: #111111;
    }
  }
  tfoot {
    tr {
      border-top: 1px solid #fafafa;
    }
    td {
      padding: 14px 24px;
      font-size: 15px;
      line-height: 20px;
      color: #111111;
    }
  }
`;

export default function Table({ title, head, data }) {
  return (
    <div>
      {title && <Title>{title}</Title>}
      <StyledTable>
        <thead>
          <tr>
            {head.map((item, index) => (
              <th key={index} style={{ textAlign: item.align ?? "left" }}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data || []).map((item, index) => (
            <tr key={index}>
              {item.map((item, index) => (
                <td
                  key={index}
                  style={{ textAlign: head[index].align ?? "left" }}
                >
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* {data.foot && (
          <tfoot>
            <tr>
              <td colSpan="100%">{data.foot}</td>
            </tr>
          </tfoot>
        )} */}
      </StyledTable>
    </div>
  );
}
