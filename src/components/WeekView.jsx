import { useState } from "react";

const ROLES = [
  { value: "stagiaire", label: "Stagiaire", color: "bg-blue-100 text-blue-700" },
  { value: "tuteur", label: "Tuteur", color: "bg-violet-100 text-violet-700" },
  { value: "patron", label: "Direction", color: "bg-amber-100 text-amber-700" },
];

function getRoleStyle(role) {
  return ROLES.find((r) => r.value === role)?.color || "bg-gray-100 text-gray-600";
}

function InlineAdd({ placeholder, onAdd }) {
  const [val, setVal] = useState("");
  const submit = () => { if (val.trim()) { onAdd(val); setVal(""); } };
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-400 bg-transparent"
      />
      <button
        onClick={submit}
        className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
      >
        +
      </button>
    </div>
  );
}

function EditableText({ value, onChange, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const save = () => { onChange(val); setEditing(false); };
  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className={`border-b border-violet-400 bg-transparent focus:outline-none ${className}`}
      />
    );
  }
  return (
    <span
      onClick={() => { setVal(value); setEditing(true); }}
      className={`cursor-text hover:text-violet-600 transition ${className}`}
      title="Cliquer pour modifier"
    >
      {value}
    </span>
  );
}

export function WeekView({
  week, progress, missionsDone, notes, adminMode,
  onToggleLivrable, onToggleMission, onAddNote, onDeleteNote,
  onUpdateWeekLabel, onAddMission, onRemoveMission, onUpdateMission,
  onAddLivrable, onRemoveLivrable, onUpdateLivrable, onRemoveWeek,
}) {
  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteRole, setNoteRole] = useState("stagiaire");
  const [noteError, setNoteError] = useState("");

  const weekNotes = notes[week.id] || [];
  const missionsTotal = week.missions.length;
  const missionsDoneCount = week.missions.filter((m) => missionsDone[m.id]).length;
  const livrTotal = week.livrables.length;
  const livrDone = week.livrables.filter((l) => progress[l.id]).length;

  const submitNote = () => {
    if (!noteText.trim()) { setNoteError("Écris quelque chose avant d'envoyer."); return; }
    if (!noteAuthor.trim()) { setNoteError("Indique ton prénom."); return; }
    onAddNote(week.id, noteAuthor.trim(), noteRole, noteText.trim());
    setNoteText(""); setNoteError("");
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
      {/* En-tête semaine */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-md">
              Semaine {week.num}
            </span>
            {livrDone === livrTotal && livrTotal > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Terminée</span>
            )}
            {adminMode && (
              <span className="text-xs text-violet-500 bg-violet-50 px-2 py-0.5 rounded-md">✏️ Mode édition</span>
            )}
          </div>
          {adminMode ? (
            <EditableText
              value={week.label}
              onChange={(v) => onUpdateWeekLabel(week.id, v)}
              className="text-2xl font-semibold text-gray-900"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-900">{week.label}</h2>
          )}
        </div>
        {adminMode && (
          <button
            onClick={() => { if (confirm(`Supprimer la semaine "${week.label}" ?`)) onRemoveWeek(week.id); }}
            className="flex-shrink-0 text-xs px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-50 transition"
          >
            Supprimer la semaine
          </button>
        )}
      </div>

      {/* Missions */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Missions</h3>
          <span className="text-xs text-gray-400">{missionsDoneCount}/{missionsTotal}</span>
        </div>
        <div className="flex flex-col gap-2">
          {week.missions.map((mission) => {
            const done = !!missionsDone[mission.id];
            return (
              <div
                key={mission.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                  done ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-violet-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => onToggleMission(mission.id)}
                  className="mt-0.5 accent-violet-600 w-4 h-4 flex-shrink-0 cursor-pointer"
                  disabled={adminMode}
                />
                {adminMode ? (
                  <EditableText
                    value={mission.text}
                    onChange={(v) => onUpdateMission(week.id, mission.id, v)}
                    className={`text-sm leading-snug flex-1 ${done ? "text-gray-400 line-through" : "text-gray-700"}`}
                  />
                ) : (
                  <span className={`text-sm leading-snug flex-1 ${done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {mission.text}
                  </span>
                )}
                {adminMode && (
                  <button onClick={() => onRemoveMission(week.id, mission.id)} className="text-gray-300 hover:text-red-400 transition text-sm flex-shrink-0">✕</button>
                )}
              </div>
            );
          })}
        </div>
        {adminMode && (
          <InlineAdd placeholder="Nouvelle mission..." onAdd={(t) => onAddMission(week.id, t)} />
        )}
        {week.missions.length === 0 && !adminMode && (
          <p className="text-sm text-gray-400 text-center py-3">Aucune mission définie.</p>
        )}
      </section>

      {/* Livrables */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Livrables attendus</h3>
          <span className="text-xs text-gray-400">{livrDone}/{livrTotal}</span>
        </div>
        <div className="flex flex-col gap-2">
          {week.livrables.map((livrable) => {
            const done = !!progress[livrable.id];
            return (
              <div
                key={livrable.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                  done ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-200 hover:border-emerald-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => onToggleLivrable(livrable.id)}
                  className="mt-0.5 accent-emerald-600 w-4 h-4 flex-shrink-0 cursor-pointer"
                  disabled={adminMode}
                />
                {adminMode ? (
                  <EditableText
                    value={livrable.text}
                    onChange={(v) => onUpdateLivrable(week.id, livrable.id, v)}
                    className={`text-sm font-medium leading-snug flex-1 ${done ? "text-emerald-600" : "text-gray-700"}`}
                  />
                ) : (
                  <span className={`text-sm font-medium leading-snug flex-1 ${done ? "text-emerald-600" : "text-gray-700"}`}>
                    {livrable.text}
                  </span>
                )}
                {done && !adminMode && <span className="ml-auto text-xs text-emerald-500 flex-shrink-0">✓ Rendu</span>}
                {adminMode && (
                  <button onClick={() => onRemoveLivrable(week.id, livrable.id)} className="text-gray-300 hover:text-red-400 transition text-sm flex-shrink-0">✕</button>
                )}
              </div>
            );
          })}
        </div>
        {adminMode && (
          <InlineAdd placeholder="Nouveau livrable..." onAdd={(t) => onAddLivrable(week.id, t)} />
        )}
        {week.livrables.length === 0 && !adminMode && (
          <p className="text-sm text-gray-400 text-center py-3">Aucun livrable défini.</p>
        )}
      </section>

      {/* Journal de bord — masqué en mode admin */}
      {!adminMode && (
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Journal de bord</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ton prénom"
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              />
              <select
                value={noteRole}
                onChange={(e) => setNoteRole(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 bg-white"
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Ajoute une note, un commentaire, un point de vigilance…"
              value={noteText}
              onChange={(e) => { setNoteText(e.target.value); setNoteError(""); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none"
            />
            {noteError && <p className="text-xs text-red-500 mt-1">{noteError}</p>}
            <div className="flex justify-end mt-2">
              <button onClick={submitNote} className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
                Ajouter
              </button>
            </div>
          </div>
          {weekNotes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucune note pour cette semaine.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {weekNotes.map((note) => (
                <div key={note.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{note.author}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleStyle(note.role)}`}>
                        {ROLES.find((r) => r.value === note.role)?.label || note.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{note.date}</span>
                      <button onClick={() => onDeleteNote(week.id, note.id)} className="text-gray-300 hover:text-red-400 transition text-xs">✕</button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
