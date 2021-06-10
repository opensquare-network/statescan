import styled from "styled-components";

const Wrapper = styled.div`
  height: 36px;
  width: 156px;
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 6px;
  position: relative;
`;

const Image = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #111111;
`;

const ArrowDown = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  right: 6px;
`;

export default function NodeSwitcher() {
  return (
    <Wrapper>
      <Image src="/imgs/icons/kusama.svg" alt="kusama" />
      <Text>Kusama</Text>
      <ArrowDown src="/imgs/icons/arrow-down.svg" />
    </Wrapper>
  );
}
