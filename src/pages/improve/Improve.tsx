import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FunnelResponseStatus,
  getGetSectionOptimizationPlanQueryOptions,
  OptimizationPlanResponseCodeGenerationStatus,
  useGetCodegenResult,
  useGetFunnelAnalytics,
  useGetProjectCodegenResults,
  useGetProjectList,
  useGetRecentSessions,
  useGetSectionSource,
  useGetSectionOptimizationPlan,
  useRequestCodegen,
  useRequestSectionOptimization,
  type CodegenResponse,
  type FunnelData,
  type OptimizationPlanResponse,
  type OptimizationRecommendationResponse,
  type SectionSourceResponse,
  type SessionDto,
} from "../../api/generated";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDropDownRoundedIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DashboardIcon,
  FileOutlineIcon,
  FunnelIcon,
  GlobeIcon,
  ImproveActionIcon,
  ImproveBackgroundIcon,
  LoadingLoopIcon,
  MegaphoneIcon,
  PlayButtonIcon,
  RefreshIcon,
  SelectIcon,
} from "../../components/Icons";
import NewProjectModal from "../../components/main/NewProjectModal";
import Skeleton from "../../components/ui/Skeleton";
import {
  getStoredProjectId,
  SELECTED_PROJECT_CHANGED_EVENT,
  setStoredProjectId,
} from "../../constants/project";
import {
  FunnelType,
  funnelIconMap,
  getFunnelStageLabel,
  getFunnelTypeFromSectionName,
} from "../../models/funnel";
import ImprovementView from "./ImprovementView";
import HtmlCssPreviewFrame from "./components/HtmlCssPreviewFrame";
import WebpageView from "./WebpageView";
import type {
  AppliedCodegenVersion,
  FunnelSection,
  FunnelSession,
  ImprovePreviewView,
  Improvement,
  LandingPreviewCode,
  LandingProjectState,
  ProjectContext,
} from "./types";

type PanelMode =
  | "create"
  | "generating"
  | "optimizationSelect"
  | "review"
  | "applying"
  | "applied"
  | "versions";

type PendingOptimizationPlan = {
  funnel: FunnelSection & { sectionId: number };
  plan: OptimizationPlanResponse;
  improvements: Improvement[];
};

type OptimizationRecommendationWithWireframe =
  OptimizationRecommendationResponse & {
    wireframe?: string | null;
  };

const isPendingOptimizationPlan = (plan?: OptimizationPlanResponse | null) =>
  plan?.codeGenerationStatus ===
    OptimizationPlanResponseCodeGenerationStatus.CODE_NOT_GENERATED &&
  !!plan.recommendations?.length;

const mapOptimizationRecommendationsToImprovements = (
  recommendations?: OptimizationRecommendationWithWireframe[]
): Improvement[] =>
  recommendations
    ?.filter((recommendation) => recommendation.id != null)
    .map((recommendation, index) => {
      const fallbackChanges = [
        recommendation.implementation_direction,
        ...(recommendation.copy_direction ?? []),
        recommendation.layout_direction,
      ].filter(Boolean) as string[];

      return {
        id: recommendation.id ?? index + 1,
        title: recommendation.title ?? `개선안 #${index + 1}`,
        problem:
          recommendation.problem ??
          "선택한 퍼널에서 개선이 필요한 지점을 분석했습니다.",
        changes: recommendation.what_to_change?.length
          ? recommendation.what_to_change
          : fallbackChanges,
        effect:
          recommendation.expected_behavior_change ??
          recommendation.risk_or_caveat ??
          "선택한 고객 페르소나가 다음 행동으로 이동할 가능성을 높입니다.",
        wireframe: recommendation.wireframe?.trim() || undefined,
      };
    }) ?? [];

const mapCodegenResponseToPreviewCode = (codegen?: {
  generatedHtml?: string;
  generatedCss?: string;
}): LandingPreviewCode => ({
  html: codegen?.generatedHtml ?? "",
  css: codegen?.generatedCss ?? "",
});

const emptyPreviewCode: LandingPreviewCode = {
  html: "",
  css: "",
};

const mapSectionSourceToPreviewCode = (
  source?: SectionSourceResponse
): LandingPreviewCode => ({
  html: source?.html ?? "",
  css: source?.cssRules ?? "",
});

const getCodegenVersionKey = (codegen?: CodegenResponse) =>
  `${codegen?.sectionId ?? "section"}-${codegen?.generatedAt ?? "pending"}`;

const formatCodegenDate = (generatedAt?: string) => {
  if (!generatedAt) return "생성 시각 없음";

  return new Date(generatedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const APPLIED_VERSIONS_PAGE_SIZE = 3;

const isCreatePanelRequest = (search: string) =>
  new URLSearchParams(search).get("panel") === "create";

const getCreatePanelTargetFunnelId = (
  search: string,
  funnels: FunnelSection[]
) => {
  const params = new URLSearchParams(search);
  if (params.get("panel") !== "create") return null;

  const targetSectionIdParam = params.get("sectionId");
  const targetSectionId =
    targetSectionIdParam == null ? null : Number(targetSectionIdParam);
  const targetSectionName = params.get("sectionName")?.toLowerCase();
  const targetFunnel = funnels.find((funnel) => {
    if (
      targetSectionId != null &&
      Number.isFinite(targetSectionId) &&
      funnel.sectionId === targetSectionId
    ) {
      return true;
    }

    return (
      !!targetSectionName &&
      funnel.sectionName?.toLowerCase() === targetSectionName
    );
  });

  return targetFunnel?.id ?? null;
};

const createMockSessions = (
  projectId: number,
  index: number,
  sectionId?: number
): FunnelSession[] => {
  const sessionBase = 19000 + Math.max(projectId, 1) * 17 + index * 11;
  const hasReplaySample = index >= 2;

  if (!hasReplaySample) return [];

  return [
    {
      id: `S-${sectionId ?? sessionBase}`,
      device: "Chrome · Android",
      stayTime: "02:58",
    },
    {
      id: `S-${sessionBase + 7}`,
      device: "Safari · iOS",
      stayTime: "02:41",
    },
    {
      id: `S-${sessionBase + 13}`,
      device: "Chrome · Android",
      stayTime: "02:22",
    },
  ];
};

type FunnelDataWithSelector = FunnelData & {
  selector?: string | null;
  cssSelector?: string | null;
};

const getFunnelSelector = (stage: FunnelDataWithSelector) =>
  stage.selector?.trim() || stage.cssSelector?.trim() || undefined;

const fallbackFunnels: FunnelSection[] = [
  {
    id: "hero",
    rank: 1,
    name: "Hero Section",
    sectionName: "HERO",
    dropRate: 0.08,
    avgStayTime: "51s",
    reachedUsers: 10248,
    reachRate: 1,
    funnelType: FunnelType.HERO,
    sessions: [],
  },
  {
    id: "problem",
    rank: 2,
    name: "Problem Section",
    sectionName: "PROBLEM",
    dropRate: 0.18,
    avgStayTime: "44s",
    reachedUsers: 7742,
    reachRate: 0.73,
    funnelType: FunnelType.PROBLEM,
    sessions: [],
  },
  {
    id: "target",
    rank: 3,
    name: "Target Section",
    sectionName: "TARGET",
    dropRate: 0.21,
    avgStayTime: "39s",
    reachedUsers: 6679,
    reachRate: 0.65,
    funnelType: FunnelType.TARGET,
    sessions: [],
  },
  {
    id: "pricing",
    rank: 4,
    name: "Pricing Section",
    sectionName: "PRICING",
    dropRate: 0.26,
    avgStayTime: "36s",
    reachedUsers: 5472,
    reachRate: 0.51,
    funnelType: FunnelType.PRICING,
    sessions: createMockSessions(1, 3),
  },
  {
    id: "cta",
    rank: 5,
    name: "CTA Section",
    sectionName: "CTA_SECTION",
    dropRate: 0.14,
    avgStayTime: "29s",
    reachedUsers: 2532,
    reachRate: 0.25,
    funnelType: FunnelType.CTA_SECTION,
    sessions: createMockSessions(1, 4).slice(0, 1),
  },
];

const getFunnelSectionId = (stage: FunnelData, index: number) => {
  if (stage.sectionId != null) return String(stage.sectionId);
  if (stage.sectionName) return stage.sectionName.toLowerCase();
  return `section-${index + 1}`;
};

const mapFunnelDataToSections = (
  project: ProjectContext,
  funnelData?: FunnelData[],
  useFallbackFunnels = true
): FunnelSection[] => {
  if (!funnelData?.length) {
    if (!useFallbackFunnels) return [];

    return fallbackFunnels.map((funnel) => ({
      ...funnel,
      reachedUsers: funnel.reachedUsers + Math.max(project.id, 1),
    }));
  }

  return funnelData.map((stage, index) => {
    const funnelType = getFunnelTypeFromSectionName(stage.sectionName);
    const sectionName = stage.sectionName;
    const stageWithSelector = stage as FunnelDataWithSelector;

    return {
      id: getFunnelSectionId(stage, index),
      sectionId: stage.sectionId,
      rank: index + 1,
      name: getFunnelStageLabel({ funnelType, sectionName }),
      sectionName,
      selector: getFunnelSelector(stageWithSelector),
      dropRate: stage.dropRate ?? 0,
      avgStayTime: stage.avgDuration ?? "--:--",
      reachedUsers: stage.reachedUserCount ?? 0,
      reachRate: stage.reachRate ?? 0,
      funnelType,
      sessions: createMockSessions(project.id, index, stage.sectionId),
    };
  });
};

const buildLandingProjectState = (
  project: ProjectContext,
  funnelData?: FunnelData[],
  useFallbackFunnels = true
): LandingProjectState => {
  const funnels = mapFunnelDataToSections(
    project,
    funnelData,
    useFallbackFunnels
  );

  return {
    project,
    funnels,
    improvements: [
      {
        id: 1,
        title: "브랜드 옆에 한 줄 가치 설명을 추가해 첫 판단을 돕기",
        problem:
          "현재 상단에서 이 서비스가 누구를 위한 무엇인지 바로 읽히지 않아, 빠르게 훑는 사용자가 적합성을 판단하기 어렵습니다.",
        changes: [
          "로고와 Ling-Level 텍스트가 있는 왼쪽 영역에 짧은 설명 문구를 추가한다",
          "설명 문구는 대상과 결과를 함께 담아 한눈에 이해되도록 만든다",
          "문구가 길어지면 브랜드명 아래 보조 행으로 분리해 읽기 순서를 분명히 한다",
        ],
        effect:
          "방문자가 1~2초 안에 서비스 대상과 효용을 파악해, 더 오래 머무르거나 다음 행동을 검토할 가능성이 높아집니다.",
      },
      {
        id: 2,
        title: "숨겨진 다운로드 버튼을 상단에서 즉시 보이게 만들기",
        problem:
          "핵심 행동 버튼이 보조 메뉴와 같은 무게로 보이며, 사용자가 첫 화면에서 다음 행동을 바로 찾기 어렵습니다.",
        changes: [
          "무료 다운로드 버튼을 상단 고정 영역에서 더 높은 대비로 노출한다",
          "보조 행동인 데모 보기는 흰색 버튼으로 분리한다",
          "모바일 기준에서도 첫 화면 안에 CTA가 유지되도록 간격을 줄인다",
        ],
        effect:
          "첫 방문자가 다음 행동을 고민하는 시간이 줄고, Pricing Section 이후의 이탈 압력이 낮아집니다.",
      },
      {
        id: 3,
        title: "메뉴 문구를 판단 기준형으로 바꿔 빠른 스캔을 돕기",
        problem:
          "상단 메뉴가 기능명 위주라서 사용자가 자신에게 필요한 정보가 어디 있는지 즉시 판단하기 어렵습니다.",
        changes: [
          "소개, 기능, 자주 묻는 질문을 가치 중심 문구로 바꾼다",
          "요금 영역 진입 전에 비교 기준과 결과를 먼저 보여준다",
          "메뉴의 시각적 간격을 줄여 콘텐츠 흐름과 연결한다",
        ],
        effect:
          "방문자가 자기 상황과 연결되는 항목을 빠르게 찾고, 가격 확인 전 이탈을 줄일 수 있습니다.",
      },
    ],
    generatedCode: emptyPreviewCode,
  };
};

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex w-full items-center gap-2.5">
    <span className="shrink-0 text-sm font-medium leading-5 text-slate-600">
      {children}
    </span>
    <div className="h-px min-w-0 flex-1 bg-slate-500" />
  </div>
);

const StepCrumbs = ({ active }: { active: "create" | "review" | "apply" }) => {
  const steps = [
    { id: "create", label: "개선안 생성" },
    { id: "review", label: "개선안 검토" },
    { id: "apply", label: "개선안 적용" },
  ] as const;
  const activeIndex = steps.findIndex((step) => step.id === active);
  const visibleSteps = steps.slice(0, activeIndex + 1);

  return (
    <div className="flex items-center gap-1 text-sm font-medium leading-5">
      {visibleSteps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-1">
          <span
            className={step.id === active ? "text-slate-600" : "text-slate-300"}
          >
            {step.label}
          </span>
          {index < visibleSteps.length - 1 && (
            <ChevronRightIcon className="h-4 w-4 text-slate-300" />
          )}
        </div>
      ))}
    </div>
  );
};

const FunnelSectionIcon = ({
  funnelType,
  muted = false,
}: {
  funnelType: FunnelType;
  muted?: boolean;
}) => {
  const StageSectionIcon =
    funnelIconMap[funnelType] ?? funnelIconMap[FunnelType.GENERIC];

  return (
    <StageSectionIcon className={muted ? "section-icon-muted" : undefined} />
  );
};

const NoProjectState = ({
  onCreateProject,
}: {
  onCreateProject: () => void;
}) => (
  <div className="flex flex-1 items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <div className="flex flex-col items-center gap-0">
        <p className="text-lg font-medium leading-6 text-slate-500">
          프로젝트가 없습니다
        </p>
        <p className="text-base font-normal whitespace-nowrap text-slate-500">
          랜딩 페이지 개선을 시작할 프로젝트를 만들어 주세요
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateProject}
        className="h-9 w-32 rounded-lg bg-blue-500 py-2 text-sm font-semibold leading-5 text-white disabled:opacity-60"
      >
        새 프로젝트
      </button>
    </div>
  </div>
);

const getFunnelAnalysisRequiredMessage = (
  status?: FunnelResponseStatus,
  hasFunnelSections = false
) => {
  if (status === FunnelResponseStatus.IN_PROGRESS) {
    return {
      title: "퍼널 분석이 진행 중입니다",
      description:
        "분석이 완료되면 실제 이탈 구간을 기준으로 개선안을 생성할 수 있습니다.",
      buttonLabel: "퍼널 분석 확인하기",
    };
  }

  if (status === FunnelResponseStatus.FAILED) {
    return {
      title: "퍼널 분석이 완료되지 않았습니다",
      description:
        "퍼널 분석 화면에서 분석을 다시 진행한 뒤 랜딩 페이지 개선안을 생성해주세요.",
      buttonLabel: "퍼널 분석 다시 하기",
    };
  }

  if (status === FunnelResponseStatus.COMPLETED && !hasFunnelSections) {
    return {
      title: "분석된 퍼널이 없습니다",
      description:
        "개선안을 만들 수 있는 퍼널 데이터가 없습니다. 퍼널 분석 화면에서 분석 결과를 확인해주세요.",
      buttonLabel: "퍼널 분석 확인하기",
    };
  }

  return {
    title: "퍼널 분석이 완료되지 않았습니다",
    description:
      "랜딩 페이지의 실제 이탈 구간을 먼저 분석해야 개선안을 생성할 수 있습니다. 퍼널 분석 화면에서 분석을 진행해주세요.",
    buttonLabel: "퍼널 분석하기",
  };
};

const FunnelAnalysisRequiredNotice = ({
  status,
  hasFunnelSections,
  onOpenFunnelAnalysis,
}: {
  status?: FunnelResponseStatus;
  hasFunnelSections: boolean;
  onOpenFunnelAnalysis: () => void;
}) => {
  const message = getFunnelAnalysisRequiredMessage(status, hasFunnelSections);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-1.5">
        <SectionLabel>개선을 원하는 퍼널</SectionLabel>
        <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-3 rounded-md bg-slate-100 px-6 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <FunnelIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold leading-6 text-slate-800">
              {message.title}
            </p>
            <p className="max-w-[320px] text-sm font-medium leading-5 text-slate-500">
              {message.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFunnelAnalysis}
            className="mt-1 h-9 rounded-lg bg-blue-500 px-4 text-sm font-semibold leading-5 text-white transition hover:bg-blue-600"
          >
            {message.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const FunnelSelectPanel = ({
  projectState,
  selectedFunnel,
  selectedFunnelId,
  persona,
  reviewNotificationCount,
  funnelAnalysisStatus,
  canSelectFunnel,
  isProjectLoading,
  canGenerate,
  onSelectFunnel,
  onChangePersona,
  onGenerate,
  onOpenReview,
  onOpenFunnelAnalysis,
  onPlaySession,
}: {
  projectState: LandingProjectState;
  selectedFunnel: FunnelSection | null;
  selectedFunnelId: string;
  persona: string;
  reviewNotificationCount: number;
  funnelAnalysisStatus?: FunnelResponseStatus;
  canSelectFunnel: boolean;
  isProjectLoading: boolean;
  canGenerate: boolean;
  onSelectFunnel: (funnelId: string) => void;
  onChangePersona: (value: string) => void;
  onGenerate: () => void;
  onOpenReview: () => void;
  onOpenFunnelAnalysis: () => void;
  onPlaySession: (sessionId: string) => void;
}) => {
  const { data: droppedSessionsData, isLoading: isDroppedSessionsLoading } =
    useGetRecentSessions(
      projectState.project.id,
      {
        sectionId: selectedFunnel?.sectionId,
        status: "DROP",
        limit: 3,
      },
      {
        query: {
          enabled:
            !!projectState.project.id && selectedFunnel?.sectionId != null,
          staleTime: 60_000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      }
    );
  const droppedSessions = (droppedSessionsData?.sessions ?? []).slice(0, 3);

  const formatSessionId = (sessionId?: string) => {
    if (!sessionId) return "-";
    if (sessionId.length <= 18) return sessionId;
    return `${sessionId.slice(0, 15)}...`;
  };

  const renderDroppedSessionRow = (session: SessionDto, index: number) => {
    const sessionId = session.sessionId ?? "";

    return (
      <div
        key={`${sessionId}-${index}`}
        className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
      >
        <div className="min-w-0 flex-1">
          <p
            className="mb-[-2px] truncate text-xs font-medium leading-4 text-slate-900"
            title={sessionId || undefined}
          >
            {formatSessionId(sessionId)}
          </p>
          <p className="truncate text-[11px] font-normal leading-4 text-slate-500">
            {session.device ?? "-"}
          </p>
        </div>
        <div className="min-w-0 flex-1 text-xs font-medium leading-4 text-slate-900">
          {session.duration ?? "-"}
        </div>
        <button
          type="button"
          disabled={!sessionId}
          onClick={() => {
            if (sessionId) onPlaySession(sessionId);
          }}
          className="flex w-8 shrink-0 items-center text-slate-600 transition-colors hover:text-slate-700 disabled:opacity-40"
          aria-label="세션 리플레이 보기"
        >
          <PlayButtonIcon className="h-6 w-6" />
        </button>
      </div>
    );
  };

  return (
    <>
      <p className="text-sm font-medium leading-5 text-slate-600">
        개선안 생성
      </p>

      {reviewNotificationCount > 0 && (
        <button
          type="button"
          onClick={onOpenReview}
          className="flex w-full items-center gap-1.5 rounded-[7px] bg-blue-500 p-3 text-left text-white"
        >
          <MegaphoneIcon className="h-6 w-6 shrink-0" />
          <span className="min-w-0 flex-1 text-base font-semibold leading-6">
            검토가 필요한 개선안 ({reviewNotificationCount})
          </span>
          <ChevronRightIcon className="h-6 w-6 shrink-0" />
        </button>
      )}

      {!isProjectLoading && !canSelectFunnel ? (
        <FunnelAnalysisRequiredNotice
          status={funnelAnalysisStatus}
          hasFunnelSections={projectState.funnels.length > 0}
          onOpenFunnelAnalysis={onOpenFunnelAnalysis}
        />
      ) : (
        <>
          <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-1.5">
          <SectionLabel>개선을 원하는 퍼널</SectionLabel>
          <label className="relative flex w-full items-center gap-2.5 rounded-md border border-slate-200 p-3">
            {selectedFunnel ? (
              <FunnelSectionIcon funnelType={selectedFunnel.funnelType} />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-500 p-2">
                <SelectIcon className="text-[16px] text-white" />
              </div>
            )}
            {isProjectLoading ? (
              <Skeleton height={20} />
            ) : (
              <span
                className={`min-w-0 flex-1 text-sm font-semibold leading-5 ${
                  selectedFunnel ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {selectedFunnel
                  ? `#${selectedFunnel.rank} ${selectedFunnel.name}`
                  : "섹션을 선택해주세요"}
              </span>
            )}
            <ArrowDropDownRoundedIcon className="h-6 w-6 shrink-0 text-slate-500" />
            <select
              value={selectedFunnelId}
              onChange={(event) => onSelectFunnel(event.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="개선을 원하는 퍼널"
            >
              <option value="">섹션을 선택해주세요</option>
              {projectState.funnels.map((funnel) => (
                <option key={funnel.id} value={funnel.id}>
                  #{funnel.rank} {funnel.name}
                </option>
              ))}
            </select>
          </label>

          {selectedFunnel ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-2 px-1 text-sm leading-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">
                    퍼널 이탈율
                  </span>
                  {isProjectLoading ? (
                    <Skeleton height={20} width={42} />
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {Math.round(selectedFunnel.dropRate * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">
                    평균 퍼널 체류 시간
                  </span>
                  {isProjectLoading ? (
                    <Skeleton height={20} width={42} />
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {selectedFunnel.avgStayTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col gap-2.5 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-medium leading-5 text-slate-600">
                  이 퍼널에서 이탈한 세션
                </p>
                <div className="flex rounded-lg bg-slate-50 p-2 text-xs font-semibold leading-4 text-slate-500">
                  <span className="min-w-0 flex-1">세션ID / 디바이스</span>
                  <span className="min-w-0 flex-1">체류시간</span>
                  <span className="w-8 shrink-0">재생</span>
                </div>
                {isProjectLoading || isDroppedSessionsLoading ? (
                  <div className="space-y-1.5">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <Skeleton height={14} />
                          <Skeleton height={12} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Skeleton height={14} />
                        </div>
                        <div className="w-8">
                          <Skeleton height={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : droppedSessions.length > 0 ? (
                  <div className="space-y-1.5">
                    {droppedSessions.map(renderDroppedSessionRow)}
                  </div>
                ) : (
                  <div className="flex h-[146px] items-center justify-center rounded-lg border border-slate-100 bg-white px-2 py-1.5">
                    <p className="text-xs font-medium text-slate-400">
                      최근 세션 데이터가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center rounded-md bg-slate-100 text-sm font-semibold leading-5 text-slate-500">
              개선을 원하는 섹션을 선택해주세요
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <SectionLabel>고객 페르소나</SectionLabel>
          <textarea
            value={persona}
            onChange={(event) => onChangePersona(event.target.value)}
            placeholder="예시: 30대, 남성, 랜딩페이지의 성과가 잘 나오지 않는 사람."
            className="h-40 w-full resize-none rounded-md bg-slate-100 p-2.5 text-sm font-normal leading-5 text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="relative flex h-10 w-full items-center justify-center gap-1 overflow-hidden rounded-lg bg-slate-900 p-2.5 text-sm font-semibold leading-5 text-white disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            <ImproveActionIcon className="h-4 w-4" />
            개선안 생성하기
            <span className="absolute -right-7 -top-14 h-32 w-32 rounded-xl bg-blue-600 opacity-[0.33] blur-[32px]" />
          </button>
        </>
      )}
    </>
  );
};

const FunnelSelectLoadingPanel = () => (
  <>
    <div className="flex w-full items-center justify-between">
      <p className="text-sm font-medium leading-5 text-slate-600">
        개선안 생성
      </p>
      <LoadingLoopIcon className="h-5 w-5 shrink-0 text-slate-600" />
    </div>
    <p className="text-sm font-medium leading-5 text-black">
      개선안을 생성하고 있습니다
    </p>
  </>
);

const ImprovementCard = ({
  improvement,
  displayNumber,
  isExpanded,
  isSelected,
  onToggleExpanded,
  onToggleSelected,
  onPreviewWireframe,
}: {
  improvement: Improvement;
  displayNumber: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpanded: () => void;
  onToggleSelected: () => void;
  onPreviewWireframe: (wireframe?: string) => void;
}) => (
  <div
    className={`flex w-full flex-col gap-2.5 rounded-md p-3 ${
      isSelected ? "bg-blue-50" : "bg-slate-50"
    }`}
  >
    <div className="flex h-6 w-full items-center gap-2">
      <button
        type="button"
        onClick={onToggleSelected}
        aria-label={`개선안 ${displayNumber} 선택`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-slate-800 bg-white"
        }`}
      >
        {isSelected && <CheckIcon className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={onToggleExpanded}
        className="min-w-0 flex-1 text-left text-sm font-medium leading-5 text-slate-800"
      >
        <span>개선안 </span>
        <span className="font-bold">#{displayNumber}: </span>
        <span>{improvement.title}</span>
      </button>
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-label={isExpanded ? "개선안 접기" : "개선안 펼치기"}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6 text-slate-900" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-slate-900" />
        )}
      </button>
    </div>

    {isExpanded && (
      <>
        <div className="flex w-full flex-col gap-1.5 text-sm leading-5">
          <p className="font-medium text-slate-600">보이는 문제</p>
          <p className="font-normal text-slate-800">{improvement.problem}</p>
        </div>
        <div className="flex w-full flex-col gap-1.5 text-sm leading-5">
          <p className="font-medium text-slate-600">변경 예정 내용</p>
          <ul className="list-disc pl-5 font-normal text-slate-800">
            {improvement.changes.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </div>
        <div className="flex w-full flex-col gap-1.5 text-sm leading-5">
          <p className="font-medium text-slate-600">예상 효과</p>
          <p className="font-normal text-slate-800">{improvement.effect}</p>
        </div>
        <button
          type="button"
          onClick={() => onPreviewWireframe(improvement.wireframe)}
          className="flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-blue-500 p-2.5 text-sm font-semibold leading-5 text-white transition hover:bg-blue-600 active:scale-[0.99]"
        >
          <DashboardIcon className="h-4 w-4 shrink-0" />
          개선안 미리 보기
        </button>
      </>
    )}
  </div>
);

const ImprovementReviewPanel = ({
  improvements,
  selectedImprovementIds,
  isApplying,
  onToggleImprovement,
  onPreviewWireframe,
  onApply,
}: {
  improvements: Improvement[];
  selectedImprovementIds: number[];
  isApplying: boolean;
  onToggleImprovement: (id: number) => void;
  onPreviewWireframe: (wireframe?: string) => void;
  onApply: () => void;
}) => {
  const [expandedId, setExpandedId] = useState(improvements[0]?.id ?? 1);

  return (
    <>
      <StepCrumbs active="review" />
      {improvements.map((improvement, index) => (
        <ImprovementCard
          key={improvement.id}
          improvement={improvement}
          displayNumber={index + 1}
          isExpanded={expandedId === improvement.id}
          isSelected={selectedImprovementIds.includes(improvement.id)}
          onToggleExpanded={() =>
            setExpandedId((prev) =>
              prev === improvement.id ? -1 : improvement.id
            )
          }
          onToggleSelected={() => onToggleImprovement(improvement.id)}
          onPreviewWireframe={onPreviewWireframe}
        />
      ))}
      <button
        type="button"
        onClick={onApply}
        disabled={selectedImprovementIds.length === 0 || isApplying}
        className={`relative flex h-10 w-full items-center justify-center gap-1 overflow-hidden rounded-lg p-2.5 text-sm font-semibold leading-5 text-white disabled:cursor-not-allowed ${
          selectedImprovementIds.length === 0 ? "bg-slate-600" : "bg-slate-900"
        }`}
      >
        {selectedImprovementIds.length === 0 ? (
          "하나 이상의 개선안을 선택해주세요"
        ) : (
          <>
            <ImproveActionIcon className="h-4 w-4" />
            {isApplying ? "개선안 적용중" : "개선안 적용하기"}
            <span className="absolute -right-7 -top-14 h-32 w-32 rounded-xl bg-blue-600 opacity-[0.33] blur-[32px]" />
          </>
        )}
      </button>
    </>
  );
};

const OptimizationSelectPanel = ({
  pendingPlans,
  onReviewPlan,
}: {
  pendingPlans: PendingOptimizationPlan[];
  onReviewPlan: (plan: PendingOptimizationPlan) => void;
}) => (
  <>
    <StepCrumbs active="review" />
    {pendingPlans.map((pendingPlan, index) => (
      <div
        key={pendingPlan.funnel.id}
        className="relative flex w-full flex-col gap-2 overflow-hidden rounded-md bg-slate-100 p-3"
      >
        <p className="text-sm font-medium leading-5 text-slate-800">
          <span>개선안 </span>
          <span className="font-bold">#{index + 1}:</span>
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm font-medium leading-5 text-slate-800">
          {pendingPlan.improvements.map((improvement) => (
            <li key={improvement.id}>{improvement.title}</li>
          ))}
        </ul>
        <ImproveBackgroundIcon className="absolute right-2.5 top-2.5 h-16 w-16 text-slate-300" />
        <button
          type="button"
          onClick={() => onReviewPlan(pendingPlan)}
          className="relative z-10 flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 p-2.5 text-sm font-semibold leading-5 text-white"
        >
          이 적용안 검토하기
        </button>
      </div>
    ))}
  </>
);

const RecommendationSelectLoadingPanel = () => (
  <>
    <div className="flex w-full items-center justify-between">
      <StepCrumbs active="review" />
      <LoadingLoopIcon className="h-5 w-5 shrink-0 text-slate-600" />
    </div>
    <p className="text-sm font-medium leading-5 text-black">
      코드를 생성하고 있습니다.
    </p>
  </>
);

const CodeGenerationDonePanel = ({
  selectedImprovements,
  generatedAt,
  onViewGeneratedCode,
}: {
  selectedImprovements: Improvement[];
  generatedAt?: string;
  onViewGeneratedCode: () => void;
}) => (
  <>
    <div className="flex w-full flex-col gap-2">
      <StepCrumbs active="apply" />
      <p className="text-base font-semibold leading-6 text-slate-800">
        코드 생성이 완료되었습니다!
      </p>
      <div className="relative flex w-full flex-col gap-2 overflow-hidden rounded-md bg-slate-100 p-3">
        <p className="text-sm font-medium leading-5 text-slate-600">
          생성에 사용된 개선안{" "}
          <span className="text-slate-400">
            ({selectedImprovements.length})
          </span>
        </p>
        {generatedAt && (
          <p className="text-xs font-medium leading-4 text-slate-500">
            생성 완료 시각 {new Date(generatedAt).toLocaleString("ko-KR")}
          </p>
        )}
        <ul className="list-disc space-y-2 pl-5 text-sm font-medium leading-5 text-slate-800">
          {selectedImprovements.map((improvement) => (
            <li key={improvement.id}>{improvement.title}</li>
          ))}
        </ul>
        <ImproveBackgroundIcon className="absolute right-2.5 top-2.5 h-16 w-16 text-slate-300" />
      </div>
    </div>
    <button
      type="button"
      onClick={onViewGeneratedCode}
      className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 p-2.5 text-sm font-semibold leading-5 text-white"
    >
      적용안 보기
    </button>
  </>
);

const AppliedVersionsPanel = ({
  versions,
  currentVersionKey,
  isLoading,
  onSelectVersion,
}: {
  versions: AppliedCodegenVersion[];
  currentVersionKey: string;
  isLoading: boolean;
  onSelectVersion: (version: AppliedCodegenVersion) => void;
}) => {
  const [requestedPage, setRequestedPage] = useState<number | null>(null);
  const pageCount = Math.max(
    1,
    Math.ceil(versions.length / APPLIED_VERSIONS_PAGE_SIZE)
  );
  const currentVersionPage = useMemo(() => {
    const currentVersionIndex = versions.findIndex(
      (version) => version.key === currentVersionKey
    );

    return currentVersionIndex < 0
      ? 0
      : Math.floor(currentVersionIndex / APPLIED_VERSIONS_PAGE_SIZE);
  }, [currentVersionKey, versions]);
  const currentPage = Math.min(
    requestedPage ?? currentVersionPage,
    pageCount - 1
  );
  const pageStartIndex = currentPage * APPLIED_VERSIONS_PAGE_SIZE;
  const pagedVersions = versions.slice(
    pageStartIndex,
    pageStartIndex + APPLIED_VERSIONS_PAGE_SIZE
  );
  const hasPagination = versions.length > APPLIED_VERSIONS_PAGE_SIZE;

  return (
    <>
      <p className="text-sm font-medium leading-5 text-slate-600">
        적용안 보기
      </p>
      {isLoading && (
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-100 p-3">
          <Skeleton height={20} width={140} />
          <Skeleton height={20} width={120} />
          <Skeleton height={72} />
        </div>
      )}
      {!isLoading && versions.length === 0 && (
        <div className="rounded-md bg-slate-100 p-4 text-sm font-medium leading-5 text-slate-500">
          아직 생성된 적용안 코드가 없습니다.
        </div>
      )}
      {!isLoading &&
        pagedVersions.map((version) => {
          const isCurrent = version.key === currentVersionKey;
          const appliedTitles = version.usedRecommendationTitles.length
            ? version.usedRecommendationTitles
            : ["적용된 개선안 정보가 없습니다."];

          return (
            <div
              key={version.key}
              className={`relative flex w-full flex-col gap-2 overflow-hidden rounded-md p-3 ${
                isCurrent
                  ? "border-[3px] border-blue-300 bg-blue-50"
                  : "bg-slate-100"
              }`}
            >
              <p className="text-sm font-medium leading-5 text-slate-800">
                적용안{" "}
                <span className="font-bold">#{version.displayNumber}:</span>{" "}
                {formatCodegenDate(version.generatedAt)}
              </p>
              <p className="text-sm font-medium leading-5 text-slate-600">
                적용된 개선안{" "}
                <span className="text-slate-400">
                  ({version.usedRecommendationTitles.length})
                </span>
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm font-medium leading-5 text-slate-800">
                {appliedTitles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
              <ImproveBackgroundIcon
                className={`absolute right-2.5 top-2.5 h-16 w-16 ${
                  isCurrent ? "text-blue-300" : "text-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setRequestedPage(null);
                  onSelectVersion(version);
                }}
                className={`relative z-10 flex h-10 w-full items-center justify-center rounded-lg p-2.5 text-sm font-semibold leading-5 ${
                  isCurrent
                    ? "bg-white text-slate-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {isCurrent ? "현재 보고 있는 적용안" : "이 적용안 보기"}
              </button>
            </div>
          );
        })}
      {!isLoading && hasPagination && (
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setRequestedPage(currentPage - 1)}
            className="flex h-6 w-6 items-center justify-center text-slate-900 transition-colors disabled:text-slate-300"
            aria-label="이전 적용안 페이지"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <p className="text-sm font-semibold leading-5 text-slate-800">
            {currentPage + 1} / {pageCount}
          </p>
          <button
            type="button"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setRequestedPage(currentPage + 1)}
            className="flex h-6 w-6 items-center justify-center text-slate-900 transition-colors disabled:text-slate-300"
            aria-label="다음 적용안 페이지"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

const ImprovementPanel = ({
  mode,
  projectState,
  selectedFunnel,
  selectedFunnelId,
  persona,
  selectedImprovementIds,
  pendingOptimizationPlans,
  reviewNotificationCount,
  funnelAnalysisStatus,
  canSelectFunnel,
  codegenVersions,
  currentCodegenVersionKey,
  isCodegenVersionsLoading,
  codegenGeneratedAt,
  isProjectLoading,
  canGenerate,
  onSelectFunnel,
  onChangePersona,
  onGenerate,
  onOpenReview,
  onOpenFunnelAnalysis,
  onReviewOptimizationPlan,
  onToggleImprovement,
  onPreviewWireframe,
  onApply,
  onViewGeneratedCode,
  onSelectCodegenVersion,
  onPlaySession,
}: {
  mode: PanelMode;
  projectState: LandingProjectState;
  selectedFunnel: FunnelSection | null;
  selectedFunnelId: string;
  persona: string;
  selectedImprovementIds: number[];
  pendingOptimizationPlans: PendingOptimizationPlan[];
  reviewNotificationCount: number;
  funnelAnalysisStatus?: FunnelResponseStatus;
  canSelectFunnel: boolean;
  codegenVersions: AppliedCodegenVersion[];
  currentCodegenVersionKey: string;
  isCodegenVersionsLoading: boolean;
  codegenGeneratedAt?: string;
  isProjectLoading: boolean;
  canGenerate: boolean;
  onSelectFunnel: (funnelId: string) => void;
  onChangePersona: (value: string) => void;
  onGenerate: () => void;
  onOpenReview: () => void;
  onOpenFunnelAnalysis: () => void;
  onReviewOptimizationPlan: (plan: PendingOptimizationPlan) => void;
  onToggleImprovement: (id: number) => void;
  onPreviewWireframe: (wireframe?: string) => void;
  onApply: () => void;
  onViewGeneratedCode: () => void;
  onSelectCodegenVersion: (version: AppliedCodegenVersion) => void;
  onPlaySession: (sessionId: string) => void;
}) => {
  const selectedImprovements = projectState.improvements.filter((improvement) =>
    selectedImprovementIds.includes(improvement.id)
  );

  return (
    <aside className="absolute bottom-6 right-6 z-40 flex max-h-[calc(100%-80px)] w-[min(500px,calc(100%-48px))] flex-col gap-4 overflow-y-auto rounded-xl border border-slate-300 bg-white p-3.5 shadow-[0px_0px_16px_0px_rgba(0,0,0,0.25)]">
      {mode === "create" && (
        <FunnelSelectPanel
          projectState={projectState}
          selectedFunnel={selectedFunnel}
          selectedFunnelId={selectedFunnelId}
          persona={persona}
          reviewNotificationCount={reviewNotificationCount}
          funnelAnalysisStatus={funnelAnalysisStatus}
          canSelectFunnel={canSelectFunnel}
          isProjectLoading={isProjectLoading}
          canGenerate={canGenerate}
          onSelectFunnel={onSelectFunnel}
          onChangePersona={onChangePersona}
          onGenerate={onGenerate}
          onOpenReview={onOpenReview}
          onOpenFunnelAnalysis={onOpenFunnelAnalysis}
          onPlaySession={onPlaySession}
        />
      )}

      {mode === "generating" && <FunnelSelectLoadingPanel />}

      {mode === "optimizationSelect" && (
        <OptimizationSelectPanel
          pendingPlans={pendingOptimizationPlans}
          onReviewPlan={onReviewOptimizationPlan}
        />
      )}

      {mode === "review" && (
        <ImprovementReviewPanel
          improvements={projectState.improvements}
          selectedImprovementIds={selectedImprovementIds}
          isApplying={false}
          onToggleImprovement={onToggleImprovement}
          onPreviewWireframe={onPreviewWireframe}
          onApply={onApply}
        />
      )}

      {mode === "applying" && <RecommendationSelectLoadingPanel />}

      {mode === "applied" && (
        <CodeGenerationDonePanel
          selectedImprovements={
            selectedImprovements.length
              ? selectedImprovements
              : projectState.improvements
          }
          generatedAt={codegenGeneratedAt}
          onViewGeneratedCode={onViewGeneratedCode}
        />
      )}

      {mode === "versions" && (
        <AppliedVersionsPanel
          versions={codegenVersions}
          currentVersionKey={currentCodegenVersionKey}
          isLoading={isCodegenVersionsLoading}
          onSelectVersion={onSelectCodegenVersion}
        />
      )}
    </aside>
  );
};

const TopBar = ({
  projectUrl,
  isProjectLoading,
  activeView,
  onSelectView,
  onReload,
}: {
  projectUrl: string;
  isProjectLoading: boolean;
  activeView: ImprovePreviewView;
  onSelectView: (view: ImprovePreviewView) => void;
  onReload: () => void;
}) => (
  <div className="flex h-14 w-full min-w-0 shrink-0 items-center gap-3 overflow-hidden border-b border-slate-200 bg-white px-4">
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
      <GlobeIcon className="h-5 w-5 shrink-0 text-slate-500" />
      {isProjectLoading ? (
        <Skeleton height={20} />
      ) : (
        <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-5 text-slate-800">
          {projectUrl}
        </p>
      )}
      <button
        type="button"
        onClick={onReload}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-500"
        aria-label="웹 페이지 새로고침"
      >
        <RefreshIcon className="h-6 w-6" />
      </button>
    </div>
    <div className="flex shrink-0 items-center justify-center gap-1 rounded-[5px] bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onSelectView("webpage")}
        className={`flex items-center justify-center gap-1 rounded-sm px-2 py-1.5 text-sm font-medium leading-5 sm:px-3 ${
          activeView === "webpage"
            ? "bg-white text-slate-800"
            : "text-slate-500"
        }`}
      >
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">웹 페이지</span>
      </button>
      <button
        type="button"
        onClick={() => onSelectView("improvement")}
        className={`flex items-center justify-center gap-1 rounded-sm px-2 py-1.5 text-sm font-medium leading-5 sm:px-3 ${
          activeView === "improvement"
            ? "bg-white text-slate-800"
            : "text-slate-500"
        }`}
      >
        <FileOutlineIcon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">개선안</span>
      </button>
    </div>
  </div>
);

const WireframePreviewModal = ({
  wireframeHtml,
  projectUrl,
  reloadKey,
  onClose,
}: {
  wireframeHtml: string;
  projectUrl: string;
  reloadKey: number;
  onClose: () => void;
}) => {
  const trimmedWireframeHtml = wireframeHtml.trim();
  const previewHtml = trimmedWireframeHtml
    ? trimmedWireframeHtml
    : `<div class="flex min-h-screen w-full items-center justify-center p-6 text-lg font-semibold text-slate-800">생성된 Wireframe이 없습니다</div>`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden p-2.5"
      style={{ backgroundColor: "rgba(2, 6, 23, 0.33)" }}
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wireframe-preview-title"
        className="flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-300 bg-white p-3.5 shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p
          id="wireframe-preview-title"
          className="text-sm font-medium leading-5 text-slate-600"
        >
          개선안 미리 보기
        </p>
        <div
          className="flex items-center justify-center overflow-hidden bg-white"
          style={{
            width: "min(512px, calc(100vw - 48px))",
            height: "min(512px, calc(100vh - 120px))",
          }}
        >
          <HtmlCssPreviewFrame
            title="개선안 미리 보기"
            previewCode={{ html: previewHtml, css: "" }}
            baseUrl={projectUrl}
            reloadKey={reloadKey}
            includeTailwind
            bodyClassName="bg-white text-slate-950 antialiased"
          />
        </div>
      </div>
    </div>
  );
};

const LandingImprovementContent = ({
  projectState,
  isProjectLoading,
  isFunnelLoading,
  funnelAnalysisStatus,
}: {
  projectState: LandingProjectState;
  isProjectLoading: boolean;
  isFunnelLoading: boolean;
  funnelAnalysisStatus?: FunnelResponseStatus;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialCreatePanelRequest = isCreatePanelRequest(location.search);
  const [selectedFunnelId, setSelectedFunnelId] = useState("");
  const [persona, setPersona] = useState("");
  const [panelMode, setPanelMode] = useState<PanelMode>("create");
  const [isPanelOpen, setIsPanelOpen] = useState(hasInitialCreatePanelRequest);
  const [selectedImprovementIds, setSelectedImprovementIds] = useState<
    number[]
  >([]);
  const [showEntryTip, setShowEntryTip] = useState(
    !hasInitialCreatePanelRequest
  );
  const [showCompareTip, setShowCompareTip] = useState(true);
  const [currentCodegenVersionKey, setCurrentCodegenVersionKey] = useState("");
  const [comparisonSectionId, setComparisonSectionId] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [generationRequestedAt, setGenerationRequestedAt] = useState(0);
  const [codegenRequestedAt, setCodegenRequestedAt] = useState(0);
  const [generatedCodeOverride, setGeneratedCodeOverride] =
    useState<LandingPreviewCode | null>(null);
  const [previewWireframeHtml, setPreviewWireframeHtml] = useState<
    string | null
  >(null);
  const activeView: ImprovePreviewView = location.pathname.endsWith(
    "/improvement"
  )
    ? "improvement"
    : "webpage";
  const isPanelDismissDisabled =
    panelMode === "generating" || panelMode === "applying";

  const handleSelectView = (view: ImprovePreviewView) => {
    navigate(view === "webpage" ? "/improve/webpage" : "/improve/improvement");
  };

  const requestedCreateFunnelId = useMemo(
    () => getCreatePanelTargetFunnelId(location.search, projectState.funnels),
    [location.search, projectState.funnels]
  );
  const selectedFunnelIdCandidate =
    selectedFunnelId || requestedCreateFunnelId || "";
  const selectedFunnel = useMemo(
    () =>
      projectState.funnels.find(
        (funnel) => funnel.id === selectedFunnelIdCandidate
      ) ?? null,
    [projectState.funnels, selectedFunnelIdCandidate]
  );
  const effectiveSelectedFunnelId = selectedFunnel?.id ?? "";
  const selectedSectionId = selectedFunnel?.sectionId ?? 0;
  const canSelectFunnel =
    funnelAnalysisStatus === FunnelResponseStatus.COMPLETED &&
    projectState.funnels.length > 0;
  const optimizationPlanFunnels = useMemo(
    () =>
      projectState.funnels.filter(
        (funnel): funnel is FunnelSection & { sectionId: number } =>
          funnel.sectionId != null
      ),
    [projectState.funnels]
  );
  const optimizationPlanQueries = useQueries({
    queries: optimizationPlanFunnels.map((funnel) =>
      getGetSectionOptimizationPlanQueryOptions(
        projectState.project.id,
        funnel.sectionId,
        {
          query: {
            enabled: !!projectState.project.id && !!funnel.sectionId,
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        }
      )
    ),
  });
  const pendingOptimizationPlans = useMemo(
    () =>
      optimizationPlanQueries
        .map((query, index) => {
          const plan = query.data as OptimizationPlanResponse | undefined;
          const funnel = optimizationPlanFunnels[index];

          if (!funnel || !plan || !isPendingOptimizationPlan(plan)) return null;

          return {
            funnel,
            plan,
            improvements: mapOptimizationRecommendationsToImprovements(
              plan.recommendations
            ),
          };
        })
        .filter((item): item is PendingOptimizationPlan => item != null),
    [optimizationPlanFunnels, optimizationPlanQueries]
  );
  const reviewNotificationCount = pendingOptimizationPlans.length;
  const selectedPendingOptimizationPlan = useMemo(
    () =>
      pendingOptimizationPlans.find(
        (pendingPlan) => pendingPlan.funnel.id === effectiveSelectedFunnelId
      ) ?? null,
    [effectiveSelectedFunnelId, pendingOptimizationPlans]
  );
  const firstPendingOptimizationPlan = pendingOptimizationPlans[0] ?? null;
  const {
    data: optimizationPlanResponse,
    refetch: refetchOptimizationPlan,
    isFetching: isOptimizationPlanFetching,
    dataUpdatedAt: optimizationPlanUpdatedAt,
  } = useGetSectionOptimizationPlan(
    projectState.project.id,
    selectedSectionId,
    {
      query: {
        enabled: !!projectState.project.id && !!selectedSectionId,
        refetchOnWindowFocus: false,
        retry: 1,
        refetchInterval: (query) => {
          if (panelMode !== "generating") return false;
          const hasFreshRecommendationPlan =
            generationRequestedAt > 0 &&
            query.state.dataUpdatedAt >= generationRequestedAt &&
            isPendingOptimizationPlan(query.state.data);

          return hasFreshRecommendationPlan ? false : 2000;
        },
      },
    }
  );
  const requestSectionOptimizationMutation = useRequestSectionOptimization();
  const {
    data: codegenResultResponse,
    refetch: refetchCodegenResult,
    dataUpdatedAt: codegenResultUpdatedAt,
  } = useGetCodegenResult(projectState.project.id, selectedSectionId, {
    query: {
      enabled: !!projectState.project.id && !!selectedSectionId,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchInterval: (query) => {
        if (panelMode !== "applying") return false;

        return query.state.data?.generatedAt ? false : 2000;
      },
    },
  });
  const requestCodegenMutation = useRequestCodegen();
  const {
    data: projectCodegenResults,
    refetch: refetchProjectCodegenResults,
    isFetching: isProjectCodegenFetching,
    isLoading: isProjectCodegenLoading,
  } = useGetProjectCodegenResults(projectState.project.id, {
    query: {
      enabled: !!projectState.project.id,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });
  const codegenVersions = useMemo<AppliedCodegenVersion[]>(
    () =>
      (projectCodegenResults ?? [])
        .filter(
          (codegen) =>
            !!codegen.generatedAt &&
            (!!codegen.generatedHtml || !!codegen.generatedCss)
        )
        .sort(
          (a, b) =>
            new Date(b.generatedAt ?? 0).getTime() -
            new Date(a.generatedAt ?? 0).getTime()
        )
        .map((codegen, index) => ({
          key: getCodegenVersionKey(codegen),
          displayNumber: index + 1,
          sectionId: codegen.sectionId,
          generatedAt: codegen.generatedAt,
          usedRecommendationTitles: codegen.usedRecommendationTitles ?? [],
          generatedCode: mapCodegenResponseToPreviewCode(codegen),
        })),
    [projectCodegenResults]
  );
  const effectiveCodegenVersionKey =
    currentCodegenVersionKey || codegenVersions[0]?.key || "";
  const selectedCodegenVersion = useMemo(
    () =>
      codegenVersions.find(
        (version) => version.key === effectiveCodegenVersionKey
      ) ?? null,
    [codegenVersions, effectiveCodegenVersionKey]
  );
  const activeComparisonSectionId =
    comparisonSectionId ||
    selectedCodegenVersion?.sectionId ||
    selectedSectionId;
  const { data: sectionSourceResponse } = useGetSectionSource(
    projectState.project.id,
    activeComparisonSectionId,
    {
      query: {
        enabled: !!projectState.project.id && !!activeComparisonSectionId,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    }
  );
  const sourcePreviewCode = useMemo(
    () =>
      sectionSourceResponse
        ? mapSectionSourceToPreviewCode(sectionSourceResponse)
        : emptyPreviewCode,
    [sectionSourceResponse]
  );
  const refetchAllOptimizationPlans = () => {
    optimizationPlanQueries.forEach((query) => {
      void query.refetch();
    });
  };
  const apiImprovements = useMemo(
    () =>
      mapOptimizationRecommendationsToImprovements(
        optimizationPlanResponse?.recommendations
      ),
    [optimizationPlanResponse?.recommendations]
  );
  const isRecommendationPlanReady =
    isPendingOptimizationPlan(optimizationPlanResponse) &&
    apiImprovements.length > 0;
  const isFreshRecommendationPlanReady =
    isRecommendationPlanReady &&
    generationRequestedAt > 0 &&
    optimizationPlanUpdatedAt >= generationRequestedAt;
  const isCodegenResultReady = !!codegenResultResponse?.generatedAt;
  const isFreshCodegenResultReady =
    isCodegenResultReady &&
    codegenRequestedAt > 0 &&
    codegenResultUpdatedAt >= codegenRequestedAt;
  const codegenPreviewCode = useMemo(
    () =>
      codegenResultResponse?.generatedAt
        ? mapCodegenResponseToPreviewCode(codegenResultResponse)
        : null,
    [codegenResultResponse]
  );
  const activeOptimizationImprovements = useMemo(() => {
    if (panelMode === "review") {
      return (
        selectedPendingOptimizationPlan?.improvements ??
        firstPendingOptimizationPlan?.improvements ??
        (apiImprovements.length ? apiImprovements : [])
      );
    }

    if (panelMode === "optimizationSelect") {
      return (
        selectedPendingOptimizationPlan?.improvements ??
        firstPendingOptimizationPlan?.improvements ??
        []
      );
    }

    return apiImprovements.length
      ? apiImprovements
      : selectedPendingOptimizationPlan?.improvements ?? [];
  }, [
    apiImprovements,
    firstPendingOptimizationPlan?.improvements,
    panelMode,
    selectedPendingOptimizationPlan?.improvements,
  ]);
  const displayProjectState = useMemo(
    () => ({
      ...projectState,
      improvements: activeOptimizationImprovements.length
        ? activeOptimizationImprovements
        : projectState.improvements,
      sourceCode: sourcePreviewCode,
      generatedCode:
        generatedCodeOverride ??
        selectedCodegenVersion?.generatedCode ??
        codegenPreviewCode ??
        projectState.generatedCode,
    }),
    [
      activeOptimizationImprovements,
      codegenPreviewCode,
      generatedCodeOverride,
      projectState,
      selectedCodegenVersion?.generatedCode,
      sourcePreviewCode,
    ]
  );
  const canGenerate =
    canSelectFunnel &&
    !!selectedFunnel &&
    !!selectedSectionId &&
    persona.trim().length > 0 &&
    !requestSectionOptimizationMutation.isPending &&
    panelMode !== "generating";

  useEffect(() => {
    if (!isFreshRecommendationPlanReady) return;
    if (panelMode !== "generating") return;

    const timer = window.setTimeout(() => {
      setGenerationRequestedAt(0);
      setSelectedImprovementIds([]);
      if (isPanelOpen) {
        setPanelMode("review");
        return;
      }

      setPanelMode("create");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isFreshRecommendationPlanReady, isPanelOpen, panelMode]);

  useEffect(() => {
    if (!isFreshCodegenResultReady) return;
    if (panelMode !== "applying") return;

    const timer = window.setTimeout(() => {
      setGeneratedCodeOverride(
        mapCodegenResponseToPreviewCode(codegenResultResponse)
      );
      setCurrentCodegenVersionKey(getCodegenVersionKey(codegenResultResponse));
      setComparisonSectionId(
        codegenResultResponse?.sectionId ?? selectedSectionId
      );
      setCodegenRequestedAt(0);
      setPanelMode("applied");
      void refetchProjectCodegenResults();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [
    codegenResultResponse,
    isFreshCodegenResultReady,
    panelMode,
    refetchProjectCodegenResults,
    selectedSectionId,
  ]);

  const handleGenerate = () => {
    if (!canGenerate) return;
    setShowEntryTip(false);
    setSelectedImprovementIds([]);
    setGenerationRequestedAt(Date.now());
    setPanelMode("generating");

    requestSectionOptimizationMutation.mutate(
      {
        projectId: projectState.project.id,
        sectionId: selectedSectionId,
        data: { persona: persona.trim() },
      },
      {
        onSuccess: () => {
          refetchAllOptimizationPlans();
          void refetchOptimizationPlan();
        },
        onError: () => {
          setGenerationRequestedAt(0);
          setPanelMode("create");
        },
      }
    );
  };

  const handleOpenCreatePanel = () => {
    setIsPanelOpen(true);
    setShowEntryTip(false);
    setPanelMode("create");
  };

  const handleOpenVersionsPanel = () => {
    setIsPanelOpen(true);
    setShowCompareTip(false);
    setPanelMode("versions");
    void refetchProjectCodegenResults();
  };

  const handleOpenReview = () => {
    setSelectedImprovementIds([]);
    setPanelMode("optimizationSelect");
  };

  const handleOpenFunnelAnalysis = () => {
    setIsPanelOpen(false);
    navigate("/report");
  };

  const handleReviewOptimizationPlan = (plan: PendingOptimizationPlan) => {
    setSelectedFunnelId(plan.funnel.id);
    setSelectedImprovementIds([]);
    setPanelMode("review");
  };

  const handleToggleImprovement = (id: number) => {
    setSelectedImprovementIds((prev) =>
      prev.includes(id)
        ? prev.filter((improvementId) => improvementId !== id)
        : [...prev, id]
    );
  };

  const handlePreviewWireframe = (wireframe?: string) => {
    setPreviewWireframeHtml(wireframe?.trim() ?? "");
  };

  const handleCloseWireframePreview = () => {
    setPreviewWireframeHtml(null);
  };

  const handleApply = () => {
    if (!selectedSectionId || selectedImprovementIds.length === 0) return;

    setCodegenRequestedAt(Date.now());
    setPanelMode("applying");

    requestCodegenMutation.mutate(
      {
        projectId: projectState.project.id,
        sectionId: selectedSectionId,
        data: { optimizationIds: selectedImprovementIds },
      },
      {
        onSuccess: () => {
          refetchAllOptimizationPlans();
          void refetchOptimizationPlan();
          void refetchCodegenResult();
          void refetchProjectCodegenResults();
        },
        onError: () => {
          setCodegenRequestedAt(0);
          setPanelMode("review");
        },
      }
    );
  };

  const handleSelectCodegenVersion = (version: AppliedCodegenVersion) => {
    setCurrentCodegenVersionKey(version.key);
    setGeneratedCodeOverride(version.generatedCode);
    setComparisonSectionId(version.sectionId ?? 0);
    const versionFunnel = projectState.funnels.find(
      (funnel) => funnel.sectionId === version.sectionId
    );
    if (versionFunnel) {
      setSelectedFunnelId(versionFunnel.id);
    }
    setShowCompareTip(true);
    navigate("/improve/improvement");
  };

  const handleViewGeneratedCode = () => {
    setComparisonSectionId(
      codegenResultResponse?.sectionId ?? selectedSectionId
    );
    setIsPanelOpen(false);
    setShowCompareTip(true);
    navigate("/improve/improvement");
  };

  const handlePlaySession = (sessionId: string) => {
    setIsPanelOpen(false);
    navigate(`/session?sessionId=${encodeURIComponent(sessionId)}`);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <TopBar
        projectUrl={projectState.project.url}
        isProjectLoading={isProjectLoading}
        activeView={activeView}
        onSelectView={handleSelectView}
        onReload={() => setReloadKey((prev) => prev + 1)}
      />
      <div className="relative flex min-h-0 flex-1">
        <Routes>
          <Route index element={<Navigate to="webpage" replace />} />
          <Route
            path="webpage"
            element={
              <WebpageView
                projectState={displayProjectState}
                reloadKey={reloadKey}
                showEntryTip={showEntryTip && !isPanelOpen}
                onCloseEntryTip={() => setShowEntryTip(false)}
                onOpenPanel={handleOpenCreatePanel}
                notificationCount={isPanelOpen ? 0 : reviewNotificationCount}
                showFloatingButton={!isPanelOpen}
              />
            }
          />
          <Route
            path="improvement"
            element={
              <ImprovementView
                projectState={displayProjectState}
                reloadKey={reloadKey}
                showCompareTip={showCompareTip && !isPanelOpen}
                onCloseCompareTip={() => setShowCompareTip(false)}
                onOpenPanel={handleOpenVersionsPanel}
                notificationCount={0}
                showFloatingButton={!isPanelOpen}
              />
            }
          />
          <Route path="*" element={<Navigate to="webpage" replace />} />
        </Routes>
        {isPanelOpen && !isPanelDismissDisabled && (
          <button
            type="button"
            className="absolute inset-0 z-30 cursor-default bg-transparent"
            aria-label="개선안 패널 닫기"
            onClick={() => setIsPanelOpen(false)}
          />
        )}
        {isPanelOpen && (
          <ImprovementPanel
            mode={panelMode}
            projectState={displayProjectState}
            selectedFunnel={selectedFunnel}
            selectedFunnelId={effectiveSelectedFunnelId}
            persona={persona}
            selectedImprovementIds={selectedImprovementIds}
            pendingOptimizationPlans={pendingOptimizationPlans}
            reviewNotificationCount={reviewNotificationCount}
            funnelAnalysisStatus={funnelAnalysisStatus}
            canSelectFunnel={canSelectFunnel}
            codegenVersions={codegenVersions}
            currentCodegenVersionKey={effectiveCodegenVersionKey}
            isCodegenVersionsLoading={
              isProjectCodegenLoading || isProjectCodegenFetching
            }
            codegenGeneratedAt={codegenResultResponse?.generatedAt}
            isProjectLoading={
              isProjectLoading ||
              isFunnelLoading ||
              (panelMode === "create" && isOptimizationPlanFetching)
            }
            canGenerate={canGenerate}
            onSelectFunnel={setSelectedFunnelId}
            onChangePersona={setPersona}
            onGenerate={handleGenerate}
            onOpenReview={handleOpenReview}
            onOpenFunnelAnalysis={handleOpenFunnelAnalysis}
            onReviewOptimizationPlan={handleReviewOptimizationPlan}
            onToggleImprovement={handleToggleImprovement}
            onPreviewWireframe={handlePreviewWireframe}
            onApply={handleApply}
            onViewGeneratedCode={handleViewGeneratedCode}
            onSelectCodegenVersion={handleSelectCodegenVersion}
            onPlaySession={handlePlaySession}
          />
        )}
        {previewWireframeHtml !== null && (
          <WireframePreviewModal
            wireframeHtml={previewWireframeHtml}
            projectUrl={projectState.project.url}
            reloadKey={reloadKey}
            onClose={handleCloseWireframePreview}
          />
        )}
      </div>
    </div>
  );
};

const Improve = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    () => getStoredProjectId()
  );
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const { data: projectListData, isLoading: isProjectListLoading } =
    useGetProjectList({
      query: {
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 0,
        throwOnError: true,
      },
    });

  const projects = useMemo(
    () => projectListData?.projects ?? [],
    [projectListData?.projects]
  );

  const selectedProject = useMemo(() => {
    if (!projects.length) return null;

    return (
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0] ??
      null
    );
  }, [projects, selectedProjectId]);
  const effectiveProjectId = selectedProject?.id ?? 0;
  const { data: funnelDataResponse, isLoading: isFunnelLoading } =
    useGetFunnelAnalytics(effectiveProjectId, {
      query: {
        enabled: !!effectiveProjectId,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        refetchInterval: (query) =>
          query.state.data?.status === FunnelResponseStatus.IN_PROGRESS
            ? 3000
            : false,
      },
    });

  useEffect(() => {
    const syncSelectedProject = () => {
      setSelectedProjectId(getStoredProjectId());
    };

    window.addEventListener(
      SELECTED_PROJECT_CHANGED_EVENT,
      syncSelectedProject
    );
    window.addEventListener("storage", syncSelectedProject);

    return () => {
      window.removeEventListener(
        SELECTED_PROJECT_CHANGED_EVENT,
        syncSelectedProject
      );
      window.removeEventListener("storage", syncSelectedProject);
    };
  }, []);

  useEffect(() => {
    if (isProjectListLoading) return;
    setStoredProjectId(selectedProject?.id ?? null);
  }, [isProjectListLoading, selectedProject?.id]);

  const projectContext = useMemo(
    () => ({
      id: selectedProject?.id ?? 0,
      name: selectedProject?.name ?? "Bitda Landing Page",
      url: selectedProject?.url ?? "https://example-saas.com",
    }),
    [selectedProject?.id, selectedProject?.name, selectedProject?.url]
  );
  const projectState = useMemo(
    () =>
      buildLandingProjectState(
        projectContext,
        funnelDataResponse?.status === FunnelResponseStatus.COMPLETED
          ? funnelDataResponse.funnelData
          : undefined,
        false
      ),
    [funnelDataResponse, projectContext]
  );

  if (!selectedProject && !isProjectListLoading) {
    return (
      <>
        <NoProjectState
          onCreateProject={() => setIsNewProjectModalOpen(true)}
        />
        <NewProjectModal
          open={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      </>
    );
  }

  return (
    <LandingImprovementContent
      projectState={projectState}
      isProjectLoading={isProjectListLoading}
      isFunnelLoading={
        isFunnelLoading ||
        funnelDataResponse?.status === FunnelResponseStatus.IN_PROGRESS
      }
      funnelAnalysisStatus={funnelDataResponse?.status}
    />
  );
};

export default Improve;
