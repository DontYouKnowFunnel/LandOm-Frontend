import { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton";

type SectionBar = {
  label: string;
  ratio: number;
  color: string;
};

const DEFAULT_SECTION_BARS: SectionBar[] = [
  { label: "Hero", ratio: 1.0, color: "#1D4ED8" },
  { label: "Features", ratio: 0.69, color: "#2563EB" },
  { label: "Value Prop", ratio: 0.43, color: "#3B82F6" },
  { label: "Social Proof", ratio: 0.27, color: "#60A5FA" },
  { label: "Pricing", ratio: 0.2, color: "#93C5FD" },
  { label: "CTA", ratio: 0.12, color: "#BFDBFE" },
];

const MAX_BAR_HEIGHT = 240;
const CONTAINER_HEIGHT = MAX_BAR_HEIGHT + 36;

interface BarColumnProps {
  ratio: number;
  color: string;
  animated: boolean;
  index: number;
  isLoading?: boolean;
  isMuted?: boolean;
}

const BarColumn = ({
  ratio,
  color,
  animated,
  index,
  isLoading = false,
  isMuted = false,
}: BarColumnProps) => {
  const targetHeight = Math.round(ratio * MAX_BAR_HEIGHT);
  const mutedBarColor = "#CBD5E1";

  return (
    <div className="relative z-0 flex-1" style={{ height: CONTAINER_HEIGHT }}>
      {/* Badge floating just above bar top */}
      {isLoading ? (
        <div
          className="absolute left-1/2 z-[1] w-12 -translate-x-1/2"
          style={{ bottom: `${targetHeight - 14}px` }}
        >
          <Skeleton height={20} />
        </div>
      ) : (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-[1] rounded-sm px-3 py-0.5 text-sm font-bold whitespace-nowrap ${
            isMuted ? "bg-white/90 text-slate-500" : "bg-white text-slate-700"
          }`}
          style={{
            borderColor: isMuted ? mutedBarColor : color,
            borderWidth: 2,
            borderStyle: "solid",
            bottom: `${targetHeight - 14}px`,
            opacity: isMuted ? 1 : animated ? 1 : 0,
            transition: `opacity 300ms ease ${index * 80 + 400}ms`,
          }}
        >
          {(ratio * 100).toFixed(0)}%
        </div>
      )}
      {/* Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 rounded-lg"
        style={{
          backgroundColor: isLoading || isMuted ? mutedBarColor : color,
          height:
            isLoading || isMuted
              ? `${targetHeight}px`
              : animated
              ? `${targetHeight}px`
              : "0px",
          transition: `height 600ms cubic-bezier(0.4, 0, 0.2, 1) ${
            index * 80
          }ms`,
        }}
      />
    </div>
  );
};

interface SectionFunnelChartProps {
  bars?: SectionBar[];
  isLoading?: boolean;
  isFunnelRegistered?: boolean;
  onClickAnalyze?: () => void;
}

const SectionFunnelChart = ({
  bars = DEFAULT_SECTION_BARS,
  isLoading = false,
  isFunnelRegistered = true,
  onClickAnalyze,
}: SectionFunnelChartProps) => {
  const [animated, setAnimated] = useState(false);
  const isUnregisteredState = !isLoading && !isFunnelRegistered;
  const displayedBars = isUnregisteredState ? DEFAULT_SECTION_BARS : bars;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 p-3.5">
      <span className="text-sm font-medium text-slate-600 block ">
        퍼널 그래프
      </span>
      <div className="relative z-0 flex gap-3">
        {displayedBars.map((bar, i) => (
          <BarColumn
            key={bar.label}
            ratio={bar.ratio}
            color={bar.color}
            animated={animated && !isLoading}
            index={i}
            isLoading={isLoading}
            isMuted={isUnregisteredState}
          />
        ))}
      </div>

      {isUnregisteredState && (
        <>
          <div className="absolute left-1 right-1 top-1 bottom-1 z-20 rounded-xl bg-white/55 backdrop-blur-[3px]" />
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
            <p className="whitespace-pre-line text-center text-base font-normal leading-6 text-slate-900">
              퍼널 정보가 등록되지 않았습니다.
              {"\n"}
              퍼널 분석을 진행해주세요.
            </p>
            <button
              type="button"
              onClick={onClickAnalyze}
              className="mt-2.5 h-9 w-32 rounded-lg bg-blue-500 text-sm font-semibold leading-5 text-white"
            >
              퍼널 분석하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SectionFunnelChart;
