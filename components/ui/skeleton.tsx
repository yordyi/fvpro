import { cn } from "@/lib/utils/cn"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'circle'
}

function Skeleton({
  className,
  variant = 'default',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        {
          'h-20 w-full': variant === 'default',
          'h-32 w-full rounded-lg': variant === 'card',
          'h-4 w-full rounded': variant === 'text',
          'h-12 w-12 rounded-full': variant === 'circle',
        },
        className
      )}
      {...props}
    />
  )
}

// 检测卡片骨架屏
export function DetectorCardSkeleton() {
  return (
    <div className="privacy-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-5 w-32" />
            <Skeleton variant="text" className="h-3 w-48" />
          </div>
        </div>
        <Skeleton variant="circle" className="h-6 w-6" />
      </div>
      
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-3/4" />
      </div>
      
      <div className="flex items-center gap-2">
        <Skeleton variant="text" className="h-8 w-24 rounded-md" />
        <Skeleton variant="text" className="h-8 w-32 rounded-md" />
      </div>
    </div>
  )
}

// 进度骨架屏
export function ProgressSkeleton() {
  return (
    <div className="privacy-card p-8 space-y-4">
      <div className="text-center space-y-2">
        <Skeleton variant="text" className="h-6 w-48 mx-auto" />
        <Skeleton variant="text" className="h-4 w-64 mx-auto" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-3 w-24" />
          <Skeleton variant="text" className="h-3 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
}

// 结果页面骨架屏
export function ResultsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 标题骨架 */}
        <div className="text-center mb-8 space-y-4">
          <Skeleton variant="text" className="h-10 w-64 mx-auto" />
          <Skeleton variant="text" className="h-5 w-96 mx-auto" />
        </div>
        
        {/* 统计卡片骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" className="h-24" />
          ))}
        </div>
        
        {/* 检测结果卡片骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DetectorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton }