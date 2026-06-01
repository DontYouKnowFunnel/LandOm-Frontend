declare module "rrweb-player" {
  interface RrwebPlayerProps {
    events: unknown[];
    width?: number;
    height?: number;
    autoPlay?: boolean;
    skipInactive?: boolean;
    showController?: boolean;
    speedOption?: number[];
    speed?: number;
    showWarning?: boolean;
    mouseTail?:
      | boolean
      | {
          duration?: number;
          lineCap?: string;
          lineWidth?: number;
          strokeStyle?: string;
        };
  }

  interface RrwebPlayerInstance {
    $destroy(): void;
    addEventListener(event: string, handler: (e: CustomEvent) => void): void;
    play(): void;
    pause(): void;
    goto(timeOffset: number): void;
    playRange(timeOffset: number, endTimeOffset: number): void;
  }

  class RrwebPlayer {
    constructor(options: { target: Element; props: RrwebPlayerProps });
    $destroy(): void;
    addEventListener(event: string, handler: (e: CustomEvent) => void): void;
    play(): void;
    pause(): void;
    goto(timeOffset: number): void;
    playRange(timeOffset: number, endTimeOffset: number): void;
  }

  export default RrwebPlayer;
}
