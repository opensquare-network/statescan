import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Select from "./select";
import FilterIcon from "public/imgs/icons/filter.svg";
import { useWindowSize } from "utils/hooks";
import { encodeURIQuery } from "utils";

const Wrapper = styled.div`
  background: #fafafa;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 20px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Total = styled.div`
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
    > :first-child {
      flex: 0 0 80px;
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

export default function Filter({ total, data, allmodulemethods }) {
  const [selectData, setSelectData] = useState(data);
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();
  const router = useRouter();
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
    <Wrapper>
      <TotalWrapper>
        <Total>{total}</Total>
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
                  `${router.pathname}?${encodeURIQuery({
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
