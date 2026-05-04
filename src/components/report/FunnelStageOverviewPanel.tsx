import { getFunnelLabel, funnelIconMap } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";
import { ChevronRightIcon } from "../Icons";

interface FunnelStageOverviewPanelProps {
  stages: FunnelStage[];
  onSelectStage?: (stage: FunnelStage) => void;
  selectedStageId?: number | null;
}

const FunnelStageOverviewPanel = ({
  stages,
  onSelectStage,
  selectedStageId,
}: FunnelStageOverviewPanelProps) => {
  const formatReachedText = (stage: FunnelStage) => {
    const reachedUsers = stage.reachedSection.toLocaleString();
    const reachedRate = Math.round(stage.ratio * 100);
    return `${reachedUsers}명 도달 (${reachedRate}%)`;
  };

  return (
    <div className="flex-[17] min-w-0 border-r border-slate-200 bg-white">
      <div className="px-5 pt-5 pb-1.5">
        <p className="text-sm text-slate-600 font-semibold">
          퍼널 그래프 <span className="font-medium text-slate-400">(5개)</span>
        </p>
      </div>
      {stages.map((stage) => {
        const StageSectionIcon = funnelIconMap[stage.funnelType];
        const stageLabel = `${getFunnelLabel(stage.funnelType)} Section`;

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
              <StageSectionIcon />
              <p className="text-lg leading-7 font-medium text-slate-900">
                {stageLabel}
              </p>
              <ChevronRightIcon className="text-slate-500 text-base" />
              <p className="text-lg leading-7 font-normal text-slate-500">
                {formatReachedText(stage)}
              </p>
            </div>
            <div className="h-8 rounded-lg bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-lg bg-blue-500"
                style={{ width: `${stage.ratio * 100}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FunnelStageOverviewPanel;
