import { CloseIcon } from "../../../components/Icons";

const FloatingTooltip = ({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) => (
  <div className="absolute  bottom-[92px] right-7 z-100 w-[338px]">
    <div className="rounded-lg bg-blue-500 p-3.5 text-white">
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-bold leading-7">{title}</p>
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center"
          aria-label="안내 닫기"
          onClick={onClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-0.5 text-base font-normal leading-6">{description}</p>
    </div>
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="absolute -bottom-[17px] right-5 h-6 w-6 text-blue-500"
    >
      <path
        d="M2.6 4h18.8q1 0 .5.87L12.5 21.13q-.5.87-1 0L2.1 4.87Q1.6 4 2.6 4Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default FloatingTooltip;
