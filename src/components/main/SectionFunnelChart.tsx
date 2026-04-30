import { useEffect, useState } from "react";

const SECTION_BARS = [
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
}

const BarColumn = ({ ratio, color, animated, index }: BarColumnProps) => {
  const targetHeight = Math.round(ratio * MAX_BAR_HEIGHT);

  return (
    <div className="relative flex-1" style={{ height: CONTAINER_HEIGHT }}>
      {/* Badge floating just above bar top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 bg-white border-2 rounded-sm px-2 py-0.5 text-sm font-bold text-slate-700 whitespace-nowrap"
        style={{
          borderColor: color,
          bottom: `${targetHeight - 14}px`,
          opacity: animated ? 1 : 0,
          transition: `opacity 300ms ease ${index * 80 + 400}ms`,
        }}
      >
        {(ratio * 100).toFixed(0)}%
      </div>
      {/* Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-lg"
        style={{
          backgroundColor: color,
          height: animated ? `${targetHeight}px` : "0px",
          transition: `height 600ms cubic-bezier(0.4, 0, 0.2, 1) ${
            index * 80
          }ms`,
        }}
      />
    </div>
  );
};

const SectionFunnelChart = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
      <span className="text-sm font-medium text-slate-600 block ">
        퍼널 그래프
      </span>
      <div className="flex gap-3">
        {SECTION_BARS.map((bar, i) => (
          <BarColumn
            key={bar.label}
            ratio={bar.ratio}
            color={bar.color}
            animated={animated}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionFunnelChart;
