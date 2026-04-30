import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";
import AnalysisBar from "./AnalysisBar";

interface SectionBar {
  ratio: number;
}

interface SectionAnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  sections: SectionBar[];
}

const SectionAnalysisCard = ({
  title,
  value,
  sections,
  className = "",
  ...props
}: SectionAnalysisCardProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col gap-4 ${className}`}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <span className="text-4xl font-bold text-slate-900 leading-none">{value}</span>
      </div>
      <div className="flex items-end gap-3">
        {sections.map((s, i) => (
          <AnalysisBar key={i} ratio={s.ratio} animated={animated} index={i} />
        ))}
      </div>
    </div>
  );
};

export default SectionAnalysisCard;
