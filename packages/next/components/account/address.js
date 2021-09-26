import styled from "styled-components";
import Identity from "./identity";
import CopyText from "../copyText";
import BreakText from "../breakText";
import MinorText from "../minorText";
import MonoText from "../monoText";
import { fetchIdentity } from "services/identity";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nodes } from "../../utils/constants";
import _ from "lodash";
import { useIsMounted } from "utils/hooks";

const Wrapper = styled.div`
  a {
    width: 100%;
  }
  [href]:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

function Address({ address }) {
  const [identity, setIdentity] = useState(null);
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";
  const isMounted = useIsMounted();

  useEffect(() => {
    setIdentity(null);
    fetchIdentity(relayChain, address).then((identity) => {
      if (isMounted()) {
        setIdentity(identity);
      }
    });
  }, [address, relayChain, isMounted]);

  if (!identity) {
    return (
      <Wrapper>
        <CopyText text={address}>
          <BreakText>
            <MinorText>
              <Link href={`/account/${address}`} passHref>
                <MonoText>{address}</MonoText>
              </Link>
            </MinorText>
          </BreakText>
        </CopyText>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <Link href={`/account/${address}`} passHref>
        <a>
          <Identity identity={identity} />
        </a>
      </Link>
      <CopyText text={address}>
        <BreakText>
          <MinorText>
            <Link href={`/account/${address}`} passHref>
              <MonoText>{address}</MonoText>
            </Link>
          </MinorText>
        </BreakText>
      </CopyText>
    </Wrapper>
  );
}

export default Address;
