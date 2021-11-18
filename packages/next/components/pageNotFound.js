import styled from "styled-components";
import { useRouter } from "next/router";

import { useNode } from "utils/hooks";
import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  padding: 40px 64px;
  background: #ffffff;
  ${card_border};
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

const TextWrapper = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
  text-align: center;
  > :not(:first-child) {
    margin-top: 4px;
    color: rgba(17, 17, 17, 0.65);
  }
`;

const Button = styled.div`
  padding: 12px 16px;
  background: #f22279;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
  cursor: pointer;
`;

export default function PageNotFound({resource = "URL"}) {
  const router = useRouter();
  const node = useNode();

  return (
    <Wrapper>
      <img src="/imgs/404.svg" alt="404" />
      <TextWrapper>
        <div>Page not found</div>
        <div>The requested {resource} was not found in our server.</div>
      </TextWrapper>
      <Button
        onClick={() => {
          router.replace(`/`);
        }}
      >
        Back home
      </Button>
    </Wrapper>
  );
}
