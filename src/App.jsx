import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   ONE CONCEPT, FOUR CLASSROOMS
   Chalkboard hero + typewriter aesthetic
   ═══════════════════════════════════════════ */

const C = {
  chalk: "#2B2D2F",
  chalkLight: "#3A3D40",
  cream: "#F5F3EE",
  paper: "#FAF9F6",
  ink: "#1A1A1A",
  muted: "#5F6368",
  border: "#E0DDD5",
  science: "#10B981",
  scienceSoft: "#7FA896",
  scienceLight: "#D1FAE5",
  scienceBg: "#F0FDF4",
  history: "#E5883D",
  historySoft: "#C4A079",
  historyLight: "#FEF3C7",
  historyBg: "#FFFBEB",
  math: "#4B7BEC",
  mathSoft: "#8595B8",
  mathLight: "#DBEAFE",
  mathBg: "#EFF6FF",
  english: "#E4588E",
  englishSoft: "#B88496",
  englishLight: "#FCE7F3",
  englishBg: "#FDF2F8",
};

const CLASSROOMS = [
  {
    id: "science", icon: "🧪", subject: "Science", grade: "7th Grade", topic: "Plate Tectonics",
    color: C.science, light: C.scienceLight, pageBg: C.scienceSoft,
    Organizer: "Series-of-Events Chain",
    scenario: "Students read about earthquakes but can't connect why convection currents lead to ground shaking. The causal chain is buried in dense paragraphs.",
    whyWorks: "The chain makes invisible logic visible — each box triggers the next, so students trace cause-to-effect with their eyes before their pencil.",
    impact: "Students will move from memorizing vocabulary to explaining processes. \"Subduction\" becomes a step in a story rather than a word to remember.",
    steps: [
      { label: "Convection currents\nin Earth's mantle", icon: "🌡️" },
      { label: "Tectonic plates\nshift & collide", icon: "🗺️" },
      { label: "Pressure builds\nalong fault lines", icon: "⚡" },
      { label: "Rock fractures,\nenergy released", icon: "💥" },
      { label: "Seismic waves\nradiate outward", icon: "〰️" },
      { label: "Ground shaking\n— Earthquake!", icon: "🏚️" },
    ],
  },
  {
    id: "history", icon: "📜", subject: "History", grade: "9th Grade", topic: "French Revolution",
    color: C.history, light: C.historyLight, pageBg: C.historySoft,
    organizer: "Cause-and-Effect Web",
    scenario: "The textbook lists causes in separate paragraphs. Students memorize a list but can't explain how economic crisis, philosophy, and famine interacted.",
    whyWorks: "History is rarely one cause → one effect. This web shows multiple forces converging, teaching students to think in systems rather than sequences.",
    impact: "Student essays will evolve from \"people were poor\" to multi-causal arguments that connect inequality, Enlightenment ideas, and crop failures in a single thesis.",
    causes: ["Tax burden on\nthe Third Estate", "Enlightenment\nideas spread", "Louis XVI's\nweak rule", "Crop failures\n& famine"],
    event: "French Revolution\n1789",
    effects: ["Monarchy\noverthrown", "Rights of Man\ndeclared", "Napoleon\nrises to power"],
  },
  {
    id: "math", icon: "📐", subject: "Math", grade: "8th Grade", topic: "Word Problems",
    color: C.math, light: C.mathLight, pageBg: C.mathSoft,
    organizer: "K-W-S Problem Solver",
    scenario: "Students can compute but freeze at word problems. They grab numbers and guess operations because they've never been taught to read math as text.",
    whyWorks: "The K-W-S forces reading before computing. Students must comprehend the problem (Know), identify the question (Want), then plan (Strategy).",
    impact: "Students will stop guessing operations. By the time they reach the Strategy column, they will have already done the hardest work — understanding what the text is asking.",
    problem: "A store sells notebooks in packs of 4 for $6.80. Maria needs 14 notebooks. How much will she spend?",
    columns: [
      { title: "KNOW", color: "#2563EB", items: ["4 notebooks/pack", "$6.80 per pack", "Needs 14 total"] },
      { title: "WANT", color: "#7C3AED", items: ["Total cost", "Packs needed", "Extra notebooks?"] },
      { title: "STRATEGY", color: "#059669", items: ["14 ÷ 4 = 3.5 → 4 packs", "4 × $6.80 = $27.20", "16 − 14 = 2 extra"] },
    ],
  },
  {
    id: "english", icon: "📖", subject: "English", grade: "10th Grade", topic: "Analyzing Theme",
    color: C.english, light: C.englishLight, pageBg: C.englishSoft,
    organizer: "Concept Web (Spider Map)",
    scenario: "Students finish reading To Kill a Mockingbird and are asked to identify its theme. Most will write something like \"racism is bad\" — they feel the theme but cannot trace how the author actually builds it through the text.",
    whyWorks: "The web makes a novel's invisible architecture visible — theme in the center, evidence radiating outward through character, dialogue, symbol, and plot.",
    impact: "Students will move from one-sentence summaries to analytical paragraphs that trace theme through specific evidence. The organizer gives them structure, not answers.",
    center: "Moral courage means\ndefending what's right\ndespite social pressure",
    branches: [
      { label: "Characters", items: ["Atticus defends Tom", "Scout faces the mob"], emoji: "👤" },
      { label: "Dialogue", items: ["\"Walk in their shoes...\"", "\"Shoot all the bluejays...\""], emoji: "💬" },
      { label: "Symbols", items: ["Mockingbird = innocence", "Boo Radley = goodness"], emoji: "🐦" },
      { label: "Plot", items: ["Trial verdict", "Ewell attacks children"], emoji: "📕" },
    ],
  },
];

const REFS = [
  "Simonsen (2003). Teaching Text Structures in Content Area Classrooms. In Lapp, Flood, & Farnan (Eds.), Content Area Reading and Learning.",
  "NCTM (2000). Principles and Standards for School Mathematics.",
  "Dexter & Hughes (2011). Graphic organizers and students with LD: A meta-analysis. Learning Disability Quarterly.",
  "Merkley & Jeffries (2000). Guidelines for implementing a graphic organizer. The Reading Teacher, 54(4).",
  "Gonzalez (2017). The Great and Powerful Graphic Organizer. Cult of Pedagogy.",
];

const TABS = [
  { id: "home", label: "Home", icon: "✦" },
  ...CLASSROOMS.map(c => ({ id: c.id, label: c.subject, icon: c.icon })),
  { id: "teachers", label: "For Teachers", icon: "🍎" },
];

// ═══ CHALK HANDWRITING ANIMATION (letter by letter) ═══
function ChalkText({ text, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisible(i);
        if (i >= text.length) clearInterval(interval);
      }, 75);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return (
    <span style={style}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{
          opacity: i < visible ? 1 : 0,
          transition: "opacity 0.12s ease",
        }}>{ch}</span>
      ))}
    </span>
  );
}

// ═══ SVG LINE-ART ICONS ═══
function BeakerIcon({ color, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6h12M20 6v14l-8 16a2 2 0 002 2h20a2 2 0 002-2l-8-16V6" />
      <path d="M14 32h20" strokeDasharray="3 3" />
      <circle cx="22" cy="35" r="1.5" fill={color} stroke="none" />
      <circle cx="28" cy="33" r="1" fill={color} stroke="none" />
    </svg>
  );
}
function QuillIcon({ color, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 42s2-8 6-14c4-6 12-14 24-22" />
      <path d="M14 28c4-2 10-1 14 2" />
      <path d="M10 38l4-10" />
    </svg>
  );
}
function ProtractorIcon({ color, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 32a18 18 0 0136 0" />
      <line x1="6" y1="32" x2="42" y2="32" />
      <line x1="24" y1="32" x2="24" y2="14" />
      <line x1="24" y1="32" x2="13" y2="17" />
      <line x1="24" y1="32" x2="35" y2="17" />
    </svg>
  );
}
function BookIcon({ color, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8c4-2 8-2 16 2c8-4 12-4 16-2v30c-4-2-8-2-16 2c-8-4-12-4-16-2V8z" />
      <line x1="24" y1="10" x2="24" y2="40" />
    </svg>
  );
}

const SUBJECT_ICONS = { science: BeakerIcon, history: QuillIcon, math: ProtractorIcon, english: BookIcon };

// ═══ ORGANIZER VISUALIZATIONS ═══
function ChainViz({ data, active }) {
  const [vis, setVis] = useState(0);
  useEffect(() => { if (!active) { setVis(0); return; } setVis(0); const t = data.steps.map((_, i) => setTimeout(() => setVis(i + 1), 200 + i * 350)); return () => t.forEach(clearTimeout); }, [active]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, padding: "20px 0" }}>
      {data.steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            opacity: i < vis ? 1 : 0.1, transform: i < vis ? "scale(1)" : "scale(0.88)",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            background: i < vis ? "#fff" : "transparent",
            border: `2.5px solid ${i < vis ? data.color : C.border}`, borderRadius: 14,
            padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
            minWidth: 240, maxWidth: 310,
            boxShadow: i < vis ? `0 3px 16px ${data.color}15` : "none",
          }}>
            <span style={{ fontSize: 24, filter: i < vis ? "none" : "grayscale(1)" }}>{s.icon}</span>
            <span style={{ fontSize: 13.5, color: C.ink, whiteSpace: "pre-line", lineHeight: 1.45, fontFamily: "'Courier Prime',monospace", fontWeight: 700 }}>{s.label}</span>
          </div>
          {i < data.steps.length - 1 && (
            <div style={{ height: 30, display: "flex", alignItems: "center", opacity: i < vis - 1 ? 1 : 0.12, transition: "opacity 0.4s" }}>
              <svg width="22" height="30" viewBox="0 0 22 30"><line x1="11" y1="2" x2="11" y2="20" stroke={data.color} strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" /><polygon points="5,20 11,28 17,20" fill={data.color} /></svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CauseEffectViz({ data, active }) {
  const [p, setP] = useState(0);
  useEffect(() => { if (!active) { setP(0); return; } setP(0); const t1 = setTimeout(() => setP(1), 350); const t2 = setTimeout(() => setP(2), 1100); const t3 = setTimeout(() => setP(3), 1800); return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }; }, [active]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {data.causes.map((c, i) => (
          <div key={i} style={{
            opacity: p >= 1 ? 1 : 0.08, transform: p >= 1 ? "translateY(0)" : "translateY(-12px)",
            transition: `all 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
            background: "#fff", border: `2.5px solid ${data.color}`, borderRadius: 14,
            padding: "11px 14px", fontSize: 12.5, color: C.ink, whiteSpace: "pre-line",
            textAlign: "center", lineHeight: 1.45, fontFamily: "'Courier Prime',monospace", fontWeight: 700,
            minWidth: 120, maxWidth: 150, boxShadow: `0 3px 12px ${data.color}12`,
          }}>{c}</div>
        ))}
      </div>
      <svg width="36" height="26" style={{ opacity: p >= 2 ? 1 : 0.1, transition: "opacity 0.5s" }}><line x1="18" y1="2" x2="18" y2="17" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" /><polygon points="12,17 18,25 24,17" fill={data.color} /></svg>
      <div style={{
        opacity: p >= 2 ? 1 : 0.08, transform: p >= 2 ? "scale(1)" : "scale(0.75)",
        transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        background: data.color, color: "#fff", borderRadius: 18, padding: "18px 28px",
        fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display',serif", textAlign: "center",
        whiteSpace: "pre-line", lineHeight: 1.3, boxShadow: `0 6px 28px ${data.color}40`,
      }}>{data.event}</div>
      <svg width="36" height="26" style={{ opacity: p >= 3 ? 1 : 0.1, transition: "opacity 0.5s" }}><line x1="18" y1="2" x2="18" y2="17" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" /><polygon points="12,17 18,25 24,17" fill={data.color} /></svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {data.effects.map((e, i) => (
          <div key={i} style={{
            opacity: p >= 3 ? 1 : 0.08, transform: p >= 3 ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
            background: data.light, border: `2.5px solid ${data.color}66`, borderRadius: 14,
            padding: "11px 14px", fontSize: 12.5, color: C.ink, whiteSpace: "pre-line",
            textAlign: "center", lineHeight: 1.45, fontFamily: "'Courier Prime',monospace", fontWeight: 700,
            minWidth: 110, boxShadow: `0 2px 10px ${data.color}08`,
          }}>{e}</div>
        ))}
      </div>
    </div>
  );
}

function KWSViz({ data, active }) {
  const [p, setP] = useState(0);
  useEffect(() => { if (!active) { setP(0); return; } setP(0); const t1 = setTimeout(() => setP(1), 250); const t2 = setTimeout(() => setP(2), 800); const t3 = setTimeout(() => setP(3), 1350); return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }; }, [active]);
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{
        background: `${C.math}06`, border: `1.5px solid ${C.math}18`, borderRadius: 12,
        padding: "12px 16px", marginBottom: 20, fontSize: 13.5, color: C.muted,
        fontFamily: "'Courier Prime',monospace", lineHeight: 1.6, fontStyle: "italic",
        opacity: p >= 1 ? 1 : 0.12, transition: "opacity 0.5s",
      }}>
        <span style={{ color: C.math, fontWeight: 700, fontStyle: "normal" }}>Problem: </span>{data.problem}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {data.columns.map((col, ci) => (
          <div key={ci} style={{
            flex: "1 1 145px", borderRadius: 14, overflow: "hidden",
            border: `2.5px solid ${col.color}44`, background: "#fff",
            opacity: p >= ci + 1 ? 1 : 0.08, transform: p >= ci + 1 ? "translateY(0)" : "translateY(16px)",
            transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${ci * 0.12}s`,
            boxShadow: p >= ci + 1 ? `0 3px 14px ${col.color}10` : "none",
          }}>
            <div style={{
              background: col.color, color: "#fff", padding: "10px 14px", fontSize: 12,
              fontWeight: 700, letterSpacing: 2.5, textAlign: "center",
              fontFamily: "'Playfair Display',serif", textTransform: "uppercase",
            }}>{col.title}</div>
            <div style={{ padding: 12 }}>
              {col.items.map((item, ii) => (
                <div key={ii} style={{
                  fontSize: 13, color: C.ink, padding: "8px 4px",
                  borderBottom: ii < col.items.length - 1 ? `1px solid ${C.border}` : "none",
                  fontFamily: "'Courier Prime',monospace", lineHeight: 1.45,
                }}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpiderViz({ data, active }) {
  const [p, setP] = useState(0);
  useEffect(() => { if (!active) { setP(0); return; } setP(0); const t1 = setTimeout(() => setP(1), 300); const t2 = setTimeout(() => setP(2), 950); return () => { clearTimeout(t1); clearTimeout(t2); }; }, [active]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "20px 0" }}>
      <div style={{
        width: 165, height: 165, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.englishLight}, #fff)`,
        border: `3.5px solid ${C.english}`, display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 18, fontSize: 12.5, fontWeight: 700, color: C.ink,
        fontFamily: "'Courier Prime',monospace", lineHeight: 1.4, whiteSpace: "pre-line",
        boxShadow: `0 6px 28px ${C.english}18`,
        opacity: p >= 1 ? 1 : 0.08, transform: p >= 1 ? "scale(1)" : "scale(0.55)",
        transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
      }}>{data.center}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {data.branches.map((b, i) => (
          <div key={i} style={{
            flex: "1 1 150px", maxWidth: 205, borderRadius: 14, overflow: "hidden",
            border: `2.5px solid ${C.english}33`, background: "#fff",
            opacity: p >= 2 ? 1 : 0.06, transform: p >= 2 ? "translateY(0) scale(1)" : "translateY(14px) scale(0.9)",
            transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.08 + i * 0.12}s`,
            boxShadow: p >= 2 ? `0 3px 12px ${C.english}08` : "none",
          }}>
            <div style={{
              background: C.englishLight, padding: "8px 12px", fontSize: 12, fontWeight: 700,
              color: C.english, textAlign: "center", fontFamily: "'Playfair Display',serif",
            }}>{b.emoji} {b.label}</div>
            <div style={{ padding: 10 }}>
              {b.items.map((item, ii) => (
                <div key={ii} style={{ fontSize: 12, color: C.muted, padding: "5px 0", fontFamily: "'Courier Prime',monospace", lineHeight: 1.55 }}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ PAGE: HOME ═══
function HomePage({ onNav }) {
  const [boardReady, setBoardReady] = useState(false);
  useEffect(() => { setTimeout(() => setBoardReady(true), 200); }, []);

  return (
    <div>
      {/* ═══ CHALKBOARD HERO ═══ */}
      <div style={{
        background: C.chalk,
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, ${C.chalkLight} 0%, transparent 70%),
          radial-gradient(ellipse at 80% 30%, #353840 0%, transparent 60%)
        `,
        padding: "70px 24px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "8px solid #8B6F47",
      }}>
        {/* chalk dust texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.7' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: "8px 8px",
        }} />
        {/* chalk tray shadow */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 12,
          background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
        }} />
        {/* little chalk marks */}
        {[
          { top: "12%", left: "8%", rot: -15, w: 30 },
          { top: "75%", left: "85%", rot: 25, w: 22 },
          { top: "20%", left: "88%", rot: -8, w: 18 },
          { top: "82%", left: "12%", rot: 40, w: 25 },
        ].map((m, i) => (
          <div key={i} style={{
            position: "absolute", top: m.top, left: m.left,
            width: m.w, height: 3, background: "rgba(255,255,255,0.08)",
            borderRadius: 2, transform: `rotate(${m.rot}deg)`,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Courier Prime',monospace", fontSize: 12, letterSpacing: 3,
            color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 28,
            opacity: boardReady ? 1 : 0, transition: "opacity 1s ease 0.3s",
          }}>
            EDUC 353 · Digital Project
          </div>

          <h1 style={{
            fontFamily: "'Caveat',cursive", fontSize: "clamp(44px,10vw,90px)",
            fontWeight: 700, lineHeight: 1.1, color: "rgba(255,255,255,0.92)",
            margin: "0 0 16px", letterSpacing: "1px",
            textShadow: "0 0 20px rgba(255,255,255,0.06)",
          }}>
            {boardReady && <ChalkText text="One Concept," delay={400} />}
            <br />
            {boardReady && <ChalkText text="Four Classrooms" delay={1700} />}
          </h1>

          <p style={{
            fontFamily: "'Caveat',cursive", fontSize: "clamp(18px,3vw,26px)",
            color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: 460, margin: "16px auto 0",
            opacity: boardReady ? 1 : 0, transition: "opacity 1.2s ease 3.3s",
          }}>
            how graphic organizers change the way students read & think
          </p>

          {/* chalk piece decoration */}
          <div style={{
            position: "absolute", bottom: -20, right: "15%",
            width: 40, height: 8, background: "rgba(255,255,255,0.6)",
            borderRadius: 4, transform: "rotate(-12deg)",
            opacity: boardReady ? 1 : 0, transition: "opacity 1s ease 3.6s",
          }} />
        </div>
      </div>

      {/* ═══ BODY SECTION ═══ */}
      <div style={{ background: C.cream, padding: "52px 24px 20px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,4vw,34px)",
            fontWeight: 900, color: C.ink, marginBottom: 14, letterSpacing: "-0.5px",
          }}>
            What is a Graphic Organizer?
          </h2>
          <p style={{
            fontFamily: "'Courier Prime',monospace", fontSize: 15, lineHeight: 1.85,
            color: C.ink,
          }}>
            A visual diagram that maps relationships between ideas. Research shows that graphic organizers boost comprehension across all subjects and skill levels (Dexter & Hughes, 2011). Click on the tabs below to see what they could look like in four real classrooms.
          </p>
        </div>

        {/* ═══ SUBJECT INDEX CARDS ═══ */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20, maxWidth: 820, margin: "0 auto 40px",
        }}>
          {CLASSROOMS.map((cl) => {
            const Icon = SUBJECT_ICONS[cl.id];
            return (
              <button key={cl.id} onClick={() => onNav(cl.id)} style={{
                background: cl.color, border: "none", borderRadius: 18,
                padding: "32px 20px 26px", cursor: "pointer", transition: "all 0.3s ease",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                boxShadow: `0 6px 24px ${cl.color}30, 4px 4px 0 ${cl.color}88`,
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) rotate(-1deg)"; e.currentTarget.style.boxShadow = `0 14px 36px ${cl.color}35, 6px 6px 0 ${cl.color}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) rotate(0)"; e.currentTarget.style.boxShadow = `0 6px 24px ${cl.color}30, 4px 4px 0 ${cl.color}88`; }}
              >
                {/* Tape effect */}
                <div style={{
                  position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
                  width: 48, height: 16, background: "rgba(255,255,255,0.25)",
                  borderRadius: "0 0 4px 4px",
                }} />
                <Icon color="rgba(255,255,255,0.85)" size={44} />
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>{cl.subject}</span>
                <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{cl.grade} · {cl.topic}</span>
                <span style={{
                  fontFamily: "'Courier Prime',monospace", fontSize: 11, fontWeight: 700,
                  color: cl.color, background: "rgba(255,255,255,0.9)", borderRadius: 12,
                  padding: "3px 12px", marginTop: 4,
                }}>explore →</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        textAlign: "center", padding: "20px", fontFamily: "'Courier Prime',monospace",
        fontSize: 11, color: C.muted, background: C.cream,
      }}>
        Hamza Zia · Washington and Lee University · 2026
      </div>
    </div>
  );
}

// ═══ PAGE: SUBJECT ═══
function SubjectPage({ classroom }) {
  const [orgActive, setOrgActive] = useState(false);
  const [replay, setReplay] = useState(0);
  useEffect(() => { setOrgActive(false); setReplay(0); setTimeout(() => setOrgActive(true), 500); }, [classroom.id]);
  const handleReplay = () => { setOrgActive(false); setReplay(r => r + 1); setTimeout(() => setOrgActive(true), 80); };
  const c = classroom;
  const Icon = SUBJECT_ICONS[c.id];

  return (
    <div style={{
      minHeight: "100vh",
      background: c.pageBg,
      backgroundImage: `
        radial-gradient(ellipse at 15% 20%, rgba(255,255,255,0.12) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 75%, rgba(0,0,0,0.15) 0%, transparent 60%)
      `,
      padding: "36px 24px 60px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grainy noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.18,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay",
      }} />
      {/* Subtle chalk-dust dots */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='white'/%3E%3Ccircle cx='5' cy='4' r='0.4' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: "10px 10px",
      }} />
      {/* Soft chalk streaks */}
      {[
        { top: "8%", left: "6%", rot: -12, w: 45, op: 0.08 },
        { top: "72%", left: "88%", rot: 22, w: 30, op: 0.06 },
        { top: "18%", left: "92%", rot: -8, w: 22, op: 0.07 },
      ].map((m, i) => (
        <div key={i} style={{
          position: "absolute", top: m.top, left: m.left,
          width: m.w, height: 3, background: `rgba(255,255,255,${m.op})`,
          borderRadius: 2, transform: `rotate(${m.rot}deg)`, pointerEvents: "none",
        }} />
      ))}

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36, animation: "slideUp 0.6s ease" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fff", border: `2.5px solid rgba(255,255,255,0.6)`,
            borderRadius: 40, padding: "8px 18px 8px 12px", marginBottom: 14,
            boxShadow: `0 4px 16px rgba(0,0,0,0.12)`,
          }}>
            <Icon color={c.color} size={24} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: c.color }}>{c.grade} · {c.subject}</span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,6vw,48px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-1px",
            textShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}>{c.topic}</h2>
          <p style={{ fontFamily: "'Courier Prime',monospace", fontSize: 14, color: "#fff", fontWeight: 700, opacity: 0.95 }}>
            organizer: {c.organizer}
          </p>
        </div>

        <div style={{ display: "flex", gap: 36, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Text */}
          <div style={{ flex: "1 1 280px" }}>
            {[
              { label: "THE PROBLEM", text: c.scenario },
              { label: "WHY IT WORKS", text: c.whyWorks },
              { label: "THE IMPACT", text: c.impact },
            ].map((block, bi) => (
              <div key={bi} style={{
                marginBottom: 20, background: "#fff", borderRadius: 16, padding: "20px 22px",
                border: `1px solid ${c.color}12`, boxShadow: `0 2px 10px ${c.color}06`,
                animation: `slideUp 0.6s ease ${0.15 + bi * 0.1}s both`,
              }}>
                <div style={{
                  fontFamily: "'Playfair Display',serif", fontSize: 10, fontWeight: 900, letterSpacing: 3,
                  color: c.color, marginBottom: 8, textTransform: "uppercase",
                }}>{block.label}</div>
                <p style={{
                  fontFamily: "'Courier Prime',monospace", fontSize: 14, lineHeight: 1.8,
                  color: C.ink, margin: 0,
                }}>{block.text}</p>
              </div>
            ))}
          </div>

          {/* Organizer */}
          <div style={{ flex: "1 1 360px", animation: "slideUp 0.7s ease 0.2s both" }}>
            <div style={{
              background: "#fff", borderRadius: 20, padding: 24,
              border: `2px solid ${c.color}18`, boxShadow: `0 6px 32px ${c.color}08`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 10, fontWeight: 900, letterSpacing: 3, color: c.color, textTransform: "uppercase" }}>
                  Interactive Organizer
                </div>
                <button onClick={handleReplay} style={{
                  background: c.light, border: `1.5px solid ${c.color}33`, borderRadius: 10,
                  padding: "5px 14px", cursor: "pointer", fontFamily: "'Courier Prime',monospace",
                  fontSize: 12, color: c.color, fontWeight: 700, transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.color; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = c.light; e.currentTarget.style.color = c.color; }}
                >▶ replay</button>
              </div>
              <div key={replay}>
                {c.id === "science" && <ChainViz data={c} active={orgActive} />}
                {c.id === "history" && <CauseEffectViz data={c} active={orgActive} />}
                {c.id === "math" && <KWSViz data={c} active={orgActive} />}
                {c.id === "english" && <SpiderViz data={c} active={orgActive} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ PAGE: TEACHERS ═══
function TeachersPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.cream, padding: "48px 24px 60px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44, animation: "slideUp 0.6s ease" }}>
          <span style={{ fontSize: 44, display: "block", marginBottom: 10 }}>🍎</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: C.ink, marginBottom: 12, letterSpacing: "-1px" }}>
            Making Them Work
          </h2>
          <p style={{ fontFamily: "'Courier Prime',monospace", fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
            Graphic organizers fail when they're treated as worksheets. Here's what research says makes them effective (Merkley & Jeffries, 2000).
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 48 }}>
          {[
            { num: "01", title: "Teach it explicitly", desc: "Model how to fill it in, thinking aloud about why each piece goes where. Don't just hand it out.", color: C.science, light: C.scienceLight },
            { num: "02", title: "Match to text structure", desc: "A Venn diagram for comparison. A chain for sequence. A web for multiple causes. The fit matters.", color: C.history, light: C.historyLight },
            { num: "03", title: "Use consistently", desc: "Make it a routine tool in students' reading repertoire, not a one-off worksheet on a random Tuesday.", color: C.math, light: C.mathLight },
            { num: "04", title: "Fade the scaffold", desc: "Start pre-made. Then partially blank. Then student-created. Build independence over time.", color: C.english, light: C.englishLight },
          ].map((tip, i) => (
            <div key={tip.num} style={{
              background: "#fff", borderRadius: 18, padding: "26px 22px",
              border: `2px solid ${tip.color}18`, transition: "all 0.3s ease", cursor: "default",
              boxShadow: `0 2px 12px ${tip.color}06`,
              animation: `slideUp 0.6s ease ${0.1 + i * 0.08}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = tip.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${tip.color}14`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tip.color + "18"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 12px ${tip.color}06`; }}
            >
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 900, color: tip.color, opacity: 0.2, marginBottom: 6 }}>{tip.num}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 900, color: C.ink, marginBottom: 8 }}>{tip.title}</div>
              <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{tip.desc}</div>
            </div>
          ))}
        </div>

        {/* Synthesis */}
        <div style={{
          background: "#fff", borderRadius: 22, padding: "34px 30px", textAlign: "center", marginBottom: 44,
          border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: C.ink, marginBottom: 14, letterSpacing: "-0.5px" }}>
            Same Strategy. Every Subject.
          </h3>
          <p style={{ fontFamily: "'Courier Prime',monospace", fontSize: 14, lineHeight: 1.85, color: C.muted, maxWidth: 460, margin: "0 auto" }}>
            In every classroom, the pattern is the same: students who struggle with dense text improve, not because the content gets easier, but because they're given a structure for thinking. Graphic organizers don't replace reading; they make reading visible.
          </p>
        </div>

        {/* References */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28 }}>
          <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontWeight: 900, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: 16 }}>References</h4>
          {REFS.map((r, i) => (
            <p key={i} style={{ fontFamily: "'Courier Prime',monospace", fontSize: 12, color: C.muted, opacity: 0.6, lineHeight: 1.7, marginBottom: 6 }}>{r}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [tab, setTab] = useState("home");
  const activeClassroom = CLASSROOMS.find(c => c.id === tab);
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Caveat:wght@400;500;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0}body{background:${C.cream}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>

      {/* NAV */}
      {tab !== "home" && (
        <nav style={{
          position: "sticky", top: 0, zIndex: 100, background: "rgba(245,243,238,0.88)",
          backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}`, padding: "0 12px",
        }}>
          <div style={{
            maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center",
            gap: 2, overflowX: "auto", padding: "6px 0",
          }}>
            {TABS.map(t => {
              const isActive = tab === t.id;
              const tColor = CLASSROOMS.find(c => c.id === t.id)?.color || C.ink;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  background: isActive ? (t.id === "home" || t.id === "teachers" ? `${C.ink}08` : `${tColor}12`) : "transparent",
                  border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer",
                  fontFamily: "'Courier Prime',monospace", fontSize: 12, fontWeight: isActive ? 700 : 400,
                  color: isActive ? (t.id === "home" || t.id === "teachers" ? C.ink : tColor) : C.muted,
                  transition: "all 0.2s ease", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.ink; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.muted; }}
                >
                  <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <div key={tab} style={{ animation: "slideUp 0.4s ease" }}>
        {tab === "home" && <HomePage onNav={setTab} />}
        {activeClassroom && <SubjectPage classroom={activeClassroom} />}
        {tab === "teachers" && <TeachersPage />}
      </div>

      {tab !== "home" && (
        <div style={{
          textAlign: "center", padding: "18px", fontFamily: "'Courier Prime',monospace",
          fontSize: 11, color: C.muted, opacity: 0.4, borderTop: `1px solid ${C.border}`, background: C.cream,
        }}>
          Hamza Zia · EDUC 353 · Washington and Lee University · 2026
        </div>
      )}
    </div>
  );
}