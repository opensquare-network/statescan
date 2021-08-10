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
    ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
  );

  const isBad = judgements.some(
    ([, judgement]) => judgement.isErroneous || judgement.isLowQuality
  );

  let status = "unauthorized";

  if (isAuthorized && !identity?.info?.displayParent) {
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

  return <StatusIcon />
}
