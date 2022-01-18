import styled from "styled-components";
import ExternalLink from "./externalLink";
import OpenLinkSvg from "public/imgs/icons/open-link.svg";

const GovernanceItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 12px;
  margin-right: 12px;
  width: 269.33px;
  height: 60px;
  .space-logo {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  .space-name {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #111111;
  }
  .project-name {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: rgba(17, 17, 17, 0.35);
  }
  > div {
    display: flex;
    :hover {
      svg > path {
        stroke-opacity: 0.65;
      }
    }
  }
`;

export default function Governance({
  spaceLogo,
  spaceName,
  projectName,
  link,
}) {
  return (
    <GovernanceItem>
      <div>
        <img className="space-logo" src={spaceLogo} />
        <div>
          <div className="space-name">{spaceName}</div>
          <div className="project-name">{projectName}</div>
        </div>
      </div>
      <div>
        <ExternalLink href={link}>
          <OpenLinkSvg />
        </ExternalLink>
      </div>
    </GovernanceItem>
  );
}
