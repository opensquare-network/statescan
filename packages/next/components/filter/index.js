import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Select from "./select";
import FilterIcon from "public/imgs/icons/filter.svg";
import { useWindowSize } from "utils/hooks";
import { encodeURIQuery } from "utils";
import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  background: #ffffff;
  ${card_border};
  padding: 19px 23px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  min-height: 72px;
  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: stretch;
  }
  ${(p) =>
    p.warning &&
    css`
      padding: 15px 23px;
    `}
`;

const Total = styled.div`
  font-weight: 600;
  white-space: nowrap;
`;

const TotalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: stretch;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 8px;
    }
  }
`;

const Button = styled.div`
  background: #000000;
  border-radius: 6px;
  padding: 6px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  cursor: pointer;
  text-align: center;
`;

const FilterWrapper = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 24px;
  }
  @media screen and (max-width: 1100px) {
    flex-direction: column;
    > :not(:first-child) {
      margin: 16px 0 0;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f4f4f4;
  margin: 20px 0;
  display: none;
  @media screen and (max-width: 1100px) {
    display: block;
  }
`;

const HiddenButton = styled.div`
  display: none;
  width: 32px;
  height: 32px;
  background: #f4f4f4;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > svg {
    stroke: #111111;
  }
  ${(p) =>
    p.active &&
    css`
      background: #fee4ef;
      > svg {
        stroke: #f22279;
      }
    `}
  @media screen and (max-width: 1100px) {
    display: flex;
  }
`;

const WarningWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.65);
  margin-top: 4px;
  > img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

export default function Filter({
  total,
  warning,
  data,
  allmodulemethods,
  addQuery = {},
}) {
  const [selectData, setSelectData] = useState(data);
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    setSelectData(data);
  }, [router, data]);

  useEffect(() => {
    if (width > 1100) {
      setShow(false);
    }
  }, [width]);

  const onSelect = (name, value) => {
    let methods = [];
    if (name === "Module") {
      methods = (
        allmodulemethods.find((item) => item.module === value)?.methods || []
      ).map((item) => ({
        value: item,
        text: item,
      }));
      methods.unshift({ text: "All", value: "" });
    }
    setSelectData(
      (selectData || []).map((item) => {
        if (name === "Module" && item.name === "Method") {
          return { ...item, value: "", options: methods };
        } else {
          return item.name === name ? { ...item, value } : item;
        }
      })
    );
  };
  const getCurrentFilter = () => {
    const filter = {};
    (selectData || []).forEach((item) => {
      if (item.value) {
        Object.assign(filter, { [item.query]: item.value });
      }
    });
    return filter;
  };

  return (
    <Wrapper warning={warning}>
      <TotalWrapper>
        <div>
          <Total>{total}</Total>
          {warning && (
            <WarningWrapper>
              <img src="/imgs/icons/circled-warning.svg" alt="" />
              <div>{warning}</div>
            </WarningWrapper>
          )}
        </div>
        <HiddenButton active={show}>
          <FilterIcon onClick={() => setShow(!show)} />
        </HiddenButton>
      </TotalWrapper>
      {(show || width > 1100) && selectData?.length > 0 && (
        <>
          <Divider />
          <FilterWrapper>
            {(selectData || []).map((item, index) => (
              <SelectWrapper key={index}>
                <div>{item.name}</div>
                <Select
                  value={item.value}
                  name={item.name}
                  options={item.options}
                  query={item.query}
                  subQuery={item.subQuery}
                  onSelect={onSelect}
                />
              </SelectWrapper>
            ))}
            <Button
              onClick={() => {
                router.push(
                  `${router.asPath.split("?")[0]}?${encodeURIQuery({
                    ...addQuery,
                    page: 1,
                    ...getCurrentFilter(),
                  })}`
                );
              }}
            >
              Filter
            </Button>
          </FilterWrapper>
        </>
      )}
    </Wrapper>
  );
}
