export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_THEMES = [
  { img: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&q=80", accent: "#c0392b", label: "Winter Peaks", palette: ["#1a0a0a", "#2c1a1a", "#8b2020"] },
  { img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80", accent: "#2980b9", label: "Ocean Light", palette: ["#0a1a2c", "#0d2137", "#1a4a7a"] },
  { img: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80", accent: "#27ae60", label: "Alpine Spring", palette: ["#0a1a0d", "#0d2411", "#1a5c2e"] },
  { img: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80", accent: "#d35400", label: "Bloom Season", palette: ["#1a0d00", "#2c1500", "#7a3300"] },
  { img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80", accent: "#8e44ad", label: "Lavender Fields", palette: ["#130a1a", "#1e0f29", "#4a1a7a"] },
  { img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", accent: "#16a085", label: "Forest Solstice", palette: ["#0a1a15", "#0d2920", "#1a5c45"] },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", accent: "#f39c12", label: "Coastal Sun", palette: ["#1a1200", "#2c1e00", "#7a5500"] },
  { img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80", accent: "#e67e22", label: "Golden Harvest", palette: ["#1a0d00", "#2c1500", "#7a3300"] },
  { img: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80", accent: "#c0392b", label: "Ember Autumn", palette: ["#1a0a00", "#2c1000", "#7a2800"] },
  { img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", accent: "#7f8c8d", label: "Late Harvest", palette: ["#0d0d0d", "#1a1a1a", "#4a4a4a"] },
  { img: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", accent: "#2c3e50", label: "First Frost", palette: ["#0a0d15", "#0f1525", "#1a2545"] },
  { img: "https://images.unsplash.com/photo-1544535830-9df3f56fff6a?w=800&q=80", accent: "#3498db", label: "Silent Snow", palette: ["#0a0f1a", "#0d1529", "#1a2a5c"] },
];

export const INDIAN_HOLIDAYS = {
  "1-1": "New Year's Day", "1-26": "Republic Day", "5-1": "Labour Day", "8-15": "Independence Day", "10-2": "Gandhi Jayanti", "12-25": "Christmas Day", "12-31": "New Year's Eve",
};

export function dateKey(year, month, day) { return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; }
export function parseKey(key) { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); }

export function isInRange(year, month, day, start, end) {
  if (!start || !end) return false;
  const d = new Date(year, month, day);
  const s = parseKey(start);
  const e = parseKey(end);
  const [lo, hi] = s < e ? [s, e] : [e, s];
  return d >= lo && d <= hi;
}

export const pageVariants = {
  enter: (dir) => ({ rotateX: dir > 0 ? 0 : 80, rotateY: dir > 0 ? 0 : -8, opacity: 0, zIndex: 0 }),
  center: { rotateX: 0, rotateY: 0, opacity: 1, zIndex: 5 },
  exit: (dir) => ({ rotateX: dir > 0 ? 80 : 0, rotateY: dir > 0 ? 8 : 0, opacity: 0, zIndex: 10 })
};
