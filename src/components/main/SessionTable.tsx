import { PlayButtonIcon } from "../Icons";
import { StatusBadge } from "./Status";
import TableHeader from "./TableHeader";
import TableData from "./TableData";

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
    accessTime: "2024-01-15 14:32",
    sessionId: "sess_4821",
    device: "Chrome / Windows",
    exitFunnel: "Feature",
    stayTime: "4m 32s",
    status: "탐색중",
  },
  {
    accessTime: "2024-01-15 14:29",
    sessionId: "sess_3047",
    device: "Safari / iOS",
    exitFunnel: "Feature",
    stayTime: "8m 17s",
    status: "전환",
  },
  {
    accessTime: "2024-01-15 14:27",
    sessionId: "sess_9183",
    device: "Chrome / Android",
    exitFunnel: "Feature",
    stayTime: "2m 08s",
    status: "이탈",
  },
  {
    accessTime: "2024-01-15 14:21",
    sessionId: "sess_5562",
    device: "Edge / Windows",
    exitFunnel: "Feature",
    stayTime: "11m 44s",
    status: "전환",
  },
];

const SessionTable = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="flex items-center gap-2 p-3.5 border-b border-slate-100">
      <span className="text-sm font-medium text-slate-600">최근 세션</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <TableHeader>접속 일시</TableHeader>
            <TableHeader>세션ID / 디바이스</TableHeader>
            <TableHeader>이탈 퍼널</TableHeader>
            <TableHeader>체류 시간</TableHeader>
            <TableHeader>전환</TableHeader>
            <TableHeader>재생</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_SESSIONS.map((session) => (
            <tr
              key={session.sessionId}
              className="hover:bg-slate-50 transition-colors"
            >
              <TableData className="text-slate-500 whitespace-nowrap">
                {session.accessTime}
              </TableData>
              <TableData>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 text-xs">
                    {session.sessionId}
                  </span>
                  <span className="text-slate-500 text-xs font-light">
                    {session.device}
                  </span>
                </div>
              </TableData>
              <TableData className="text-slate-500">
                {session.exitFunnel}
              </TableData>
              <TableData className="text-slate-500 whitespace-nowrap">
                {session.stayTime}
              </TableData>
              <TableData>
                <StatusBadge status={session.status} />
              </TableData>
              <TableData>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <PlayButtonIcon className="text-2xl" />
                </button>
              </TableData>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SessionTable;
