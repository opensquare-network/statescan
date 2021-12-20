import styled from "styled-components";

import ExternalLink from "./externalLink";
import Tooltip from "./tooltip";
import EditSvg from "public/imgs/icons/edit.svg";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-top: 16px;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f8f8f8;
  margin: 24px 24px 16px;
`;

const LeftWrapper = styled.div`
  display: flex;
  padding: 0 24px;
  min-width: 26.7%;
  flex-wrap: wrap;
  .logo {
    width: 52px;
    height: 52px;
    margin-right: 16px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const SymbolWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
  .symbol {
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    color: #111111;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    color: rgba(17, 17, 17, 0.35);
  }
`;

const RightWrapper = styled.div`
  flex: 1 1 auto;
  padding: 0 24px;
  > :not(:first-child) {
    margin-top: 12px;
  }
  .title {
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
  }
  .content {
    line-height: 20px;
    color: rgba(17, 17, 17, 0.65);
    word-wrap: break-word;
    text-align: justify;
    font-size: 14px;
  }
  .noinfo {
    font-size: 14px;
    line-height: 20px;
    color: rgba(17, 17, 17, 0.2);
  }
`;

const AboutEdit = styled.div`
  display: flex;
  align-items: center;
`;

const Edit = styled.div`
  cursor: pointer;
  margin-left: 12px;
  a {
    display: flex;
    align-items: center;
  }
`;

const LinksWrapper = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, 20px);
`;

const LinkIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export default function AssetInfo({ data, symbol, name }) {
  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <img
            className="logo"
            src={data?.icon ?? "/imgs/icons/default.svg"}
            alt="logo"
          />
          <SymbolWrapper>
            {symbol && <div className="symbol">{symbol}</div>}
            {name && <div className="name">{name}</div>}
          </SymbolWrapper>
        </LeftWrapper>
        <RightWrapper>
          <AboutEdit>
            <span className="title">About</span>
            <Edit>
              <ExternalLink href={`https://forms.gle/9C3zJAS9YzYtoJFs9`}>
                <EditSvg />
              </ExternalLink>
            </Edit>
          </AboutEdit>
          {data?.about && <div className="content">{data?.about}</div>}
          {!data?.about && <div className="noinfo">No more information.</div>}
          <LinksWrapper>
            {(data?.links || []).map((item, index) => (
              <Tooltip key={index} title={item.name} content={item.url}>
                <ExternalLink href={item.url}>
                  <LinkIcon src={item.icon} />
                </ExternalLink>
              </Tooltip>
            ))}
          </LinksWrapper>
        </RightWrapper>
      </Wrapper>
      <Divider />
    </>
  );
}
