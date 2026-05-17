import type { ComponentType, HTMLAttributes } from "react";
import Skeleton from "../ui/Skeleton";

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ComponentType<HTMLAttributes<HTMLSpanElement>>;
  iconClassName?: string;
  iconRotate?: number;
  label: string;
  value: string;
  isLoading?: boolean;
  valueClassName?: string;
}

const MetricCard = ({
  icon: Icon,
  iconClassName = "text-slate-200",
  iconRotate = 0,
  label,
  value,
  isLoading = false,
  valueClassName = "text-slate-900",
  className = "",
  ...props
}: MetricCardProps) => (
  <div
    className={`relative bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between p-3 gap-2 h-24 ${className}`}
    {...props}
  >
    <span className="text-sm text-slate-600 font-medium">{label}</span>
    <Icon
      className={`absolute -bottom-3 left-3 text-[64px] z-0 ${iconClassName}`}
      style={{ transform: `rotate(-${iconRotate}deg)` }}
    />
    <div className="relative z-10 w-28 self-end text-right">
      {isLoading ? (
        <Skeleton height={32} />
      ) : (
        <span
          className={`inline-block w-full text-2xl font-bold text-slate-900 leading-none ${valueClassName}`}
        >
          {value}
        </span>
      )}
    </div>
  </div>
);

export default MetricCard;
