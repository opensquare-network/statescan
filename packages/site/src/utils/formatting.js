import TimeBody from "../components/Table/TimeBody";

export const formattingTableCell = (value, type) => {
  if (type === "time") {
    return <TimeBody ts={value} />;
  }
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }
  if (isNumeric(value)) {
    return parseInt(value).toLocaleString();
  }
  return value;
};

const isNumeric = (str) => {
  if (typeof str != "string") {
    return false;
  }
  return !isNaN(str) && !isNaN(parseInt(str));
};
