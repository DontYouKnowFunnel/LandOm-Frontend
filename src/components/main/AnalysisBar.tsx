const MAX_BAR_HEIGHT = 136;

interface AnalysisBarProps {
  ratio: number;
  animated: boolean;
  index: number;
}

const AnalysisBar = ({ ratio, animated, index }: AnalysisBarProps) => (
  <div
    className="min-w-0 flex-1 self-end rounded-[8px] bg-blue-200"
    style={{
      height: animated ? `${Math.round(ratio * MAX_BAR_HEIGHT)}px` : "0px",
      transition: `height 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
    }}
  />
);

export default AnalysisBar;
