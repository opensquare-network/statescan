import styled from "styled-components";
import { bigNumber2Locale } from "utils";

const NonePrice = styled.div`
  color: rgba(17, 17, 17, 0.2);
`;

export default function AssetPrice({ price }) {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return <NonePrice>-</NonePrice>;
  } else {
    return <div>{`$${bigNumber2Locale(Number(price).toFixed(2) + "")}`}</div>;
  }
}
