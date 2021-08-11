import { useEffect, useState, Fragment } from "react";
import styled, { css } from "styled-components";

import { useWindowSize } from "utils/hooks";
import NoData from "./noData";
import TimeHead from "./timeHead";
import TimeBody from "./timeBody";
import { useDispatch, useSelector } from "react-redux";
import { timeTypeSelector, setTimeType } from "store/reducers/preferenceSlice";
import InnerDataTable from "./innerDataTable";

const Wrapper = styled.div``;

const Title = styled.h4`
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  color: #111111;
  margin: 0 0 24px;
`;

const StyledTable = styled.table`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-spacing: 0px;
  border-radius: 8px;

  thead {
    background: #fafafa;
    overflow: hidden;
  }

  th {
    :first-child {
      border-top-left-radius: 8px;
      -moz-border-top-left-radius: 8px;
      -webkit-border-top-left-radius: 8px;
    }

    :last-child {
      border-top-right-radius: 8px;
      -moz-border-top-right-radius: 8px;
      -webkit-border-top-right-radius: 8px;
    }

    padding: 16px 24px;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: rgba(17, 17, 17, 0.35);
    text-align: left;
  }

  tbody {
    ::before,
    ::after {
      content: "";
      display: block;
      height: 4px;
    }

    td {
      padding: 0px 24px;
      font-size: 14px;
      line-height: 20px;
      color: #111111;
    }
  }

  tfoot {
    td {
      border-top: 1px solid #f8f8f8;
      padding: 14px 24px;
      font-size: 14px;
      line-height: 20px;
      color: #111111;
    }
  }
`;

const StyledTr = styled.tr`
  ${(p) =>
    !p.isShow &&
    css`
      :not(:last-child) {
        td {
          position: relative;
          .border-bottom {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: #f8f8f8;
          }
          :first-child {
            .border-bottom {
              left: 24px;
            }
          }
          :last-child {
            .border-bottom {
              right: 24px;
            }
          }
        }
      }
    `}
`;

const TableDataWrapper = styled.td`
  padding: 0 24px 16px !important;
`;

const CollapseTableDataWrapper = styled.div`
  padding: 8px 24px !important;
`;

const TableDataItem = styled.pre`
  background: #fafafa;
  border-radius: 4px;
  padding: 32px;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "SF Mono";
  letter-spacing: -0.5px;

  @media screen and (max-width: 1200px) {
    max-width: calc(100vw - var(--scrollbar-width) - 48px - 48px);
  }
  max-width: calc(1200px - 48px);

  overflow-x: auto;
`;

const CollapseTableDataItem = styled.pre`
  background: #fafafa;
  border-radius: 4px;
  padding: 32px;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "SF Mono";
  letter-spacing: -0.5px;

  overflow-x: auto;
  :-webkit-scrollbar {
    display: none;
  }
`;

const CollapseWrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
`;

const CollapseTableWrapper = styled.div`
  padding: 16px 0px;
  width: 100%;

  :not(:last-child) {
    position: relative;
    .border-bottom {
      position: absolute;
      left: 24px;
      right: 24px;
      bottom: 0;
      height: 1px;
      background-color: #f8f8f8;
    }
  }
`;

const CollapseTable = styled.table`
  width: 100%;
`;

const CollapseHead = styled.td`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 6px 24px;
  width: 136px;
`;

const CollapseBody = styled.td`
  font-size: 14px;
  line-height: 20px;
  padding: 6px 24px;
  word-break: break-all;
`;

const CollapseFoot = styled.div`
  border-top: 1px solid #f8f8f8;
  padding: 16px 24px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DataImg = styled.img`
  cursor: pointer;
`;

export default function Table({
  title,
  head,
  body,
  foot,
  rowHeight = 49,
  collapse,
  expand,
}) {
  const dispatch = useDispatch();
  const [isCollapse, setIsCollapse] = useState();

  // Hanlding expand json data by default
  const initExpand = [];
  if (expand >= 0) {
    initExpand[expand] = true;
  }
  const [showData, setShowData] = useState(initExpand);
  useEffect(() => {
    if (!initExpand.some((item) => item)) {
      setShowData((body || []).map(() => false));
    }
  }, [body]);

  const timeType = useSelector(timeTypeSelector);
  useEffect(() => {
    const timeType = localStorage.getItem("timeType");
    dispatch(setTimeType(timeType));
  }, []);
  const doSetTimeType = (timeType) => {
    dispatch(setTimeType(timeType));
  };
  const size = useWindowSize();

  useEffect(() => {
    if (!size.width) return;
    if (collapse && collapse > size.width) {
      setIsCollapse(true);
    } else {
      setIsCollapse(false);
    }
  }, [size, collapse]);

  if (!size.width || isCollapse === undefined) {
    return null;
  }

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      {!isCollapse && (
        <StyledTable>
          <thead>
            <tr>
              {(head || []).map((item, index) => (
                <th
                  key={index}
                  style={{
                    textAlign: item.align ?? "left",
                    width: item.width,
                  }}
                >
                  {item.type === "time" && (
                    <TimeHead timeType={timeType} setTimeType={doSetTimeType} />
                  )}
                  {item.type === "data" && <div />}
                  {!item.type && item.name}
                </th>
              ))}
            </tr>
          </thead>
          {body && body.length > 0 ? (
            <>
              <tbody>
                {(body || []).map((row, bodyIndex) => (
                  <Fragment key={bodyIndex}>
                    <StyledTr isShow={showData[bodyIndex]}>
                      {row.map((item, index) => (
                        <td
                          key={index}
                          style={{
                            textAlign: head?.[index]?.align ?? "left",
                            height: `${rowHeight}px`,
                          }}
                        >
                          {head?.[index]?.type === "time" && (
                            <TimeBody timeType={timeType} ts={item} />
                          )}
                          {head?.[index]?.type === "data" && (
                            <IconWrapper>
                              <DataImg
                                src={`/imgs/icons/data-show${
                                  showData[bodyIndex] ? "-active" : ""
                                }.svg`}
                                alt="action"
                                onClick={() => {
                                  const data = [...showData];
                                  data[bodyIndex] = !showData[bodyIndex];
                                  setShowData(data);
                                }}
                              />
                            </IconWrapper>
                          )}
                          {!head?.[index]?.type && item}
                          <div className="border-bottom"></div>
                        </td>
                      ))}
                    </StyledTr>
                    {showData[bodyIndex] && (
                      <StyledTr>
                        <TableDataWrapper colSpan="100%">
                          <TableDataItem>
                            {head?.[body[bodyIndex].length - 1].display ===
                            "table" ? (
                              <InnerDataTable
                                data={
                                  body?.[bodyIndex]?.[
                                    body[bodyIndex].length - 1
                                  ]
                                }
                              />
                            ) : (
                              JSON.stringify(
                                body?.[bodyIndex]?.[body[bodyIndex].length - 1],
                                null,
                                2
                              )
                            )}
                          </TableDataItem>
                        </TableDataWrapper>
                      </StyledTr>
                    )}
                  </Fragment>
                ))}
              </tbody>
              {foot && (
                <tfoot>
                  <tr>
                    <td
                      colSpan="100%"
                      style={{ paddingTop: 14, paddingBottom: 14 }}
                    >
                      {foot}
                    </td>
                  </tr>
                </tfoot>
              )}
            </>
          ) : (
            <tbody>
              <tr>
                <td colSpan="100%" style={{ padding: 0 }}>
                  <NoData isCollapse={isCollapse} />
                </td>
              </tr>
            </tbody>
          )}
        </StyledTable>
      )}
      {isCollapse && (
        <CollapseWrapper>
          {body && body.length > 0 ? (
            <>
              <div>
                {(body || []).map((bodyItem, bodyIndex) => (
                  <CollapseTableWrapper key={bodyIndex}>
                    <CollapseTable>
                      <tbody>
                        {head.map((headItem, index) => (
                          <tr key={index}>
                            {head?.[index].type === "data" && (
                              <>
                                <CollapseHead></CollapseHead>
                                <CollapseBody>
                                  <IconWrapper>
                                    <DataImg
                                      src={`/imgs/icons/data-show${
                                        showData[bodyIndex] ? "-active" : ""
                                      }.svg`}
                                      alt="action"
                                      onClick={() => {
                                        const data = [...showData];
                                        data[bodyIndex] = !showData[bodyIndex];
                                        setShowData(data);
                                      }}
                                    />
                                  </IconWrapper>
                                </CollapseBody>
                              </>
                            )}
                            {!head?.[index].type && (
                              <>
                                <CollapseHead>{headItem.name}</CollapseHead>
                                <CollapseBody>{bodyItem[index]}</CollapseBody>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </CollapseTable>
                    {showData[bodyIndex] && (
                      <CollapseTableDataWrapper>
                        <CollapseTableDataItem>
                          {head?.[body[bodyIndex].length - 1].display ===
                          "table" ? (
                            <InnerDataTable
                              data={
                                body?.[bodyIndex]?.[body[bodyIndex].length - 1]
                              }
                            />
                          ) : (
                            JSON.stringify(
                              body?.[bodyIndex]?.[body[bodyIndex].length - 1],
                              null,
                              2
                            )
                          )}
                        </CollapseTableDataItem>
                      </CollapseTableDataWrapper>
                    )}
                    <div className="border-bottom"></div>
                  </CollapseTableWrapper>
                ))}
              </div>
              {foot && <CollapseFoot>{foot}</CollapseFoot>}
            </>
          ) : (
            <NoData isCollapse={isCollapse} />
          )}
        </CollapseWrapper>
      )}
    </Wrapper>
  );
}
