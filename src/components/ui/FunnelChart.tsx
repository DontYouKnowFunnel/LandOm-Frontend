import { useEffect, useState } from "react";
import type { FunnelDataItem } from "../../services/analytics";

interface FunnelChartProps {
  data: FunnelDataItem[];
}

const FunnelChart = ({ data }: FunnelChartProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-0">
      {data.map((item, index) => {
        const prev = index > 0 ? data[index - 1] : null;
        const dropPct = prev
          ? (((prev.ratio - item.ratio) / prev.ratio) * 100).toFixed(1)
          : null;

        return (
          <div key={item.id}>
            {dropPct !== null && <div className="h-7" />}
            <div className="flex items-center gap-3">
              <div
                className="h-12 rounded-xl bg-blue-500 flex items-center px-4 overflow-hidden shrink-0"
                style={{
                  width: animated ? `${item.ratio * 100}%` : "0%",
                  opacity: animated ? 1 : 0,
                  transition: `width 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 70}ms, opacity 400ms ease ${index * 70}ms`,
                }}
              >
                <span className="text-white font-semibold text-sm whitespace-nowrap">
                  {(item.ratio * 100).toFixed(0)}%
                </span>
              </div>
              {dropPct !== null && (
                <span
                  className="text-red-500 text-sm font-semibold whitespace-nowrap"
                  style={{
                    opacity: animated ? 1 : 0,
                    transition: `opacity 400ms ease ${index * 70 + 400}ms`,
                  }}
                >
                  -{dropPct}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
