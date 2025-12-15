import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, X, Trash2, Check, Moon, Sun } from 'lucide-react';

// --- Types ---
interface Note {
  id: string;
  content: string;
  category: 'note' | 'todo' | 'idea' | 'listen' | 'read';
  createdAt: number;
  updatedAt?: number;
}

// --- Helpers ---
const detectCategory = (text: string): Note['category'] => {
  const lower = text.toLowerCase();
  if (lower.startsWith('todo:') || lower.startsWith('- [ ]')) return 'todo';
  if (lower.startsWith('idea:')) return 'idea';
  if (lower.startsWith('listen:')) return 'listen';
  if (lower.startsWith('read:')) return 'read';
  return 'note';
};

const formatTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('stash-notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', content: 'todo: call insurance about claim\n- Ask about dental coverage\n- Confirm deductible', category: 'todo', createdAt: Date.now() },
      { id: '2', content: 'listen: Podcast Freakonomics ep latest', category: 'listen', createdAt: Date.now() - 3600000 },
    ];
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('stash-theme');
    return saved === 'dark';
  });

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    localStorage.setItem('stash-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('stash-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (expandedNoteId && editRefs.current[expandedNoteId]) {
      const el = editRefs.current[expandedNoteId];
      if (el) {
        el.focus();
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [expandedNoteId]);

  const addNote = () => {
    if (!input.trim()) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: input,
      category: detectCategory(input),
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setInput('');
    setIsModalOpen(false);
  };

  const updateNoteContent = (id: string, newContent: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? {
        ...n,
        content: newContent,
        category: detectCategory(newContent),
        updatedAt: Date.now()
      } : n
    ));

    const el = editRefs.current[id];
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setExpandedNoteId(null);
  };

  const saveNote = () => {
    setExpandedNoteId(null);
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    return notes.filter(n => n.content.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [notes, searchQuery]);

  // Theme colors
  const theme = {
    bg: isDark ? 'bg-[#1a1816]' : 'bg-[#fbf9f6]',
    bgSecondary: isDark ? 'bg-[#252220]' : 'bg-[#f3eee8]',
    text: isDark ? 'text-[#e8e2d9]' : 'text-[#2d2a26]',
    textMuted: isDark ? 'text-[#8c8883]' : 'text-[#8c8883]',
    border: isDark ? 'border-[#3a3632]' : 'border-[#e8e2d9]',
    divider: isDark ? 'bg-[#3a3632]' : 'bg-[#e8e2d9]',
    accent: isDark ? 'bg-[#e8e2d9]' : 'bg-[#2d2a26]',
    accentText: isDark ? 'text-[#1a1816]' : 'text-[#fbf9f6]',
    gradientFrom: isDark ? 'from-[#1a1816]' : 'from-[#fbf9f6]',
    overlay: isDark ? 'bg-[#000000]/40' : 'bg-[#2d2a26]/20',
  };

  // --- Render Preview ---
  const renderPreview = (note: Note) => {
    const lines = note.content.split('\n');
    const firstLine = lines[0];
    const hasMore = lines.length > 1 || firstLine.length > 50;

    const parts = firstLine.split(/^(todo:|idea:|listen:|read:)/i);
    let contentNode;

    if (parts.length > 1) {
      const tag = parts[1].toLowerCase().replace(':', '');
      let tagColor = theme.textMuted;
      if (tag === 'todo') tagColor = isDark ? 'text-[#E89B6A]' : 'text-[#C27A45]';
      if (tag === 'idea') tagColor = isDark ? 'text-[#7FA87F]' : 'text-[#5A7D5A]';
      if (tag === 'listen') tagColor = isDark ? 'text-[#B39A85]' : 'text-[#8C7A6B]';
      if (tag === 'read') tagColor = isDark ? 'text-[#8E8EBD]' : 'text-[#6B6B99]';

      contentNode = (
        <div className={`truncate pr-4 text-[16px]`}>
          <span className={`${tagColor} font-bold mr-1`}>{parts[1]}</span>
          <span className={theme.text}>{parts[2]}</span>
        </div>
      );
    } else {
      contentNode = <div className={`truncate pr-4 ${theme.text} text-[16px]`}>{firstLine}</div>;
    }

    return (
      <div className="relative">
        {contentNode}
        {hasMore && (
          <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${theme.gradientFrom} to-transparent pointer-events-none`} />
        )}
      </div>
    );
  };

  return (
    <div className={`h-screen w-full ${theme.bg} flex justify-center font-sans ${theme.text} overflow-hidden`}>
      <div className={`w-full max-w-[430px] h-full flex flex-col relative ${theme.bg} shadow-2xl`}>

        {/* --- Header --- */}
        <div className={`flex-none pt-14 pb-4 px-6 flex flex-col items-center z-20 ${theme.bg}/95 backdrop-blur-sm ${theme.border} border-b`}>
          {!isSearchMode ? (
            <>
              <h1 className={`font-serif text-4xl ${theme.text} tracking-tight mb-1`}>Stash</h1>
              <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider opacity-80`}>
                {notes.length} notes captured
              </p>
              <>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`absolute left-6 top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                  title="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsSearchMode(true)}
                  className={`absolute right-6 top-16 ${theme.textMuted} hover:${theme.text} transition-colors`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </>
            </>
          ) : (
            <div className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3 top-3 ${theme.textMuted}`} />
                <input
                  autoFocus
                  placeholder="Search..."
                  className={`w-full ${theme.bgSecondary} rounded-xl py-2.5 pl-9 pr-4 ${theme.text} text-sm outline-none`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => { setIsSearchMode(false); setSearchQuery(''); }}
                className={`${theme.text} text-sm font-medium`}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* --- Scrollable Notes List --- */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 scrollbar-hide">
          {filteredNotes.map((note) => {
            const isExpanded = expandedNoteId === note.id;

            return (
              <div
                key={note.id}
                className={`
                  group relative transition-all duration-300 ease-in-out mb-8
                  ${isExpanded ? '' : 'cursor-pointer'}
                `}
                onClick={() => !isExpanded && setExpandedNoteId(note.id)}
              >
                {/* INLINE EDIT MODE */}
                {/* INLINE EDIT MODE */}
                {isExpanded ? (
                  <div className="flex gap-3 w-full items-start">
                    {/* Left side - Textarea */}
                    <div className="flex-1 min-w-0">
                      <textarea
                        ref={(el) => (editRefs.current[note.id] = el)}
                        value={note.content}
                        onChange={(e) => updateNoteContent(note.id, e.target.value)}
                        onBlur={() => setExpandedNoteId(null)}
                        className={`w-full bg-transparent text-[16px] leading-[1.75rem] ${theme.text} 
                     outline-none resize-none overflow-hidden font-normal p-0 m-0 block`}
                        spellCheck={false}
                      />
                    </div>

                    {/* Right side - Action Buttons at top */}
                    <div className="flex gap-2 flex-none">
                      <button
                        onMouseDown={(e) => { e.preventDefault(); saveNote(); }}
                        className={`p-2 ${isDark ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'} rounded-full transition-colors`}
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onMouseDown={(e) => { e.preventDefault(); deleteNote(note.id); }}
                        className={`p-2 ${isDark ? 'text-red-400 hover:bg-red-500/20' : 'text-red-400 hover:bg-red-50'} rounded-full transition-colors`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* PREVIEW MODE */
                  <div>
                    {renderPreview(note)}
                  </div>
                )}

                {/* Metadata & Divider Line */}
                <div className="mt-2 relative">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] ${theme.textMuted} font-medium tracking-wide`}>
                      {note.updatedAt ? `Edited ${formatTime(note.updatedAt)}` : formatTime(note.createdAt)}
                    </span>
                  </div>

                  <div className={`mt-3 h-[1px] ${theme.divider} w-full`} />
                </div>

              </div>
            );
          })}
        </div>

        {/* --- FAB --- */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`absolute bottom-8 right-6 w-14 h-14 ${theme.accent} ${theme.accentText} rounded-full 
                     shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 
                     flex items-center justify-center z-30`}
        >
          <Plus className="w-7 h-7" />
        </button>

        {/* --- Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <div
              className={`absolute inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`}
              onClick={() => setIsModalOpen(false)}
            />
            <div className={`${theme.bg} w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative z-50 ${theme.border} border`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-serif text-xl ${theme.text}`}>New Note</h3>
                <button onClick={() => setIsModalOpen(false)} className={`${theme.textMuted} hover:${theme.text}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Capture a thought..."
                className={`w-full bg-transparent text-lg ${theme.text} placeholder:${theme.textMuted}/50 
              outline-none resize-none leading-relaxed h-32 mb-4`}
              />
              <div className={`flex justify-between items-center ${theme.border} border-t pt-4`}>
                <div className="text-xs font-medium pl-1">
                  {input.toLowerCase().startsWith('todo:') && <span className={isDark ? 'text-[#E89B6A]' : 'text-[#C27A45]'}>Todo</span>}
                  {input.toLowerCase().startsWith('idea:') && <span className={isDark ? 'text-[#7FA87F]' : 'text-[#5A7D5A]'}>Idea</span>}
                  {input.toLowerCase().startsWith('listen:') && <span className={isDark ? 'text-[#B39A85]' : 'text-[#8C7A6B]'}>Listen</span>}
                  {input.toLowerCase().startsWith('read:') && <span className={isDark ? 'text-[#8E8EBD]' : 'text-[#6B6B99]'}>Read</span>}
                </div>
                <button
                  onClick={addNote}
                  disabled={!input.trim()}
                  className={`${theme.accent} ${theme.accentText} px-5 py-2.5 rounded-xl font-medium text-sm
                              disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg`}
                >
                  Add & Stash
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
