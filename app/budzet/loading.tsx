export default function Loading() {
  return (
    <div className="p-6 max-w-3xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-200 rounded w-48 mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 border border-zinc-200 h-28" />
        ))}
      </div>
    </div>
  );
}
