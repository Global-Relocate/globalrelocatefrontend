const NotificationSkeleton = () => {
  return (
    <div className="w-full bg-[#F8F7F7] p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
          {/* Post preview skeleton */}
          <div className="mt-3 p-4 bg-white rounded-xl border border-[#D4D4D4]">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gray-300 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="w-16 h-3 bg-gray-300 rounded mt-1" />
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton; 