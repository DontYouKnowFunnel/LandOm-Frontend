import { Icon } from "@iconify/react";
import { getFunnelStageLabel, funnelIconMap } from "../../models/funnel";
import { ImproveActionIcon } from "../Icons";
import type { FunnelStage } from "../../models/funnel";
import Skeleton from "../ui/Skeleton";

interface FunnelStageDetailPanelProps {
  stage: FunnelStage;
  stages: FunnelStage[];
  isLoading?: boolean;
}

const toPercent = (ratio: number) => ratio * 100;

const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

const formatPercent = (value: number) => {
  const rounded = roundOneDecimal(value);
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
};

const formatSignedPercent = (value: number) => {
  const rounded = roundOneDecimal(value);
  if (rounded === 0) return "0%";
  return `${rounded > 0 ? "+" : ""}${
    Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)
  }%`;
};

const getDropoutRates = (stages: FunnelStage[]) => {
  return stages.map((currentStage, index) => {
    const nextStage = stages[index + 1];
    if (!nextStage) return 0;
    return Math.max(0, toPercent(currentStage.ratio - nextStage.ratio));
  });
};

const getFunnelScore = (averageDropoutDelta: number) => {
  const score = Math.round(70 + averageDropoutDelta * 1.5);
  return Math.min(100, Math.max(0, score));
};

const FunnelStageDetailPanel = ({
  stage,
  stages,
  isLoading = false,
}: FunnelStageDetailPanelProps) => {
  const StageSectionIcon = funnelIconMap[stage.funnelType];
  const stageLabel = getFunnelStageLabel(stage);
  const reachedUsersText = `${stage.reachedSection.toLocaleString()}명`;
  const reachRateText = formatPercent(toPercent(stage.ratio));
  const sortedStages = [...stages].sort((a, b) => a.id - b.id);
  const currentStageIndex = sortedStages.findIndex(
    (currentStage) => currentStage.id === stage.id
  );
  const dropoutRates = getDropoutRates(sortedStages);
  const transitionDropoutRates = dropoutRates.slice(0, -1);
  const averageDropoutRate =
    transitionDropoutRates.length > 0
      ? transitionDropoutRates.reduce((sum, rate) => sum + rate, 0) /
        transitionDropoutRates.length
      : 0;
  const dropoutRate =
    currentStageIndex >= 0 ? dropoutRates[currentStageIndex] ?? 0 : 0;
  const averageDropoutDelta = averageDropoutRate - dropoutRate;
  const dropoutRateText = formatPercent(dropoutRate);
  const averageDropoutDeltaText = formatSignedPercent(averageDropoutDelta);
  const funnelScoreText = `${getFunnelScore(averageDropoutDelta)}점`;

  return (
    <div className="h-full w-full bg-slate-50 p-5 flex flex-col gap-5">
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-600">
          {`퍼널 #${stage.id}`}
        </p>
        <div className="h-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StageSectionIcon />
            <p className="text-lg leading-7 font-semibold text-slate-700">
              {stageLabel}
            </p>
          </div>
          <Icon icon="lucide:info" className="text-slate-500 text-base" />
        </div>

        <div className="space-y-2 text-sm leading-5">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">도달 유저 수</p>
            {isLoading ? (
              <Skeleton height={20} width={80} />
            ) : (
              <p className="text-slate-900 font-semibold">{reachedUsersText}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 도달 비율</p>
            {isLoading ? (
              <Skeleton height={20} width={48} />
            ) : (
              <p className="text-slate-900 font-semibold">{reachRateText}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 이탈율</p>
            {isLoading ? (
              <Skeleton height={20} width={48} />
            ) : (
              <p className="text-slate-900 font-semibold">{dropoutRateText}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 이탈율 대비</p>
            {isLoading ? (
              <Skeleton height={20} width={48} />
            ) : (
              <p
                className={`font-semibold ${
                  averageDropoutDelta < 0 ? "text-red-500" : "text-blue-500"
                }`}
              >
                {averageDropoutDeltaText}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 퍼널 체류 시간</p>
            <p className="text-slate-900 font-semibold">--</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 체류 시간 대비</p>
            <p className="text-slate-900 font-semibold">--</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 점수</p>
            {isLoading ? (
              <Skeleton height={20} width={48} />
            ) : (
              <p className="text-slate-900 font-semibold">{funnelScoreText}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2.5">
        <p className="text-sm font-medium text-slate-600">
          이 퍼널에서 이탈한 세션
        </p>
        <div className="h-8 rounded-lg bg-slate-50 px-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
          <p className="flex-1 min-w-0">세션ID / 디바이스</p>
          <p className="flex-1 min-w-0">체류시간</p>
          <p className="w-8">재생</p>
        </div>
        <div className="h-[42px] rounded-lg border border-slate-100 bg-white px-2 py-1.5 flex items-center justify-center">
          <p className="text-xs font-medium text-slate-500">
            이탈한 세션 데이터가 없습니다.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-1 relative overflow-hidden"
        >
          <ImproveActionIcon className="text-base" />
          퍼널 개선하기
          <span
            className="absolute -right-7 -top-14 w-32 h-32 rounded-xl pointer-events-none"
            style={{
              background: "#2563EB",
              opacity: 0.33,
              filter: "blur(32px)",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default FunnelStageDetailPanel;
