import styled from "styled-components";
import { useRouter } from "next/router";

import { card_border } from "styles/textStyles";
import ExternalLink from "components/externalLink";
import Mail from "public/imgs/icons/sns/mail.svg";
import Element from "public/imgs/icons/sns/element.svg";

const Wrapper = styled.div`
  padding: 40px 24px;
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
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  color: #111111;
  text-align: center;
  max-width: 318px;
  > :not(:first-child) {
    margin-top: 16px;
    color: rgba(17, 17, 17, 0.35);
    font-weight: normal;
    font-size: 14px;
  }
`;

const Button = styled.div`
  padding: 12px 16px;
  background: #000000;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
  cursor: pointer;
`;

const Contact = styled.div`
  margin-top: 16px !important;
  max-width: 343px;
  color: #1e2134;
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  > :not(:first-child) {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    > :not(:first-child) {
      margin-left: 12px;
    }
  }
`;

const pageMap = new Map([
  [
    "404",
    {
      title: "Page not found",
      contact: false,
      text: "You may have mistyped the address or the page may have moved.",
    },
  ],
  [
    "500",
    {
      title: "Internal Server Error",
      contact: true,
      text: "The server encountered an internal server error and was unable to complete your request.",
    },
  ],
  [
    "503",
    {
      title: "Service Unavailable",
      contact: true,
      text: "The server is unable to service your request due to maintenance downtime or capacity problems.",
    },
  ],
  [
    "505",
    {
      title: "Forbidden",
      contact: true,
      text: "We've been automatically alerted of the issue and will work to fix it asap.",
    },
  ],
]);

export default function PageError({ resource, code = "404" }) {
  const router = useRouter();
  const data = pageMap.get(code) ?? pageMap.get("500");

  return (
    <Wrapper>
      <img src={`/imgs/${code}.svg`} alt="" />
      <TextWrapper>
        <div>{data.title}</div>
        {resource ? (
          <div>{resource} not found in our server.</div>
        ) : (
          <div>{data.text}</div>
        )}
      </TextWrapper>
      {data.contact && (
        <Contact>
          <div>Contact Us</div>
          <div>
            <ExternalLink href="mailto:hi@opensquare.network">
              <Mail />
            </ExternalLink>
            <ExternalLink href="https://app.element.io/#/room/#opensquare:matrix.org">
              <Element />
            </ExternalLink>
          </div>
        </Contact>
      )}
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
