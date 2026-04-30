import { AXIcon } from "../Icons";

interface AIInsightCardProps {
  section: string;
  conversionRate: string;
  onClose?: () => void;
}

const AIInsightCard = ({
  section,
  conversionRate,
  onClose,
}: AIInsightCardProps) => (
  <div className="relative rounded-2xl bg-slate-900 overflow-hidden h-full flex flex-col">
    <div
      className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
      style={{ background: "#2563EB", opacity: 0.33, filter: "blur(64px)" }}
    />

    <div className="relative z-10 flex flex-col h-full">
      {onClose && (
        <div className="flex justify-end px-5 pt-5">
          <button
            onClick={onClose}
            className="text-white hover:text-slate-300 transition-colors p-0.5 rounded"
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
        </div>
      )}

      <div className="flex-1 px-5 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <AXIcon className="text-blue-400 text-xl" />
          <span className="text-base font-bold tracking-widest text-blue-400 uppercase">
            AI Insights
          </span>
        </div>
        <p className="text-xl font-semibold text-white leading-snug mt-3">
          주요 개선 포인트
        </p>
        <p className="text-base font-normal text-slate-300 leading-relaxed mt-3">
          <span className="font-bold text-white">{section} 섹션</span>
          {
            "에서 사용자 이탈이 많이 발생합니다. AI 추천 개선안을 적용하면, 전환율이 "
          }
          <span className="font-bold text-blue-500">{conversionRate}</span>
          {" 향상될 것으로 예상됩니다."}
        </p>
      </div>

      <div className="px-4 pb-4">
        <button className="w-full bg-white rounded-sm py-3 mt-6 mb-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors">
          랜딩 페이지 개선안 보기
        </button>
      </div>
    </div>
  </div>
);

export default AIInsightCard;
