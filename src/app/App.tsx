import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ship, Check, Eye, Cog, Lightbulb, Rocket, Trophy, ChevronRight, ChevronLeft, Map } from "lucide-react";

const ISLAND_IMAGES = [
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&h=400&fit=crop&auto=format",
];

const ISLANDS = [
  {
    id: "what",
    name: "What Island",
    tagline: "Name what actually happened",
    icon: Eye,
    theme: "Observation",
    question: "What happened? Describe the situation, event, or experience your team went through — just the facts.",
    subPrompt: "No interpretation yet. Stick to what was observable: what did you see, hear, do?",
    color: "#0fb8a4",
    glowColor: "rgba(15,184,164,0.3)",
    x: 14,
    y: 55,
  },
  {
    id: "how",
    name: "How Island",
    tagline: "Trace the path you took",
    icon: Cog,
    theme: "Process",
    question: "How did it unfold? Walk through the steps, decisions, and dynamics that shaped the outcome.",
    subPrompt: "What choices were made, and by whom? Where did momentum build — or stall?",
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,0.3)",
    x: 38,
    y: 22,
  },
  {
    id: "sowhat",
    name: "So What Isle",
    tagline: "Find the meaning in the moment",
    icon: Lightbulb,
    theme: "Reflection",
    question: "So what? What does this experience mean for your team — what patterns, lessons, or insights emerge?",
    subPrompt: "Move beyond description into meaning. Why does this matter? What does it reveal?",
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,0.3)",
    x: 65,
    y: 50,
  },
  {
    id: "nowwhat",
    name: "Now What Cay",
    tagline: "Chart the course forward",
    icon: Rocket,
    theme: "Action",
    question: "Now what? What will your team do differently — and what's the first concrete step you'll take?",
    subPrompt: "Insights without action are just good intentions. Name something specific and owned.",
    color: "#fbbf24",
    glowColor: "rgba(251,191,36,0.3)",
    x: 86,
    y: 25,
  },
];

const TEAMS = [
  { id: "t1", name: "Team Albatross", color: "#0fb8a4", emoji: "🦅" },
  { id: "t2", name: "Team Barracuda", color: "#f97316", emoji: "🐟" },
  { id: "t3", name: "Team Coral", color: "#a78bfa", emoji: "🪸" },
  { id: "t4", name: "Team Driftwood", color: "#fbbf24", emoji: "🪵" },
  { id: "t5", name: "Team Egret", color: "#22d3ee", emoji: "🦢" },
  { id: "t6", name: "Team Fulmar", color: "#ec4899", emoji: "🐦" },
  { id: "t7", name: "Team Grotto", color: "#34d399", emoji: "🌊" },
  { id: "t8", name: "Team Horizon", color: "#f87171", emoji: "🌅" },
];

type Answers = Record<string, Record<string, string>>;

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - 15;
  return `M ${x1} ${y1} Q ${mx} ${cy} ${x2} ${y2}`;
}

function islandComplete(islandId: string, answers: Answers) {
  const a = answers[islandId] || {};
  return TEAMS.every((t) => a[t.id]?.trim());
}

export default function App() {
  const [activeIsland, setActiveIsland] = useState<string>("origins");
  const [answers, setAnswers] = useState<Answers>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [view, setView] = useState<"map" | "island">("map");
  const [activeTeam, setActiveTeam] = useState<string>("t1");

  const island = ISLANDS.find((i) => i.id === activeIsland)!;
  const islandIdx = ISLANDS.findIndex((i) => i.id === activeIsland);

  const completedIslands = new Set(ISLANDS.filter((i) => islandComplete(i.id, answers)).map((i) => i.id));

  function setDraft(teamId: string, val: string) {
    setDrafts((d) => ({ ...d, [teamId]: val }));
  }

  function saveAnswer(teamId: string) {
    const val = (drafts[teamId] ?? "").trim();
    if (!val) return;
    setAnswers((a) => ({
      ...a,
      [activeIsland]: { ...(a[activeIsland] || {}), [teamId]: val },
    }));
    setDrafts((d) => { const n = { ...d }; delete n[teamId]; return n; });
    // Auto-advance to next team
    const idx = TEAMS.findIndex((t) => t.id === teamId);
    if (idx < TEAMS.length - 1) setActiveTeam(TEAMS[idx + 1].id);
  }

  function goNext() {
    if (islandIdx < ISLANDS.length - 1) {
      setActiveIsland(ISLANDS[islandIdx + 1].id);
      setActiveTeam("t1");
      setView("island");
    }
  }

  function goPrev() {
    if (islandIdx > 0) {
      setActiveIsland(ISLANDS[islandIdx - 1].id);
      setActiveTeam("t1");
      setView("island");
    }
  }

  const allDone = completedIslands.size === ISLANDS.length;

  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 25% 15%, #0e2f47 0%, #071520 55%, #04101a 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Subtle wave overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cpath d='M0 20 Q20 8 40 20 Q60 32 80 20' fill='none' stroke='%230fb8a4' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 40px",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid rgba(15,184,164,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#0fb8a4" }}>
            <Ship size={15} className="text-black" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: "#d9f0ea", lineHeight: 1 }}>
              Island Hopper
            </h1>
            <p style={{ fontSize: "0.62rem", color: "#7fb5a8", letterSpacing: "0.1em" }}>8 TEAMS · 4 ISLANDS</p>
          </div>
        </div>

        {/* Island progress */}
        <div className="flex items-center gap-3">
          {ISLANDS.map((isl, idx) => (
            <button
              key={isl.id}
              onClick={() => { setActiveIsland(isl.id); setView("island"); }}
              className="flex items-center gap-1.5"
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: completedIslands.has(isl.id) ? isl.color : activeIsland === isl.id ? isl.color : "rgba(127,181,168,0.25)",
                  transform: activeIsland === isl.id ? "scale(1.7)" : "scale(1)",
                  boxShadow: activeIsland === isl.id ? `0 0 6px ${isl.color}` : "none",
                }}
              />
              {idx < ISLANDS.length - 1 && (
                <div className="w-5 h-px" style={{ background: "rgba(127,181,168,0.15)" }} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setView(view === "map" ? "island" : "map")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: view === "map" ? "rgba(15,184,164,0.15)" : "rgba(127,181,168,0.08)",
            color: view === "map" ? "#0fb8a4" : "#7fb5a8",
            border: "1px solid rgba(15,184,164,0.15)",
          }}
        >
          <Map size={12} />
          {view === "map" ? "Overview" : "Map"}
        </button>
      </header>

      <AnimatePresence mode="wait">

        {/* ── MAP VIEW ── */}
        {view === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative z-10 overflow-hidden"
          >
            {/* Ocean map canvas */}
            <div className="relative flex-1" style={{ minHeight: 360 }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {ISLANDS.slice(0, -1).map((isl, idx) => {
                  const next = ISLANDS[idx + 1];
                  const done = completedIslands.has(isl.id);
                  return (
                    <g key={isl.id}>
                      <path
                        d={curvePath(isl.x, isl.y, next.x, next.y)}
                        fill="none"
                        stroke={done ? isl.color : "rgba(15,184,164,0.15)"}
                        strokeWidth="0.4"
                        strokeDasharray={done ? "none" : "1.2 1.2"}
                      />
                    </g>
                  );
                })}
              </svg>

              {ISLANDS.map((isl) => {
                const isActive = activeIsland === isl.id;
                const done = completedIslands.has(isl.id);
                const Icon = isl.icon;
                const teamCount = Object.keys(answers[isl.id] || {}).length;
                return (
                  <button
                    key={isl.id}
                    onClick={() => { setActiveIsland(isl.id); setView("island"); }}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${isl.x}%`, top: `${isl.y}%`, transform: "translate(-50%,-50%)", zIndex: isActive ? 20 : 10 }}
                  >
                    <motion.div
                      animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className="relative"
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                          style={{ background: isl.color, filter: "blur(10px)" }}
                        />
                      )}
                      <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{
                          width: isActive ? 96 : 76,
                          height: isActive ? 96 : 76,
                          border: `2px solid ${isActive ? isl.color : done ? isl.color + "66" : "rgba(15,184,164,0.2)"}`,
                          boxShadow: isActive ? `0 8px 30px ${isl.glowColor}` : "none",
                          transition: "all 0.3s ease",
                          background: "#0d2337",
                        }}
                      >
                        <img
                          src={ISLAND_IMAGES[ISLANDS.indexOf(isl)]}
                          alt={isl.name}
                          className="w-full h-full object-cover"
                          style={{ opacity: done ? 0.75 : 0.6 }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: `linear-gradient(to top, ${isl.color}44 0%, transparent 60%)` }}
                        />
                        {done && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: isl.color }}>
                            <Check size={10} className="text-black" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                          <Icon size={14} style={{ color: isl.color }} />
                        </div>
                      </div>
                    </motion.div>

                    <div className="mt-2 text-center">
                      <p style={{ fontFamily: "'Fraunces', serif", fontSize: isActive ? "0.82rem" : "0.7rem", fontWeight: 700, color: isActive ? isl.color : "#7fb5a8", lineHeight: 1.2 }}>
                        {isl.name}
                      </p>
                      <p style={{ fontSize: "0.6rem", color: "#4d8a7e", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", marginTop: 2 }}>
                        {teamCount}/{TEAMS.length} teams
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Team roster at bottom */}
            <div className="px-6 pb-6 pt-2" style={{ borderTop: "1px solid rgba(15,184,164,0.1)" }}>
              <p style={{ fontSize: "0.62rem", color: "#7fb5a8", letterSpacing: "0.1em", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>VOYAGE ROSTER</p>
              <div className="grid grid-cols-4 gap-2">
                {TEAMS.map((team) => {
                  const answered = Object.keys(answers).filter((iid) => answers[iid][team.id]).length;
                  return (
                    <div key={team.id} className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: "#0d2337" }}>
                      <span style={{ fontSize: "1.1rem" }}>{team.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: team.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {team.name}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {ISLANDS.map((isl) => (
                            <div
                              key={isl.id}
                              className="w-2 h-2 rounded-full"
                              style={{ background: answers[isl.id]?.[team.id] ? isl.color : "rgba(127,181,168,0.15)" }}
                              title={isl.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ISLAND VIEW ── */}
        {view === "island" && (
          <motion.div
            key={`island-${activeIsland}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex overflow-hidden relative z-10"
          >
            {/* Island hero panel */}
            <div className="flex flex-col" style={{ width: "42%", minWidth: 300, borderRight: "1px solid rgba(15,184,164,0.1)" }}>
              <div className="relative overflow-hidden flex-shrink-0" style={{ height: 220 }}>
                <img
                  src={ISLAND_IMAGES[islandIdx]}
                  alt={island.name}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.55 }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 20%, #071520 100%)` }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${island.color}18 0%, transparent 60%)` }} />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <island.icon size={14} style={{ color: island.color }} />
                    <span style={{ fontSize: "0.62rem", color: island.color, fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em" }}>
                      {island.theme.toUpperCase()}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "1.6rem", color: "#d9f0ea", lineHeight: 1.1, marginBottom: 4 }}>
                    {island.name}
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#7fb5a8", fontStyle: "italic" }}>
                    {island.tagline}
                  </p>
                </div>
              </div>

              {/* The Question */}
              <div className="flex-1 p-5" style={{ background: "#071520" }}>
                <div className="mb-4 rounded-xl p-4" style={{ background: `${island.color}0d`, border: `1px solid ${island.color}22` }}>
                  <p style={{ fontSize: "0.6rem", color: island.color, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", marginBottom: 8 }}>
                    THEMATIC QUESTION
                  </p>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 600, color: "#d9f0ea", lineHeight: 1.5 }}>
                    "{island.question}"
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#7fb5a8", marginTop: 8, lineHeight: 1.5 }}>
                    {island.subPrompt}
                  </p>
                </div>

                {/* Island progress */}
                <div className="space-y-1.5">
                  <p style={{ fontSize: "0.6rem", color: "#4d8a7e", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em" }}>
                    TEAM RESPONSES
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {TEAMS.map((t) => {
                      const hasAns = !!answers[activeIsland]?.[t.id];
                      return (
                        <button
                          key={t.id}
                          onClick={() => setActiveTeam(t.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
                          style={{
                            background: activeTeam === t.id ? `${island.color}22` : hasAns ? `${t.color}11` : "rgba(17,45,68,0.6)",
                            border: `1px solid ${activeTeam === t.id ? island.color + "66" : hasAns ? t.color + "44" : "rgba(15,184,164,0.1)"}`,
                          }}
                        >
                          <span style={{ fontSize: "0.75rem" }}>{t.emoji}</span>
                          {hasAns && <Check size={8} style={{ color: t.color }} />}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "#7fb5a8", marginTop: 6 }}>
                    <span style={{ color: island.color, fontWeight: 600 }}>{Object.keys(answers[activeIsland] || {}).length}</span>
                    {" of 8 teams responded"}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4" style={{ borderTop: "1px solid rgba(15,184,164,0.1)" }}>
                <button
                  onClick={goPrev}
                  disabled={islandIdx === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    color: islandIdx === 0 ? "#2a5060" : "#7fb5a8",
                    background: islandIdx === 0 ? "transparent" : "rgba(127,181,168,0.08)",
                    cursor: islandIdx === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={islandIdx === ISLANDS.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: islandIdx < ISLANDS.length - 1 ? island.color : "rgba(15,184,164,0.08)",
                    color: islandIdx < ISLANDS.length - 1 ? "#071520" : "#2a5060",
                    cursor: islandIdx < ISLANDS.length - 1 ? "pointer" : "not-allowed",
                  }}
                >
                  Next Island
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: Team response area */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#061018" }}>
              {/* Scrollable team list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {TEAMS.map((team) => {
                  const saved = answers[activeIsland]?.[team.id] ?? "";
                  const draft = drafts[team.id] ?? "";
                  const isActive = activeTeam === team.id;
                  const displayVal = isActive ? draft || saved : saved;

                  return (
                    <motion.div
                      key={team.id}
                      layout
                      onClick={() => setActiveTeam(team.id)}
                      className="rounded-2xl overflow-hidden cursor-pointer transition-all"
                      style={{
                        background: isActive ? "#0d2337" : "#071520",
                        border: `1.5px solid ${isActive ? team.color + "55" : saved ? team.color + "22" : "rgba(15,184,164,0.08)"}`,
                        boxShadow: isActive ? `0 4px 20px ${team.color}18` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <span style={{ fontSize: "1.4rem" }}>{team.emoji}</span>
                        <div className="flex-1">
                          <p style={{ fontWeight: 700, fontSize: "0.85rem", color: team.color }}>{team.name}</p>
                          {saved && !isActive && (
                            <p style={{ fontSize: "0.73rem", color: "#7fb5a8", marginTop: 2, lineHeight: 1.4 }}>
                              {saved}
                            </p>
                          )}
                          {!saved && !isActive && (
                            <p style={{ fontSize: "0.7rem", color: "#2d5a6a", fontStyle: "italic" }}>
                              No response yet
                            </p>
                          )}
                        </div>
                        {saved && !isActive && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: team.color + "22" }}>
                            <Check size={11} style={{ color: team.color }} />
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 flex flex-col gap-2">
                              <textarea
                                rows={3}
                                autoFocus
                                value={draft || saved}
                                onChange={(e) => setDraft(team.id, e.target.value)}
                                placeholder={`${team.name}'s response to this island…`}
                                className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none transition-all"
                                style={{
                                  background: "#071520",
                                  border: `1.5px solid ${team.color}44`,
                                  color: "#d9f0ea",
                                  fontSize: "0.82rem",
                                  lineHeight: 1.6,
                                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = team.color + "99")}
                                onBlur={(e) => (e.target.style.borderColor = team.color + "44")}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={(e) => { e.stopPropagation(); saveAnswer(team.id); }}
                                  disabled={!(draft || saved).trim()}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                  style={{
                                    background: (draft || saved).trim() ? team.color : "rgba(127,181,168,0.08)",
                                    color: (draft || saved).trim() ? "#071520" : "#2a5060",
                                    cursor: (draft || saved).trim() ? "pointer" : "not-allowed",
                                  }}
                                >
                                  <Check size={11} />
                                  {saved ? "Update" : "Save Response"}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom summary bar */}
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(15,184,164,0.1)", background: "#061018" }}
              >
                <div>
                  <p style={{ fontSize: "0.65rem", color: "#4d8a7e", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em" }}>
                    ISLAND {islandIdx + 1} OF {ISLANDS.length}
                  </p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#d9f0ea", marginTop: 1 }}>
                    {island.name}
                  </p>
                </div>
                {allDone && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}>
                    <Trophy size={12} style={{ color: "#fbbf24" }} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#fbbf24" }}>Voyage Complete!</span>
                  </div>
                )}
                {!allDone && (
                  <div className="flex gap-1">
                    {ISLANDS.map((isl) => (
                      <div
                        key={isl.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: completedIslands.has(isl.id) ? isl.color : "rgba(127,181,168,0.15)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
