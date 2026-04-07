import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

import { MONTHS, DAYS, MONTH_THEMES, INDIAN_HOLIDAYS, pageVariants, dateKey, isInRange } from "./data";
import { PinIcon } from "./components/PinIcon";
import { HighlighterNote } from "./components/HighlighterNote";

export default function App() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [bluePinDates, setBluePinDates] = useState([null, null]);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("calendar_notes");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem("calendar_notes", JSON.stringify(notes)); }, [notes]);

  const [noteKey, setNoteKey] = useState(`${today.getFullYear()}-${today.getMonth()}`);
  const [flipDir, setFlipDir] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  const theme = MONTH_THEMES[viewMonth];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const accent = theme.accent;
  const currentMonthKey = `${viewYear}-${viewMonth}`;

  const navigateMonth = (dir) => {
    setFlipDir(dir);
    setViewMonth(prev => {
      let nm = prev + dir;
      let ny = viewYear;
      if (nm > 11) { nm = 0; ny++; }
      else if (nm < 0) { nm = 11; ny--; }
      setViewYear(ny);
      setNoteKey(`${ny}-${nm}`);
      return nm;
    });
  };

  const handleDrop = (e, day) => {
    const type = e.dataTransfer.getData("pinType");
    const indexStr = e.dataTransfer.getData("pinIndex");
    const key = dateKey(viewYear, viewMonth + 1, day);
    if (type === "red") {
      const nk = `red:${key}`;
      setNotes(p => ({ ...p, [nk]: p[nk] || "" })); setNoteKey(nk);
    } else if (type === "blue") {
      const index = parseInt(indexStr); let nbd = [...bluePinDates]; nbd[index] = key; setBluePinDates(nbd);
      const other = nbd[index === 0 ? 1 : 0];
      if (other) { const nk = `range:${[key, other].sort().join(':')}`; setNotes(p => ({ ...p, [nk]: p[nk] || "" })); setNoteKey(nk); }
    }
  };

  const aggregatedNotes = Object.entries(notes)
    .filter(([k, v]) => {
      if (k === noteKey) return true;
      if (v.trim().length === 0) return false;
      if (k === currentMonthKey) return true;
      const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
      return k.includes(monthStr);
    })
    .map(([k, v]) => ({ key: k, content: v }))
    .sort((a, b) => (a.key === currentMonthKey ? -1 : (b.key === currentMonthKey ? 1 : a.key.localeCompare(b.key))));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const deleteActiveNote = () => {
    if (noteKey === currentMonthKey) return;
    setNotes(prev => { let n = { ...prev }; delete n[noteKey]; return n; });
    if (noteKey.startsWith('range:')) setBluePinDates([null, null]);
    setNoteKey(currentMonthKey);
  };

  return (
    <div className={`h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-serif ${darkMode ? 'bg-[#121212]' : 'bg-[#e5e5e5]'}`}>
      <div className="flex flex-col  md:flex-row gap-8 z-20 relative w-full max-w-[1300px] items-center justify-center transform scale-[0.65]">
        <div className={`p-4 rounded-xl flex md:flex-col items-center gap-6 backdrop-blur-md shadow-2xl border ${darkMode ? 'bg-[#221e1a]/80 border-white/10' : 'bg-[#faf6f0]/80 border-black/10'}`}>
          <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "red"); e.dataTransfer.setData("pinIndex", "0"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#e74c3c" /></div>
          <div className="w-full h-px bg-white/10" />
          <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "blue"); e.dataTransfer.setData("pinIndex", "0"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#3498db" /></div>
          <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "blue"); e.dataTransfer.setData("pinIndex", "1"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#3498db" /></div>
        </div>

        <div className="flex-1 perspective-distant w-full relative">
          <div className="absolute -top-10 left-4 right-4 flex justify-evenly z-40 pointer-events-none">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="relative flex flex-col items-center justify-end w-3 h-18">
                <div className="spiral-wire" />
                <div className="spiral-hole" />
              </div>
            ))}
          </div>
          <div className="rounded-lg shadow-2xl relative w-full h-[480px] md:h-auto flex flex-col md:flex-row overflow-hidden"
            style={{ background: darkMode ? "#221e1a" : "#faf6f0", color: darkMode ? "#f0ebe4" : "#1a1510" }}>
            <div className="relative w-full md:w-[400px] shrink-0 h-[250px] md:h-auto overflow-hidden z-20">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={viewMonth} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} src={theme.img} className="absolute inset-0 w-full h-full object-cover" />
              </AnimatePresence>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white text-shadow-lg">
                <div className="text-4xl font-black mb-1">{MONTHS[viewMonth]}</div>
                <div className="text-[10px] tracking-widest uppercase opacity-70">{theme.label}</div>
              </div>
            </div>

            <div className="flex-1 relative perspective-distant z-10 h-auto flex overflow-hidden">
              <AnimatePresence mode="popLayout" custom={flipDir} initial={false}>
                <motion.div
                  key={viewMonth} custom={flipDir} variants={pageVariants} initial="enter" animate="center" exit="exit"
                  transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
                  style={{ transformOrigin: "top right", backfaceVisibility: "hidden" }}
                  className="flex-1 relative flex flex-col p-6 md:p-8 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${theme.img})`, filter: 'blur(0px)', backgroundSize: 'cover' }} />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <button onClick={() => navigateMonth(-1)} className="w-8 h-8 rounded-full border border-current opacity-60 hover:opacity-100 flex items-center justify-center transition-all">‹</button>
                        <button onClick={() => navigateMonth(1)} className="w-8 h-8 rounded-full border border-current opacity-60 hover:opacity-100 flex items-center justify-center transition-all">›</button>
                      </div>
                      <button onClick={() => setDarkMode(!darkMode)} className="text-[10px] uppercase font-bold tracking-widest opacity-60 hover:opacity-100">{darkMode ? "Light" : "Dark"}</button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAYS.map((d, i) => (<div key={d} className="text-center text-[10px] tracking-widest uppercase font-bold" style={{ color: i === 0 ? accent : 'inherit', opacity: 0.5 }}>{d}</div>))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((day, i) => {
                        if (!day) return <div key={`e-${i}`} className="aspect-square" />;
                        const key = dateKey(viewYear, viewMonth + 1, day);
                        const holiday = INDIAN_HOLIDAYS[`${viewMonth + 1}-${day}`];
                        const isCurrent = dateKey(today.getFullYear(), today.getMonth() + 1, today.getDate()) === key;
                        const isRed = Object.keys(notes).some(nk => nk === `red:${key}`);
                        const rangeK = Object.keys(notes).find(nk => nk.startsWith('range:') && isInRange(viewYear, viewMonth, day, nk.split(':')[1], nk.split(':')[2]));
                        const isInR = isInRange(viewYear, viewMonth, day, bluePinDates[0], bluePinDates[1]) || rangeK;

                        return (
                          <div key={key} className="day-cell aspect-square rounded-md"
                            onClick={() => {
                              if (isRed) { setNoteKey(`red:${key}`); }
                              else if (rangeK) { setNoteKey(rangeK); }
                              else { setNoteKey(currentMonthKey); setNotes(p => ({ ...p, [currentMonthKey]: p[currentMonthKey] || "" })); }
                            }}
                            onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, day)}
                            onMouseEnter={(e) => holiday && setTooltip({ x: e.clientX, y: e.clientY, label: `🎉 ${holiday}` })}
                            onMouseLeave={() => setTooltip(null)}
                            style={{ color: i % 7 === 0 ? accent : 'inherit', fontWeight: (isCurrent || isRed) ? 700 : 400, background: isInR ? `${accent}22` : 'transparent' }}
                          >
                            {day}
                            {isCurrent && !isRed && <div className="absolute bottom-1.5 w-1 h-1 rounded-full" style={{ background: accent }} />}
                            {isRed && <div className="absolute -top-1.5" onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, label: `📌 ${notes['red:' + key]}` })} onMouseLeave={() => setTooltip(null)}><PinIcon color="#e74c3c" size={10} /></div>}
                            {isInR && (key === bluePinDates[0] || key === bluePinDates[1] || rangeK?.includes(key)) && <div className="absolute -top-1.5"><PinIcon color="#3498db" size={10} /></div>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-px bg-current opacity-10 my-2" />

                    <div className="flex-1 flex flex-col scroll-auto overflow-hid min-h-0 ">
                      <div className="mb-1">
                        <HighlighterNote
                          nk={currentMonthKey}
                          content={notes[currentMonthKey] || ""}
                          isFocused={noteKey === currentMonthKey}
                          darkMode={darkMode}
                          accent={accent}
                          isGeneral={true}
                          onSelect={() => setNoteKey(currentMonthKey)}
                          onUpdate={(k, v) => setNotes(p => ({ ...p, [k]: v }))}
                          onSave={() => { /* feedback loop simplified */ }}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-90">Pinned Events</span>
                        {noteKey !== currentMonthKey && <button onClick={deleteActiveNote} className="text-[9px] font-bold uppercase text-red-500 opacity-60 hover:opacity-100">Delete</button>}
                      </div>
                      <div className="flex-1 max-h-20 overflow-y-auto text-black pr-2 custom-scrollbar space-y-2">
                        <AnimatePresence>
                          {aggregatedNotes.filter(n => n.key !== currentMonthKey).map(n => (
                            <HighlighterNote key={n.key} nk={n.key} content={n.content} isFocused={noteKey === n.key} darkMode={darkMode} accent={accent} onSelect={() => setNoteKey(n.key)} onUpdate={(k, v) => setNotes(p => ({ ...p, [k]: v }))} onSave={() => { }} />
                          ))}
                          {aggregatedNotes.filter(n => n.key !== currentMonthKey).length === 0 && (
                            <div className="text-[10px] italic opacity-80 py-6 text-center">No pins...</div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {tooltip && <div className={`fixed px-3 py-1.5 rounded-md text-xs font-sans shadow-lg z-[1000] pointer-events-none whitespace-nowrap -translate-y-1/2 border ${darkMode ? 'bg-[#2c2620] text-white border-[#333]' : 'bg-white text-black border-[#eee]'}`} style={{ left: tooltip.x + 12, top: tooltip.y }}>{tooltip.label}</div>}
    </div>
  );
}
