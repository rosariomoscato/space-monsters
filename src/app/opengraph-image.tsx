import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Space Monsters — una ondata, tre vite / one wave, three lives";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#080e1c", border: "24px solid #101b2e", padding: 80, color: "#e8f7f5", fontFamily: "monospace" }}>
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#65e6e3", marginBottom: 32 }}>✳ A TINY SPACE ARCADE</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 1.1, letterSpacing: -4, color: "#b4f45b" }}><span>SPACE</span><span>MONSTERS_</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 26, marginTop: 32 }}><span>Un&apos;ondata. Tre vite. Salva la Terra.</span><span>One wave. Three lives. Save Earth.</span></div>
    </div>, size,
  );
}
