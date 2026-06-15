import { useState } from "react";
import { useStore } from "./hooks/useStore";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { WeekView } from "./components/WeekView";

export default function App() {
  const [adminMode, setAdminMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const store = useStore();
  const { state, loading, saving, getWeekProgress, getGlobalProgress } = store;
  const currentWeek = state.weeks.find((w) => w.id === state.currentWeek) || state.weeks[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm font-semibold font-mono">AV</span>
          </div>
          <p className="text-sm text-gray-400">Chargement du suivi de stage…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3]">
      <Header
        meta={state.meta}
        globalProgress={getGlobalProgress()}
        onUpdateMeta={store.updateMeta}
        onReset={store.resetAll}
        adminMode={adminMode}
        onToggleAdmin={() => setAdminMode((v) => !v)}
        saving={saving}
        onMenuOpen={() => setSidebarOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        {sidebarOpen && (
          <div
            className="fixed top-[72px] inset-x-0 bottom-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          weeks={state.weeks}
          currentWeek={state.currentWeek}
          getWeekProgress={getWeekProgress}
          onSelect={(id) => { store.setCurrentWeek(id); setSidebarOpen(false); }}
          adminMode={adminMode}
          onAddWeek={store.addWeek}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          {currentWeek ? (
            <WeekView
              week={currentWeek}
              progress={state.progress}
              missionsDone={state.missionsDone}
              notes={state.notes}
              adminMode={adminMode}
              onToggleLivrable={store.toggleLivrable}
              onToggleMission={store.toggleMission}
              onAddNote={store.addNote}
              onDeleteNote={store.deleteNote}
              onUpdateWeekLabel={store.updateWeekLabel}
              onAddMission={store.addMission}
              onRemoveMission={store.removeMission}
              onUpdateMission={store.updateMission}
              onAddLivrable={store.addLivrable}
              onRemoveLivrable={store.removeLivrable}
              onUpdateLivrable={store.updateLivrable}
              onRemoveWeek={store.removeWeek}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Aucune semaine. Ajoutes-en une en mode édition.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
