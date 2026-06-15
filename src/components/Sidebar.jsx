export function Sidebar({ weeks, currentWeek, getWeekProgress, onSelect, adminMode, onAddWeek }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-4 mb-3">Semaines</p>
      <nav className="flex flex-col gap-0.5 px-2 flex-1 overflow-y-auto">
        {weeks.map((week) => {
          const pct = getWeekProgress(week);
          const active = week.id === currentWeek;
          return (
            <button
              key={week.id}
              onClick={() => onSelect(week.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition group ${
                active ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-medium ${active ? "text-violet-500" : "text-gray-400"}`}>
                    S{week.num}
                  </span>
                  <span className="text-xs font-medium leading-tight truncate max-w-[90px]">{week.label}</span>
                </div>
                <span className={`text-xs font-semibold ${pct === 100 ? "text-emerald-600" : active ? "text-violet-600" : "text-gray-400"}`}>
                  {pct}%
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-400" : "bg-violet-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>
      {adminMode && (
        <div className="px-2 pt-2 border-t border-gray-100 mt-2">
          <button
            onClick={onAddWeek}
            className="w-full text-xs px-3 py-2 rounded-xl border border-dashed border-violet-300 text-violet-500 hover:bg-violet-50 transition"
          >
            + Ajouter une semaine
          </button>
        </div>
      )}
    </aside>
  );
}
