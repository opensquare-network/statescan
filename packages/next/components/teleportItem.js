import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const iconMap = {
  Kusama: "teleport-kusama.svg",
  OpenSquare: "teleport-opensquare.svg",
};

const getIcon = (name) => {
  return iconMap[name] ?? "teleport-default.svg";
};

export default function TeleportItem({ name }) {
  const icon = getIcon(name);
  return (
    <Wrapper>
      <img src={`/imgs/icons/${icon}`} />
      {name}
    </Wrapper>
  );
}
