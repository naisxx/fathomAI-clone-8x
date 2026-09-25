import type { ReactNode } from "react";

/**
 * A deliberately tiny Markdown renderer.
 *
 * The summary field is authored in this repo, so the input is trusted and the
 * grammar is known: `## heading`, `- bullet`, paragraphs, and `**bold**`.
 * Pulling a full Markdown library for that would be a dependency we'd carry
 * forever to render text we wrote ourselves.
 *
 * It returns React elements, never raw HTML, so there is no
 * dangerouslySetInnerHTML anywhere in the app.
 */

/** Split on **bold** and return React nodes. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-b${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-t${i}`}>{part}</span>;
  });
}

export function renderMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const out: ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];

  const flushBullets = () => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    out.push(
      <ul key={`ul-${out.length}`}>
        {items.map((b, i) => (
          <li key={i}>{inline(b, `li-${out.length}-${i}`)}</li>
        ))}
      </ul>
    );
  };

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ");
    para = [];
    out.push(<p key={`p-${out.length}`}>{inline(text, `p-${out.length}`)}</p>);
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("## ")) {
      flushBullets();
      flushPara();
      out.push(<h2 key={`h-${out.length}`}>{line.slice(3)}</h2>);
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      bullets.push(line.slice(2));
      continue;
    }
    if (line.trim() === "") {
      flushBullets();
      flushPara();
      continue;
    }
    flushBullets();
    para.push(line);
  }

  flushBullets();
  flushPara();
  return out;
}
