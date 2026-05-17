type SkeletonProps = {
  height?: number;
  width?: number | string;
  className?: string;
  roundedClassName?: string;
};

const Skeleton = ({
  height = 10,
  width,
  className = "",
  roundedClassName = "rounded-md",
}: SkeletonProps) => {
  const resolvedWidth =
    typeof width === "number" ? `${width / 16}rem` : width ?? undefined;

  return (
    <div
      style={{ height: `${height / 16}rem`, width: resolvedWidth }}
      className={`bg-slate-100 animate-pulse ${roundedClassName} ${
        width == null ? "w-full" : ""
      } ${className}`}
    />
  );
};

export default Skeleton;
