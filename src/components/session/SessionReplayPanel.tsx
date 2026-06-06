import { useGetSessionReplay, type SessionDto } from "../../api/generated";
import type { EventDetail } from "../../api/generated";
import { StatusBadge } from "../main/Status";
import Skeleton from "../ui/Skeleton";
import EventTimeline from "./EventTimeline";
import SessionReplayPlayer from "./SessionReplayPlayer";
import { MOCK_REPLAY_EVENTS } from "../../mocks/sessionMocks";
import { rrwebEventsToTimeline } from "../../utils/rrwebToTimeline";

const USE_MOCK = false;

const mapSessionStatus = (status?: string): "전환" | "이탈" | "탐색중" => {
  if (status === "CONVERTED") return "전환";
  if (status === "DROP") return "이탈";
  return "탐색중";
};

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

  // rrweb raw events for the player
  const rrwebEvents: unknown[] = USE_MOCK ? [] : data?.events ?? [];

  const events: EventDetail[] = USE_MOCK
    ? MOCK_REPLAY_EVENTS[session.sessionId ?? ""] ?? []
    : rrwebEventsToTimeline(rrwebEvents);

  const scrollEvents = events.filter(
    (e) => String(e.type ?? "").toLowerCase() === "scroll"
  );
  const clickEvents = events.filter(
    (e) => String(e.type ?? "").toLowerCase() === "click"
  );

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shrink-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-slate-700 break-all leading-5">
            {session.sessionId}
          </span>
          <div className="shrink-0">
            <StatusBadge status={mapSessionStatus(session.status)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">접속 일시</span>
            <span className="text-xs font-medium text-slate-700">
              {session.timestamp
                ? new Date(session.timestamp).toLocaleString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "-"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">체류시간</span>
            <span className="text-xs font-medium text-slate-700">
              {session.duration ?? "-"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">이탈 섹션</span>
            {session.status === "CONVERTED" ? (
              <span className="text-xs font-medium text-green-600">
                전환 완료
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-700 truncate">
                {session.lastSection ?? "-"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 col-span-3">
            <span className="text-[11px] text-slate-400">디바이스</span>
            <span className="text-xs font-medium text-slate-700 truncate">
              {session.device ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Session Replay Player */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shrink-0">
        <span className="text-xs font-medium text-slate-600 block mb-3">
          세션 리플레이
        </span>
        {isLoading ? (
          <div
            className="w-full animate-pulse rounded-lg bg-slate-100"
            style={{ aspectRatio: "16/10" }}
          />
        ) : (
          <SessionReplayPlayer events={rrwebEvents} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-4 shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          {isLoading ? (
            <Skeleton height={20} />
          ) : (
            <span className="text-base font-bold text-slate-800">
              {scrollEvents.length}
            </span>
          )}
          <span className="text-[11px] text-slate-400">스크롤</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          {isLoading ? (
            <Skeleton height={20} />
          ) : (
            <span className="text-base font-bold text-slate-800">
              {clickEvents.length}
            </span>
          )}
          <span className="text-[11px] text-slate-400">클릭</span>
        </div>
      </div>

      {/* Event timeline */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 flex-1">
        <span className="text-sm font-medium text-slate-600 shrink-0">
          이벤트 타임라인
        </span>
        {isLoading ? (
          <div className="flex flex-col gap-4 mt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-slate-100 shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 pt-1">
                  <Skeleton height={12} />
                  <Skeleton height={10} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EventTimeline events={events} />
        )}
      </div>
    </div>
  );
};

export default SessionReplayPanel;
