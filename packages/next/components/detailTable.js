import { Fragment } from "react";
import styled from "styled-components";
import { useTheme } from "utils/hooks";

import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  background: #ffffff;
  ${card_border};
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

export default function DetailTable({ head, badge, body, foot, info }) {
  const theme = useTheme();

  return (
    <Wrapper>
      {info}
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
