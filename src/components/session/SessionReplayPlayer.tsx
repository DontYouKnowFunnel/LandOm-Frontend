import { useEffect, useRef, useState } from "react";
import RrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

interface SessionReplayPlayerProps {
  events: unknown[];
}

const SessionReplayPlayer = ({ events }: SessionReplayPlayerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<RrwebPlayer | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;

      setSize((previous) => {
        const nextWidth = Math.floor(rect.width);
        const nextHeight = Math.floor(rect.height);

        if (
          Math.abs(nextWidth - previous.width) <= 2 &&
          Math.abs(nextHeight - previous.height) <= 2
        ) {
          return previous;
        }

        return { width: nextWidth, height: nextHeight };
      });
    });
    observer.observe(wrapperRef.current);
    const rect = wrapperRef.current.getBoundingClientRect();
    setSize({
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || events.length === 0 || size.width === 0)
      return;

    const controllerHeight = 64;
    const availableHeight =
      size.height > controllerHeight ? size.height - controllerHeight : 0;
    const playerHeight = Math.max(
      240,
      availableHeight || Math.round(size.width * 0.56)
    );

    playerRef.current?.$destroy();
    playerRef.current = null;
    containerRef.current.innerHTML = "";

    playerRef.current = new RrwebPlayer({
      target: containerRef.current,
      props: {
        events,
        width: size.width,
        height: playerHeight,
        autoPlay: false,
        skipInactive: true,
        speedOption: [1, 2, 4],
        speed: 1,
        inactiveColor: "#f1f5f9",
        showWarning: false,

        mouseTail: {
          duration: 280,
          lineCap: "round",
          lineWidth: 4,
          strokeStyle: "#3b82f6",
        },
      },
    });

    return () => {
      playerRef.current?.$destroy();
      playerRef.current = null;
    };
  }, [events, size]);

  if (events.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
        리플레이 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="landom-replay-player min-h-0 w-full flex-1"
    >
      <div
        ref={containerRef}
        className="h-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
      />
    </div>
  );
};

export default SessionReplayPlayer;
