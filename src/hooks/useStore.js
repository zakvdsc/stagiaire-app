import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { INITIAL_WEEKS } from "../data/roadmap";

const ROW_ID = "main";

function getDefaultState() {
  return {
    meta: {
      stageName: "Stage — Intégration AV",
      internName: "",
      tutorName: "",
      startDate: "",
      endDate: "",
    },
    weeks: INITIAL_WEEKS,
    progress: {},
    missionsDone: {},
    notes: {},
    currentWeek: "w1",
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function useStore() {
  const [state, setState] = useState(getDefaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger depuis Supabase au démarrage
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("roadmap")
        .select("data")
        .eq("id", ROW_ID)
        .single();

      if (!error && data?.data && Object.keys(data.data).length > 0) {
        setState((s) => ({ ...s, ...data.data }));
      }
      setLoading(false);
    }
    load();
  }, []);

  // Sauvegarder dans Supabase à chaque changement (debounced)
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      // On exclut currentWeek de la sauvegarde (local seulement)
      const { currentWeek, ...toSave } = state;
      await supabase
        .from("roadmap")
        .upsert({ id: ROW_ID, data: toSave, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [state, loading]);

  const update = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), []);

  const toggleLivrable = (livrableId) =>
    update((s) => ({ progress: { ...s.progress, [livrableId]: !s.progress[livrableId] } }));

  const toggleMission = (missionId) =>
    update((s) => ({ missionsDone: { ...s.missionsDone, [missionId]: !s.missionsDone[missionId] } }));

  const addNote = (weekId, author, role, text) => {
    const note = {
      id: Date.now().toString(),
      author, role, text,
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    };
    update((s) => ({ notes: { ...s.notes, [weekId]: [...(s.notes[weekId] || []), note] } }));
  };

  const deleteNote = (weekId, noteId) =>
    update((s) => ({ notes: { ...s.notes, [weekId]: (s.notes[weekId] || []).filter((n) => n.id !== noteId) } }));

  const updateMeta = (meta) => update((s) => ({ meta: { ...s.meta, ...meta } }));

  const setCurrentWeek = (weekId) => update(() => ({ currentWeek: weekId }));

  const addWeek = () => {
    update((s) => {
      const num = s.weeks.length + 1;
      const id = "w" + uid();
      return {
        weeks: [...s.weeks, { id, num, label: `Semaine ${num}`, missions: [], livrables: [] }],
        currentWeek: id,
      };
    });
  };

  const removeWeek = (weekId) => {
    update((s) => {
      const filtered = s.weeks.filter((w) => w.id !== weekId).map((w, i) => ({ ...w, num: i + 1 }));
      const current = weekId === s.currentWeek ? (filtered[0]?.id || "") : s.currentWeek;
      return { weeks: filtered, currentWeek: current };
    });
  };

  const updateWeekLabel = (weekId, label) =>
    update((s) => ({ weeks: s.weeks.map((w) => w.id === weekId ? { ...w, label } : w) }));

  const addMission = (weekId, text) => {
    if (!text.trim()) return;
    const id = "m" + uid();
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId ? { ...w, missions: [...w.missions, { id, text: text.trim() }] } : w
      ),
    }));
  };

  const removeMission = (weekId, missionId) =>
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId ? { ...w, missions: w.missions.filter((m) => m.id !== missionId) } : w
      ),
    }));

  const updateMission = (weekId, missionId, text) =>
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId
          ? { ...w, missions: w.missions.map((m) => m.id === missionId ? { ...m, text } : m) }
          : w
      ),
    }));

  const addLivrable = (weekId, text) => {
    if (!text.trim()) return;
    const id = "l" + uid();
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId ? { ...w, livrables: [...w.livrables, { id, text: text.trim() }] } : w
      ),
    }));
  };

  const removeLivrable = (weekId, livrableId) =>
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId ? { ...w, livrables: w.livrables.filter((l) => l.id !== livrableId) } : w
      ),
    }));

  const updateLivrable = (weekId, livrableId, text) =>
    update((s) => ({
      weeks: s.weeks.map((w) =>
        w.id === weekId
          ? { ...w, livrables: w.livrables.map((l) => l.id === livrableId ? { ...l, text } : l) }
          : w
      ),
    }));

  const getWeekProgress = (week) => {
    const total = week.livrables.length + week.missions.length;
    if (!total) return 0;
    const done =
      week.livrables.filter((l) => state.progress[l.id]).length +
      week.missions.filter((m) => state.missionsDone[m.id]).length;
    return Math.round((done / total) * 100);
  };

  const getGlobalProgress = () => {
    const allL = state.weeks.flatMap((w) => w.livrables);
    const allM = state.weeks.flatMap((w) => w.missions);
    const total = allL.length + allM.length;
    if (!total) return 0;
    const done =
      allL.filter((l) => state.progress[l.id]).length +
      allM.filter((m) => state.missionsDone[m.id]).length;
    return Math.round((done / total) * 100);
  };

  const resetAll = async () => {
    const fresh = getDefaultState();
    setState(fresh);
    const { currentWeek, ...toSave } = fresh;
    await supabase
      .from("roadmap")
      .upsert({ id: ROW_ID, data: toSave, updated_at: new Date().toISOString() });
  };

  return {
    state, loading, saving,
    toggleLivrable, toggleMission,
    addNote, deleteNote,
    updateMeta, setCurrentWeek,
    addWeek, removeWeek, updateWeekLabel,
    addMission, removeMission, updateMission,
    addLivrable, removeLivrable, updateLivrable,
    getWeekProgress, getGlobalProgress,
    resetAll,
  };
}
