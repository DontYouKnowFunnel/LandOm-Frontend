const MAX_BAR_HEIGHT = 120;

interface AnalysisBarProps {
  ratio: number;
  animated: boolean;
  index: number;
}

const AnalysisBar = ({ ratio, animated, index }: AnalysisBarProps) => (
  <div className="flex flex-col items-center flex-1">
    <div
      className="w-full flex items-end justify-center"
      style={{ height: `${MAX_BAR_HEIGHT}px` }}
    >
      <div
        className="w-full rounded-lg bg-blue-200"
        style={{
          height: animated ? `${Math.round(ratio * MAX_BAR_HEIGHT)}px` : "0px",
          transition: `height 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
        }}
      />
    </div>
  </div>
);

export default AnalysisBar;
