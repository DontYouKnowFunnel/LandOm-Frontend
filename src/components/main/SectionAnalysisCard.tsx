import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";
import AnalysisBar from "./AnalysisBar";
import Skeleton from "../ui/Skeleton";

interface SectionBar {
  ratio: number;
}

interface SectionAnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  period: string;
  sections: SectionBar[];
  isLoading?: boolean;
}

const SectionAnalysisCard = ({
  title,
  value,
  period,
  sections,
  isLoading = false,
  className = "",
  ...props
}: SectionAnalysisCardProps) => {
  const [animated, setAnimated] = useState(false);
  const [score, total = "100"] = value.split("/");

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative h-[208px] overflow-hidden rounded-xl border border-slate-200 bg-white p-3 ${className}`}
      {...props}
    >
      <div className="flex w-full items-start justify-between leading-5">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {isLoading ? (
          <div className="w-40">
            <Skeleton height={20} />
          </div>
        ) : period ? (
          <span className="text-sm font-normal text-slate-400">{period}</span>
        ) : null}
      </div>
      <div className="flex h-full w-full items-end justify-center gap-2">
        {sections.map((s, i) => (
          <AnalysisBar key={i} ratio={s.ratio} animated={animated} index={i} />
        ))}
      </div>
      <div className="absolute left-[11px] top-[43px] leading-none">
        {isLoading ? (
          <div className="w-24">
            <Skeleton height={48} />
          </div>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 text-5xl text-transparent [-webkit-text-stroke:5px_#ffffff]"
            >
              <span className="font-bold">{score}</span>
              <span className="font-light">/{total}</span>
            </div>
            <div className="relative text-5xl text-black">
              <span className="font-bold">{score}</span>
              <span className="font-light">/{total}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SectionAnalysisCard;
