import { useState } from "react";

export function Header({ meta, globalProgress, onUpdateMeta, onReset, adminMode, onToggleAdmin, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(meta);

  const save = () => { onUpdateMeta(form); setEditing(false); };

  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (globalProgress / 100) * circ;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold font-mono">AV</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-900 leading-tight">
                {meta.stageName || "Stage — Intégration AV"}
              </h1>
              {saving && (
                <span className="text-xs text-gray-400 animate-pulse">· Sauvegarde…</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
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

        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64">
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
              <span className="text-xs font-semibold text-violet-700">{globalProgress}%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggleAdmin}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                adminMode ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {adminMode ? "✏️ Édition active" : "Modifier structure"}
            </button>
            <button
              onClick={() => { setForm(meta); setEditing(true); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Infos
            </button>
            <button
              onClick={() => { if (confirm("Remettre à zéro toutes les données ?")) onReset(); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
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
