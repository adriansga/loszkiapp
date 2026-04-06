export default function Loading() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-200 rounded w-48 mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-32 mb-6" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 border border-zinc-200 h-20" />
        ))}
      </div>
    </div>
  );
}
