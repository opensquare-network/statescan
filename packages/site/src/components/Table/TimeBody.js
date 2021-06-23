import { time, timeDuration } from "utils";
import { timeTypes } from "utils/constants";

export default function TimeBody({ timeType, ts }) {
  return (
    <>
      {timeType === timeTypes.age && timeDuration(ts)}
      {timeType === timeTypes.date && time(ts)}
    </>
  );
}
