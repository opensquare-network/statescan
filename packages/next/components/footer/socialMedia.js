import styled from "styled-components";

import Github from "../../public/imgs/icons/sns/github.svg";
import Twitter from "../../public/imgs/icons/sns/twitter.svg";
import Mail from "../../public/imgs/icons/sns/mail.svg";
import Element from "../../public/imgs/icons/sns/element.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Link = styled.a`
  cursor: pointer;
  text-decoration: none;

  &:hover {
    svg {
      * {
        fill-opacity: 0.35 !important;
      }
    }
  }
`;

export default function SocialMedia() {
  return (
    <Wrapper>
      <Link
        href="https://github.com/opensquare-network/"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Github />
      </Link>
      <Link
        href="https://twitter.com/OpensquareN"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Twitter />
      </Link>
      <Link href="mailto:hi@opensquare.network" target="_blank">
        <Mail />
      </Link>
      <Link
        href="https://app.element.io/#/room/#opensquare:matrix.org"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Element />
      </Link>
    </Wrapper>
  );
}
