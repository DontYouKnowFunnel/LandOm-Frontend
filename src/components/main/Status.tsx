import {
  StatusExploringIcon,
  StatusConvertedIcon,
  StatusExitedIcon,
} from "../Icons";

export const ExploringStatus = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
    <StatusExploringIcon className="text-sm" />
    탐색중
  </span>
);

export const ConvertedStatus = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    <StatusConvertedIcon className="text-sm" />
    전환
  </span>
);

export const ExitedStatus = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
    <StatusExitedIcon className="text-sm" />
    이탈
  </span>
);

type SessionStatus = "전환" | "이탈" | "탐색중";

export const StatusBadge = ({ status }: { status: SessionStatus }) => {
  if (status === "전환") return <ConvertedStatus />;
  if (status === "이탈") return <ExitedStatus />;
  return <ExploringStatus />;
};
