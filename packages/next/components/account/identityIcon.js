import AuthIcon from "../../public/imgs/icons/identity/auth.svg";
import SubIcon from "../../public/imgs/icons/identity/sub.svg";
import ErrorIcon from "../../public/imgs/icons/identity/error.svg";
import UnauthorizedIcon from "../../public/imgs/icons/identity/error-grey.svg";
import SubGreyIcon from "../../public/imgs/icons/identity/sub-grey.svg";

export default function IdentityIcon({ identity }) {
  const statusIconMap = new Map([
    ["authorized", AuthIcon],
    ["authorized-sub", SubIcon],
    ["error", ErrorIcon],
    ["unauthorized", UnauthorizedIcon],
    ["unauthorized-sub", SubGreyIcon],
  ]);

  const judgements = identity?.info?.judgements ?? [];

  const isAuthorized = judgements.some(
    ([, judgement]) =>
      typeof judgement === "object" &&
      Object.keys(judgement).some((key) =>
        ["reasonable", "knownGood"].includes(key)
      )
  );

  const isBad = judgements.some(
    ([, judgement]) =>
      typeof judgement === "object" &&
      (Object.keys(judgement).some((key) => key === "erroneous") ||
        Object.keys(judgement).some((key) => key === "lowQuality"))
  );

  let status = "unauthorized";

  if (isAuthorized) {
    status = "authorized";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  if (isBad) {
    status = "error";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  const StatusIcon = statusIconMap.get(status) ?? ErrorIcon;

  return <StatusIcon />;
}
