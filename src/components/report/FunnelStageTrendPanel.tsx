import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { FunnelType, getFunnelStageLabel } from "../../models/funnel";
import type { FunnelStage } from "../../models/funnel";
import type { FunnelAnalysisTableRow } from "./FunnelAnalysisTableCard";
import Skeleton from "../ui/Skeleton";

const STAY_SECONDS_BY_FUNNEL_TYPE: Record<FunnelType, number> = {
  [FunnelType.HERO]: 48,
  [FunnelType.PROBLEM]: 71,
  [FunnelType.TARGET]: 85,
  [FunnelType.USE_CASE]: 0,
  [FunnelType.FEATURE]: 0,
  [FunnelType.VALUE_PROP]: 0,
  [FunnelType.TRUST]: 0,
  [FunnelType.PRICING]: 36,
  [FunnelType.FAQ]: 0,
  [FunnelType.CTA_SECTION]: 57,
  [FunnelType.GENERIC]: 0,
};

interface FunnelStageTrendPanelProps {
  stages: FunnelStage[];
  rows?: FunnelAnalysisTableRow[];
  isLoading?: boolean;
  showEmptyState?: boolean;
}

interface FunnelRateEntry {
  stageId: number;
  funnelType: FunnelType;
  sectionName?: string;
  value: number;
}

interface FunnelLineChartProps {
  series: Array<{
    id: string;
    data: Array<{ x: string; y: number }>;
  }>;
  lineColor: string;
  gradientId: string;
  yMax: number;
}

interface StrokedTextProps {
  text: string;
  className: string;
}

const StrokedText = ({ text, className }: StrokedTextProps) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        aria-hidden
        className="absolute inset-0 text-transparent [-webkit-text-stroke:2px_#ffffff]"
      >
        {text}
      </span>
      <span className="relative">{text}</span>
    </span>
  );
};

const FunnelLineChart = ({
  series,
  lineColor,
  gradientId,
  yMax,
}: FunnelLineChartProps) => {
  return (
    <ResponsiveLine
      data={series}
      margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: 0, max: yMax, stacked: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      enableGridX={false}
      enableGridY={false}
      enablePoints={false}
      lineWidth={2}
      curve="monotoneX"
      enableArea
      areaOpacity={1}
      isInteractive={false}
      enableCrosshair={false}
      useMesh={false}
      legends={[]}
      colors={[lineColor]}
      defs={[
        linearGradientDef(gradientId, [
          { offset: 0, color: "inherit", opacity: 0.35 },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: gradientId }]}
      theme={{
        background: "transparent",
      }}
    />
  );
};

const parseStayTimeToSeconds = (stayTime: string): number => {
  const [mm, ss] = stayTime.split(":");
  const minutes = Number(mm);
  const seconds = Number(ss);
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) return 0;
  return minutes * 60 + seconds;
};

const FunnelStageTrendPanel = ({
  stages,
  rows,
  isLoading = false,
  showEmptyState = false,
}: FunnelStageTrendPanelProps) => {
  if (showEmptyState) {
    return (
      <div className="flex gap-4 items-start w-full">
        <div className="relative flex-1 min-w-0 h-64 rounded-[14px] border border-slate-200 bg-white p-5 overflow-hidden">
          <p className="text-sm font-medium text-slate-600">이탈율 분석</p>
          <div className="h-[calc(100%-20px)] flex items-center justify-center">
            <p className="text-xs font-medium text-slate-500">
              퍼널 분석 결과가 없습니다.
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-w-0 h-64 rounded-[14px] border border-slate-200 bg-white p-5 overflow-hidden">
          <p className="text-sm font-medium text-slate-600">체류 시간 분석</p>
          <div className="h-[calc(100%-20px)] flex items-center justify-center">
            <p className="text-xs font-medium text-slate-500">
              퍼널 분석 결과가 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sortedStages = [...stages].sort((a, b) => a.id - b.id);
  const sortedRows = [...(rows ?? [])].sort((a, b) => a.id - b.id);

  const dropoutRateEntries: FunnelRateEntry[] =
    sortedRows.length > 0
      ? sortedRows.map((row) => ({
          stageId: row.id,
          funnelType: row.funnelType,
          sectionName: row.sectionName,
          value: row.dropoutRate,
        }))
      : sortedStages.map((currentStage, index) => {
          const nextStage = sortedStages[index + 1];
          const dropoutRate = nextStage
            ? Math.max(
                0,
                Math.round((currentStage.ratio - nextStage.ratio) * 100)
              )
            : 0;

          return {
            stageId: currentStage.id,
            funnelType: currentStage.funnelType,
            sectionName: currentStage.sectionName,
            value: dropoutRate,
          };
        });

  const stayTimeEntries: FunnelRateEntry[] =
    sortedRows.length > 0
      ? sortedRows.map((row) => ({
          stageId: row.id,
          funnelType: row.funnelType,
          sectionName: row.sectionName,
          value: parseStayTimeToSeconds(row.stayTime),
        }))
      : sortedStages.map((stage) => ({
          stageId: stage.id,
          funnelType: stage.funnelType,
          sectionName: stage.sectionName,
          value: STAY_SECONDS_BY_FUNNEL_TYPE[stage.funnelType] ?? 0,
        }));

  const transitionDropoutEntries = dropoutRateEntries.slice(0, -1);
  const mostDropoutStage =
    transitionDropoutEntries.length > 0
      ? transitionDropoutEntries.reduce((prev, current) =>
          current.value > prev.value ? current : prev
        )
      : undefined;
  const leastDropoutStage =
    transitionDropoutEntries.length > 0
      ? transitionDropoutEntries.reduce((prev, current) =>
          current.value < prev.value ? current : prev
        )
      : undefined;

  const validStayEntries = stayTimeEntries.filter((entry) => entry.value > 0);
  const shortestStayStage =
    validStayEntries.length > 0
      ? validStayEntries.reduce((prev, current) =>
          current.value < prev.value ? current : prev
        )
      : undefined;
  const longestStayStage =
    validStayEntries.length > 0
      ? validStayEntries.reduce((prev, current) =>
          current.value > prev.value ? current : prev
        )
      : undefined;

  const dropoutLineSeries = [
    {
      id: "dropoutRate",
      data: dropoutRateEntries.map((entry) => ({
        x: `#${entry.stageId}`,
        y: entry.value,
      })),
    },
  ];

  const stayTimeLineSeries = [
    {
      id: "stayTime",
      data: stayTimeEntries.map((entry) => ({
        x: `#${entry.stageId}`,
        y: entry.value,
      })),
    },
  ];

  const dropoutChartMaxY = Math.max(
    1,
    ...dropoutRateEntries.map((entry) => entry.value)
  );
  const stayTimeChartMaxY = Math.max(
    1,
    ...stayTimeEntries.map((entry) => entry.value)
  );
  const mostDropoutStageLabel = mostDropoutStage
    ? `#${mostDropoutStage.stageId} ${getFunnelStageLabel(mostDropoutStage)}`
    : "--";
  const leastDropoutStageLabel = leastDropoutStage
    ? `#${leastDropoutStage.stageId} ${getFunnelStageLabel(leastDropoutStage)}`
    : "--";
  const shortestStayStageLabel = shortestStayStage
    ? `#${shortestStayStage.stageId} ${getFunnelStageLabel(shortestStayStage)}`
    : "--";
  const longestStayStageLabel = longestStayStage
    ? `#${longestStayStage.stageId} ${getFunnelStageLabel(longestStayStage)}`
    : "--";

  return (
    <div className="flex gap-4 items-start w-full">
      <div className="relative flex-1 min-w-0 h-64 rounded-[14px] border border-slate-200 bg-white p-5 overflow-hidden">
        <p className="text-sm font-medium text-slate-600">이탈율 분석</p>

        <div className="absolute top-[41px] left-[19px] space-y-0.5 z-10">
          <div className="flex items-center gap-2.5">
            <StrokedText
              text="가장 이탈이 많은 퍼널"
              className="text-base leading-6 font-medium text-slate-500"
            />
            {isLoading ? (
              <Skeleton height={24} width={220} />
            ) : (
              <StrokedText
                text={mostDropoutStageLabel}
                className="text-base leading-6 font-semibold text-black"
              />
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <StrokedText
              text="가장 이탈이 적은 퍼널"
              className="text-base leading-6 font-medium text-slate-500"
            />
            {isLoading ? (
              <Skeleton height={24} width={220} />
            ) : (
              <StrokedText
                text={leastDropoutStageLabel}
                className="text-base leading-6 font-semibold text-black"
              />
            )}
          </div>
        </div>

        <div className="absolute left-5 right-5 bottom-5 top-[52px]">
          <FunnelLineChart
            series={dropoutLineSeries}
            lineColor="#EF4444"
            gradientId="dropout-line-gradient"
            yMax={dropoutChartMaxY}
          />
        </div>
      </div>

      <div className="relative flex-1 min-w-0 h-64 rounded-[14px] border border-slate-200 bg-white p-5 overflow-hidden">
        <p className="text-sm font-medium text-slate-600">체류 시간 분석</p>

        <div className="absolute top-[41px] left-[19px] space-y-0.5 z-10">
          <div className="flex items-center gap-2.5 z-10">
            <StrokedText
              text="가장 체류 시간이 짧은 퍼널"
              className="text-base leading-6 font-medium text-slate-500"
            />
            {isLoading ? (
              <Skeleton height={24} width={220} />
            ) : (
              <StrokedText
                text={shortestStayStageLabel}
                className="text-base leading-6 font-semibold text-black"
              />
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <StrokedText
              text="가장 체류 시간이 긴 퍼널"
              className="text-base leading-6 font-medium text-slate-500"
            />
            {isLoading ? (
              <Skeleton height={24} width={220} />
            ) : (
              <StrokedText
                text={longestStayStageLabel}
                className="text-base leading-6 font-semibold text-black"
              />
            )}
          </div>
        </div>

        <div className="absolute left-5 right-5 bottom-5 top-[56px]">
          <FunnelLineChart
            series={stayTimeLineSeries}
            lineColor="#3B82F6"
            gradientId="stay-time-line-gradient"
            yMax={stayTimeChartMaxY}
          />
        </div>
      </div>
    </div>
  );
};

export default FunnelStageTrendPanel;
