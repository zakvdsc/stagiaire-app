import { useState } from "react";

export function Header({ meta, globalProgress, onUpdateMeta, onReset, adminMode, onToggleAdmin, saving, onMenuOpen }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(meta);

  const save = () => { onUpdateMeta(form); setEditing(false); };

  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (globalProgress / 100) * circ;

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 h-[72px] flex-shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 md:gap-4 h-full">

        {/* Left: hamburger (mobile) + logo + info */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <button
            onClick={onMenuOpen}
            className="md:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition text-gray-500"
            aria-label="Menu semaines"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="2" width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>

          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold font-mono">AV</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-semibold text-gray-900 leading-tight truncate">
                {meta.stageName || "Stage — Intégration AV"}
              </h1>
              {saving && (
                <span className="text-xs text-gray-400 animate-pulse hidden sm:inline">· Sauvegarde…</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 hidden md:block truncate">
              {meta.internName && <span className="mr-2">👤 {meta.internName}</span>}
              {meta.tutorName && <span className="mr-2">🎓 {meta.tutorName}</span>}
              {meta.startDate && meta.endDate && <span>{meta.startDate} → {meta.endDate}</span>}
              {!meta.internName && !meta.tutorName && (
                <button onClick={() => setEditing(true)} className="text-violet-500 hover:text-violet-700 underline underline-offset-2">
                  Configurer le stage
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Right: progress circle + buttons */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="relative flex-shrink-0 w-11 h-11 md:w-16 md:h-16">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <circle cx="32" cy="32" r={radius} fill="none" stroke="#EDE9FE" strokeWidth="5" />
              <circle
                cx="32" cy="32" r={radius} fill="none"
                stroke="#7C3AED" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 32 32)"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] md:text-xs font-semibold text-violet-700">{globalProgress}%</span>
            </div>
          </div>

          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={onToggleAdmin}
              className={`text-xs px-2 md:px-3 py-1.5 rounded-lg border transition ${
                adminMode ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="hidden md:inline">{adminMode ? "✏️ Édition active" : "Modifier structure"}</span>
              <span className="md:hidden text-base leading-none">✏️</span>
            </button>
            <button
              onClick={() => { setForm(meta); setEditing(true); }}
              className="text-xs px-2 md:px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              <span className="hidden md:inline">Infos</span>
              <span className="md:hidden text-base leading-none">ℹ️</span>
            </button>
            <button
              onClick={() => { if (confirm("Remettre à zéro toutes les données ?")) onReset(); }}
              className="hidden md:block text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full sm:max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Informations du stage</h2>
            <div className="flex flex-col gap-3">
              {[
                { key: "stageName", label: "Nom du stage" },
                { key: "internName", label: "Stagiaire" },
                { key: "tutorName", label: "Tuteur" },
                { key: "startDate", label: "Date de début", type: "date" },
                { key: "endDate", label: "Date de fin", type: "date" },
              ].map(({ key, label, type = "text" }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-violet-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
              <button onClick={save} className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
