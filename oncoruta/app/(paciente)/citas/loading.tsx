export default function CitasLoading() {
  return (
    <div className="animate-pulse">
      <div className="px-8 pt-7 pb-2">
        <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 w-56 bg-gray-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="p-6 space-y-4">
        <div className="h-10 w-36 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
