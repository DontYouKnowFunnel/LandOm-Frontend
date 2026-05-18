import { getFunnelLabel } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";
import Skeleton from "../ui/Skeleton";

const DEFAULT_TABLE_HEADERS = [
  "퍼널 타입",
  "도달 유저 수",
  "도달율",
  "이탈율",
  "체류시간",
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
  isLoading?: boolean;
}

const FunnelAnalysisTableCard = ({
  title = "퍼널 분석",
  headers = DEFAULT_TABLE_HEADERS,
  rows = [],
  stages,
  isLoading = false,
}: FunnelAnalysisTableCardProps) => {
  const resolvedRows =
    rows && rows.length > 0
      ? rows
      : stages && stages.length > 0
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

        {resolvedRows.length === 0 ? (
          <div className="h-[186px] rounded-lg border border-slate-100 bg-white px-2 py-1.5 flex items-center justify-center">
            <p className="text-xs font-medium text-slate-500">
              퍼널 분석 결과가 없습니다.
            </p>
          </div>
        ) : (
          resolvedRows.map((row) => (
            <div
              key={row.id}
              className="h-[42px] rounded-lg border border-slate-100 bg-white px-2 flex items-center gap-1"
            >
              <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
                {getFunnelLabel(row.funnelType)} Section
              </p>
              <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
                {isLoading ? (
                  <Skeleton height={20} width={72} />
                ) : (
                  row.reachedUsers.toLocaleString()
                )}
              </p>
              <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
                {isLoading ? (
                  <Skeleton height={20} width={40} />
                ) : (
                  `${row.reachRate}%`
                )}
              </p>
              <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
                {isLoading ? (
                  <Skeleton height={20} width={40} />
                ) : (
                  `${row.dropoutRate}%`
                )}
              </p>
              <p className="flex-1 min-w-0 text-sm font-medium text-slate-900">
                {isLoading ? <Skeleton height={20} width={56} /> : row.stayTime}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FunnelAnalysisTableCard;
