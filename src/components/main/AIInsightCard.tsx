import { AXIcon } from "../Icons";

export interface Insight {
  text: string;
}

interface AIInsightCardProps {
  insight: Insight;
  onClose?: () => void;
}

const AIInsightCard = ({ insight, onClose }: AIInsightCardProps) => (
  <div className="relative rounded-2xl bg-slate-900 overflow-hidden h-full flex flex-col">
    <div
      className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
      style={{ background: "#2563EB", opacity: 0.33, filter: "blur(64px)" }}
    />

    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-1.5">
          <AXIcon className="text-blue-400 text-base" />
          <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
            AI Insights
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded"
            aria-label="AI Insights 닫기"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 px-5 flex flex-col justify-center gap-3">
        <p className="text-lg font-bold text-white leading-snug">
          주요 개선 포인트
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
      </div>

      <div className="px-4 pb-4">
        <button className="w-full bg-white rounded-xl py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors">
          랜딩 페이지 개선안 보기
        </button>
      </div>
    </div>
  </div>
);

export default AIInsightCard;
