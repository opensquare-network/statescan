import styled from "styled-components";

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 16px 0px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Head = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 24px;
  flex-basis: 320px;
`;

const Data = styled.div`
  font-size: 14px;
  line-height: 20px;
  padding: 10px 24px;
  flex-grow: 1;
`;

const LoadingItem = styled.div`
  background: #fafafa;
  border-radius: 4px;
  height: 20px;
  flex-grow: 1;
  margin: 10px 24px;
`;

export default function DetailTable({ head, body, loading }) {
  return (
    <Wrapper>
      {(head || []).map((item, index) => (
        <Item key={index}>
          <Head>{item}</Head>
          {loading ? <LoadingItem /> : <Data>{body?.[index]}</Data>}
        </Item>
      ))}
    </Wrapper>
  );
}
