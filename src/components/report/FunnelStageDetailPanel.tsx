import { Icon } from "@iconify/react";
import { FunnelType, getFunnelLabel, funnelIconMap } from "../../models/funnel";
import { AXIcon, PlayButtonIcon } from "../Icons";
import type { FunnelStage } from "../../models/funnel";

type SessionRow = {
  id: string;
  device: string;
  stayTime: string;
};

type FunnelStageDetail = {
  dropoutDelta: string;
  stayTime: string;
  stayDelta: string;
  score: string;
  sessions: SessionRow[];
};

const FUNNEL_STAGE_DETAIL_MAP: Record<FunnelType, FunnelStageDetail> = {
  [FunnelType.HERO]: {
    dropoutDelta: "-15%",
    stayTime: "48s",
    stayDelta: "+8s",
    score: "78점",
    sessions: [
      { id: "S-10248", device: "Chrome · Windows", stayTime: "00:48" },
      { id: "S-10241", device: "Safari · iOS", stayTime: "00:44" },
      { id: "S-10235", device: "Edge · Windows", stayTime: "00:53" },
    ],
  },
  [FunnelType.PROBLEM]: {
    dropoutDelta: "+2%",
    stayTime: "71s",
    stayDelta: "+16s",
    score: "61점",
    sessions: [
      { id: "S-21472", device: "Chrome · Android", stayTime: "01:11" },
      { id: "S-21459", device: "Safari · iOS", stayTime: "01:04" },
      { id: "S-21444", device: "Chrome · Mac", stayTime: "01:13" },
    ],
  },
  [FunnelType.TARGET]: {
    dropoutDelta: "-7%",
    stayTime: "85s",
    stayDelta: "+21s",
    score: "69점",
    sessions: [
      { id: "S-31872", device: "Chrome · Android", stayTime: "01:25" },
      { id: "S-31861", device: "Safari · iOS", stayTime: "01:12" },
      { id: "S-31855", device: "Chrome · Windows", stayTime: "01:18" },
    ],
  },
  [FunnelType.PRICING]: {
    dropoutDelta: "+11%",
    stayTime: "36s",
    stayDelta: "-19s",
    score: "44점",
    sessions: [
      { id: "S-19472", device: "Chrome · Android", stayTime: "02:58" },
      { id: "S-19472", device: "Chrome · Android", stayTime: "02:58" },
      { id: "S-19472", device: "Chrome · Android", stayTime: "02:58" },
    ],
  },
  [FunnelType.CTA_SECTION]: {
    dropoutDelta: "+9%",
    stayTime: "57s",
    stayDelta: "-4s",
    score: "38점",
    sessions: [
      { id: "S-51921", device: "Chrome · Android", stayTime: "00:57" },
      { id: "S-51904", device: "Safari · iOS", stayTime: "00:50" },
      { id: "S-51888", device: "Chrome · Windows", stayTime: "00:55" },
    ],
  },
  [FunnelType.USE_CASE]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
  [FunnelType.FEATURE]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
  [FunnelType.VALUE_PROP]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
  [FunnelType.TRUST]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
  [FunnelType.FAQ]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
  [FunnelType.GENERIC]: {
    dropoutDelta: "+0%",
    stayTime: "--",
    stayDelta: "--",
    score: "--",
    sessions: [],
  },
};

interface FunnelStageDetailPanelProps {
  stage: FunnelStage;
  stages: FunnelStage[];
}

const FunnelStageDetailPanel = ({
  stage,
  stages,
}: FunnelStageDetailPanelProps) => {
  const selectedStageDetail = FUNNEL_STAGE_DETAIL_MAP[stage.funnelType];
  const StageSectionIcon = funnelIconMap[stage.funnelType];
  const stageLabel = `${getFunnelLabel(stage.funnelType)} Section`;
  const reachedUsersText = `${stage.reachedSection.toLocaleString()}명`;
  const reachRateText = `${Math.round(stage.ratio * 100)}%`;
  const sortedStages = [...stages].sort((a, b) => a.id - b.id);
  const currentStageIndex = sortedStages.findIndex(
    (currentStage) => currentStage.id === stage.id
  );
  const nextStage =
    currentStageIndex >= 0 ? sortedStages[currentStageIndex + 1] : undefined;
  const dropoutRate = nextStage
    ? Math.max(0, Math.round((stage.ratio - nextStage.ratio) * 100))
    : 0;
  const dropoutRateText = `${dropoutRate}%`;

  return (
    <div className="flex-[10] min-w-0 bg-slate-50 p-5 flex flex-col gap-5">
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
            <p className="text-slate-900 font-semibold">{reachedUsersText}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 도달 비율</p>
            <p className="text-slate-900 font-semibold">{reachRateText}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 이탈율</p>
            <p className="text-slate-900 font-semibold">{dropoutRateText}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 이탈율 대비</p>
            <p className="text-red-500 font-semibold">
              {selectedStageDetail.dropoutDelta}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 퍼널 체류 시간</p>
            <p className="text-slate-900 font-semibold">
              {selectedStageDetail.stayTime}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">평균 체류 시간 대비</p>
            <p className="text-blue-500 font-semibold">
              {selectedStageDetail.stayDelta}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">퍼널 점수</p>
            <p className="text-slate-900 font-semibold">
              {selectedStageDetail.score}
            </p>
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
        {selectedStageDetail.sessions.map((session, index) => (
          <div
            key={`${session.id}-${index}`}
            className="h-[42px] rounded-lg border border-slate-100 bg-white px-2 py-1.5 flex items-center gap-1"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 leading-4">
                {session.id}
              </p>
              <p className="text-[11px] leading-4 text-slate-500">
                {session.device}
              </p>
            </div>
            <p className="flex-1 min-w-0 text-xs font-medium text-slate-900">
              {session.stayTime}
            </p>
            <button type="button" className="w-8 flex items-center">
              <PlayButtonIcon className="text-2xl text-slate-500 hover:text-slate-700 transition-colors" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-1 relative overflow-hidden"
        >
          <AXIcon className="text-base" />
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
