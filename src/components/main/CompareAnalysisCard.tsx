import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";

interface CompareBar {
  label: string;
  ratio: number;
}

interface CompareAnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  change: number;
  sections: CompareBar[];
}

const MAX_BAR_HEIGHT = 120;

interface BarProps {
  label: string;
  ratio: number;
  animated: boolean;
  index: number;
}

const Bar = ({ label, ratio, animated, index }: BarProps) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <div
      className="w-full flex items-end justify-center"
      style={{ height: `${MAX_BAR_HEIGHT}px` }}
    >
      <div
        className="w-full rounded-lg bg-blue-200"
        style={{
          height: animated ? `${Math.round(ratio * MAX_BAR_HEIGHT)}px` : "0px",
          transition: `height 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
        }}
      />
    </div>
    <span
      className="text-xs text-slate-500 text-center"
      style={{
        opacity: animated ? 1 : 0,
        transition: `opacity 300ms ease ${index * 80 + 400}ms`,
      }}
    >
      {label}
    </span>
  </div>
);

const CompareAnalysisCard = ({
  title,
  change,
  sections,
  className = "",
  ...props
}: CompareAnalysisCardProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const valueColor =
    change > 0 ? "text-red-500" : change < 0 ? "text-blue-400" : "text-slate-400";
  const changeLabel = change > 0 ? `+${change}%` : `${change}%`;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 ${className}`}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <span className={`text-4xl font-bold leading-none ${valueColor}`}>
          {changeLabel}
        </span>
      </div>
      <div className="flex items-end gap-3">
        {sections.map((s, i) => (
          <Bar
            key={s.label}
            label={s.label}
            ratio={s.ratio}
            animated={animated}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default CompareAnalysisCard;
