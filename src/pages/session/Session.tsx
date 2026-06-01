import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetRecentSessions, type SessionDto } from "../../api/generated";
import { getStoredProjectId } from "../../constants/project";
import { StatusBadge } from "../../components/main/Status";
import Skeleton from "../../components/ui/Skeleton";
import SessionReplayPanel from "../../components/session/SessionReplayPanel";
import { Icon } from "@iconify/react";
import { MOCK_SESSIONS } from "../../mocks/sessionMocks";

const USE_MOCK = false;

const mapSessionStatus = (status?: string): "전환" | "이탈" | "탐색중" => {
  if (status === "CONVERTED") return "전환";
  if (status === "DROP") return "이탈";
  return "탐색중";
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "";
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


interface SessionRowItemProps {
  session: SessionDto;
  isSelected: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

const SessionRowItem = ({
  session,
  isSelected,
  onClick,
  isLoading = false,
}: SessionRowItemProps) => {
  const sectionLabel =
    session.status === "CONVERTED" ? "전환 완료" : session.lastSection;
  const metaParts = isLoading
    ? []
    : [formatTimestamp(session.timestamp), session.duration, sectionLabel].filter(Boolean);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex flex-col gap-1 px-3 py-2.5 transition-colors ${
        isSelected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
      }`}
    >
      {/* Row 1: Session ID + Status */}
      <div className="flex items-center justify-between gap-2">
        {isLoading ? (
          <div className="flex-1">
            <Skeleton height={13} />
          </div>
        ) : (
          <>
            <span className="text-xs font-semibold text-slate-900 font-mono truncate">
              {session.sessionId}
            </span>
            <div className="shrink-0">
              <StatusBadge status={mapSessionStatus(session.status)} showIcon={false} />
            </div>
          </>
        )}
      </div>

      {/* Row 2: Meta text */}
      {isLoading ? (
        <div className="w-3/4">
          <Skeleton height={11} />
        </div>
      ) : (
        <span className="text-[11px] text-slate-400 truncate leading-4">
          {metaParts.join(" · ") || "-"}
        </span>
      )}

      {/* Row 3: Device text */}
      {isLoading ? (
        <div className="w-1/2 mt-0.5">
          <Skeleton height={11} />
        </div>
      ) : session.device ? (
        <span className="text-[11px] text-slate-400 truncate leading-4">
          {session.device}
        </span>
      ) : null}
    </button>
  );
};

const SKELETON_SESSIONS: SessionDto[] = Array.from({ length: 8 }, (_, i) => ({
  sessionId: `loading-${i}`,
}));

const Session = () => {
  const projectId = getStoredProjectId();
  const [selectedSession, setSelectedSession] = useState<SessionDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  const { data, isLoading: apiLoading } = useGetRecentSessions(
    projectId ?? 0,
    { limit: 20 },
    {
      query: {
        enabled: !!projectId && !USE_MOCK,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    }
  );

  const isLoading = USE_MOCK ? false : apiLoading;
  const allSessions = USE_MOCK ? MOCK_SESSIONS : (data?.sessions ?? []);

  useEffect(() => {
    const targetId = searchParams.get("sessionId");
    if (!targetId || isLoading || allSessions.length === 0) return;
    const found = allSessions.find((s) => s.sessionId === targetId);
    if (found) setSelectedSession(found);
  }, [searchParams, allSessions, isLoading]);
  const sessions = searchQuery.trim()
    ? allSessions.filter(
        (s) =>
          s.sessionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.device?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastSection?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSessions;

  if (!projectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Icon icon="lucide:folder-open" className="text-3xl" />
          <span className="text-sm font-medium">프로젝트를 선택해 주세요.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden bg-slate-50 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Icon icon="lucide:activity" className="text-lg text-slate-700" />
        <span className="text-xl font-semibold text-slate-900">사용자 세션</span>
        {!isLoading && (
          <span className="text-sm text-slate-400 font-normal">
            ({allSessions.length}개)
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-0 overflow-hidden rounded-[14px] border border-slate-200 bg-white">
        {/* Left: Session list */}
        <div className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200">
          {/* List header + search */}
          <div className="flex flex-col gap-2 px-3 pt-3 pb-2 shrink-0 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">세션 목록</span>
              {!isLoading && searchQuery.trim() && (
                <span className="text-[11px] text-slate-400">
                  {sessions.length} / {allSessions.length}
                </span>
              )}
            </div>
            <div className="relative">
              <Icon
                icon="lucide:search"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="세션 ID, 기기, 섹션 검색"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Icon icon="lucide:x" className="text-[13px]" />
                </button>
              )}
            </div>
          </div>

          {/* Session rows */}
          <div className="flex flex-col overflow-y-auto flex-1 divide-y divide-slate-100">
            {(isLoading ? SKELETON_SESSIONS : sessions).map((session, index) => (
              <SessionRowItem
                key={session.sessionId ?? index}
                session={session}
                isSelected={
                  !isLoading && selectedSession?.sessionId === session.sessionId
                }
                isLoading={isLoading}
                onClick={() => {
                  if (!isLoading) setSelectedSession(session);
                }}
              />
            ))}

            {!isLoading && sessions.length === 0 && (
              <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                {searchQuery.trim() ? "검색 결과가 없습니다." : "세션 데이터가 없습니다."}
              </div>
            )}
          </div>
        </div>

        {/* Right: Replay panel */}
        <div className="flex flex-1 min-w-0 overflow-y-auto p-5">
          {selectedSession ? (
            <div className="w-full">
              <SessionReplayPanel projectId={projectId} session={selectedSession} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
              <Icon icon="lucide:play-circle" className="text-4xl text-slate-300" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-slate-500">
                  세션을 선택하면 리플레이를 볼 수 있어요
                </span>
                <span className="text-xs text-slate-400">
                  왼쪽 목록에서 세션을 클릭하세요
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Session;
