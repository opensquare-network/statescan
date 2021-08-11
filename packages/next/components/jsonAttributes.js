import styled from "styled-components";
import InnerDataTable from "components/table/innerDataTable";

const Wrapper = styled.div``;

const Divider = styled.div`
  margin: 18px 24px;
  background: #f8f8f8;
  height: 1px;
`;

const Title = styled.div`
  padding: 8px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const TableDataItem = styled.pre`
  background: #fafafa;
  border-radius: 4px;
  margin: 8px 24px 16px;
  padding: 32px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Inter";
  overflow-x: auto;
`;

export default function JsonAttributes({ title, data }) {
  return (
    <Wrapper>
      <Divider />
      <Title>{title}</Title>
      <TableDataItem>
        <InnerDataTable data={data} />
      </TableDataItem>
    </Wrapper>
  );
}
