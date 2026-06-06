import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetProjectDetail,
  useGetRecentSessions,
  type SessionDto,
} from "../../api/generated";
import { getStoredProjectId } from "../../constants/project";
import { StatusBadge } from "../../components/main/Status";
import Skeleton from "../../components/ui/Skeleton";
import SessionReplayPanel from "../../components/session/SessionReplayPanel";
import { Icon } from "@iconify/react";
import { MOCK_SESSIONS } from "../../mocks/sessionMocks";
import { ChevronRightIcon } from "../../components/Icons";

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

interface SessionListItemProps {
  session: SessionDto;
  isSelected: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

const SessionListItem = ({
  session,
  isSelected,
  onClick,
  isLoading = false,
}: SessionListItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`flex w-full flex-col gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
        isSelected
          ? "border-blue-200 bg-blue-50"
          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {isLoading ? (
          <div className="flex-1">
            <Skeleton height={16} />
          </div>
        ) : (
          <>
            <div className="min-w-0">
              <span
                className="block max-w-full whitespace-normal break-all text-xs font-semibold leading-4 text-slate-900"
                title={session.sessionId}
              >
                {session.sessionId ?? "-"}
              </span>
              <span className="block max-w-full truncate whitespace-nowrap text-[11px] leading-4 text-slate-500">
                {session.device ?? "-"}
              </span>
            </div>
            <div className="shrink-0">
              <StatusBadge
                status={mapSessionStatus(session.status)}
                showIcon={false}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(64px,0.72fr)_minmax(0,1.5fr)] gap-1.5">
        {isLoading ? (
          <>
            <Skeleton height={34} />
            <Skeleton height={34} />
            <Skeleton height={34} />
          </>
        ) : (
          <>
            <div className="min-w-0 rounded-md bg-slate-50 px-2 py-1">
              <span className="block text-[10px] font-medium leading-3 text-slate-400">
                접속 시간
              </span>
              <span className="block truncate text-[11px] font-medium leading-4 text-slate-700">
                {formatTimestamp(session.timestamp)}
              </span>
            </div>
            <div className="min-w-0 rounded-md bg-slate-50 px-2 py-1">
              <span className="block text-[10px] font-medium leading-3 text-slate-400">
                체류 시간
              </span>
              <span className="block truncate text-[11px] font-medium leading-4 text-slate-700">
                {session.duration ?? "-"}
              </span>
            </div>
            <div className="min-w-0 rounded-md bg-slate-50 px-2 py-1">
              <span className="block text-[10px] font-medium leading-3 text-slate-400">
                이탈한 퍼널
              </span>
              <span className="block whitespace-normal break-words text-[11px] font-medium leading-4 text-slate-700">
                {getExitFunnelLabel(session)}
              </span>
            </div>
          </>
        )}
      </div>
    </button>
  );
};

const SKELETON_SESSIONS: SessionDto[] = Array.from({ length: 6 }, (_, i) => ({
  sessionId: `loading-${i}`,
}));

const Session = () => {
  const projectId = getStoredProjectId();
  const [selectedSession, setSelectedSession] = useState<SessionDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: projectDetail, isLoading: isProjectDetailLoading } =
    useGetProjectDetail(projectId ?? 0, {
      query: {
        enabled: !!projectId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    });

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
  const projectName = projectDetail?.name ?? "프로젝트";

  useEffect(() => {
    const targetId = searchParams.get("sessionId");
    if (!targetId || isLoading || allSessions.length === 0) return;
    const found = allSessions.find((s) => s.sessionId === targetId);
    if (found) setSelectedSession(found);
  }, [searchParams, allSessions, isLoading]);

  const handleSelectSession = (session: SessionDto) => {
    setSelectedSession(session);
    const nextSearchParams = new URLSearchParams(searchParams);

    if (session.sessionId) {
      nextSearchParams.set("sessionId", session.sessionId);
    } else {
      nextSearchParams.delete("sessionId");
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

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
      <div className="flex shrink-0 items-center justify-start">
        <div className="flex items-center gap-1">
          {isProjectDetailLoading ? (
            <div className="w-52">
              <Skeleton height={28} className="bg-slate-300" />
            </div>
          ) : (
            <p className="text-xl font-semibold text-slate-900">
              {projectName}
            </p>
          )}
          <ChevronRightIcon className="text-base text-slate-900" />
          <p className="text-base font-medium text-slate-500">사용자 세션</p>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden rounded-[14px] border border-slate-200 bg-white p-5">
        <section className="flex w-[380px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium leading-5 text-slate-600">
                세션 목록
              </span>
              {!isLoading && (
                <span className="text-xs font-medium text-slate-400">
                  {sessions.length}개
                </span>
              )}
            </div>

            <div className="relative">
              <Icon
                icon="lucide:search"
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="세션 ID, 기기, 섹션 검색"
                className="w-full rounded border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-7 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label="검색어 지우기"
                >
                  <Icon icon="lucide:x" className="text-[13px]" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
            {(isLoading ? SKELETON_SESSIONS : sessions).map((session, index) => (
              <SessionListItem
                key={session.sessionId ?? index}
                session={session}
                isSelected={
                  !isLoading &&
                  selectedSession?.sessionId === session.sessionId
                }
                isLoading={isLoading}
                onClick={() => {
                  if (!isLoading) handleSelectSession(session);
                }}
              />
            ))}

            {!isLoading && sessions.length === 0 && (
              <div className="flex h-[186px] items-center justify-center rounded-lg border border-slate-100 bg-white px-2 py-4 text-center text-xs font-medium text-slate-400">
                {searchQuery.trim()
                  ? "검색 결과가 없습니다."
                  : "최근 세션 데이터가 없습니다."}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-w-0 flex-1 overflow-hidden">
          {selectedSession ? (
            <SessionReplayPanel projectId={projectId} session={selectedSession} />
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-400">
              세션을 선택해 주세요.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Session;
