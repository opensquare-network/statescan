import styled from "styled-components";
import Identity from "./identity";
import CopyText from "../copyText";
import BreakText from "../breakText";
import MinorText from "../minorText";
import MonoText from "../monoText";
import Source from "./source";
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
    const headers = {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json;charset=UTF-8",
    };
    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${relayChain}/short-ids`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({ addresses: [address] }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!_.isEmpty(res) && isMounted()) {
          setIdentity(res[0]);
        }
      })
      .catch(() => null);
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
