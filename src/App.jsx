import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MONTH_THEMES = [
  { img: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&q=80", accent: "#c0392b", label: "Winter Peaks", palette: ["#1a0a0a","#2c1a1a","#8b2020"] },
  { img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80", accent: "#2980b9", label: "Ocean Light", palette: ["#0a1a2c","#0d2137","#1a4a7a"] },
  { img: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80", accent: "#27ae60", label: "Alpine Spring", palette: ["#0a1a0d","#0d2411","#1a5c2e"] },
  { img: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80", accent: "#d35400", label: "Bloom Season", palette: ["#1a0d00","#2c1500","#7a3300"] },
  { img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80", accent: "#8e44ad", label: "Lavender Fields", palette: ["#130a1a","#1e0f29","#4a1a7a"] },
  { img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", accent: "#16a085", label: "Forest Solstice", palette: ["#0a1a15","#0d2920","#1a5c45"] },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", accent: "#f39c12", label: "Coastal Sun", palette: ["#1a1200","#2c1e00","#7a5500"] },
  { img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80", accent: "#e67e22", label: "Golden Harvest", palette: ["#1a0d00","#2c1500","#7a3300"] },
  { img: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80", accent: "#c0392b", label: "Ember Autumn", palette: ["#1a0a00","#2c1000","#7a2800"] },
  { img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", accent: "#7f8c8d", label: "Late Harvest", palette: ["#0d0d0d","#1a1a1a","#4a4a4a"] },
  { img: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", accent: "#2c3e50", label: "First Frost", palette: ["#0a0d15","#0f1525","#1a2545"] },
  { img: "https://images.unsplash.com/photo-1544535830-9df3f56fff6a?w=800&q=80", accent: "#3498db", label: "Silent Snow", palette: ["#0a0f1a","#0d1529","#1a2a5c"] },
];

const US_HOLIDAYS = {
  "1-1": "New Year's Day", "2-14": "Valentine's Day", "3-17": "St. Patrick's Day", "7-4": "Independence Day", "10-31": "Halloween", "11-11": "Veterans Day", "12-25": "Christmas Day", "12-31": "New Year's Eve",
};

const PinIcon = ({ color, size=14 }) => (
  <div className="flex flex-col items-center relative drop-shadow-md z-10 transition-transform hover:scale-110">
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.5)" }} />
    <div style={{ width: 2, height: size - 4, background: "#ccc", marginTop: -1, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, boxShadow: "1px 1px 2px rgba(0,0,0,0.3)" }} />
  </div>
);

function dateKey(year, month, day) { return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; }
function parseKey(key) { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); }

function isInRange(year, month, day, start, end) {
  if (!start || !end) return false;
  const d = new Date(year, month, day);
  const s = parseKey(start);
  const e = parseKey(end);
  const [lo, hi] = s < e ? [s, e] : [e, s];
  return d >= lo && d <= hi;
}

const pageVariants = {
  enter: (dir) => ({ rotateX: dir > 0 ? 0 : 80, rotateY: dir > 0 ? 0 : -8, opacity: 0, zIndex: 0 }),
  center: { rotateX: 0, rotateY: 0, opacity: 1, zIndex: 5 },
  exit: (dir) => ({ rotateX: dir > 0 ? 80 : 0, rotateY: dir > 0 ? 8 : 0, opacity: 0, zIndex: 10 })
};

const HighlighterNote = ({ nk, content, isFocused, darkMode, accent, onSelect, onUpdate, onSave, isGeneral }) => {
  let title = isGeneral ? "Month Note" : "Pin";
  
  if (!isGeneral) {
    if (nk.startsWith("red:")) {
       title = "Pin: " + nk.split(":")[1].split("-")[2];
    } else if (nk.startsWith("range:")) {
       const p = nk.split(":");
       title = `Range: ${p[1].split("-")[2]}→${p[2].split("-")[2]}`;
    }
  }

  const colors = [
    { bg: "#fff9c4", text: "#5d4037", darkBg: "#fef08a33", darkText: "#fef08a" },
    { bg: "#c8e6c9", text: "#1b5e20", darkBg: "#bbf7d033", darkText: "#bbf7d0" },
    { bg: "#bbdefb", text: "#0d47a1", darkBg: "#bfdbfe33", darkText: "#bfdbfe" },
    { bg: "#f8bbd0", text: "#880e4f", darkBg: "#fbcfe833", darkText: "#fbcfe8" },
    { bg: "#e1bee7", text: "#4a148c", darkBg: "#ddd6fe33", darkText: "#ddd6fe" },
  ];
  const colorIdx = Math.abs(nk.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % colors.length;
  const c = colors[colorIdx];

  return (
    <div 
      className={`relative py-1 group transition-all ${isFocused ? 'scale-[1.01]' : 'opacity-80'}`}
      onClick={onSelect}
    >
      <div className={`px-2 py-0.5 inline-block text-[8px] font-black uppercase tracking-widest mb-0.5 rounded-sm`}
           style={{ background: darkMode ? c.darkBg : c.bg, color: darkMode ? c.darkText : c.text }}>
        {title}
      </div>
      <div className={`w-full transition-all ${isFocused ? 'border-l-2' : ''}`} style={{ borderColor: accent }}>
        <textarea
          autoFocus={isFocused}
          className={`w-full bg-transparent border-none outline-none resize-none text-[12px] font-sans leading-snug px-2 py-1 placeholder:opacity-30`}
          style={{ 
            background: isFocused ? (darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") : "transparent",
            color: darkMode ? "#f0ebe4" : "#1a1510",
            height: isGeneral ? '80px' : 'auto'
          }}
          value={content}
          rows={isGeneral ? 4 : Math.max(1, content.split('\n').length)}
          onChange={(e) => onUpdate(nk, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(); }
          }}
          placeholder={isGeneral ? "General month notes..." : "Details..."}
        />
      </div>
    </div>
  );
};

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
      const monthStr = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}`;
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
    <div className={`h-screen flex items-center justify-center p-4 relative overflow-hidden font-serif ${darkMode ? 'bg-[#121212]' : 'bg-[#e5e5e5]'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .spiral-wire { width: 10px; height: 60px; border-radius: 6px; background: linear-gradient(90deg, #888 0%, #f4f4f4 40%, #888 80%, #444 100%); transform: rotate(20deg); box-shadow: 2px 3px 5px rgba(0,0,0,0.7), inset -1px -1px 2px rgba(0,0,0,0.4); z-index: 2; position: relative; }
        .spiral-hole { position: absolute; right:10px; bottom: -2px; width: 10px; height: 10px; border-radius: 50%; background: #0a0a0a; box-shadow: inset 0 2px 4px rgba(0,0,0,1); z-index: 1; }
        .day-cell { cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; font-size: 13px; transition: all 0.1s; }
        .day-cell:hover { background: rgba(150,150,150,0.1); transform: scale(1.05); }
        .tooltip { position: fixed; background: ${darkMode ? '#2c2620' : '#ffffff'}; color: ${darkMode ? '#fff' : '#000'}; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid ${darkMode ? '#333' : '#eee'}; z-index: 1000; pointer-events: none; white-space: nowrap; transform: translateY(-50%); }
      `}</style>

      <div className="flex flex-col  md:flex-row gap-8 z-20 relative w-full max-w-[1300px] items-center justify-center transform scale-[0.65]">
        <div className={`p-4 rounded-xl flex md:flex-col items-center gap-6 backdrop-blur-md shadow-2xl border ${darkMode ? 'bg-[#221e1a]/80 border-white/10' : 'bg-[#faf6f0]/80 border-black/10'}`}>
           <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "red"); e.dataTransfer.setData("pinIndex", "0"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#e74c3c" /></div>
           <div className="w-full h-px bg-white/10" />
           <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "blue"); e.dataTransfer.setData("pinIndex", "0"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#3498db" /></div>
           <div draggable onDragStart={(e) => { e.dataTransfer.setData("pinType", "blue"); e.dataTransfer.setData("pinIndex", "1"); }} className="cursor-grab active:cursor-grabbing"><PinIcon color="#3498db" /></div>
        </div>

        <div className="flex-1 perspective-distant w-full relative">
          <div className="absolute -top-10 left-4 right-4 flex justify-evenly z-40 pointer-events-none">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="relative flex flex-col items-center justify-end w-3 h-18">
                <div className="spiral-wire" />
                <div className="spiral-hole" />
              </div>
            ))}
          </div>
          <div className="rounded-lg shadow-2xl relative w-full flex flex-col md:flex-row overflow-hidden" 
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

            <div className="flex-1 relative perspective-distant z-10 flex overflow-hidden">
              <AnimatePresence mode="popLayout" custom={flipDir} initial={false}>
                <motion.div
                   key={viewMonth} custom={flipDir} variants={pageVariants} initial="enter" animate="center" exit="exit"
                   transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
                   style={{ transformOrigin: "top right", backfaceVisibility: "hidden" }}
                   className="flex-1 relative flex flex-col p-6 md:p-8 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${theme.img})`, filter: 'blur(0px)', backgroundSize: 'cover' }} />
                  <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-6">
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
                     const holiday = US_HOLIDAYS[`${viewMonth+1}-${day}`];
                     const isCurrent = dateKey(today.getFullYear(), today.getMonth()+1, today.getDate()) === key;
                     const isRed = Object.keys(notes).some(nk => nk === `red:${key}`);
                     const rangeK = Object.keys(notes).find(nk => nk.startsWith('range:') && isInRange(viewYear, viewMonth, day, nk.split(':')[1], nk.split(':')[2]));
                     const isInR = isInRange(viewYear, viewMonth, day, bluePinDates[0], bluePinDates[1]) || rangeK;
                     
                     return (
                       <div key={key} className="day-cell aspect-square rounded-md"
                         onClick={() => {
                            if (isRed) { setNoteKey(`red:${key}`); } 
                            else if (rangeK) { setNoteKey(rangeK); } 
                            else { setNoteKey(currentMonthKey); setNotes(p => ({...p, [currentMonthKey]: p[currentMonthKey] || ""})); }
                         }}
                         onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, day)}
                         onMouseEnter={(e) => holiday && setTooltip({ x: e.clientX, y: e.clientY, label: `🎉 ${holiday}` })}
                         onMouseLeave={() => setTooltip(null)}
                         style={{ color: i % 7 === 0 ? accent : 'inherit', fontWeight: (isCurrent || isRed) ? 700 : 400, background: isInR ? `${accent}22` : 'transparent' }}
                       >
                         {day}
                         {isCurrent && !isRed && <div className="absolute bottom-1.5 w-1 h-1 rounded-full" style={{ background: accent }} />}
                         {isRed && <div className="absolute -top-1.5" onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, label: `📌 ${notes['red:'+key]}` })} onMouseLeave={() => setTooltip(null)}><PinIcon color="#e74c3c" size={10}/></div>}
                         {isInR && (key===bluePinDates[0]||key===bluePinDates[1]||rangeK?.includes(key)) && <div className="absolute -top-1.5"><PinIcon color="#3498db" size={10}/></div>}
                       </div>
                     );
                   })}
                 </div>

                 <div className="h-px bg-current opacity-10 my-6" />

                 <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="mb-6">
                       <HighlighterNote 
                         nk={currentMonthKey} 
                         content={notes[currentMonthKey] || ""} 
                         isFocused={noteKey === currentMonthKey} 
                         darkMode={darkMode} 
                         accent={accent} 
                         isGeneral={true}
                         onSelect={() => setNoteKey(currentMonthKey)} 
                         onUpdate={(k, v) => setNotes(p => ({...p, [k]: v}))} 
                         onSave={() => { /* feedback loop simplified */ }} 
                       />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-40">Pinned Events</span>
                       {noteKey !== currentMonthKey && <button onClick={deleteActiveNote} className="text-[9px] font-bold uppercase text-red-500 opacity-60 hover:opacity-100">Delete</button>}
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                       <AnimatePresence>
                          {aggregatedNotes.filter(n => n.key !== currentMonthKey).map(n => (
                            <HighlighterNote key={n.key} nk={n.key} content={n.content} isFocused={noteKey === n.key} darkMode={darkMode} accent={accent} onSelect={() => setNoteKey(n.key)} onUpdate={(k,v) => setNotes(p => ({...p, [k]: v}))} onSave={() => {}} />
                          ))}
                          {aggregatedNotes.filter(n => n.key !== currentMonthKey).length === 0 && (
                            <div className="text-[10px] italic opacity-20 py-6 text-center">No pins...</div>
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
      {tooltip && <div className="tooltip" style={{ left: tooltip.x + 12, top: tooltip.y }}>{tooltip.label}</div>}
    </div>
  );
}
