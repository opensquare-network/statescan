import styled from "styled-components";

const Input = styled.input`
  padding-left: 44px;
  width: 320px;
  font-size: 16px;
  line-height: 36px;
  border: none;
  color: #111111;
  background: url("/imgs/icons/search-idle.svg") no-repeat scroll 7px 7px;

  ::placeholder {
    color: rgba(17, 17, 17, 0.35);
  }

  :focus,
  :focus-visible {
    outline: none;
    background: url("/imgs/icons/search-focus.svg") no-repeat scroll 7px 7px;
  }
`;

export default function SearchS({ loading = false, onSearch }) {
  return <Input />;
}
