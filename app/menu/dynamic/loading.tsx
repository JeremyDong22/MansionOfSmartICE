// Loading state for dynamic menu page
// Provides smooth transition while page loads

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/50"></div>
        <p className="mt-4 text-white/70 text-sm tracking-wider">加载中...</p>
      </div>
    </div>
  );
}