import AuthIcon from "../../public/imgs/icons/identity/auth.svg";
import SubIcon from "../../public/imgs/icons/identity/sub.svg";
import ErrorIcon from "../../public/imgs/icons/identity/error.svg";
import UnauthorizedIcon from "../../public/imgs/icons/identity/error-grey.svg";
import SubGreyIcon from "../../public/imgs/icons/identity/sub-grey.svg";
import SubRedIcon from "../../public/imgs/icons/identity/sub-red.svg";

export default function IdentityIcon({ identity }) {
  const statusIconMap = new Map([
    ["NOT_VERIFIED", UnauthorizedIcon],
    ["VERIFIED", AuthIcon],
    ["ERRONEOUS", ErrorIcon],
    ["VERIFIED_LINKED", SubIcon],
    ["LINKED", SubGreyIcon],
    ["ERRONEOUS_LINKED", SubRedIcon],
  ]);

  const StatusIcon = statusIconMap.get(identity?.info?.status) ?? ErrorIcon;

  return <StatusIcon />;
}
