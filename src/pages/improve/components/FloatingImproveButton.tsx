import { ImproveActionIcon } from "../../../components/Icons";

const FloatingImproveButton = ({
  notificationCount,
  onOpenPanel,
}: {
  notificationCount: number;
  onOpenPanel: () => void;
}) => (
  <div className="absolute bottom-8 right-8 z-50 h-14 w-14">
    <button
      type="button"
      onClick={onOpenPanel}
      className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-900 text-white shadow-[0px_3px_16px_4px_rgba(0,0,0,0.25)]"
      aria-label="랜딩 페이지 개선 패널 열기"
    >
      <span className="absolute -right-10 -top-9 h-16 w-16 rounded-full bg-blue-600 opacity-[0.33] blur-[8px]" />
      <ImproveActionIcon className="z-10 h-8 w-8" />
    </button>
    {notificationCount > 0 && (
      <span className="absolute -right-1 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-2.5 text-base font-bold leading-6 text-slate-50">
        {notificationCount}
      </span>
    )}
  </div>
);

export default FloatingImproveButton;
