export const PinIcon = ({ color, size = 14 }) => (
  <div className="flex flex-col items-center relative drop-shadow-md z-10 transition-transform hover:scale-110">
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.5)" }} />
    <div style={{ width: 2, height: size - 4, background: "#ccc", marginTop: -1, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, boxShadow: "1px 1px 2px rgba(0,0,0,0.3)" }} />
  </div>
);
