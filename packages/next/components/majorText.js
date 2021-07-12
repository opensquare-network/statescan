import styled from "styled-components";

const Wrapper = styled.div`
  color: #111111;
  margin: 0;

  a {
    text-decoration: none;
    color: #f22279;

    &:hover {
      color: #f22279;
    }
  }
`;

export default function MajorText({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
