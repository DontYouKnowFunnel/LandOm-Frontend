import type { EventDetail } from "../api/generated";

// rrweb EventType
const RRWebType = {
  FullSnapshot: 2,
  IncrementalSnapshot: 3,
  Custom: 5,
} as const;

// rrweb IncrementalSnapshot source
const IncrementalSource = {
  MouseInteraction: 2,
  Scroll: 3,
  Input: 5,
} as const;

// rrweb MouseInteraction type
const MouseInteractions = {
  Click: 2,
} as const;

interface RRWebEvent {
  type: number;
  timestamp: number;
  data: Record<string, unknown>;
}

export function rrwebEventsToTimeline(raw: unknown[]): EventDetail[] {
  const events = raw as RRWebEvent[];
  if (!events.length) return [];

  const result: EventDetail[] = [];

  const first = events[0];
  result.push({ type: "start", timestamp: first.timestamp });

  for (const e of events) {
    if (e.type === RRWebType.IncrementalSnapshot) {
      const source = e.data.source as number;
      const data = e.data;

      if (source === IncrementalSource.Scroll) {
        result.push({
          type: "scroll",
          timestamp: e.timestamp,
          payload: {
            yOffset: data.y,
            percentage: typeof data.y === "number" && typeof (data as Record<string, unknown>).height === "number"
              ? (data.y as number) / (data as Record<string, unknown>).height as number
              : undefined,
          },
        });
      } else if (source === IncrementalSource.MouseInteraction) {
        const interactionType = data.type as number;
        if (interactionType === MouseInteractions.Click) {
          result.push({
            type: "click",
            timestamp: e.timestamp,
            payload: { targetId: data.id },
          });
        }
      } else if (source === IncrementalSource.Input) {
        result.push({
          type: "input",
          timestamp: e.timestamp,
          payload: { fieldId: data.id },
        });
      }
    } else if (e.type === RRWebType.Custom) {
      const tag = e.data.tag as string | undefined;
      const payload = e.data.payload as Record<string, unknown> | undefined;
      if (tag === "ping" || tag === "section") {
        result.push({
          type: "ping",
          timestamp: e.timestamp,
          payload: { sectionId: payload?.sectionId ?? payload?.section },
        });
      }
    }
  }

  const last = events[events.length - 1];
  if (last && last.timestamp !== first.timestamp) {
    result.push({ type: "exit", timestamp: last.timestamp });
  }

  return result;
}
