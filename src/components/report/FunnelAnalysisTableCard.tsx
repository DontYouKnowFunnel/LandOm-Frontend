import { FunnelType, getFunnelLabel } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";

const DEFAULT_TABLE_HEADERS = [
  "퍼널 타입",
  "도달 유저 수",
  "도달율",
  "이탈율",
  "체류시간",
];

const DEFAULT_TABLE_ROWS: FunnelAnalysisTableRow[] = [
  {
    id: 1,
    funnelType: FunnelType.HERO,
    reachedUsers: 10248,
    reachRate: 100,
    dropoutRate: 0,
    stayTime: "00:48",
  },
  {
    id: 2,
    funnelType: FunnelType.PROBLEM,
    reachedUsers: 7742,
    reachRate: 73,
    dropoutRate: 27,
    stayTime: "01:11",
  },
  {
    id: 3,
    funnelType: FunnelType.TARGET,
    reachedUsers: 6679,
    reachRate: 65,
    dropoutRate: 8,
    stayTime: "01:25",
  },
  {
    id: 4,
    funnelType: FunnelType.PRICING,
    reachedUsers: 5472,
    reachRate: 51,
    dropoutRate: 14,
    stayTime: "00:36",
  },
  {
    id: 5,
    funnelType: FunnelType.CTA_SECTION,
    reachedUsers: 2532,
    reachRate: 25,
    dropoutRate: 26,
    stayTime: "00:57",
  },
];

export type FunnelAnalysisTableRow = {
  id: number;
  funnelType: FunnelType;
  reachedUsers: number;
  reachRate: number;
  dropoutRate: number;
  stayTime: string;
};

interface FunnelAnalysisTableCardProps {
  title?: string;
  headers?: string[];
  rows?: FunnelAnalysisTableRow[];
  stages?: FunnelStage[];
}

const FunnelAnalysisTableCard = ({
  title = "퍼널 분석",
  headers = DEFAULT_TABLE_HEADERS,
  rows = DEFAULT_TABLE_ROWS,
  stages,
}: FunnelAnalysisTableCardProps) => {
  const resolvedRows =
    stages && stages.length > 0
      ? stages.map((stage) => ({
          id: stage.id,
          funnelType: stage.funnelType,
          reachedUsers: stage.reachedSection,
          reachRate: Math.round(stage.ratio * 100),
          dropoutRate: Math.max(0, 100 - Math.round(stage.ratio * 100)),
          stayTime: "--:--",
        }))
      : rows;

  return (
    <div className="bg-white border border-slate-200 rounded-[14px] p-5">
      <p className="text-sm text-slate-600 font-medium mb-2.5">{title}</p>

      <div className="space-y-2.5">
        <div className="h-8 rounded-lg bg-slate-50 px-2 flex items-center gap-1">
          {headers.map((header) => (
            <p
              key={header}
              className="flex-1 min-w-0 text-sm font-semibold text-slate-500"
            >
              {header}
            </p>
          ))}
        </div>

        {resolvedRows.map((row) => (
          <div
            key={row.id}
            className="h-[42px] rounded-lg border border-slate-100 bg-white px-2 flex items-center gap-1"
          >
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
              {getFunnelLabel(row.funnelType)} Section
            </p>
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
              {row.reachedUsers.toLocaleString()}
            </p>
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
              {row.reachRate}%
            </p>
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
              {row.dropoutRate}%
            </p>
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
              {row.stayTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelAnalysisTableCard;
