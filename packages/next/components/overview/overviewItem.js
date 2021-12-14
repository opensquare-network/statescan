import styled from "styled-components";

import InLink from "components/inLink";
import { useTheme } from "utils/hooks";
import Tooltip from "components/tooltip";

const Wrapper = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #f8f8f8 0%, rgba(248, 248, 248, 0) 100%);
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  margin-left: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: flex-start;
  height: 16px;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const Title = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

const Text = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: #111111;
  margin: 0;
  :hover {
    color: ${(p) => p.themecolor};
    > :not(:first-child) {
      color: ${(p) => p.themecolor};
    }
  }
  > :not(:first-child) {
    margin-left: 4px;
    color: rgba(17, 17, 17, 0.35);
  }
`;

export default function OverviewItem({
  title,
  text,
  textSec,
  icon,
  link,
  tip,
}) {
  const theme = useTheme();

  return (
    <Wrapper>
      <IconWrapper>
        <img src={`/imgs/icons/${icon}`} alt="" />
      </IconWrapper>
      <ContentWrapper>
        <TitleWrapper>
          <Title>{title}</Title>
          {tip && (
            <Tooltip content={tip}>
              <img src="/imgs/icons/circled-info.svg" alt="" />
            </Tooltip>
          )}
        </TitleWrapper>
        {link ? (
          <InLink to={link}>
            <Text themecolor={theme.color}>
              <span>{text}</span>
              {textSec && (
                <>
                  <span>/</span>
                  <span>{textSec}</span>
                </>
              )}
            </Text>
          </InLink>
        ) : (
          <Text>
            <span>{text}</span>
            {textSec && (
              <>
                <span>/</span>
                <span>{textSec}</span>
              </>
            )}
          </Text>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}
