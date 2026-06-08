type SkeletonProps = {
  width?: string;
  height?: string;
};

export default function Skeleton({
  width = "w-full",
  height = "h-4",
}: SkeletonProps) {
  return (
    <div
      className={`${width} ${height} bg-slate-200 animate-pulse rounded`}
    />
  );
}