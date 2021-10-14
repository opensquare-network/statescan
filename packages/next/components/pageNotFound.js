import styled from "styled-components";
import { useRouter } from "next/router";

import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  padding: 40px 64px;
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
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

export default function PageNotFound() {
  const router = useRouter();
  const node = useNode();

  return (
    <Wrapper>
      <img src="/imgs/404.svg" alt="404" />
      <TextWrapper>
        <div>Page not found</div>
        <div>The requested URL was not found in our server.</div>
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
