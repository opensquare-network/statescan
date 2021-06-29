import { useEffect, useState, Fragment } from "react";
import styled, { css } from "styled-components";

import { useWindowSize } from "utils/hooks";
import NoData from "./NoData";
import TimeHead from "./TimeHead";
import TimeBody from "./TimeBody";
import LoadingBar from "components/LoadingBar";
import { useDispatch, useSelector } from "react-redux";
import { timeTypeSelector, setTimeType } from "store/reducers/preferenceSlice";

const Title = styled.h4`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
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
  overflow: hidden;
  thead {
    background: #fafafa;
  }
  th {
    padding: 14px 24px;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: rgba(17, 17, 17, 0.35);
    text-align: left;
  }
  tbody {
    margin: 8px 0;
    td {
      padding: 14px 24px;
      font-size: 14px;
      line-height: 20px;
      color: #111111;
    }
  }
  tfoot {
    position: relative;
    ::after {
      content: "";
      width: 100%;
      height: 1px;
      position: absolute;
      top: 0;
      left: 0;
      background: #f4f4f4;
    }
    td {
      padding: 14px 24px;
      font-size: 14px;
      line-height: 20px;
      color: #111111;
    }
  }
`;

const StyledTr = styled.tr`
  position: relative;
  ${(p) =>
    !p.isShow &&
    css`
      :not(:last-child)::after {
        content: "";
        position: absolute;
        height: 1px;
        background: #f4f4f4;
        left: 24px;
        right: 24px;
        bottom: 0;
      }
    `}
`;

const TableDataWrapper = styled.td`
  padding: 8px 24px !important;
`;

const CollapseTableDataWrapper = styled.div`
  padding: 8px 24px !important;
`;

const TableDataItem = styled.pre`
  background: #fafafa;
  border-radius: 4px;
  padding: 16px 24px;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
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
  position: relative;
  :not(:last-child)::after {
    content: "";
    position: absolute;
    height: 1px;
    background: #f4f4f4;
    left: 24px;
    right: 24px;
    bottom: 0;
  }
`;

const CollapseTable = styled.table``;

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
  width: 136px;
`;

const CollapseFoot = styled.div`
  border-top: 1px solid #f4f4f4;
  padding: 16px 24px;
`;

const DataImg = styled.img`
  cursor: pointer;
`;

export default function Table({
  title,
  head,
  body,
  foot,
  collapse,
  isLoading,
  placeholder = 3,
}) {
  const dispatch = useDispatch();
  const [isCollapse, setIsCollapse] = useState(false);
  const [showData, setShowData] = useState([]);
  const timeType = useSelector(timeTypeSelector);
  const doSetTimeType = (timeType) => {
    dispatch(setTimeType(timeType));
  };
  const size = useWindowSize();
  useEffect(() => {
    if (collapse && collapse > size.width) {
      setIsCollapse(true);
    } else {
      setIsCollapse(false);
    }
  }, [size, collapse]);
  useEffect(() => {
    setShowData((body || []).map(() => false));
  }, [body]);

  return (
    <div>
      {title && <Title>{title}</Title>}
      {!isCollapse && (
        <StyledTable>
          <thead>
            <tr>
              {(head || []).map((item, index) => (
                <th key={index} style={{ textAlign: item.align ?? "left" }}>
                  {item.type === "time" && (
                    <TimeHead timeType={timeType} setTimeType={doSetTimeType} />
                  )}
                  {item.type === "data" && <div />}
                  {!item.type && item.name}
                </th>
              ))}
            </tr>
          </thead>
          {!isLoading && body && body.length > 0 ? (
            <>
              <tbody>
                {(body || []).map((item, bodyIndex) => (
                  <Fragment key={bodyIndex}>
                    <StyledTr isShow={showData[bodyIndex]}>
                      {item.map((item, index) => (
                        <td
                          key={index}
                          style={{ textAlign: head[index].align ?? "left" }}
                        >
                          {head[index].type === "time" && (
                            <TimeBody timeType={timeType} ts={item} />
                          )}
                          {head[index].type === "data" && (
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
                          )}
                          {!head[index].type && item}
                        </td>
                      ))}
                    </StyledTr>
                    {showData[bodyIndex] && (
                      <StyledTr>
                        <TableDataWrapper colSpan="100%">
                          <TableDataItem>
                            {JSON.stringify(
                              body?.[bodyIndex]?.[body[bodyIndex].length - 1],
                              null,
                              2
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
                    <td colSpan="100%">{foot}</td>
                  </tr>
                </tfoot>
              )}
            </>
          ) : isLoading ? (
            <tbody>
              {Array.from(Array(placeholder)).map((_, index) => (
                <tr key={index}>
                  <td colSpan="100%">
                    <LoadingBar />
                  </td>
                </tr>
              ))}
            </tbody>
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
          {!isLoading && body && body.length > 0 ? (
            <>
              <div>
                {(body || []).map((bodyItem, bodyIndex) => (
                  <CollapseTableWrapper key={bodyIndex}>
                    <CollapseTable>
                      <tbody>
                        {head.map((headItem, index) => (
                          <tr key={index}>
                            {head[index].type === "data" && (
                              <>
                                <CollapseHead></CollapseHead>
                                <CollapseBody>
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
                                </CollapseBody>
                              </>
                            )}
                            {!head[index].type && (
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
                        <TableDataItem>
                          {JSON.stringify(
                            body?.[bodyIndex]?.[body[bodyIndex].length - 1],
                            null,
                            2
                          )}
                        </TableDataItem>
                      </CollapseTableDataWrapper>
                    )}
                  </CollapseTableWrapper>
                ))}
              </div>
              {foot && <CollapseFoot>{foot}</CollapseFoot>}
            </>
          ) : isLoading ? (
            <CollapseTable>
              <tbody>
                {Array.from(Array(3)).map((_, index) => (
                  <tr key={index}>
                    <CollapseHead>
                      <LoadingBar random />
                    </CollapseHead>
                    <CollapseBody>
                      <LoadingBar random />
                    </CollapseBody>
                  </tr>
                ))}
              </tbody>
            </CollapseTable>
          ) : (
            <NoData isCollapse={isCollapse} />
          )}
        </CollapseWrapper>
      )}
    </div>
  );
}
