import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-800/80', className)}
      {...props}
    />
  );
}

// Pre-configured composite skeletons

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-2 rounded border border-slate-800">
          <Skeleton className="h-4 w-1/4 rounded-sm" />
          <Skeleton className="h-4 w-1/4 rounded-sm" />
          <Skeleton className="h-4 w-1/4 rounded-sm" />
          <Skeleton className="h-4 w-1/4 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
