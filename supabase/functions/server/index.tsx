import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const STATE_KEY = "eqap:island-hopper:state";
const AUDIT_KEY = "eqap:island-hopper:audit_logs";
const ACTIVITY_KEY = "eqap:island-hopper:activity_feed";
const VERSION_KEY = "eqap:island-hopper:version_history";

const defaultState = {
  sessionId: "jul-2026",
  sessionName: "July Reflection 2026",
  answers: { what: {}, how: {}, sowhat: {}, nowwhat: {} },
  actionPlan: {},
  matrix: {},
  updatedAt: new Date().toISOString(),
};

function stamp() {
  return new Date().toISOString();
}

function displayTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function readActor(body: any) {
  if (body?.auth?.role === "team") return body.auth.teamId ?? "team";
  return body?.auth?.role ?? "system";
}

async function appendHistory({ tableName, recordId, action, oldValue, newValue, changedBy, teamId }: any) {
  const now = stamp();
  const audit = await kv.get(AUDIT_KEY) ?? [];
  const entry = {
    id: crypto.randomUUID(),
    table_name: tableName,
    record_id: recordId ?? crypto.randomUUID(),
    action,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
    changed_by: changedBy ?? "system",
    team_id: teamId ?? null,
    created_at: now,
  };
  await kv.set(AUDIT_KEY, [entry, ...audit].slice(0, 250));

  const versions = await kv.get(VERSION_KEY) ?? [];
  await kv.set(VERSION_KEY, [{ ...entry, version_label: `${tableName} ${action}`, recorded_at: now }, ...versions].slice(0, 250));

  const feed = await kv.get(ACTIVITY_KEY) ?? [];
  const activity = {
    id: crypto.randomUUID(),
    time: displayTime(now),
    team: teamId ?? changedBy ?? "Platform",
    event: `${action.toLowerCase()} ${tableName.replaceAll("_", " ")}`,
    type: tableName,
    created_at: now,
  };
  await kv.set(ACTIVITY_KEY, [activity, ...feed].slice(0, 120));
}

app.get("/make-server-66fe3ecd/health", (c) => c.json({ status: "ok", realtime: "ready" }));

app.get("/make-server-66fe3ecd/state", async (c) => {
  const state = await kv.get(STATE_KEY) ?? defaultState;
  const auditLogs = await kv.get(AUDIT_KEY) ?? [];
  const activityFeed = await kv.get(ACTIVITY_KEY) ?? [];
  const versionHistory = await kv.get(VERSION_KEY) ?? [];
  return c.json({ state, auditLogs, activityFeed, versionHistory });
});

app.post("/make-server-66fe3ecd/state", async (c) => {
  const body = await c.req.json();
  const previous = await kv.get(STATE_KEY) ?? defaultState;
  const next = { ...defaultState, ...body.state, updatedAt: stamp() };
  await kv.set(STATE_KEY, next);

  const changedBy = readActor(body);
  const teamId = body?.auth?.teamId ?? body?.activeTeamId ?? null;
  await appendHistory({
    tableName: body?.change?.tableName ?? "workshop_state",
    recordId: body?.change?.recordId,
    action: body?.change?.action ?? "UPSERT",
    oldValue: body?.change?.oldValue ?? previous,
    newValue: body?.change?.newValue ?? next,
    changedBy,
    teamId,
  });

  return c.json({ state: next, ok: true });
});

app.get("/make-server-66fe3ecd/export/:format", async (c) => {
  const state = await kv.get(STATE_KEY) ?? defaultState;
  return c.json({
    format: c.req.param("format"),
    generated_at: stamp(),
    storage_bucket: "workshop-exports",
    file_name: `${state.sessionId}-reflection-export.${c.req.param("format")}`,
    state,
  });
});

Deno.serve(app.fetch);
