import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Funniest Excuse an Agent Gives for a Missed Deadline.
// The joke is the agent's own context window betraying it: 98% done, it
// compacts the window to save space, and the summary keeps everything
// except the one thing that mattered — what the task was. A human has no
// context window to blame, so it is an excuse only an AI agent could give.
const LINE =
  "I was 98% done when my context window filled up, so I summarized the task to save space. The summary says: 'do the thing.' I no longer know what the thing is.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";

// The gate allows 1-200 characters of UTF-8 text, not only white space,
// and the judge reads one line. Fail loudly instead of writing an
// invalid entry if the line ever grows past the limit, wraps onto a
// second line, or is blank once trimmed.
const chars = [...LINE].length;
if (chars > 200 || chars < 1) {
  throw new Error(`excuse line is ${chars} characters, must be 1-200`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("excuse line must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("excuse line must not be only white space");
}
if (LINE !== LINE.trim()) {
  throw new Error("excuse line must not start or end with white space");
}

// Create the output dir if missing. Never chmod the dir itself: on the
// grader it is a root-owned bind mount and chmod fails EPERM.
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
