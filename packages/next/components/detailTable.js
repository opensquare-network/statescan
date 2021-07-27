import { Fragment } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { themeSelector } from "store/reducers/themeSlice";

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
  align-items: start;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 24px;
  min-width: 26.7%;
`;

const Badge = styled.div`
  height: 18px;
  margin-left: 8px;
  padding: 1px 8px;
  background: ${(p) => p.themecolorSecondary};
  border-radius: 16px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  color: ${(p) => p.themecolor};
`;

const Data = styled.div`
  font-size: 14px;
  min-height: 36px;
  padding: 0 24px;
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

export default function DetailTable({ head, badge, body, foot }) {
  const theme = useSelector(themeSelector);

  return (
    <Wrapper>
      {(head || []).map((item, index) =>
        body?.[index] === undefined ? (
          <Fragment key={index}></Fragment>
        ) : (
          <Item key={index}>
            <Head title={item}>
              {item}
              {badge?.[index] !== null && badge?.[index] !== undefined && (
                <Badge
                  themecolor={theme.color}
                  themecolorSecondary={theme.colorSecondary}
                >
                  {badge?.[index]}
                </Badge>
              )}
            </Head>
            <Data>{body?.[index]}</Data>
          </Item>
        )
      )}
      {foot && foot}
    </Wrapper>
  );
}
