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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && Math.abs(w - width) > 2) setWidth(Math.floor(w));
    });
    observer.observe(wrapperRef.current);
    setWidth(Math.floor(wrapperRef.current.getBoundingClientRect().width));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || events.length === 0 || width === 0) return;

    playerRef.current?.$destroy();
    playerRef.current = null;
    containerRef.current.innerHTML = "";

    playerRef.current = new RrwebPlayer({
      target: containerRef.current,
      props: {
        events,
        width,
        height: Math.round(width * 0.625),
        autoPlay: false,
        skipInactive: true,
        showWarning: false,
        mouseTail: true,
      },
    });

    return () => {
      playerRef.current?.$destroy();
      playerRef.current = null;
    };
  }, [events, width]);

  if (events.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
        리플레이 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full">
      <div ref={containerRef} className="rounded-lg overflow-hidden" />
    </div>
  );
};

export default SessionReplayPlayer;
