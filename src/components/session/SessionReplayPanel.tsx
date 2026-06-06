import { useGetSessionReplay, type SessionDto } from "../../api/generated";
import { StatusBadge } from "../main/Status";
import SessionReplayPlayer from "./SessionReplayPlayer";

const USE_MOCK = false;

const mapSessionStatus = (status?: string): "전환" | "이탈" | "탐색중" => {
  if (status === "CONVERTED") return "전환";
  if (status === "DROP") return "이탈";
  return "탐색중";
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getExitFunnelLabel = (session: SessionDto) => {
  if (session.status === "CONVERTED") return "전환 완료";
  return session.lastSection ?? "-";
};

const SummaryCard = ({
  label,
  value,
  wrapValue = false,
}: {
  label: string;
  value: string;
  wrapValue?: boolean;
}) => (
  <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
    <span className="block text-[11px] font-medium leading-4 text-slate-400">
      {label}
    </span>
    <span
      className={`block text-xs font-semibold leading-5 text-slate-800 ${
        wrapValue ? "whitespace-normal break-words" : "truncate"
      }`}
    >
      {value}
    </span>
  </div>
);

interface SessionReplayPanelProps {
  projectId: number;
  session: SessionDto;
}

const SessionReplayPanel = ({
  projectId,
  session,
}: SessionReplayPanelProps) => {
  const { data, isLoading: apiLoading } = useGetSessionReplay(
    projectId,
    session.sessionId ?? "",
    {
      query: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!session.sessionId && !USE_MOCK,
      },
    }
  );

  const isLoading = USE_MOCK ? false : apiLoading;

  const rrwebEvents: unknown[] = USE_MOCK ? [] : data?.events ?? [];

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-sm font-medium leading-5 text-slate-600">
              세션 상세
            </span>
            <span
              className="min-w-0 whitespace-normal break-all text-xs font-medium leading-5 text-slate-400"
              title={session.sessionId}
            >
              {session.sessionId ?? "-"}
            </span>
          </div>
          <div className="shrink-0">
            <StatusBadge status={mapSessionStatus(session.status)} />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
          <SummaryCard
            label="접속 일시"
            value={formatTimestamp(session.timestamp)}
          />
          <SummaryCard label="체류 시간" value={session.duration ?? "-"} />
          <SummaryCard
            label="이탈한 퍼널"
            value={getExitFunnelLabel(session)}
            wrapValue
          />
          <SummaryCard label="디바이스" value={session.device ?? "-"} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5">
        <span className="mb-3 block shrink-0 text-sm font-medium leading-5 text-slate-600">
          세션 리플레이
        </span>
        {isLoading ? (
          <div className="min-h-0 flex-1 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <SessionReplayPlayer events={rrwebEvents} />
        )}
      </div>
    </div>
  );
};

export default SessionReplayPanel;
