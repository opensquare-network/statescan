import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  > :not(:first-child) {
    margin-left: 20px;
  }
  > img {
    width: 20px;
    height: 20px;
  }
`;

const iconMap = {
  Westend: "westend.svg",
  Kusama: "teleport-kusama.svg",
  OpenSquare: "teleport-opensquare.svg",
};

const getIcon = (name) => {
  return iconMap[name] ?? "teleport-default.svg";
};

export default function TeleportItem({ from, to }) {
  const iconFrom = getIcon(from);
  const iconTo = getIcon(to);
  return (
    <Wrapper>
      <img src={`/imgs/icons/${iconFrom}`} />
      <img src="/imgs/arrow-transfer.svg" />
      <img src={`/imgs/icons/${iconTo}`} />
    </Wrapper>
  );
}
