import { useState, useEffect } from 'react'; // 1. Yahan useEffect add karein
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
import { Login } from './pages/Login';
import { pb } from './lib/pb';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!pb.authStore.isValid) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
function App() {
  const { notes, addNote, updateNote, deleteNote, importNotes } = useNotes()
  const { settings, setSettings, addKeyword, removeKeyword, importSettings } = useSettings()

  const { isDark, setIsDark } = useTheme();

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = getTheme(isDark);

  // 2. Is code block ko yahan paste karein (state variables ke baad aur return se pehle)
  useEffect(() => {
    const handler = () => {
      document
        .querySelectorAll('textarea')
        .forEach(el => el.blur())
    }

    document.addEventListener('visibilitychange', handler)
    window.addEventListener('beforeunload', handler)

    return () => {
      document.removeEventListener('visibilitychange', handler)
      window.removeEventListener('beforeunload', handler)
    }
  }, [])

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
              path="/login"
              element={<Login theme={theme} isDark={isDark} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
