import { PlayButtonIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";
import { StatusBadge } from "./Status";

type SessionStatus = "전환" | "이탈" | "탐색중";

export interface SessionRow {
  accessTime: string;
  sessionId: string;
  device: string;
  exitFunnel: string;
  stayTime: string;
  status: SessionStatus;
  replayUrl?: string;
}

interface SessionTableProps {
  sessions: SessionRow[];
  isLoading?: boolean;
  onPlay?: (sessionId: string) => void;
}

const formatSessionId = (sessionId: string) => {
  if (sessionId.length <= 21) return sessionId;
  return `${sessionId.slice(0, 18)}...`;
};

const SessionTable = ({ sessions, isLoading = false, onPlay }: SessionTableProps) => (
  <div className="min-h-[280px] rounded-xl border border-slate-200 bg-white p-3.5">
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
        {(isLoading
          ? (Array.from({ length: 4 }, (_, index): SessionRow => ({
              accessTime: `loading-${index}`,
              sessionId: `loading-${index}`,
              device: `loading-${index}`,
              exitFunnel: `loading-${index}`,
              stayTime: `loading-${index}`,
              status: "탐색중",
              replayUrl: undefined,
            })) as SessionRow[])
          : sessions.slice(0, 4)
        ).map((session, index) => (
          <div
            key={`${session.accessTime}-${session.sessionId}-${index}`}
            className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
          >
            <div className="w-full">
              {isLoading ? (
                <Skeleton height={16} />
              ) : (
                <span className="text-xs font-medium text-slate-900">{session.accessTime}</span>
              )}
            </div>
            <div className="flex min-w-0 w-full flex-col justify-center -space-y-0.5">
              {isLoading ? (
                <>
                  <Skeleton height={16} />
                  <Skeleton height={16} />
                </>
              ) : (
                <>
                  <span
                    className="block max-w-full truncate whitespace-nowrap text-xs font-medium text-slate-900"
                    title={session.sessionId}
                  >
                    {formatSessionId(session.sessionId)}
                  </span>
                  <span className="block max-w-full truncate whitespace-nowrap text-[11px] font-normal leading-4 text-slate-500">{session.device}</span>
                </>
              )}
            </div>
            <div className="w-full">
              {isLoading ? (
                <Skeleton height={16} />
              ) : (
                <span className="text-xs font-medium text-slate-900">{session.exitFunnel}</span>
              )}
            </div>
            <div className="w-full">
              {isLoading ? (
                <Skeleton height={16} />
              ) : (
                <span className="text-xs font-medium text-slate-900">{session.stayTime}</span>
              )}
            </div>
            <div className="w-full">
              {isLoading ? <Skeleton height={24} /> : <StatusBadge status={session.status} />}
            </div>
            <div className="flex w-8 shrink-0 justify-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onPlay?.(session.sessionId)}
                className="text-slate-600 transition-colors hover:text-slate-700 disabled:opacity-40"
              >
                <PlayButtonIcon className="text-2xl" />
              </button>
            </div>
          </div>
        ))}
        {!isLoading && sessions.length === 0 && (
          <div className="flex h-[186px] items-center justify-center rounded-lg border border-slate-100 bg-white px-2 py-4 text-center text-xs font-medium text-slate-400">
            최근 세션 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SessionTable;
