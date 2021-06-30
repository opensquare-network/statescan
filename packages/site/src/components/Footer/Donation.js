import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import copy from "copy-to-clipboard";

import { addressEllipsis } from "utils";
import { useIsMounted } from "utils/hooks";

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
    color: rgba(17, 17, 17, 0.65);
  }
`;

const TextBold = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #111111;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
`;

const CopyButton = styled.div`
  width: 54px;
  text-align: center;
  padding: 2px 4px;
  background: #eeeeee;
  border-radius: 4px;
  font-size: 12px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.65);
  font-weight: bold;
  cursor: pointer;

  :hover {
    background: #fee4ef;
    color: #f22279;
  }

  ${(p) =>
    p.copied &&
    css`
      background: #fee4ef;
      color: #f22279;
      cursor: auto;
    `}
`;

export default function Donation() {
  const [copied, setCopied] = useState(false);
  const isMounted = useIsMounted();
  const address = process.env.REACT_APP_DONATION_ADDRESS;

  const onCopy = () => {
    if (copied) return;
    if (copy(address)) {
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        isMounted && setCopied(false);
      }, 3000);
    }
  }, [copied, isMounted]);

  return (
    <Wrapper>
      <p>☕</p>
      <TextBold>Donate (KSM)</TextBold>
      <Text>·</Text>
      <Text
        onClick={() => {
          window.open(
            `https://kusama.subscan.io/account/${address}?tab=transfer`,
            "_blank"
          );
        }}
      >
        <Link>{addressEllipsis(address, 7, 8)}</Link>
      </Text>
      <CopyButton copied={copied} onClick={onCopy}>
        {copied ? "COPIED" : "COPY"}
      </CopyButton>
    </Wrapper>
  );
}
