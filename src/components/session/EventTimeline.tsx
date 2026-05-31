import { useState } from "react";
import { Icon } from "@iconify/react";
import type { EventDetail } from "../../api/generated";

const formatRelativeTime = (timestamp: number, baseTimestamp: number) => {
  const diff = (timestamp - baseTimestamp) / 1000;
  if (diff < 60) return `+${diff.toFixed(1)}s`;
  const min = Math.floor(diff / 60);
  const sec = Math.floor(diff % 60);
  return `+${min}m ${sec}s`;
};

const getEventStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case "start":
      return {
        icon: "lucide:play-circle",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        label: "세션 시작",
      };
    case "scroll":
      return {
        icon: "lucide:arrow-down",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        label: "스크롤",
      };
    case "click":
      return {
        icon: "lucide:mouse-pointer-click",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        label: "클릭",
      };
    case "input":
      return {
        icon: "lucide:keyboard",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        label: "입력",
      };
    case "ping":
      return {
        icon: "lucide:map-pin",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        label: "섹션 진입",
      };
    case "visibility":
      return {
        icon: "lucide:eye",
        color: "text-slate-500",
        bg: "bg-slate-100",
        border: "border-slate-200",
        label: "탭 전환",
      };
    case "exit":
      return {
        icon: "lucide:log-out",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        label: "이탈",
      };
    default:
      return {
        icon: "lucide:play-circle",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        label: "세션 시작",
      };
  }
};

const getEventDetail = (event: EventDetail): string => {
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  switch (String(event.type ?? "").toLowerCase()) {
    case "scroll": {
      const pct =
        payload.percentage != null
          ? ` (${(Number(payload.percentage) * 100).toFixed(0)}%)`
          : "";
      return `${payload.yOffset ?? ""}px${pct}`;
    }
    case "click":
      return String(payload.targetId ?? event.cssSelector ?? "");
    case "input":
      return `필드: ${payload.fieldId ?? event.cssSelector ?? ""}`;
    case "ping":
      return `섹션: ${payload.sectionId ?? ""}`;
    case "visibility":
      return payload.isVisible ? "탭 활성화" : "탭 비활성화";
    case "exit":
      return `${payload.lastElementId ?? ""} · 최대 ${payload.maxDepth ?? ""}%`;
    default:
      return "";
  }
};

const COLLAPSED_COUNT = 5;

interface EventTimelineProps {
  events: EventDetail[];
}

const EventTimeline = ({ events }: EventTimelineProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-slate-400">
        이벤트 데이터가 없습니다.
      </div>
    );
  }

  const baseTimestamp = events[0]?.timestamp ?? 0;
  const visible = expanded ? events : events.slice(0, COLLAPSED_COUNT);
  const hasMore = events.length > COLLAPSED_COUNT;

  return (
    <div className="flex flex-col">
      {visible.map((event, index) => {
        const style = getEventStyle(String(event.type ?? ""));
        const detail = getEventDetail(event);
        const relTime =
          event.timestamp != null
            ? formatRelativeTime(event.timestamp, baseTimestamp)
            : "";
        const isLast = index === visible.length - 1 && (!hasMore || expanded);

        return (
          <div
            key={`${event.type}-${event.timestamp}-${index}`}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center shrink-0 w-7">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full border ${style.bg} ${style.border} shrink-0`}
              >
                <Icon icon={style.icon} className={`text-xs ${style.color}`} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 min-h-3 bg-slate-200 my-0.5" />
              )}
            </div>

            <div
              className={`flex flex-col min-w-0 ${isLast ? "pb-0" : "pb-3"}`}
            >
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold ${style.color}`}>
                  {style.label}
                </span>
                {relTime && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {relTime}
                  </span>
                )}
              </div>
              {detail && (
                <span className="text-xs text-slate-500 break-all leading-4 mt-0.5">
                  {detail}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium self-start"
        >
          <Icon
            icon={expanded ? "lucide:chevron-up" : "lucide:chevron-down"}
            className="text-sm"
          />
          {expanded ? "접기" : `${events.length - COLLAPSED_COUNT}개 더 보기`}
        </button>
      )}
    </div>
  );
};

export default EventTimeline;
