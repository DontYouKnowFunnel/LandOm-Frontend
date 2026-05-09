import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";
import AnalysisBar from "./AnalysisBar";

interface CompareBar {
  ratio: number;
}

interface CompareAnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  change: number;
  period: string;
  sections: CompareBar[];
}

const CompareAnalysisCard = ({
  title,
  change,
  period,
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
    change > 0
      ? "text-red-500"
      : change < 0
      ? "text-blue-400"
      : "text-slate-400";
  const changeLabel = change > 0 ? `+${change}%` : `${change}%`;

  return (
    <div
      className={`relative h-[208px] overflow-hidden rounded-xl border border-slate-200 bg-white p-3 ${className}`}
      {...props}
    >
      <div className="flex w-full items-start justify-between leading-5">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {period ? (
          <span className="text-sm font-normal text-slate-400">{period}</span>
        ) : null}
      </div>
      <div className="flex h-full w-full items-end justify-center gap-2">
        {sections.map((s, i) => (
          <AnalysisBar key={i} ratio={s.ratio} animated={animated} index={i} />
        ))}
      </div>
      <div className="absolute left-[11px] top-[43px] leading-none">
        <span
          aria-hidden
          className="absolute inset-0 text-5xl font-bold text-transparent [-webkit-text-stroke:5px_#ffffff]"
        >
          {changeLabel}
        </span>
        <span className={`relative text-5xl font-bold ${valueColor}`}>
          {changeLabel}
        </span>
      </div>
    </div>
  );
};

export default CompareAnalysisCard;
