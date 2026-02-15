export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="h-12 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>

        {/* Result Skeletons */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
