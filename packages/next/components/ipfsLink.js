import Link from "next/link";
import styled from "styled-components";

const DataIcon = styled.div`
  width: 20px;
  height: 20px;
  background: url("/imgs/icons/ipfs-gray.svg");
  :hover {
    background: url("/imgs/icons/ipfs.svg");
  }
`;

export default function IpfsLink({ cid }) {
  return (
    <Link href={`https://cloudflare-ipfs.com/ipfs/${cid}`} passHref>
      <a target="_blank">
        <DataIcon />
      </a>
    </Link>
  );
}
