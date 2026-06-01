import { useRef, useState } from "react";
import { DragHorizontalIcon } from "../../components/Icons";
import FloatingImproveButton from "./components/FloatingImproveButton";
import FloatingTooltip from "./components/FloatingTooltip";
import HtmlCssPreviewFrame from "./components/HtmlCssPreviewFrame";
import type { LandingProjectState } from "./types";

const emptyPreviewCode = {
  html: "",
  css: "",
};

const ImprovementView = ({
  projectState,
  reloadKey,
  showCompareTip,
  onCloseCompareTip,
  onOpenPanel,
  notificationCount,
  showFloatingButton,
}: {
  projectState: LandingProjectState;
  reloadKey: number;
  showCompareTip: boolean;
  onCloseCompareTip: () => void;
  onOpenPanel: () => void;
  notificationCount: number;
  showFloatingButton: boolean;
}) => {
  const compareContainerRef = useRef<HTMLDivElement | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDraggingCompare, setIsDraggingCompare] = useState(false);

  const updateComparePosition = (clientX: number) => {
    const container = compareContainerRef.current;
    if (!container) return;

    const { left, width } = container.getBoundingClientRect();
    const nextPosition = ((clientX - left) / width) * 100;
    setComparePosition(Math.min(Math.max(nextPosition, 0), 100));
  };

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
      <div
        ref={compareContainerRef}
        className="absolute inset-0 overflow-hidden bg-white"
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 0 0 ${comparePosition}%)`,
          }}
        >
          <HtmlCssPreviewFrame
            title="개선안 적용 후 랜딩페이지"
            previewCode={projectState.generatedCode}
            baseUrl={projectState.project.url}
            reloadKey={reloadKey}
          />
          <div className="pointer-events-none absolute right-3 top-3 z-10">
            <div className="rounded-md bg-blue-500 flex justify-center w-24 px-4 py-2 text-lg font-semibold leading-7 text-white">
              After
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - comparePosition}% 0 0)`,
          }}
        >
          <HtmlCssPreviewFrame
            title="기존 랜딩페이지"
            previewCode={projectState.sourceCode ?? emptyPreviewCode}
            baseUrl={projectState.project.url}
            reloadKey={reloadKey}
          />
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <div className="rounded-md border border-slate-200 bg-white flex justify-center w-24 px-4 py-2 text-lg font-semibold leading-7 text-slate-800">
              Before
            </div>
          </div>
        </div>

        {isDraggingCompare && (
          <div
            className="absolute inset-0 z-30 cursor-ew-resize"
            onPointerMove={(event) => updateComparePosition(event.clientX)}
            onPointerUp={() => setIsDraggingCompare(false)}
            onPointerCancel={() => setIsDraggingCompare(false)}
          />
        )}
      </div>

      <div
        className="absolute top-0 z-40 flex h-full w-[100px] -translate-x-1/2 flex-col items-center justify-center"
        style={{ left: `${comparePosition}%` }}
      >
        <div className="pointer-events-none min-h-0 flex-1 border-l-2 border-slate-200" />
        <button
          type="button"
          className="flex h-11 w-11 cursor-ew-resize touch-none items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-[0px_4px_16px_4px_rgba(0,0,0,0.1)]"
          aria-label="Before After 비교 핸들"
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDraggingCompare(true);
            updateComparePosition(event.clientX);
          }}
          onPointerMove={(event) => {
            if (!isDraggingCompare) return;
            updateComparePosition(event.clientX);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setIsDraggingCompare(false);
          }}
          onPointerCancel={() => setIsDraggingCompare(false)}
          onLostPointerCapture={() => setIsDraggingCompare(false)}
        >
          <DragHorizontalIcon className="h-6 w-6 text-slate-500" />
        </button>
        <div className="pointer-events-none min-h-0 flex-1 border-l-2 border-slate-200" />
      </div>

      {showCompareTip && (
        <FloatingTooltip
          title="기존 랜딩페이지와 비교해 보세요!"
          description="개선안을 기반으로 생성된 랜딩페이지 적용안을 기존 랜딩페이지와 비교해 보세요"
          onClose={onCloseCompareTip}
        />
      )}

      {showFloatingButton && (
        <FloatingImproveButton
          notificationCount={notificationCount}
          onOpenPanel={onOpenPanel}
        />
      )}
    </div>
  );
};

export default ImprovementView;
