import styled from "styled-components";
import AddressEllipsis from "../addressEllipsis";

const Wrapper = styled.div`
  margin-right: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Label = styled.span`
  margin-right: 8px;
  font-size: 13px;
  color: rgba(17, 17, 17, 0.35);
`;

export default function AddressCounts({
  node,
  validator,
  extrinsicCount,
  eventsCount,
}) {
  return (
    <Wrapper>
      <AddressEllipsis
        address={validator}
        to={`/${node}/account/${validator}`}
      />
      <FlexWrapper style={{ width: "100%", marginTop: 4 }}>
        <Label>Extrinsics</Label> {extrinsicCount}
        <Label style={{ marginLeft: 16 }}>Events</Label> {eventsCount}
      </FlexWrapper>
    </Wrapper>
  );
}
