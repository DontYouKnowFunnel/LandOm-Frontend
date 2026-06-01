import { ImproveActionIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";

interface ImproveInsightCardProps {
  section: string;
  conversionRate: string;
  isLoading?: boolean;
  onClose?: () => void;
}

const ImproveInsightCard = ({
  section,
  conversionRate,
  isLoading = false,
  onClose,
}: ImproveInsightCardProps) => (
  <div className="relative h-full min-h-[280px] rounded-xl bg-slate-900 shadow-[0_0_16px_4px_rgba(0,0,0,0.25)] overflow-hidden">
    <div className="pointer-events-none absolute -right-[23px] -top-[19px] h-32 w-32 rounded-xl bg-blue-600 opacity-30 blur-[32px]" />

    <div className="relative z-10 flex h-full flex-col gap-5 p-5">
      {onClose && (
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center text-white transition-colors hover:text-slate-300"
            aria-label="Improve Insights 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="flex items-center gap-[6px]">
          <ImproveActionIcon className="text-2xl text-blue-400" />
          <span className="text-sm font-semibold uppercase leading-5 tracking-[1.4px] text-blue-400">
            IMPROVE INSIGHTS
          </span>
        </div>
        <p className="text-xl font-semibold leading-7 text-white">
          주요 개선 포인트
        </p>
        <p className="text-base font-normal leading-6 text-slate-300">
          {isLoading ? (
            <div className="flex flex-col gap-1.5">
              <Skeleton height={24} className="bg-slate-700" />
              <Skeleton height={24} className="bg-slate-700" />
              <Skeleton height={24} className="bg-slate-700" />
            </div>
          ) : (
            <>
              <span className="font-bold text-white">{section} 섹션</span>
              <span>{"에서 사용자 이탈이 많이 발생합니다."}</span>
              <br />
              <span>{"improve 추천 개선안을 적용하면, 전환율이 "}</span>
              <span className="font-bold text-blue-500">{conversionRate}</span>
              <span>{" 향상될 것으로 예상됩니다."}</span>
            </>
          )}
        </p>
      </div>

      <div>
        <button className="h-11 w-full rounded bg-white px-4 py-3 text-sm font-bold leading-5 text-slate-900 transition-colors hover:bg-slate-100">
          랜딩 페이지 개선안 보기
        </button>
      </div>
    </div>
  </div>
);

export default ImproveInsightCard;
