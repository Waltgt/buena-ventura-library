type SkeletonProps = {
  width?: string;
  height?: string;
  className?: string;
};

export default function Skeleton({
  width = "w-full",
  height = "h-4",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`${width} ${height} ${className} bg-slate-200 animate-pulse rounded`}
    />
  );
}