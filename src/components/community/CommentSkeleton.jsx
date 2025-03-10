import { Skeleton } from "@/components/ui/skeleton";

export const CommentSkeleton = ({ level = 0 }) => {
  return (
    <div className={`relative ${level > 0 ? 'ml-10' : ''} mb-4`}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommentThreadSkeleton = () => {
  return (
    <div className="w-full px-6 pb-4">
      <div className="pt-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}; 