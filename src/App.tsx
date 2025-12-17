import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { useNotes } from './hooks/useNotes';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { getTheme } from './utils/theme';
import { exportNotesAsJSON } from './utils/exportNotes'
import { exportSettingsAsJSON } from './utils/exportSettings'

function App() {
  const { notes, addNote, updateNote, deleteNote, importNotes } = useNotes()
  const { settings, setSettings, addKeyword, removeKeyword, importSettings } = useSettings()

  const { isDark, setIsDark } = useTheme();

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = getTheme(isDark);

  return (
    <BrowserRouter>
      <div className={`h-screen w-full ${theme.bg} flex justify-center font-sans ${theme.text} overflow-hidden`}>
        <div className={`w-full max-w-[430px] h-full flex flex-col relative ${theme.bg} shadow-2xl overflow-hidden`}>

          <Header
            isSearchMode={isSearchMode}
            setIsSearchMode={setIsSearchMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDark={isDark}
            setIsDark={setIsDark}
            notesCount={notes.length}
            theme={theme}
          />

          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  notes={notes}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                  onAdd={addNote}
                  theme={theme}
                  isDark={isDark}
                  settings={settings}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  settings={settings}
                  setSettings={setSettings}
                  addKeyword={addKeyword}
                  removeKeyword={removeKeyword}
                  onExport={exportNotesAsJSON}
                  onImport={importNotes}
                  onExportSettings={exportSettingsAsJSON}
                  onImportSettings={importSettings}
                  theme={theme}
                  isDark={isDark}
                />
              }
            />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
