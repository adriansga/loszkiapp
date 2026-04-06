export default function Loading() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-200 rounded w-48 mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-white rounded-xl p-5 border border-zinc-200 h-32" />
        <div className="bg-white rounded-xl p-5 border border-zinc-200 h-32" />
      </div>
      <div className="bg-white rounded-xl p-5 border border-zinc-200 h-40" />
    </div>
  );
}
