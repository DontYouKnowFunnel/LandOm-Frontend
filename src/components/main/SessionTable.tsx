import { PlayButtonIcon } from "../Icons";
import { StatusBadge } from "./Status";

type SessionStatus = "전환" | "이탈" | "탐색중";

interface SessionRow {
  accessTime: string;
  sessionId: string;
  device: string;
  exitFunnel: string;
  stayTime: string;
  status: SessionStatus;
}

const MOCK_SESSIONS: SessionRow[] = [
  {
    accessTime: "방금 전",
    sessionId: "S-19472",
    device: "Chrome · Android",
    exitFunnel: "Feature",
    stayTime: "02:58",
    status: "탐색중",
  },
  {
    accessTime: "1시간 전",
    sessionId: "S-19472",
    device: "Safari · iOS",
    exitFunnel: "Feature",
    stayTime: "02:58",
    status: "전환",
  },
  {
    accessTime: "2일 전",
    sessionId: "S-19472",
    device: "IE · Windows",
    exitFunnel: "Feature",
    stayTime: "02:58",
    status: "이탈",
  },
  {
    accessTime: "2025-11-03",
    sessionId: "S-19472",
    device: "Safari · macOS",
    exitFunnel: "Feature",
    stayTime: "02:58",
    status: "전환",
  },
];

const SessionTable = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium leading-5 text-slate-600">최근 세션</span>

      <div className="flex gap-1 rounded-lg bg-slate-50 p-2">
        <span className="w-full text-xs font-semibold text-slate-500">접속 일시</span>
        <span className="w-full text-xs font-semibold text-slate-500">세션ID / 디바이스</span>
        <span className="w-full text-xs font-semibold text-slate-500">이탈 퍼널</span>
        <span className="w-full text-xs font-semibold text-slate-500">체류시간</span>
        <span className="w-full text-xs font-semibold text-slate-500">전환</span>
        <span className="w-8 shrink-0 text-xs font-semibold text-slate-500">재생</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {MOCK_SESSIONS.map((session) => (
          <div
            key={`${session.accessTime}-${session.sessionId}`}
            className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
          >
            <span className="w-full text-xs font-medium text-slate-900">{session.accessTime}</span>
            <div className="flex w-full flex-col justify-center -space-y-0.5">
              <span className="text-xs font-medium text-slate-900">{session.sessionId}</span>
              <span className="text-[11px] font-normal leading-4 text-slate-500">{session.device}</span>
            </div>
            <span className="w-full text-xs font-medium text-slate-900">{session.exitFunnel}</span>
            <span className="w-full text-xs font-medium text-slate-900">{session.stayTime}</span>
            <div className="w-full">
              <StatusBadge status={session.status} />
            </div>
            <div className="flex w-8 shrink-0 justify-center">
              <button className="text-slate-600 transition-colors hover:text-slate-700">
                <PlayButtonIcon className="text-2xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SessionTable;
