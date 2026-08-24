import React from "react";
import { FiLoader, FiRefreshCw } from "react-icons/fi";
import { useLoading } from "../../context/LoadingContext";

/**
 * Base Skeleton Placeholder
 */
export const Skeleton = ({
  className = "",
  variant = "rounded",
  width,
  height,
  style = {},
}) => {
  const variantClasses = {
    text: "rounded-md h-4",
    circle: "rounded-full",
    rounded: "rounded-xl",
    card: "rounded-2xl",
  };

  const customStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`skeleton-shimmer ${variantClasses[variant] || "rounded-xl"} ${className}`}
      style={customStyle}
    />
  );
};

/**
 * Page Header Skeleton
 */
export const PageHeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div className="space-y-2">
      <Skeleton className="w-48 sm:w-64 h-7" />
      <Skeleton className="w-64 sm:w-80 h-4" />
    </div>
    <Skeleton className="w-32 h-10 rounded-xl" />
  </div>
);

/**
 * Stats Cards Grid Skeleton
 */
export const StatsGridSkeleton = ({ count = 3, cols = 3 }) => {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-3 mb-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs"
        >
          <div className="space-y-2 flex-1 mr-3">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-24 h-3.5" />
          </div>
          <Skeleton className="w-11 h-11" variant="circle" />
        </div>
      ))}
    </div>
  );
};

/**
 * Table Skeleton
 */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
    {/* Table Control Bar */}
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <Skeleton className="w-full sm:w-72 h-9 rounded-lg" />
      <Skeleton className="w-32 h-9 rounded-lg" />
    </div>

    {/* Table Header */}
    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-3.5 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="w-8 h-8 shrink-0" variant="circle" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="w-3/4 h-3.5" />
              <Skeleton className="w-1/2 h-2.5" />
            </div>
          </div>
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Card Grid Skeleton (for Projects, Tasks, Teams, Evaluations, Resources)
 */
export const CardGridSkeleton = ({ count = 6, cols = 3 }) => {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-5 rounded-md" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-2/3 h-3.5" />
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Complete Page Skeleton
 */
export const PageSkeleton = ({
  hasHeader = true,
  hasStats = true,
  statCount = 3,
  viewType = "table", // 'table' | 'cards'
  rowCount = 6,
  cardCount = 6,
}) => (
  <div className="p-4 sm:p-5 space-y-5 animate-fade-in">
    {hasHeader && <PageHeaderSkeleton />}
    {hasStats && <StatsGridSkeleton count={statCount} cols={statCount} />}
    {viewType === "table" ? (
      <TableSkeleton rows={rowCount} />
    ) : (
      <CardGridSkeleton count={cardCount} />
    )}
  </div>
);

/**
 * Global Action Loading Floating Widget
 */
export const ActionLoadingWidget = () => {
  const { isLoading, actionMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/90 hover:bg-gray-900 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700/50 text-xs font-medium transition-all">
        <FiRefreshCw className="animate-spin text-blue-400" size={15} />
        <span>{actionMessage || "Refreshing components..."}</span>
      </div>
    </div>
  );
};

export default Skeleton;
