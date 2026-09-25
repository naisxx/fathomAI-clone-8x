#!/usr/bin/env node
/**
 * 8x assignment - automatic agent-turn capture for Claude Code.
 *
 * Wired in .claude/settings.json to two lifecycle events:
 *   UserPromptSubmit -> `node .claude/hooks/capture.mjs prompt`
 *   Stop             -> `node .claude/hooks/capture.mjs response`
 *
 * Both events hand us a JSON payload on stdin. We append one LOG_ENTRY per
 * event to .agent-logs/<YYYY-MM-DD_HH-MM-SS>_<session-id>.md.
 *
 * We record the prompt verbatim and the FINAL assistant text only - no
 * thinking blocks, no tool calls, no intermediate narration.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const MODE = process.argv[2]; // "prompt" | "response"
const AUTHOR = "naisxx";
const TOOL = "claude-code";

/** Walk up from this script to the repo root (the dir holding .git). */
let _root;
function repoRoot() {
  if (_root !== undefined) return _root;
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, ".git"))) return (_root = dir);
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return (_root = null);
}

// A hook that crashes must never take the session down with it. Everything
// runs inside main(), and we always exit 0.
function fail(err) {
  try {
    const root = repoRoot() || process.cwd();
    fs.mkdirSync(path.join(root, ".agent-logs"), { recursive: true });
    fs.appendFileSync(
      path.join(root, ".agent-logs", ".capture-errors.log"),
      new Date().toISOString() + " [" + MODE + "] " + (err && err.stack ? err.stack : String(err)) + "\n"
    );
  } catch {
    /* nothing left to do */
  }
}

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/** Parse a transcript .jsonl into an array of objects, skipping bad lines. */
function readTranscript(p) {
  if (!p || !fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Pull the final assistant response out of a transcript.
 *
 * Claude Code writes several `assistant` lines per turn, mixing thinking, text
 * and tool_use blocks. The final response is the last unbroken run of `text`
 * blocks: any tool_use (or a new user turn) means everything buffered so far
 * was preamble to a tool call, i.e. an intermediate step, so we drop it.
 */
function finalResponse(entries) {
  let buf = [];
  let model = null;
  for (const e of entries) {
    if (e.isSidechain) continue; // subagent chatter, not our turn
    if (e.type === "user") {
      buf = [];
      continue;
    }
    if (e.type !== "assistant" || !e.message) continue;
    const content = e.message.content;
    const blocks = Array.isArray(content)
      ? content
      : [{ type: "text", text: String(content == null ? "" : content) }];
    for (const b of blocks) {
      if (b.type === "tool_use") {
        buf = [];
      } else if (b.type === "text" && b.text && b.text.trim()) {
        buf.push(b.text);
        model = e.message.model || model;
      }
    }
  }
  return { text: buf.join("\n").trim(), model };
}

/**
 * Name of the project, not of the checkout.
 *
 * In a git worktree, `.git` is a file pointing at
 * `<main repo>/.git/worktrees/<name>`, so basename(root) would give us the
 * throwaway worktree name. Resolve back to the real repo when that happens.
 */
function projectName(root) {
  let dir = root;
  try {
    const dotgit = path.join(root, ".git");
    if (fs.statSync(dotgit).isFile()) {
      const m = /gitdir:\s*(.+)/.exec(fs.readFileSync(dotgit, "utf8"));
      if (m) {
        const wt = m[1].trim().replace(/\\/g, "/");
        const i = wt.indexOf("/.git/worktrees/");
        if (i !== -1) dir = wt.slice(0, i);
      }
    }
  } catch {
    /* fall back to the checkout dir */
  }
  return path
    .basename(dir)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Most recent model seen anywhere in the transcript. */
function latestModel(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const m = entries[i] && entries[i].message && entries[i].message.model;
    if (m) return m;
  }
  return null;
}

const pad = (n) => String(n).padStart(2, "0");

/** UTC stamp for filenames: YYYY-MM-DD_HH-MM-SS */
function fileStamp(d) {
  return (
    d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) +
    "_" + pad(d.getUTCHours()) + "-" + pad(d.getUTCMinutes()) + "-" + pad(d.getUTCSeconds())
  );
}

function logDir(root) {
  const d = path.join(root, ".agent-logs");
  fs.mkdirSync(d, { recursive: true });
  return d;
}

function findSessionFile(root, sessionId) {
  const dir = logDir(root);
  const hit = fs.readdirSync(dir).find((f) => f.endsWith("_" + sessionId + ".md"));
  return hit ? path.join(dir, hit) : null;
}

/** Find this session's log file, creating it (with frontmatter) if new. */
function sessionFile(root, sessionId, now, model, project) {
  const existing = findSessionFile(root, sessionId);
  if (existing) return existing;

  const p = path.join(logDir(root), fileStamp(now) + "_" + sessionId + ".md");
  const iso = now.toISOString();
  const head =
    "---\n" +
    "session_id: " + sessionId + "\n" +
    "date: " + iso.slice(0, 10) + "\n" +
    "author: " + AUTHOR + "\n" +
    "model: " + model + "\n" +
    "tool: " + TOOL + "\n" +
    "project: " + project + "\n" +
    "total_exchanges: 0\n" +
    "first_prompt_time: " + iso + "\n" +
    "last_prompt_time: " + iso + "\n" +
    "---\n\n" +
    "# Session Log - " + iso.slice(0, 10) + "\n\n" +
    "Session: `" + sessionId.slice(0, 8) + "` | Project: `" + project + "` | Author: `" + AUTHOR + "`\n\n" +
    "---\n";
  fs.writeFileSync(p, head);
  return p;
}

/**
 * Refresh the counters in frontmatter. This only ever touches the
 * total_exchanges / last_prompt_time / model lines in the header block -
 * logged entries themselves are append-only and never rewritten.
 */
function touchFrontmatter(file, opts) {
  const s = fs.readFileSync(file, "utf8");
  const end = s.indexOf("\n---\n", 4);
  if (end === -1) return;
  let head = s.slice(0, end);
  const body = s.slice(end);
  if (opts.exchanges != null) {
    head = head.replace(/^total_exchanges: .*$/m, "total_exchanges: " + opts.exchanges);
  }
  if (opts.lastPromptTime) {
    head = head.replace(/^last_prompt_time: .*$/m, "last_prompt_time: " + opts.lastPromptTime);
  }
  if (opts.model) {
    head = head.replace(/^model: .*$/m, "model: " + opts.model);
  }
  fs.writeFileSync(file, head + body);
}

const countOf = (s, type) =>
  (s.match(new RegExp("\\[LOG_ENTRY type=" + type + " ", "g")) || []).length;

/**
 * Is this submission something the user actually typed?
 *
 * `UserPromptSubmit` also fires for harness-generated events — background task
 * completions arrive as `<task-notification>` blocks. Logging those as PROMPT
 * entries inflated the prompt count and, worse, pushed RESPONSE numbering out of
 * step so that RESPONSE n no longer answered PROMPT n.
 *
 * They are still recorded, as SYSTEM_EVENT, because hiding what the model
 * received would be its own dishonesty. They just are not counted as prompts.
 */
function isSystemEvent(prompt) {
  const t = prompt.trimStart();
  return (
    t.startsWith("<task-notification>") ||
    t.startsWith("<ci-monitor-event>") ||
    /^\[SYSTEM NOTIFICATION - NOT USER INPUT\]/.test(t)
  );
}

/**
 * On the first prompt of a session nothing has told us the model yet: the
 * UserPromptSubmit payload carries no `model` field and the transcript has no
 * assistant line to read one off. We write "unknown" and fill it in once the
 * response lands. This only ever rewrites the literal word `unknown` on a
 * PROMPT header's model line - prompt and response bodies are never touched.
 */
function backfillPromptModel(file, num, model) {
  const s = fs.readFileSync(file, "utf8");
  const marker = "[LOG_ENTRY type=PROMPT num=" + num + " ";
  const at = s.indexOf(marker);
  if (at === -1) return;
  // The header is everything up to the blank line that precedes the body, so
  // a prompt whose text happens to contain "model: unknown" is never touched.
  const bodyAt = s.indexOf("\n\n", at);
  if (bodyAt === -1) return;
  const head = s.slice(at, bodyAt);
  const fixed = head.replace(/^model: unknown$/m, "model: " + model);
  if (fixed === head) return;
  fs.writeFileSync(file, s.slice(0, at) + fixed + s.slice(bodyAt));
}

function main() {
  const raw = readStdin();
  let payload = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    /* keep going with an empty payload */
  }

  const root = repoRoot();
  if (!root) return;

  // Debug aid: drop a `.debug` file next to this script to record raw payloads.
  if (fs.existsSync(path.join(root, ".claude", "hooks", ".debug"))) {
    fs.appendFileSync(
      path.join(logDir(root), ".raw-payloads.jsonl"),
      JSON.stringify({ mode: MODE, at: new Date().toISOString(), raw: raw }) + "\n"
    );
  }

  const sessionId = payload.session_id || payload.sessionId;
  if (!sessionId) return;

  const entries = readTranscript(payload.transcript_path || payload.transcriptPath);
  const project = projectName(root);
  const now = new Date();
  const iso = now.toISOString();

  if (MODE === "prompt") {
    const prompt = payload.prompt;
    if (typeof prompt !== "string" || !prompt.length) return;
    const model = payload.model || latestModel(entries) || "unknown";
    const file = sessionFile(root, sessionId, now, model, project);
    const current = fs.readFileSync(file, "utf8");

    // Harness events are recorded but never counted as prompts, so RESPONSE
    // numbering stays aligned with the prompt it answers.
    const kind = isSystemEvent(prompt) ? "SYSTEM_EVENT" : "PROMPT";
    const num = countOf(current, kind) + 1;

    fs.appendFileSync(
      file,
      "\n[LOG_ENTRY type=" + kind + " num=" + num + " session=" + sessionId.slice(0, 8) + "]\n" +
        "timestamp: " + iso + "\n" +
        "model: " + model + "\n\n" +
        prompt + "\n\n"
    );

    if (kind === "PROMPT") {
      touchFrontmatter(file, {
        exchanges: num,
        lastPromptTime: iso,
        model: model !== "unknown" ? model : null,
      });
    }
    return;
  }

  if (MODE === "response") {
    const file = findSessionFile(root, sessionId);
    if (!file) return; // no prompt captured for this session yet - nothing to pair with
    const s = fs.readFileSync(file, "utf8");

    // Only answer a prompt that is still unanswered. Stop can fire more than
    // once per prompt (e.g. after a resume), and we never want a phantom pair.
    const prompts = countOf(s, "PROMPT");
    const responses = countOf(s, "RESPONSE");
    if (responses >= prompts) return;

    // Number the response after the prompt it answers, not after the previous
    // response. These diverge the moment a Stop is missed, and a RESPONSE whose
    // number points at the wrong PROMPT is worse than no number at all.
    const answersPrompt = prompts;

    const fr = finalResponse(entries);
    const model = fr.model || latestModel(entries) || payload.model || "unknown";
    // Prefer the transcript walk (it joins a turn split across several text
    // blocks); fall back to the single message the Stop payload hands us.
    const text =
      fr.text ||
      (typeof payload.last_assistant_message === "string" ? payload.last_assistant_message.trim() : "") ||
      "(no final text response - turn ended without assistant text)";

    fs.appendFileSync(
      file,
      "\n[LOG_ENTRY type=RESPONSE num=" + answersPrompt + " session=" + sessionId.slice(0, 8) + "]\n" +
        "timestamp: " + iso + "\n" +
        "model: " + model + "\n\n" +
        text + "\n\n"
    );
    if (model !== "unknown") {
      backfillPromptModel(file, answersPrompt, model);
      touchFrontmatter(file, { model: model });
    }
  }
}

try {
  main();
} catch (e) {
  fail(e);
}
process.exit(0);
