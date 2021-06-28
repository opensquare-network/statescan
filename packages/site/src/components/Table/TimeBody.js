import { time, timeDuration } from "utils";
import { timeTypes } from "utils/constants";
import { useSelector } from "react-redux";
import { timeTypeSelector } from "../../store/reducers/preferenceSlice";

export default function TimeBody({ ts }) {
  const timeType = useSelector(timeTypeSelector);
  return (
    <>
      {timeType === timeTypes.age && timeDuration(ts)}
      {timeType === timeTypes.date && time(ts)}
    </>
  );
}
