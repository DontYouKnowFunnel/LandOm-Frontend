import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  crawlProjectLandingPage,
  FunnelResponseStatus,
  getGetFunnelAnalyticsQueryKey,
  useGetProjectDetail,
  useGetFunnelAnalytics,
} from "../../api/generated";
import { ChevronDownIcon, ChevronRightIcon } from "../../components/Icons";
import FunnelAnalysisTableCard, {
  type FunnelAnalysisTableRow,
} from "../../components/report/FunnelAnalysisTableCard";
import FunnelStageTrendPanel from "../../components/report/FunnelStageTrendPanel";
import FunnelStageOverviewPanel from "../../components/report/FunnelStageOverviewPanel";
import FunnelStageDetailPanel from "../../components/report/FunnelStageDetailPanel";
import Skeleton from "../../components/ui/Skeleton";
import { FunnelType, getFunnelTypeFromSectionName } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";
import { getStoredProjectId } from "../../constants/project";

const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

const getDropoutRatePercent = (stages: FunnelStage[], index: number) => {
  const currentStage = stages[index];
  const nextStage = stages[index + 1];
  if (!currentStage || !nextStage) return 0;
  return roundOneDecimal(
    Math.max(0, (currentStage.ratio - nextStage.ratio) * 100)
  );
};

const Report = () => {
  const selectedProjectId = getStoredProjectId();
  const queryClient = useQueryClient();
  const [statusOverride, setStatusOverride] =
    useState<FunnelResponseStatus | null>(null);
  const { data: projectDetail, isLoading: isProjectDetailLoading } =
    useGetProjectDetail(selectedProjectId ?? 0, {
      query: {
        enabled: !!selectedProjectId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    });
  const { data: funnelDataResponse, isLoading: isFunnelLoading } =
    useGetFunnelAnalytics(selectedProjectId ?? 0, {
      query: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        refetchInterval: (query) => {
          const status = query.state.data?.status;
          if (status === FunnelResponseStatus.IN_PROGRESS) return 3000;
          if (statusOverride === FunnelResponseStatus.IN_PROGRESS) return 3000;
          return false;
        },
      },
    });

  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);

  const fallbackStages: FunnelStage[] = [
    { id: 1, funnelType: FunnelType.HERO, reachedSection: 10248, ratio: 1 },
    {
      id: 2,
      funnelType: FunnelType.PROBLEM,
      reachedSection: 7742,
      ratio: 0.73,
    },
    { id: 3, funnelType: FunnelType.TARGET, reachedSection: 6679, ratio: 0.65 },
    {
      id: 4,
      funnelType: FunnelType.PRICING,
      reachedSection: 5472,
      ratio: 0.51,
    },
    {
      id: 5,
      funnelType: FunnelType.CTA_SECTION,
      reachedSection: 2532,
      ratio: 0.25,
    },
  ];

  const apiStages: FunnelStage[] =
    funnelDataResponse?.funnelData?.map((stage, index) => ({
      id: index + 1,
      funnelType: getFunnelTypeFromSectionName(stage.sectionName),
      sectionName: stage.sectionName,
      reachedSection: stage.reachedUserCount ?? 0,
      ratio: stage.reachRate ?? 0,
    })) ?? [];
  const emptyStages: FunnelStage[] = [
    { id: 1, funnelType: FunnelType.HERO, reachedSection: 0, ratio: 1 },
    { id: 2, funnelType: FunnelType.PROBLEM, reachedSection: 0, ratio: 0.73 },
    { id: 3, funnelType: FunnelType.TARGET, reachedSection: 0, ratio: 0.65 },
    { id: 4, funnelType: FunnelType.PRICING, reachedSection: 0, ratio: 0.51 },
    {
      id: 5,
      funnelType: FunnelType.CTA_SECTION,
      reachedSection: 0,
      ratio: 0.25,
    },
  ];

  const currentStatus = funnelDataResponse?.status ?? statusOverride;
  const isCompleted = currentStatus === FunnelResponseStatus.COMPLETED;
  const isInProgress = currentStatus === FunnelResponseStatus.IN_PROGRESS;
  const isFailed = currentStatus === FunnelResponseStatus.FAILED;
  const isNotCreated =
    currentStatus === FunnelResponseStatus.NOT_CREATED ||
    !currentStatus ||
    !selectedProjectId;

  const shouldShowStatusOverlay =
    !isFunnelLoading && (isNotCreated || isInProgress || isFailed);
  const isNotCreatedLike = isNotCreated || isInProgress || isFailed;
  const funnelStages = isCompleted
    ? apiStages.length > 0
      ? apiStages
      : emptyStages
    : fallbackStages;
  const funnelStageCount = isCompleted
    ? funnelDataResponse?.funnelData?.length ?? 0
    : fallbackStages.length;
  const analysisRows: FunnelAnalysisTableRow[] = isCompleted
    ? funnelDataResponse?.funnelData?.map((stage, index) => {
        return {
          id: index + 1,
          funnelType: getFunnelTypeFromSectionName(stage.sectionName),
          sectionName: stage.sectionName,
          reachedUsers: stage.reachedUserCount ?? 0,
          reachRate: roundOneDecimal((stage.reachRate ?? 0) * 100),
          dropoutRate: getDropoutRatePercent(apiStages, index),
          stayTime: stage.avgDuration ?? "--:--",
        };
      }) ?? []
    : [];
  const selectedStageForDetail = selectedStage
    ? funnelStages.find((stage) => stage.id === selectedStage.id) ??
      selectedStage
    : null;

  const statusMessage = isInProgress
    ? "퍼널 분석 진행중..."
    : isFailed
    ? "퍼널 분석을 실패했습니다.\n다시 시도해주세요."
    : "퍼널 정보가 등록되지 않았습니다.\n퍼널 분석을 진행해주세요.";
  const projectName = projectDetail?.name ?? "프로젝트";

  const { mutate: startFunnelAnalysis, isPending: isCrawling } = useMutation({
    mutationFn: async () => {
      if (!selectedProjectId) {
        throw new Error("PROJECT_ID_MISSING");
      }
      return crawlProjectLandingPage(selectedProjectId);
    },
    onSuccess: async () => {
      setStatusOverride(FunnelResponseStatus.IN_PROGRESS);
      if (!selectedProjectId) return;

      await queryClient.invalidateQueries({
        queryKey: getGetFunnelAnalyticsQueryKey(selectedProjectId),
      });
    },
  });

  return (
    <div className="flex flex-1 flex-col p-5 gap-4 bg-slate-50 overflow-y-auto">
      <div className="flex items-center justify-between">
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

      <div className="relative bg-white border border-slate-200 rounded-[14px] overflow-hidden flex min-h-[650px]">
        <div className="flex w-full">
          <div className="relative flex-[3_1_0] min-w-0 self-stretch border-r border-slate-200">
            <FunnelStageOverviewPanel
              stages={funnelStages}
              selectedStageId={selectedStage?.id ?? null}
              onSelectStage={setSelectedStage}
              isLoading={isFunnelLoading}
              mutedVisual={shouldShowStatusOverlay || isFunnelLoading}
              totalCount={funnelStageCount}
            />
            {shouldShowStatusOverlay && (
              <>
                <div className="absolute inset-0 z-20 backdrop-blur-[8px]" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5">
                  {isInProgress ? (
                    <div className="mb-[10px] h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500" />
                  ) : null}
                  <p className="whitespace-pre-line text-center text-base font-normal leading-6 text-slate-900">
                    {statusMessage}
                  </p>
                  {(isNotCreated || isFailed) && (
                    <button
                      type="button"
                      onClick={() => startFunnelAnalysis()}
                      disabled={isCrawling || !selectedProjectId}
                      className="mt-2.5 h-9 w-32 rounded-lg bg-blue-500 text-sm font-semibold leading-5 text-white"
                    >
                      {isCrawling ? "요청 중..." : "퍼널 분석하기"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex-[2_1_0] min-w-0 self-stretch">
            {selectedStageForDetail ? (
              <FunnelStageDetailPanel
                stage={selectedStageForDetail}
                stages={funnelStages}
                isLoading={isFunnelLoading}
              />
            ) : (
              <div className="h-full w-full bg-slate-50 flex items-center justify-center">
                <p className="text-lg font-medium text-slate-400">
                  퍼널을 클릭해서 자세하게 알아보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FunnelAnalysisTableCard
        stages={isCompleted ? funnelStages : []}
        rows={analysisRows}
        isLoading={isFunnelLoading}
      />
      <FunnelStageTrendPanel
        stages={isCompleted ? funnelStages : []}
        rows={analysisRows}
        isLoading={isFunnelLoading}
        showEmptyState={isNotCreatedLike}
      />
    </div>
  );
};

export default Report;
