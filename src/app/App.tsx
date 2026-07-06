import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Anchor, ArrowRight, Check, ChevronLeft, ChevronRight,
  Compass, Eye, Lightbulb, Map, Rocket, Sailboat,
  Settings2, Table2, Target, Trophy,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
const lanes = ["stop", "start", "continue"] as const;
type Lane = (typeof lanes)[number];
type IslandId = "what" | "how" | "sowhat" | "nowwhat";

type Reflection = Partial<Record<Lane, string>>;
type Answers = Record<IslandId, Record<string, Reflection>>;

type ActionRow = {
  action: string;
  outcomeStatement: string;
  progressImpact: string;
  owner: string;
  dueDate: string;
  successIndicator: string;
  status: "not-started" | "in-progress" | "complete";
};
type ActionPlan = Record<string, Partial<Record<Lane, ActionRow>>>;
type MatrixPos = { progress: number; stagnation: number; rationale: string };
type Matrix = Record<string, MatrixPos>;

// ─── Team Outcome Statements ──────────────────────────────────────────────────
const TEAM_OUTCOMES: Record<string, string[]> = {
  "curriculum": [
    "Strengthened SPFSC assessment and national examination systems to ensure students completing Years 12 and 13 attain recognised qualifications that enable progression to further education, tertiary pathways, or employment.",
    "Improved learning outcomes through the development and implementation of a quality curriculum aligned to country priorities and aspirations.",
    "Support provided to PICs to contextualise regional teacher standards into national frameworks, including the development of appraisal tools, strengthening readiness for validation and implementation to improve teacher quality.",
    "Enhanced teaching quality and classroom practice through accessible, high-quality Ocean Literacy resources aligned to learning outcomes and integrating Pacific knowledge and contexts.",
  ],
  "large-scale": [
    "Strengthened the use of PILNA reports and trend data to inform interventions, enhance ministry capacity, and support evidence-based planning, policy, and classroom practices.",
    "Strengthened implementation of PALS through effective field trial administration.",
    "Strengthened readiness and use of PILNA findings through effective preparation and dissemination of reports.",
  ],
  "qualifications": [
    "Strengthened national and regional qualifications systems.",
    "Enhance trust, understanding and ownership of the PQF as a regional framework.",
    "Improved access to quality and industry relevant training packages for learners.",
    "Strengthened credibility of qualifications and training providers.",
    "Increased access to learning and employment opportunities.",
  ],
  "policy": [
    "Strengthened MOE capacity to develop and review policies.",
    "Evidence-based insights on student performance to inform targeted interventions and policy improvements.",
    "Strengthened national and regional capacity to generate, interpret and use education research and evidence to inform policy, planning and practice.",
    "Improved measurement of Pacific students' literacy and numeracy achievement.",
    "Refinement of LANA reporting scales to enhance meaningful reporting and evidence-based decision making.",
    "MoE leadership standards alignment with regional leadership capabilities conducted.",
    "MoE systems for monitoring school principal performance are strengthened and enhanced.",
  ],
  "data-emis": [
    "Enhanced national capacity and systems to produce validated SDG 4 data that is published and effectively used for SOPER, regional and national reporting and policy decision making.",
    "Strengthened country capacity and systems to report education data through UIS/SDG 4 reporting mechanisms and PacSIMS EMIS.",
    "Improve EMIS readiness, adoption and functionality across countries.",
    "Strengthen coordination and collaboration between SPC, UIS and member countries.",
    "Timely high-quality SOPER reporting supported by consolidated, validated and harmonised regional data inputs.",
  ],
  "it": [
    "PacSIMS-EMIS Phase 1 is operationalised in PICs.",
    "SPFSC and Micro-qualification Moodle platforms are successfully migrated to a new hosting environment.",
    "Talanoa Hub is successfully migrated to SPC hosting.",
    "SPFSC exam results are successfully finalised and delivered.",
    "National examination results are successfully processed and delivered.",
    "PALS data is successfully compiled and delivered to LSA.",
  ],
  "corporate": [
    "A PBEQ endorsed business plan aligned to agreed indicators effectively guides strategic decision making and programme implementation.",
    "Strengthened and sustained donor partnerships enabling improved resource mobilisation.",
    "Stronger alignment and collaboration with SPC systems and processes operationalises the OneSPC vision and improves organisational coherence.",
  ],
  "cool": [
    "Donors, partners and stakeholders receive timely, reliable results reporting that informs accountability and decision-making.",
    "A fit-for-purpose MEL process and system is embedded and actively supports divisional business plan implementation.",
    "Up-to-date knowledge and digital systems are maintained and accessible to stakeholders.",
    "Evidence-driven learning culture is embedded, capturing impacts and the level of change to shape strategic direction and decision-making.",
    "Strengthened stakeholder engagement through effective feedback loops with divisional stakeholders, partners and donors.",
  ],
};

const PROGRESS_IMPACTS = [
  { value: "removes-stagnation", label: "Removes Stagnation", color: "#fb7185", dot: "🔴" },
  { value: "improves-efficiency", label: "Improves Efficiency", color: "#fbbf24", dot: "🟡" },
  { value: "accelerates-outcomes", label: "Accelerates Outcomes", color: "#34d399", dot: "🟢" },
  { value: "builds-capability", label: "Builds Future Capability", color: "#60a5fa", dot: "🔵" },
];

const STATUS_OPTIONS = [
  { value: "not-started", label: "Not Started", color: "#7fb5a8" },
  { value: "in-progress", label: "In Progress", color: "#fbbf24" },
  { value: "complete", label: "Complete", color: "#34d399" },
];

type Island = {
  id: IslandId; name: string; title: string; theme: string;
  icon: typeof Eye; color: string; image: string; x: number; y: number;
  objective: string; prompt: string; lanePrompts: Record<Lane, string[]>;
};

const islands: Island[] = [
  {
    id: "what", name: "What Island", title: "Where are we right now?", theme: "Current Reality",
    icon: Eye, color: "#0fb8a4",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=900&h=620&fit=crop&auto=format",
    x: 13, y: 55,
    objective: "Create a shared understanding of each team's current position against intended outcomes.",
    prompt: "Assess progress, stagnation, strengths, duplication, bottlenecks and the work that most affects team outcomes.",
    lanePrompts: {
      stop: ["What activities or outdated approaches should we stop?", "Where are the bottlenecks, delays, confusion or rework?"],
      start: ["What opportunities, tools, habits or innovations should we start?", "What would help us work smarter and accelerate outcomes?"],
      continue: ["What is working well and consistently delivering results?", "What strengths should be protected, maintained or scaled?"],
    },
  },
  {
    id: "how", name: "How Island", title: "How did we get here?", theme: "Ways of Working",
    icon: Settings2, color: "#38bdf8",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=620&fit=crop&auto=format",
    x: 38, y: 24,
    objective: "Explore behaviours, systems, processes and ways of working that influence progress.",
    prompt: "Trace the decisions, routines, collaboration patterns and systems that shaped the current outcome.",
    lanePrompts: {
      stop: ["What behaviours, habits or processes create delays or complexity?", "What frustrates stakeholders or limits collaboration?"],
      start: ["How can communication, partnerships or technology better support delivery?", "What new ways of working or capabilities should we build?"],
      continue: ["What collaboration, leadership routines or team habits are effective?", "What helps maintain focus and consistent delivery?"],
    },
  },
  {
    id: "sowhat", name: "So What Isle", title: "What does this mean?", theme: "Impact & Meaning",
    icon: Lightbulb, color: "#c084fc",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=620&fit=crop&auto=format",
    x: 64, y: 52,
    objective: "Understand the impact of current practices on team outcomes and stakeholders.",
    prompt: "Move from description to meaning: name the risks, consequences, opportunities and value revealed.",
    lanePrompts: {
      stop: ["What risks exist if inefficiencies continue?", "Which outcomes or stakeholder experiences could be negatively impacted?"],
      start: ["What opportunities, future benefits or value could be unlocked?", "What would success look like if we improved?"],
      continue: ["What positive outcomes are already being achieved?", "Which successful approaches should become standard practice?"],
    },
  },
  {
    id: "nowwhat", name: "Now What Cay", title: "Where do we go next?", theme: "Action Commitments",
    icon: Rocket, color: "#fbbf24",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=900&h=620&fit=crop&auto=format",
    x: 87, y: 27,
    objective: "Transform reflection into practical actions aligned with team outcome areas.",
    prompt: "Commit to specific, owned actions: simplify something, trial something, and scale something that works.",
    lanePrompts: {
      stop: ["What will we intentionally stop, simplify or remove immediately?", "What practice no longer earns its place?"],
      start: ["What action, improvement or capability will we implement or trial?", "Who owns the first step?"],
      continue: ["What successful practices should be maintained, scaled or embedded?", "How will we protect what already works?"],
    },
  },
];

const teams = [
  { id: "curriculum", name: "Curriculum and Assessment Team", short: "Curriculum", color: "#22c55e" },
  { id: "large-scale", name: "Large Scale Assessment Team", short: "Large Scale", color: "#a855f7" },
  { id: "policy", name: "Policy and Research Team", short: "Policy", color: "#f97316" },
  { id: "qualifications", name: "Qualifications Team", short: "Qualifications", color: "#eab308" },
  { id: "corporate", name: "Corporate Team", short: "Corporate", color: "#ef4444" },
  { id: "data-emis", name: "Data and EMIS Team", short: "Data & EMIS", color: "#14b8a6" },
  { id: "it", name: "IT Team", short: "IT", color: "#3b82f6" },
  { id: "cool", name: "COOL Team", short: "COOL", color: "#ec4899" },
];

const navItems = [
  { key: "map" as const, label: "Map", icon: Map },
  { key: "island" as const, label: "Island", icon: Compass },
  { key: "matrix" as const, label: "Matrix", icon: Target },
  { key: "plan" as const, label: "Action Plan", icon: Table2 },
];

const laneMeta: Record<Lane, { label: string; color: string; bg: string; hint: string }> = {
  stop:     { label: "STOP",     color: "#fb7185", bg: "rgba(251,113,133,.12)", hint: "Remove drag" },
  start:    { label: "START",    color: "#38bdf8", bg: "rgba(56,189,248,.12)",  hint: "Open opportunity" },
  continue: { label: "CONTINUE", color: "#34d399", bg: "rgba(52,211,153,.12)", hint: "Scale strengths" },
};

function emptyAnswers(): Answers { return { what: {}, how: {}, sowhat: {}, nowwhat: {} }; }

function emptyRow(): ActionRow {
  return { action: "", outcomeStatement: "", progressImpact: "", owner: "", dueDate: "", successIndicator: "", status: "not-started" };
}

function isTeamComplete(answers: Answers, islandId: IslandId, teamId: string) {
  return lanes.every((lane) => answers[islandId]?.[teamId]?.[lane]?.trim());
}

function svgPath(a: Island, b: Island) {
  return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 18} ${b.x} ${b.y}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [activeIslandId, setActiveIslandId] = useState<IslandId>("what");
  const [activeTeamId, setActiveTeamId] = useState(teams[0].id);
  const [view, setView] = useState<"map" | "island" | "matrix" | "plan">("map");
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [actionPlan, setActionPlan] = useState<ActionPlan>({});
  const [matrix, setMatrix] = useState<Matrix>(() =>
    Object.fromEntries(teams.map((t, i) => [t.id, { progress: 30 + i * 8, stagnation: 20 + ((i * 13) % 70), rationale: "" }]))
  );

  const island = islands.find((i) => i.id === activeIslandId) ?? islands[0];
  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0];
  const islandIndex = islands.findIndex((i) => i.id === island.id);
  const totalCompleted = useMemo(() =>
    islands.reduce((sum, isl) => sum + teams.filter((t) => isTeamComplete(answers, isl.id, t.id)).length, 0),
    [answers]
  );
  const voyageDone = totalCompleted === islands.length * teams.length;

  function updateAnswer(lane: Lane, value: string) {
    setAnswers((cur) => ({
      ...cur,
      [island.id]: { ...cur[island.id], [activeTeam.id]: { ...cur[island.id]?.[activeTeam.id], [lane]: value } },
    }));
  }

  function updateActionRow(teamId: string, lane: Lane, field: keyof ActionRow, value: string) {
    setActionPlan((cur) => ({
      ...cur,
      [teamId]: {
        ...cur[teamId],
        [lane]: { ...(cur[teamId]?.[lane] ?? emptyRow()), [field]: value },
      },
    }));
  }

  function getActionRow(teamId: string, lane: Lane): ActionRow {
    return actionPlan[teamId]?.[lane] ?? emptyRow();
  }

  function jumpTo(id: IslandId) { setActiveIslandId(id); setView("island"); }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(circle at 18% 10%, rgba(20,184,166,.25) 0%, transparent 30%), radial-gradient(circle at 85% 18%, rgba(251,191,36,.14) 0%, transparent 25%), linear-gradient(180deg,#071520 0%,#04101a 100%)" }} />
      <div className="pointer-events-none fixed inset-0 opacity-[.07]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2240%22%3E%3Cpath d=%22M0 20 Q20 8 40 20 Q60 32 80 20%22 fill=%22none%22 stroke=%22%23d9f0ea%22/%3E%3C/svg%3E')" }} />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
        <button onClick={() => setView("map")} className="flex items-center gap-3 text-left">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg" style={{ boxShadow: "0 0 20px rgba(15,184,164,.35)" }}>
            <Sailboat size={18} />
          </span>
          <span>
            <span className="block font-serif text-xl font-black leading-none" style={{ fontFamily: "'Fraunces', serif" }}>Island Hopper Reflection</span>
            <span className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">EQAP · Stop · Start · Continue · 8 Teams</span>
          </span>
        </button>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all"
              style={{
                borderColor: view === key ? "var(--primary)" : "var(--border)",
                background: view === key ? "var(--primary)" : "rgba(13,35,55,.55)",
                color: view === key ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>
        {voyageDone && (
          <span className="flex items-center gap-2 rounded-full bg-amber-300/20 border border-amber-300/40 px-3 py-1.5 text-sm font-bold text-amber-200">
            <Trophy size={14} />Voyage Complete
          </span>
        )}
      </header>

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════ MAP VIEW ══════════════════════════════ */}
        {view === "map" && (
          <motion.section key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 grid min-h-[calc(100vh-73px)] grid-rows-[1fr_auto]">

            <div className="relative min-h-[480px]">
              {/* SVG paths */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {islands.slice(0, -1).map((isl, i) => (
                  <path key={isl.id} d={svgPath(isl, islands[i + 1])}
                    fill="none" stroke="rgba(217,240,234,.22)" strokeDasharray="1.4 1.6" strokeWidth=".3" />
                ))}
              </svg>

              {/* Hero text */}
              <div className="absolute left-8 top-8 max-w-md">
                <p className="font-mono text-xs uppercase tracking-[.18em] text-primary">Ocean Workshop Board</p>
                <h1 className="mt-3 font-serif text-5xl font-black leading-[.95] text-[#eefbf7] md:text-6xl" style={{ fontFamily: "'Fraunces', serif" }}>
                  Reflect.<br />Map the drag.<br />Chart the tide.
                </h1>
                <p className="mt-4 text-sm leading-6 text-muted-foreground max-w-xs">
                  Four islands guide each team from current reality through process, meaning and measurable action.
                </p>
              </div>

              {/* Island nodes */}
              {islands.map((isl, seq) => {
                const Icon = isl.icon;
                const count = teams.filter((t) => isTeamComplete(answers, isl.id, t.id)).length;
                return (
                  <button key={isl.id} onClick={() => jumpTo(isl.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center group"
                    style={{ left: `${isl.x}%`, top: `${isl.y}%` }}
                  >
                    <motion.div whileHover={{ y: -7, scale: 1.05 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                      {/* Sequence badge */}
                      <div className="absolute -top-3 -left-3 z-10 flex size-6 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold"
                        style={{ borderColor: isl.color, background: "#071520", color: isl.color }}>
                        {seq + 1}
                      </div>
                      <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-[2rem] border-2 bg-card shadow-2xl"
                        style={{ borderColor: isl.color, boxShadow: `0 8px 32px ${isl.color}30` }}>
                        <img src={isl.image} alt={isl.name} className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <Icon className="absolute bottom-3 left-1/2 -translate-x-1/2" size={20} color={isl.color} />
                      </div>
                    </motion.div>
                    <h2 className="mt-3 font-serif text-lg font-black" style={{ fontFamily: "'Fraunces', serif", color: isl.color }}>{isl.name}</h2>
                    <p className="font-mono text-[10px] text-muted-foreground">{count}/8 complete</p>
                  </button>
                );
              })}
            </div>

            <TeamRoster answers={answers} />
          </motion.section>
        )}

        {/* ═════════════════════════════ ISLAND VIEW ═══════════════════════════ */}
        {view === "island" && (
          <motion.section key={`island-${island.id}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="relative z-10 grid min-h-[calc(100vh-73px)] lg:grid-cols-[380px_1fr]">

            {/* ── Left sidebar ── */}
            <aside className="flex flex-col border-r border-border bg-background/60 overflow-hidden">
              {/* Hero image */}
              <div className="relative h-56 flex-shrink-0 overflow-hidden">
                <img src={island.image} alt={island.name} className="h-full w-full object-cover opacity-55" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: island.color }}>{island.theme}</p>
                  <h1 className="font-serif text-4xl font-black leading-none mt-1" style={{ fontFamily: "'Fraunces', serif" }}>{island.name}</h1>
                  <p className="mt-1 text-base text-muted-foreground">{island.title}</p>
                </div>
              </div>

              {/* Objective */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="rounded-2xl border border-border bg-card/60 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground mb-2">Island Objective</p>
                  <p className="font-serif text-lg font-bold leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>{island.objective}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{island.prompt}</p>
                </div>

                {/* Island nav pills */}
                <div className="grid grid-cols-2 gap-2">
                  {islands.map((isl) => {
                    const cnt = teams.filter((t) => isTeamComplete(answers, isl.id, t.id)).length;
                    return (
                      <button key={isl.id} onClick={() => jumpTo(isl.id)}
                        className="rounded-xl border p-3 text-left transition-all"
                        style={{
                          borderColor: isl.id === island.id ? isl.color : "rgba(15,184,164,.12)",
                          background: isl.id === island.id ? `${isl.color}18` : "rgba(13,35,55,.5)",
                        }}>
                        <p className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">{isl.name}</p>
                        <p className="mt-1 font-serif text-2xl font-black" style={{ fontFamily: "'Fraunces', serif", color: isl.color }}>{cnt}<span className="text-sm font-normal text-muted-foreground">/8</span></p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-between border-t border-border p-4 flex-shrink-0">
                <button disabled={islandIndex === 0} onClick={() => jumpTo(islands[islandIndex - 1].id)}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-25 transition-opacity">
                  <ChevronLeft size={15} />Previous
                </button>
                <button disabled={islandIndex === islands.length - 1} onClick={() => jumpTo(islands[islandIndex + 1].id)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-25 transition-opacity"
                  style={{ background: island.color }}>
                  Next<ChevronRight size={15} />
                </button>
              </div>
            </aside>

            {/* ── Right: team responses ── */}
            <div className="flex min-h-0 flex-col bg-[#061018]/80">
              {/* Team tabs */}
              <div className="flex gap-2 overflow-x-auto border-b border-border p-3 flex-shrink-0">
                {teams.map((team) => (
                  <button key={team.id} onClick={() => setActiveTeamId(team.id)}
                    className="min-w-36 flex-shrink-0 rounded-xl border px-3 py-2 text-left transition-all"
                    style={{
                      borderColor: activeTeam.id === team.id ? team.color : "rgba(15,184,164,.12)",
                      background: activeTeam.id === team.id ? `${team.color}18` : "rgba(13,35,55,.45)",
                    }}>
                    <p className="truncate text-sm font-bold" style={{ color: team.color }}>{team.short}</p>
                    <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                      {isTeamComplete(answers, island.id, team.id) ? "✓ COMPLETE" : "IN PROGRESS"}
                    </p>
                  </button>
                ))}
              </div>

              {/* Response area */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Active crew</p>
                    <h2 className="font-serif text-3xl font-black" style={{ fontFamily: "'Fraunces', serif", color: activeTeam.color }}>{activeTeam.name}</h2>
                  </div>
                  {isTeamComplete(answers, island.id, activeTeam.id) && (
                    <span className="flex items-center gap-2 rounded-full bg-emerald-400/15 border border-emerald-400/25 px-3 py-2 text-sm text-emerald-200">
                      <Check size={14} />Island response complete
                    </span>
                  )}
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  {lanes.map((lane) => (
                    <article key={lane} className="rounded-[1.5rem] border border-border bg-card/70 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg px-2.5 py-1 font-mono text-xs font-bold tracking-[.1em]"
                          style={{ background: laneMeta[lane].bg, color: laneMeta[lane].color }}>
                          {laneMeta[lane].label}
                        </div>
                        <span className="text-xs text-muted-foreground">{laneMeta[lane].hint}</span>
                      </div>
                      <ul className="mb-4 space-y-2">
                        {island.lanePrompts[lane].map((p) => (
                          <li key={p} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                            <Anchor size={12} className="mt-0.5 shrink-0" style={{ color: laneMeta[lane].color }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <textarea
                        rows={7}
                        value={answers[island.id]?.[activeTeam.id]?.[lane] ?? ""}
                        onChange={(e) => updateAnswer(lane, e.target.value)}
                        placeholder={`${activeTeam.short}: ${laneMeta[lane].label.toLowerCase()} notes…`}
                        className="w-full resize-none rounded-xl border border-border bg-background/60 p-3.5 text-sm leading-6 outline-none transition-colors focus:border-primary"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════ MATRIX VIEW ══════════════════════════════ */}
        {view === "matrix" && (
          <motion.section key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 grid min-h-[calc(100vh-73px)] gap-5 p-5 lg:grid-cols-[1fr_340px]">

            {/* Grid canvas */}
            <div className="rounded-[2rem] border border-border bg-card/60 p-6">
              <h1 className="font-serif text-3xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>Progress vs Stagnation Map</h1>
              <p className="mt-1 text-sm text-muted-foreground">Click anywhere on the grid to position the selected team.</p>

              <MatrixGrid matrix={matrix} activeTeamId={activeTeamId} setActiveTeamId={setActiveTeamId} setMatrix={setMatrix} />
            </div>

            {/* Team controls */}
            <div className="flex flex-col gap-4 overflow-y-auto">
              {/* Team selector */}
              <div className="rounded-[1.5rem] border border-border bg-card/70 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground mb-3">Select Team</p>
                <div className="space-y-1.5">
                  {teams.map((team) => (
                    <button key={team.id} onClick={() => setActiveTeamId(team.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                      style={{
                        background: activeTeamId === team.id ? `${team.color}18` : "transparent",
                        border: `1px solid ${activeTeamId === team.id ? team.color + "55" : "transparent"}`,
                      }}>
                      <span className="size-2.5 rounded-full flex-shrink-0" style={{ background: team.color }} />
                      <span className="text-sm font-medium" style={{ color: team.color }}>{team.short}</span>
                      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                        P:{matrix[team.id].progress} S:{matrix[team.id].stagnation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active team detail */}
              <div className="rounded-[1.5rem] border border-border bg-card/70 p-5 flex-1">
                <h2 className="font-serif text-xl font-black" style={{ fontFamily: "'Fraunces', serif", color: activeTeam.color }}>{activeTeam.name}</h2>
                <div className="mt-4 space-y-3">
                  {(["progress", "stagnation"] as const).map((key) => (
                    <label key={key} className="block">
                      <span className="text-xs font-semibold capitalize text-muted-foreground">{key} score: {matrix[activeTeamId][key]}</span>
                      <input type="range" min={5} max={95}
                        value={matrix[activeTeamId][key]}
                        onChange={(e) => setMatrix((m) => ({ ...m, [activeTeamId]: { ...m[activeTeamId], [key]: Number(e.target.value) } }))}
                        className="mt-1.5 w-full accent-primary" />
                    </label>
                  ))}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">Rationale</p>
                    <textarea rows={5} value={matrix[activeTeamId].rationale}
                      onChange={(e) => setMatrix((m) => ({ ...m, [activeTeamId]: { ...m[activeTeamId], rationale: e.target.value } }))}
                      placeholder="Why are we here? What evidence supports this position?"
                      className="w-full resize-none rounded-xl border border-border bg-background/60 p-3 text-sm leading-6 outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ════════════════════════ ACTION PLAN VIEW ════════════════════════════ */}
        {view === "plan" && (
          <motion.section key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 min-h-[calc(100vh-73px)] p-5">

            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Team Action Register</p>
                <h1 className="font-serif text-4xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>From insight to owned action.</h1>
              </div>
            </div>

            {/* Team tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
              {teams.map((team) => (
                <button key={team.id} onClick={() => setActiveTeamId(team.id)}
                  className="min-w-32 flex-shrink-0 rounded-xl border px-3 py-2 text-left transition-all"
                  style={{
                    borderColor: activeTeamId === team.id ? team.color : "rgba(15,184,164,.12)",
                    background: activeTeamId === team.id ? `${team.color}18` : "rgba(13,35,55,.45)",
                  }}>
                  <p className="truncate text-sm font-bold" style={{ color: team.color }}>{team.short}</p>
                </button>
              ))}
            </div>

            {/* Action register table */}
            <div className="rounded-[1.5rem] border border-border overflow-hidden bg-card/60">
              {/* Header */}
              <div className="grid border-b border-border bg-secondary/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground"
                style={{ gridTemplateColumns: "100px 1fr 180px 180px 130px 1fr 120px" }}>
                <span>Type</span><span>Action</span><span>Outcome Area</span><span>Progress Impact</span><span>Timeline</span><span>Success Indicator</span><span>Status</span>
              </div>

              {/* Rows */}
              {lanes.map((lane, laneIdx) => {
                const row = getActionRow(activeTeam.id, lane);
                const pi = PROGRESS_IMPACTS.find((p) => p.value === row.progressImpact);
                const st = STATUS_OPTIONS.find((s) => s.value === row.status) ?? STATUS_OPTIONS[0];

                return (
                  <div key={lane}
                    className="grid items-start gap-3 border-b border-border px-4 py-4 transition-colors last:border-0"
                    style={{
                      gridTemplateColumns: "100px 1fr 180px 180px 130px 1fr 120px",
                      background: laneIdx % 2 === 0 ? "rgba(13,35,55,.3)" : "transparent",
                    }}>

                    {/* Type */}
                    <div>
                      <span className="rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
                        style={{ background: laneMeta[lane].bg, color: laneMeta[lane].color }}>
                        {laneMeta[lane].label}
                      </span>
                    </div>

                    {/* Action */}
                    <textarea rows={3} value={row.action}
                      onChange={(e) => updateActionRow(activeTeam.id, lane, "action", e.target.value)}
                      placeholder={`What will ${activeTeam.short} ${lane === "stop" ? "stop" : lane === "start" ? "start" : "continue"}?`}
                      className="w-full resize-none rounded-xl border border-border bg-background/50 p-2.5 text-sm leading-5 outline-none focus:border-primary transition-colors" />

                    {/* Outcome Area */}
                    <select value={row.outcomeStatement}
                      onChange={(e) => updateActionRow(activeTeam.id, lane, "outcomeStatement", e.target.value)}
                      className="rounded-xl border border-border bg-background/50 px-2.5 py-2 text-xs outline-none focus:border-primary transition-colors w-full text-foreground">
                      <option value="">— Select outcome —</option>
                      {(TEAM_OUTCOMES[activeTeam.id] ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    {/* Progress Impact */}
                    <div className="space-y-1.5">
                      {PROGRESS_IMPACTS.map((p) => (
                        <button key={p.value}
                          onClick={() => updateActionRow(activeTeam.id, lane, "progressImpact", p.value)}
                          className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all"
                          style={{
                            borderColor: row.progressImpact === p.value ? p.color + "99" : "rgba(15,184,164,.1)",
                            background: row.progressImpact === p.value ? p.color + "18" : "rgba(13,35,55,.4)",
                            color: row.progressImpact === p.value ? p.color : "var(--muted-foreground)",
                          }}>
                          <span>{p.dot}</span>{p.label}
                        </button>
                      ))}
                    </div>

                    {/* Timeline */}
                    <input type="text" value={row.timeline}
                      onChange={(e) => updateActionRow(activeTeam.id, lane, "timeline", e.target.value)}
                      placeholder="e.g. 30 days"
                      className="rounded-xl border border-border bg-background/50 px-2.5 py-2 text-sm outline-none focus:border-primary transition-colors w-full" />

                    {/* Success Indicator */}
                    <textarea rows={3} value={row.successIndicator}
                      onChange={(e) => updateActionRow(activeTeam.id, lane, "successIndicator", e.target.value)}
                      placeholder="How will you know it worked?"
                      className="w-full resize-none rounded-xl border border-border bg-background/50 p-2.5 text-sm leading-5 outline-none focus:border-primary transition-colors" />

                    {/* Status */}
                    <div className="space-y-1.5">
                      {STATUS_OPTIONS.map((s) => (
                        <button key={s.value}
                          onClick={() => updateActionRow(activeTeam.id, lane, "status", s.value)}
                          className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-all"
                          style={{
                            borderColor: row.status === s.value ? s.color + "88" : "rgba(15,184,164,.1)",
                            background: row.status === s.value ? s.color + "18" : "rgba(13,35,55,.4)",
                            color: row.status === s.value ? s.color : "var(--muted-foreground)",
                          }}>
                          {row.status === s.value && <Check size={10} />}
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Impact legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {PROGRESS_IMPACTS.map((p) => (
                <span key={p.value} className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs text-muted-foreground">
                  {p.dot} <span style={{ color: p.color }}>{p.label}</span>
                </span>
              ))}
            </div>
          </motion.section>
        )}

      </AnimatePresence>
    </main>
  );
}

// ─── Matrix Grid (clickable) ──────────────────────────────────────────────────
function MatrixGrid({ matrix, activeTeamId, setActiveTeamId, setMatrix }: {
  matrix: Matrix;
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  setMatrix: React.Dispatch<React.SetStateAction<Matrix>>;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent) {
    const rect = gridRef.current!.getBoundingClientRect();
    const stagnation = Math.round(((e.clientX - rect.left) / rect.width) * 90 + 5);
    const progress = Math.round((1 - (e.clientY - rect.top) / rect.height) * 90 + 5);
    setMatrix((m) => ({ ...m, [activeTeamId]: { ...m[activeTeamId], stagnation, progress } }));
  }

  return (
    <div
      ref={gridRef}
      onClick={handleClick}
      className="relative mt-5 cursor-crosshair rounded-[1.5rem] border border-border overflow-hidden"
      style={{ height: 520, background: "linear-gradient(135deg,rgba(34,197,94,.06) 0%,rgba(8,36,58,.95) 50%,rgba(239,68,68,.08) 100%)" }}
    >
      {/* Quadrant labels */}
      <div className="absolute top-4 left-5 font-mono text-[10px] text-emerald-400 opacity-70">HIGH PROGRESS ↑</div>
      <div className="absolute top-4 right-5 font-mono text-[10px] text-emerald-400/50 opacity-70">↑ HIGH PROGRESS</div>
      <div className="absolute bottom-4 left-5 font-mono text-[10px] text-muted-foreground opacity-60">LOW PROGRESS</div>
      <div className="absolute bottom-4 right-5 font-mono text-[10px] text-rose-400 opacity-70">HIGH STAGNATION →</div>

      {/* Quadrant dividers */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
        {[
          { label: "Thriving", sub: "High progress · Low stagnation", bg: "rgba(34,197,94,.04)" },
          { label: "Conflicted", sub: "High progress · High stagnation", bg: "rgba(251,191,36,.04)" },
          { label: "Drifting", sub: "Low progress · Low stagnation", bg: "rgba(96,165,250,.03)" },
          { label: "Stuck", sub: "Low progress · High stagnation", bg: "rgba(239,68,68,.05)" },
        ].map(({ label, sub, bg }) => (
          <div key={label} className="flex flex-col items-center justify-center border border-white/[.04]" style={{ background: bg }}>
            <p className="font-serif text-sm font-bold text-white/20" style={{ fontFamily: "'Fraunces', serif" }}>{label}</p>
            <p className="font-mono text-[9px] text-white/10">{sub}</p>
          </div>
        ))}
      </div>

      {/* Team markers */}
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={(e) => { e.stopPropagation(); setActiveTeamId(team.id); }}
          className="absolute -translate-x-1/2 translate-y-1/2 rounded-full border-2 px-2.5 py-1.5 font-mono text-[10px] font-bold shadow-xl transition-all hover:scale-110"
          style={{
            left: `${matrix[team.id].stagnation}%`,
            bottom: `${matrix[team.id].progress}%`,
            borderColor: team.color,
            background: activeTeamId === team.id ? team.color : "#071520",
            color: activeTeamId === team.id ? "#071520" : team.color,
            boxShadow: activeTeamId === team.id ? `0 0 18px ${team.color}66` : "none",
            zIndex: activeTeamId === team.id ? 10 : 1,
          }}
        >
          {team.short}
        </button>
      ))}
    </div>
  );
}

// ─── Team Roster ──────────────────────────────────────────────────────────────
function TeamRoster({ answers }: { answers: Answers }) {
  return (
    <section className="relative z-10 border-t border-border bg-background/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Voyage Roster</p>
        <p className="text-xs text-muted-foreground">8 EQAP teams</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => {
          const completed = islands.filter((isl) => isTeamComplete(answers, isl.id, team.id)).length;
          return (
            <article key={team.id} className="rounded-2xl border border-border bg-card/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold" style={{ color: team.color }}>{team.name}</p>
                <ArrowRight size={13} className="text-muted-foreground flex-shrink-0" />
              </div>
              <div className="mt-3 flex gap-1.5 items-center">
                {islands.map((isl) => (
                  <span key={isl.id} className="h-2 flex-1 rounded-full transition-all"
                    style={{ background: isTeamComplete(answers, isl.id, team.id) ? isl.color : "rgba(127,181,168,.15)" }} />
                ))}
                <span className="font-mono text-[9px] text-muted-foreground ml-1">{completed}/4</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
