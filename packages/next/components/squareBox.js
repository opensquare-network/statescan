import styled from 'styled-components';

const SquareBox = styled.div`
  position: relative;
  @media screen and (min-width: 1064px) {
    width: 480px;
  }
  max-width: 480px;
  overflow: hidden;
  background-color: #555555;
  :before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const SquareContent = styled.div`
  position:  absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: white;
  text-align: center;
`;

export default function SquareBoxComponent({ children }) {
  return (
    <SquareBox>
      <SquareContent>
        {children}
      </SquareContent>
    </SquareBox>
  );
}
