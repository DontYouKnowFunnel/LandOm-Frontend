import { useMemo, useState } from "react";
import { getFunnelStageLabel, funnelIconMap } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";
import { ChevronRightIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";

interface FunnelStageOverviewPanelProps {
  stages: FunnelStage[];
  onSelectStage?: (stage: FunnelStage) => void;
  selectedStageId?: number | null;
  isLoading?: boolean;
  mutedVisual?: boolean;
  totalCount?: number;
}

const FunnelStageOverviewPanel = ({
  stages,
  onSelectStage,
  selectedStageId,
  isLoading = false,
  mutedVisual = false,
  totalCount,
}: FunnelStageOverviewPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreThanFiveStages = stages.length > 5;
  const visibleStages = useMemo(
    () => (isExpanded ? stages : stages.slice(0, 5)),
    [isExpanded, stages]
  );
  const graphCount = totalCount ?? stages.length;

  const formatReachedText = (stage: FunnelStage) => {
    const reachedUsers = stage.reachedSection.toLocaleString();
    const reachedRate = Math.round(stage.ratio * 100);
    return `${reachedUsers}명 도달 (${reachedRate}%)`;
  };

  return (
    <div className="min-h-full w-full bg-white">
      <div className="px-5 pt-5 pb-1.5">
        <div className="flex items-center gap-1 text-sm text-slate-600 font-semibold">
          <p>퍼널 그래프</p>
          {isLoading ? (
            <div className="w-10">
              <Skeleton height={20} className="bg-slate-300" />
            </div>
          ) : (
            <span className="font-medium text-slate-400">({graphCount}개)</span>
          )}
        </div>
      </div>
      {visibleStages.map((stage) => {
        const StageSectionIcon = funnelIconMap[stage.funnelType];
        const stageLabel = getFunnelStageLabel(stage);

        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelectStage?.(stage)}
            className={`w-full text-left space-y-2 p-5 ${
              selectedStageId === stage.id
                ? "bg-slate-50 border-t border-b box-border border-slate-200"
                : "hover:bg-slate-50/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <StageSectionIcon
                className={mutedVisual ? "section-icon-muted" : ""}
              />
              {isLoading ? (
                <div className="w-40">
                  <Skeleton height={28} className="bg-slate-300" />
                </div>
              ) : (
                <p className="text-lg leading-7 font-medium text-slate-900">
                  {stageLabel}
                </p>
              )}
              {!isLoading && (
                <ChevronRightIcon className="text-slate-500 text-base" />
              )}
              <div className="min-w-[168px]">
                {isLoading ? (
                  <Skeleton height={28} className="bg-slate-300" />
                ) : (
                  <p className="text-lg leading-7 font-normal text-slate-500">
                    {formatReachedText(stage)}
                  </p>
                )}
              </div>
            </div>
            <div className="h-8 rounded-lg bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-lg ${
                  mutedVisual ? "bg-blue-100" : "bg-blue-500"
                }`}
                style={{ width: `${stage.ratio * 100}%` }}
              />
            </div>
          </button>
        );
      })}
      {hasMoreThanFiveStages && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full border-t border-slate-200 py-3 text-sm font-medium text-slate-700"
        >
          {isExpanded ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  );
};

export default FunnelStageOverviewPanel;
