import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FunnelOverlayItem } from "../types";

const SDK_READY_TIMEOUT_MS = 3500;
const SDK_WARNING_VISIBLE_MS = 10000;

type OverlayMessage =
  | "LANDOM_OVERLAY_READY"
  | "OVERLAY_READY"
  | {
      type?: "LANDOM_OVERLAY_READY" | "OVERLAY_READY";
      event?: "LANDOM_OVERLAY_READY" | "OVERLAY_READY";
    }
  | {
      type: "LANDOM_OVERLAY_RESULT";
      matched?: unknown[];
      missing?: unknown[];
      invalid?: unknown[];
    };

const getTargetOrigin = (pageUrl: string) => {
  try {
    return new URL(pageUrl).origin;
  } catch {
    return "*";
  }
};

const getOverlayMessageType = (message: unknown) => {
  if (typeof message === "string") return message;
  if (!message || typeof message !== "object") return undefined;

  const candidate = message as { type?: unknown; event?: unknown };
  if (typeof candidate.type === "string") return candidate.type;
  if (typeof candidate.event === "string") return candidate.event;

  return undefined;
};

const SdkWarningToast = ({ visible }: { visible: boolean }) => (
  <div
    className={`pointer-events-none absolute right-4 top-4 z-50 w-[min(360px,calc(100%-32px))] transition-all duration-300 ease-out ${
      visible
        ? "translate-y-0 opacity-100"
        : "-translate-y-3 opacity-0"
    }`}
    aria-live="polite"
  >
    <div className="rounded-md bg-amber-500 px-4 py-3 text-white shadow-[0px_10px_28px_rgba(15,23,42,0.22)]">
      <p className="text-sm font-bold leading-5">SDK가 설정되지 않았습니다!</p>
      <p className="mt-0.5 text-xs font-medium leading-4 text-amber-50">
        랜딩페이지에서 overlay ready 신호를 받지 못했습니다.
      </p>
    </div>
  </div>
);

const ActualWebpageFrameContent = ({
  title,
  pageUrl,
  reloadKey,
  overlayItems,
  showSdkWarning = true,
}: {
  title: string;
  pageUrl: string;
  reloadKey: number;
  overlayItems: FunnelOverlayItem[];
  showSdkWarning?: boolean;
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const overlayItemsRef = useRef(overlayItems);
  const targetOriginRef = useRef("*");
  const isSdkReadyRef = useRef(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const targetOrigin = useMemo(() => getTargetOrigin(pageUrl), [pageUrl]);

  const postOverlayItems = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "LANDOM_OVERLAY_SET",
        items: overlayItemsRef.current,
      },
      targetOriginRef.current
    );
  }, []);

  useEffect(() => {
    overlayItemsRef.current = overlayItems;
  }, [overlayItems]);

  useEffect(() => {
    targetOriginRef.current = targetOrigin;
  }, [targetOrigin]);

  useEffect(() => {
    isSdkReadyRef.current = isSdkReady;
  }, [isSdkReady]);

  useEffect(() => {
    if (!showSdkWarning || isSdkReady) return;

    const timer = window.setTimeout(() => {
      if (isSdkReadyRef.current) return;
      setShowWarning(true);
    }, SDK_READY_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isSdkReady, showSdkWarning]);

  useEffect(() => {
    if (!showWarning) return;

    const timer = window.setTimeout(() => {
      setShowWarning(false);
    }, SDK_WARNING_VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [showWarning]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OverlayMessage>) => {
      const frameWindow = iframeRef.current?.contentWindow;
      const isFrameMessage =
        event.source === frameWindow ||
        (targetOriginRef.current !== "*" &&
          event.origin === targetOriginRef.current);
      if (!isFrameMessage) return;

      const messageType = getOverlayMessageType(event.data);

      if (
        messageType === "LANDOM_OVERLAY_READY" ||
        messageType === "OVERLAY_READY"
      ) {
        if (event.origin) {
          targetOriginRef.current = event.origin;
        }
        isSdkReadyRef.current = true;
        setIsSdkReady(true);
        setShowWarning(false);
        postOverlayItems();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [postOverlayItems]);

  useEffect(() => {
    if (!isSdkReady) return;

    postOverlayItems();
  }, [isSdkReady, overlayItems, postOverlayItems, targetOrigin]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <iframe
        key={`${pageUrl}-${reloadKey}`}
        ref={iframeRef}
        title={title}
        src={pageUrl}
        className="h-full w-full border-0 bg-white"
      />
      {showSdkWarning && <SdkWarningToast visible={showWarning} />}
    </div>
  );
};

const ActualWebpageFrame = (props: {
  title: string;
  pageUrl: string;
  reloadKey: number;
  overlayItems: FunnelOverlayItem[];
  showSdkWarning?: boolean;
}) => (
  <ActualWebpageFrameContent
    key={`${props.pageUrl}-${props.reloadKey}`}
    {...props}
  />
);

export default ActualWebpageFrame;
