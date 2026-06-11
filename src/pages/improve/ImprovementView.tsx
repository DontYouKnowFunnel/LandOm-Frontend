import { useEffect, useRef, useState } from "react";
import {
  CheckLineIcon,
  CopyIcon,
  DragHorizontalIcon,
  FileOutlineIcon,
} from "../../components/Icons";
import FloatingImproveButton from "./components/FloatingImproveButton";
import FloatingTooltip from "./components/FloatingTooltip";
import HtmlCssPreviewFrame from "./components/HtmlCssPreviewFrame";
import type { LandingPreviewCode, LandingProjectState } from "./types";

const emptyPreviewCode = {
  html: "",
  css: "",
};

const formatPreviewCodeForCopy = (previewCode: LandingPreviewCode) => {
  const html = previewCode.html.trim();
  const css = previewCode.css.trim();

  return `<!-- HTML -->
${html}

<!-- CSS -->
<style>
${css}
</style>`;
};

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
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
  const copyResetTimerRef = useRef<number | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDraggingCompare, setIsDraggingCompare] = useState(false);
  const [isCopyComplete, setIsCopyComplete] = useState(false);
  const hasGeneratedCode =
    projectState.generatedCode.html.trim().length > 0 ||
    projectState.generatedCode.css.trim().length > 0;

  const updateComparePosition = (clientX: number) => {
    const container = compareContainerRef.current;
    if (!container) return;

    const { left, width } = container.getBoundingClientRect();
    const nextPosition = ((clientX - left) / width) * 100;
    setComparePosition(Math.min(Math.max(nextPosition, 0), 100));
  };

  const handleCopyGeneratedCode = async () => {
    if (!hasGeneratedCode) return;

    try {
      await copyTextToClipboard(
        formatPreviewCodeForCopy(projectState.generatedCode)
      );
      setIsCopyComplete(true);

      if (copyResetTimerRef.current) {
        window.clearTimeout(copyResetTimerRef.current);
      }

      copyResetTimerRef.current = window.setTimeout(() => {
        setIsCopyComplete(false);
        copyResetTimerRef.current = null;
      }, 1600);
    } catch (error) {
      console.error("Failed to copy generated landing page code.", error);
    }
  };

  useEffect(
    () => () => {
      if (copyResetTimerRef.current) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    },
    []
  );

  if (!hasGeneratedCode) {
    return (
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-50 px-6 py-10">
        <div className="flex w-full max-w-[420px] flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <FileOutlineIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-semibold leading-7 text-slate-900">
            보여줄 개선안이 없습니다
          </h2>
          <p className="mt-2 text-sm font-medium leading-5 text-slate-500">
            생성된 개선안 적용 코드가 없어 미리보기를 표시할 수 없습니다.
            개선안을 생성하거나 적용 코드를 만든 뒤 다시 확인해주세요.
          </p>
        </div>

        {showFloatingButton && (
          <FloatingImproveButton
            notificationCount={notificationCount}
            onOpenPanel={onOpenPanel}
          />
        )}
      </div>
    );
  }

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

      <button
        type="button"
        onClick={handleCopyGeneratedCode}
        disabled={!hasGeneratedCode}
        className="absolute bottom-8 left-1/2 z-50 flex h-10 w-[159px] -translate-x-1/2 items-center justify-center gap-2.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-base font-semibold leading-6 text-slate-800 shadow-[0px_4px_16px_rgba(0,0,0,0.25)] transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={
          isCopyComplete ? "개선안 코드 복사 완료" : "개선안 코드 복사"
        }
        aria-live="polite"
      >
        {isCopyComplete ? (
          <CheckLineIcon className="h-4 w-4 text-green-500" />
        ) : (
          <CopyIcon className="h-4 w-4 text-slate-800" />
        )}
        <span className="whitespace-nowrap">
          {isCopyComplete ? "복사 완료" : "개선안 코드 복사"}
        </span>
      </button>

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
