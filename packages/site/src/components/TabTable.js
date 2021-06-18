import styled from "styled-components";

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  > :not(:first-child) {
    margin-left: 40px;
  }
`;

const Tab = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const TabText = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
`;

const TabTag = styled.div`
  padding: 1px 8px;
  background: #fee4ef;
  border-radius: 16px;
  font-size: 12px;
  line-height: 16px;
  color: #f22279;
  font-weight: bold;
`;

export default function TabTable({ data }) {
  return (
    <div>
      <TabWrapper>
        {(data || []).map((item, index) => (
          <Tab key={index}>
            <TabText>{item.name}</TabText>
            <TabTag>{item.total}</TabTag>
          </Tab>
        ))}
      </TabWrapper>
    </div>
  );
}
