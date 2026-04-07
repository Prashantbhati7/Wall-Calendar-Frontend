export const HighlighterNote = ({ nk, content, isFocused, darkMode, accent, onSelect, onUpdate, onSave, isGeneral }) => {
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
      className={`relative group transition-all ${isFocused ? 'scale-[1.01]' : 'opacity-80'}`}
      onClick={onSelect}
    >
      <div className={`px-2 py-0.5 inline-block text-[8px] font-black uppercase tracking-widest mb-0.5 rounded-sm`}
        style={{ background: darkMode ? c.darkBg : c.bg, color: darkMode ? c.darkText : c.text }}>
        {title}
      </div>
      <div className={`w-full transition-all ${isFocused ? 'border-l-2' : ''}`} style={{ borderColor: accent }}>
        <textarea
          autoFocus={isFocused}
          className={`w-full bg-transparent border-none outline-none resize-none text-[12px] font-sans leading-snug px-2 placeholder:opacity-30`}
          style={{
            background: isFocused ? (darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") : "transparent",
            color: darkMode ? "#f0ebe4" : "#1a1510",
            height: isGeneral ? '60px' : 'auto'
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
