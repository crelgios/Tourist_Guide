function cleanText(value) {
  return String(value || "").trim();
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isHeading(line) {
  return /^(#{1,6})\s+/.test(line.trim());
}

function listMatch(line) {
  const trimmed = line.trim();
  const bullet = trimmed.match(/^[-*]\s+(.+)$/);
  if (bullet) return { type: "ul", text: bullet[1] };

  const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
  if (ordered) return { type: "ol", text: ordered[1] };

  return null;
}

function labelMatch(line) {
  const trimmed = line.trim();
  if (trimmed.length > 85) return null;
  if (/^(#{1,6})\s+/.test(trimmed)) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9\s/&()'-]+:$/.test(trimmed)) return null;
  return trimmed.replace(/:$/, "");
}

function looksLikeSentence(line) {
  return /[.!?]$/.test(line.trim());
}

function getNextNonEmptyLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line) {
      return { line, index };
    }
  }
  return null;
}

function isPlainSectionHeading(line, nextLine) {
  const trimmed = cleanText(line);
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (!nextLine) return false;
  if (trimmed.length < 4 || trimmed.length > 90) return false;
  if (words.length > 13) return false;
  if (looksLikeSentence(trimmed)) return false;
  if (/https?:\/\//i.test(trimmed)) return false;
  if (isHeading(trimmed) || listMatch(trimmed) || labelMatch(trimmed)) return false;
  if (/[,;]/.test(trimmed)) return false;

  return /^[A-Z0-9]/.test(trimmed);
}

function parseContent(content) {
  const lines = String(content || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let autoNumber = 1;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = cleanText(heading[2]);
      if (!(level === 1 && blocks.length === 0)) {
        blocks.push({ type: "heading", level: Math.min(level, 4), text });
      }
      i += 1;
      continue;
    }

    const nextNonEmpty = getNextNonEmptyLine(lines, i + 1);
    if (isPlainSectionHeading(line, nextNonEmpty?.line)) {
      blocks.push({ type: "heading", level: blocks.length === 0 ? 2 : 3, text: line });
      i += 1;
      continue;
    }

    const list = listMatch(line);
    if (list) {
      const nextLineIsImmediatelyList = Boolean(lines[i + 1] && listMatch(lines[i + 1]));
      const looksLikeAppHeading =
        list.type === "ol" &&
        !nextLineIsImmediatelyList &&
        list.text.length <= 70 &&
        nextNonEmpty?.index !== i + 1;

      if (looksLikeAppHeading) {
        blocks.push({ type: "appHeading", number: autoNumber, text: list.text });
        autoNumber += 1;
        i += 1;
        continue;
      }

      const items = [];
      const listType = list.type;
      while (i < lines.length) {
        const current = listMatch(lines[i]);
        if (!current || current.type !== listType) break;
        items.push(current.text);
        i += 1;
      }
      blocks.push({ type: listType, items });
      continue;
    }

    const label = labelMatch(line);
    if (label && i + 1 < lines.length && lines[i + 1].trim() && !isHeading(lines[i + 1])) {
      const items = [];
      i += 1;
      while (i < lines.length) {
        const next = lines[i].trim();
        const upcoming = getNextNonEmptyLine(lines, i + 1);
        if (!next || isHeading(next) || listMatch(next) || labelMatch(next) || isPlainSectionHeading(next, upcoming?.line)) break;
        items.push(next);
        i += 1;
      }

      if (items.length) {
        blocks.push({
          type: "callout",
          label,
          items,
          compactList: items.length > 1 && items.every((item) => !looksLikeSentence(item))
        });
        continue;
      }
    }

    const paragraphLines = [line];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      const upcoming = getNextNonEmptyLine(lines, i + 1);
      if (!next || isHeading(next) || listMatch(next) || labelMatch(next) || isPlainSectionHeading(next, upcoming?.line)) break;
      paragraphLines.push(next);
      i += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function getHeadingId(text, usedIds) {
  const base = slugify(text) || "section";
  const nextCount = (usedIds.get(base) || 0) + 1;
  usedIds.set(base, nextCount);
  return nextCount === 1 ? base : `${base}-${nextCount}`;
}

function InlineText({ text }) {
  const parts = String(text || "").split(/(https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-900"
        >
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function BlogArticleContent({ content }) {
  const blocks = parseContent(content);
  const headingIds = new Map();
  const renderedBlocks = blocks.map((block) => {
    if (block.type === "heading") {
      return { ...block, id: getHeadingId(block.text, headingIds) };
    }
    return block;
  });
  const tableOfContents = renderedBlocks.filter((block) => block.type === "heading" && block.level <= 3);

  return (
    <div className="mt-10">
      {tableOfContents.length >= 2 ? (
        <nav className="mb-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5 shadow-sm sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
            In this guide
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tableOfContents.slice(0, 12).map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-800 hover:shadow-md"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="space-y-7 text-slate-700">
          {renderedBlocks.map((block, index) => {
            if (block.type === "heading") {
              const levelClass = block.level <= 2
                ? "mt-6 border-b border-slate-200 pb-4 text-3xl font-extrabold tracking-tight text-slate-950 first:mt-0"
                : "mt-10 text-2xl font-extrabold tracking-tight text-slate-950";

              const HeadingTag = block.level <= 2 ? "h2" : "h3";
              return (
                <HeadingTag key={`${block.id}-${index}`} id={block.id} className={`scroll-mt-24 ${levelClass}`}>
                  {block.text}
                </HeadingTag>
              );
            }

            if (block.type === "appHeading") {
              return (
                <div key={`app-heading-${index}`} className="mt-10 flex items-center gap-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-base font-extrabold text-white shadow-sm">
                    {block.number}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">
                    {block.text}
                  </h3>
                </div>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p key={`p-${index}`} className="text-lg leading-9 text-slate-700">
                  <InlineText text={block.text} />
                </p>
              );
            }

            if (block.type === "ul" || block.type === "ol") {
              const ListTag = block.type;
              return (
                <ListTag
                  key={`list-${index}`}
                  className={`grid gap-3 text-lg leading-8 text-slate-700 ${block.type === "ul" ? "" : "list-none"}`}
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${block.type === "ul" ? "bg-emerald-600" : "bg-blue-600"}`}>
                        {block.type === "ul" ? "✓" : itemIndex + 1}
                      </span>
                      <span>
                        <InlineText text={item} />
                      </span>
                    </li>
                  ))}
                </ListTag>
              );
            }

            if (block.type === "callout") {
              const isTip = /tip|important|safety|recommendation|note|warning/i.test(block.label);
              return (
                <div
                  key={`callout-${index}`}
                  className={`rounded-3xl border p-5 shadow-sm ${isTip ? "border-amber-200 bg-amber-50" : "border-emerald-100 bg-emerald-50/70"}`}
                >
                  <p className={`text-sm font-extrabold uppercase tracking-[0.2em] ${isTip ? "text-amber-700" : "text-emerald-700"}`}>
                    {block.label}
                  </p>

                  {block.compactList ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {block.items.map((item, itemIndex) => (
                        <span
                          key={`${item}-${itemIndex}`}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3 text-lg leading-8 text-slate-700">
                      {block.items.map((item, itemIndex) => (
                        <p key={`${item}-${itemIndex}`}>
                          <InlineText text={item} />
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </article>
    </div>
  );
}
