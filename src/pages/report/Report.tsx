import { useState } from "react";
// import { useGetFunnelAnalytics } from "../../hooks/api/useAnalytics";
import { ChevronDownIcon, ChevronRightIcon } from "../../components/Icons";
import FunnelAnalysisTableCard from "../../components/report/FunnelAnalysisTableCard";
import FunnelStageTrendPanel from "../../components/report/FunnelStageTrendPanel";
import FunnelStageOverviewPanel from "../../components/report/FunnelStageOverviewPanel";
import FunnelStageDetailPanel from "../../components/report/FunnelStageDetailPanel";
import { FunnelType } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";

const Report = () => {
  // const { data, isLoading } = useGetFunnelAnalytics();
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-1 items-center justify-center">
  //       <span className="text-slate-400 text-sm">로딩 중...</span>
  //     </div>
  //   );
  // }

  // const stageRatios = data?.funnelData
  //   ? [...data.funnelData].sort((a, b) => a.id - b.id).map((item) => item.ratio)
  //   : undefined;

  const funnelStages: FunnelStage[] = [
    { id: 1, funnelType: FunnelType.HERO, reachedSection: 10248, ratio: 1 },
    { id: 2, funnelType: FunnelType.PROBLEM, reachedSection: 7742, ratio: 0.73 },
    { id: 3, funnelType: FunnelType.TARGET, reachedSection: 6679, ratio: 0.65 },
    { id: 4, funnelType: FunnelType.PRICING, reachedSection: 5472, ratio: 0.51 },
    { id: 5, funnelType: FunnelType.CTA_SECTION, reachedSection: 2532, ratio: 0.25 },
  ];

  return (
    <div className="flex flex-1 flex-col p-5 gap-4 bg-slate-50 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="text-xl font-semibold text-slate-900">
            Bitda Landing Page
          </p>
          <ChevronRightIcon className="text-slate-900 text-base" />
          <p className="text-base font-medium text-slate-500">퍼널 분석</p>
        </div>
        <button
          type="button"
          className="h-9 bg-white border border-slate-200 rounded px-3 py-2 flex items-center gap-1.5 text-sm font-medium text-slate-500"
        >
          최근 30일
          <ChevronDownIcon className="text-xl text-slate-600" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden flex min-h-[650px]">
        <FunnelStageOverviewPanel
          stages={funnelStages}
          selectedStageId={selectedStage?.id ?? null}
          onSelectStage={setSelectedStage}
        />
        {selectedStage ? (
          <FunnelStageDetailPanel stage={selectedStage} stages={funnelStages} />
        ) : (
          <div className="flex-[10] min-w-0 bg-slate-50 flex items-center justify-center">
            <p className="text-lg font-medium text-slate-400">
              퍼널을 클릭해서 자세하게 알아보세요
            </p>
          </div>
        )}
      </div>
      <FunnelAnalysisTableCard stages={funnelStages} />
      <FunnelStageTrendPanel stages={funnelStages} />
    </div>
  );
};

export default Report;
