import { useState } from "react";
import { useStore } from "./hooks/useStore";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { WeekView } from "./components/WeekView";

export default function App() {
  const [adminMode, setAdminMode] = useState(false);
  const store = useStore();
  const { state, getWeekProgress, getGlobalProgress } = store;
  const currentWeek = state.weeks.find((w) => w.id === state.currentWeek) || state.weeks[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3]">
      <Header
        meta={state.meta}
        globalProgress={getGlobalProgress()}
        onUpdateMeta={store.updateMeta}
        onReset={store.resetAll}
        adminMode={adminMode}
        onToggleAdmin={() => setAdminMode((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        <Sidebar
          weeks={state.weeks}
          currentWeek={state.currentWeek}
          getWeekProgress={getWeekProgress}
          onSelect={store.setCurrentWeek}
          adminMode={adminMode}
          onAddWeek={store.addWeek}
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
