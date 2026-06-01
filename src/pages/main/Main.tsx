import { useEffect, useMemo, useState } from "react";
import {
  FunnelResponseStatus,
  useGetAnalyticsSummary,
  useGetFunnelAnalytics,
  useGetProjectList,
  useGetRecentSessions,
  useGetTrends,
  type SessionDto,
} from "../../api/generated";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/main/PageHeader";
import MetricCard from "../../components/main/MetricCard";
import SectionFunnelChart from "../../components/main/SectionFunnelChart";
import SessionTable, {
  type SessionRow,
} from "../../components/main/SessionTable";
import SectionAnalysisCard from "../../components/main/SectionAnalysisCard";
import CompareAnalysisCard from "../../components/main/CompareAnalysisCard";
import ImproveInsightCard from "../../components/main/ImproveInsightCard";
import NewProjectModal from "../../components/main/NewProjectModal";
import {
  getStoredProjectId,
  SELECTED_PROJECT_CHANGED_EVENT,
  setStoredProjectId,
} from "../../constants/project";
import {
  UserIcon,
  MonitorIcon,
  RepeatIcon,
  ClockIcon,
} from "../../components/Icons";

const DEFAULT_REACH_SECTIONS = [
  { ratio: 1.0 },
  { ratio: 0.74 },
  { ratio: 0.5 },
  { ratio: 0.88 },
];

const DEFAULT_COMPARE_SECTIONS = [
  { ratio: 1.0 },
  { ratio: 0.74 },
  { ratio: 0.5 },
  { ratio: 0.88 },
];

const FUNNEL_COLORS = [
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
];

const formatNumber = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString();
};

const formatConversionRate = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(2)}%`;
};

const formatPeriodRange = (periods: string[]) => {
  if (periods.length === 0) return "";
  if (periods.length === 1) return periods[0];
  return `${periods[0]} - ${periods[periods.length - 1]}`;
};

const formatSessionTimestamp = (timestamp?: string) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const mapSessionStatus = (status?: string): "전환" | "이탈" | "탐색중" => {
  if (status === "CONVERTED") return "전환";
  if (status === "DROP") return "이탈";
  return "탐색중";
};

const clampRatio = (value: number) => Math.max(0, Math.min(1, value));

const buildSessionRows = (sessions?: SessionDto[]): SessionRow[] =>
  (sessions ?? []).map((session) => ({
    accessTime: formatSessionTimestamp(session.timestamp),
    sessionId: session.sessionId ?? "-",
    device: session.device ?? "-",
    exitFunnel: session.lastSection ?? "-",
    stayTime: session.duration ?? "-",
    status: mapSessionStatus(session.status),
    replayUrl: session.replayUrl,
  }));

type DashboardContentProps = {
  projectId: number;
  projectName: string;
  projectUrl: string;
  isProjectContextLoading?: boolean;
  enableInitialSkeletonFadeIn?: boolean;
};

const DashboardContent = ({
  projectId,
  projectName,
  projectUrl,
  isProjectContextLoading = false,
  enableInitialSkeletonFadeIn = false,
}: DashboardContentProps) => {
  const navigate = useNavigate();
  const [showInsight, setShowInsight] = useState(true);
  const [isSkeletonFadeVisible, setIsSkeletonFadeVisible] = useState(
    !enableInitialSkeletonFadeIn
  );
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetAnalyticsSummary(projectId, {
      query: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        throwOnError: true,
      },
    });

  const { data: funnelData, isLoading: isFunnelLoading } =
    useGetFunnelAnalytics(projectId, {
      query: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        throwOnError: true,
      },
    });

  const { data: recentSessionsData, isLoading: isRecentSessionsLoading } =
    useGetRecentSessions(
      projectId,
      { limit: 4 },
      {
        query: {
          staleTime: 60_000,
          refetchOnWindowFocus: false,
          retry: 1,
          throwOnError: true,
        },
      }
    );

  const { data: trendsData, isLoading: isTrendsLoading } = useGetTrends(
    projectId,
    {
      query: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        throwOnError: true,
      },
    }
  );

  const visitorCount =
    funnelData?.totalSessions ?? funnelData?.funnelData?.[0]?.reachedUserCount;
  const sessionCount = summaryData?.sessionCount;
  const conversionRate = summaryData?.conversionRate;
  const avgDuration = summaryData?.avgDuration;

  const isVisitorLoading = isProjectContextLoading || isFunnelLoading;
  const isSessionLoading = isProjectContextLoading || isSummaryLoading;
  const isConversionLoading = isProjectContextLoading || isSummaryLoading;
  const isAvgDurationLoading = isProjectContextLoading || isSummaryLoading;
  const isHeaderLoading = isProjectContextLoading;
  const isFunnelChartLoading = isProjectContextLoading || isFunnelLoading;
  const isSessionTableLoading =
    isProjectContextLoading || isRecentSessionsLoading;
  const isAnalysisLoading = isProjectContextLoading || isTrendsLoading;
  const isFunnelRegistered =
    funnelData?.status === FunnelResponseStatus.COMPLETED;
  const isAnyDashboardLoading =
    isHeaderLoading ||
    isVisitorLoading ||
    isSessionLoading ||
    isConversionLoading ||
    isAvgDurationLoading ||
    isFunnelChartLoading ||
    isSessionTableLoading ||
    isAnalysisLoading;
  const funnelSections = funnelData?.funnelData;

  useEffect(() => {
    if (!enableInitialSkeletonFadeIn) return;
    const timer = window.setTimeout(() => setIsSkeletonFadeVisible(true), 30);
    return () => window.clearTimeout(timer);
  }, [enableInitialSkeletonFadeIn]);

  const funnelBars = useMemo(() => {
    if (!funnelSections?.length) return [];
    return funnelSections.slice(0, 6).map((section, index) => ({
      label: section.sectionName ?? `Step ${index + 1}`,
      ratio: clampRatio(section.reachRate ?? 0),
      color: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
    }));
  }, [funnelSections]);

  const sessionRows = useMemo(
    () => buildSessionRows(recentSessionsData?.sessions),
    [recentSessionsData?.sessions]
  );

  const scoreValues = useMemo(
    () =>
      (trendsData?.scores ?? [])
        .map((item) => item.value)
        .filter((value): value is number => typeof value === "number"),
    [trendsData?.scores]
  );

  const scorePeriods = useMemo(
    () =>
      (trendsData?.scores ?? [])
        .map((item) => item.period)
        .filter((period): period is string => Boolean(period)),
    [trendsData?.scores]
  );

  const conversionRateValues = useMemo(
    () =>
      (trendsData?.conversionRates ?? [])
        .map((item) => item.value)
        .filter((value): value is number => typeof value === "number"),
    [trendsData?.conversionRates]
  );

  const conversionPeriods = useMemo(
    () =>
      (trendsData?.conversionRates ?? [])
        .map((item) => item.period)
        .filter((period): period is string => Boolean(period)),
    [trendsData?.conversionRates]
  );

  const scorePeriodLabel = formatPeriodRange(scorePeriods);
  const conversionPeriodLabel = formatPeriodRange(conversionPeriods);

  const latestScore = scoreValues.at(-1);
  const scoreCardValue =
    latestScore == null || Number.isNaN(latestScore)
      ? "-"
      : `${latestScore}/100`;

  const scoreSections = useMemo(() => {
    if (!scoreValues.length) return DEFAULT_REACH_SECTIONS;
    return scoreValues.slice(-4).map((value) => ({
      ratio: clampRatio(value / 100),
    }));
  }, [scoreValues]);

  const conversionSections = useMemo(() => {
    if (!conversionRateValues.length) return DEFAULT_COMPARE_SECTIONS;
    const recentValues = conversionRateValues.slice(-4);
    const maxValue = Math.max(...recentValues, 0.0001);
    return recentValues.map((value) => ({
      ratio: clampRatio(value / maxValue),
    }));
  }, [conversionRateValues]);

  const conversionChange = useMemo(() => {
    if (conversionRateValues.length < 2) return 0;
    const current = conversionRateValues[conversionRateValues.length - 1] ?? 0;
    const previous = conversionRateValues[conversionRateValues.length - 2] ?? 0;
    return Number(((current - previous) * 100).toFixed(2));
  }, [conversionRateValues]);

  const topDropSection = useMemo(() => {
    if (!funnelSections?.length) return null;
    return [...funnelSections].sort(
      (a, b) => (b.dropRate ?? 0) - (a.dropRate ?? 0)
    )[0];
  }, [funnelSections]);

  const insightSection = topDropSection?.sectionName ?? "핵심";
  const insightImprovement = `${Math.max(
    1,
    Math.abs(conversionChange || 0)
  ).toFixed(1)}%`;

  return (
    <div
      className={`flex flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 p-5 transition-opacity duration-300 ${
        enableInitialSkeletonFadeIn &&
        isAnyDashboardLoading &&
        !isSkeletonFadeVisible
          ? "opacity-0"
          : "opacity-100"
      }`}
    >
      <PageHeader
        projectName={projectName}
        url={projectUrl}
        isLoading={isHeaderLoading}
      />

      <div className="flex flex-1 flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            icon={UserIcon}
            iconRotate={7.36}
            iconClassName="text-slate-200"
            label="방문자 수"
            value={formatNumber(visitorCount)}
            isLoading={isVisitorLoading}
          />
          <MetricCard
            icon={MonitorIcon}
            iconRotate={5.31}
            iconClassName="text-slate-200"
            label="세션 수"
            value={formatNumber(sessionCount)}
            isLoading={isSessionLoading}
          />
          <MetricCard
            icon={RepeatIcon}
            iconRotate={9.78}
            iconClassName="text-slate-200"
            label="전환률"
            value={formatConversionRate(conversionRate)}
            isLoading={isConversionLoading}
          />
          <MetricCard
            icon={ClockIcon}
            iconRotate={5.31}
            iconClassName="text-slate-200"
            label="평균 체류시간"
            value={avgDuration ?? "-"}
            isLoading={isAvgDurationLoading}
          />
        </div>

        <SectionFunnelChart
          bars={funnelBars.length ? funnelBars : undefined}
          isLoading={isFunnelChartLoading}
          isFunnelRegistered={isFunnelRegistered}
          onClickAnalyze={() => navigate("/report")}
        />

        <div className="flex items-stretch gap-4">
          <div className="min-w-0 flex-1">
            <SessionTable
              sessions={sessionRows}
              isLoading={isSessionTableLoading}
            />
          </div>
          <div
            className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
              showInsight ? "max-w-96 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <div className="h-full w-96">
              <ImproveInsightCard
                section={insightSection}
                conversionRate={insightImprovement}
                isLoading={isFunnelChartLoading || isAnalysisLoading}
                onClose={() => setShowInsight(false)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SectionAnalysisCard
            title="랜딩페이지 점수"
            value={scoreCardValue}
            period={scorePeriodLabel}
            sections={scoreSections}
            isLoading={isAnalysisLoading}
          />
          <CompareAnalysisCard
            title="과거 대비 전환률 비교"
            change={conversionChange}
            period={conversionPeriodLabel}
            sections={conversionSections}
            isLoading={isAnalysisLoading}
          />
        </div>
      </div>
    </div>
  );
};

const Main = () => {
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

    if (!selectedProject?.apiKey) {
      return;
    }
  }, [isProjectListLoading, selectedProject?.id, selectedProject?.apiKey]);

  if (isProjectListLoading) {
    return <div className="flex flex-1 bg-slate-50" />;
  }

  if (!selectedProject && !isProjectListLoading) {
    return (
      <>
        <div className="flex flex-1 items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="flex flex-col items-center gap-0">
              <p className="text-lg font-medium leading-6 text-slate-500">
                프로젝트가 없습니다
              </p>
              <p className="text-base font-normal whitespace-nowrap text-slate-500">
                새 프로젝트를 만들어 주세요
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="h-9 w-32 rounded-lg bg-blue-500 py-2 text-sm font-semibold leading-5 text-white disabled:opacity-60"
            >
              새 프로젝트
            </button>
          </div>
        </div>
        <NewProjectModal
          open={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      </>
    );
  }

  return (
    <DashboardContent
      projectId={selectedProject?.id ?? 0}
      projectName={selectedProject?.name ?? ""}
      projectUrl={selectedProject?.url ?? ""}
      isProjectContextLoading={false}
      enableInitialSkeletonFadeIn
    />
  );
};

export default Main;
