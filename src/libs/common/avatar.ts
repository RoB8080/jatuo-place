// Utility to derive AvatarFallback text from a username in a Unicode-aware way
// Keep it simple for now; split later if needed.

export type AvatarFallbackOptions = {
  maxLength?: number; // max graphemes to display in fallback (default 1)
};

// Basic grapheme segmentation using Intl.Segmenter when available; fallback to naive
function segmentGraphemes(input: string): string[] {
  const str = input?.trim() ?? "";
  if (!str) return [];
  try {
    // Use generic grapheme segmentation; most modern browsers support this.
    // Node 18+ supports Intl.Segmenter too.
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(str)).map((s) => s.segment);
  } catch {
    // Naive split as a safe fallback
    return Array.from(str);
  }
}

function isAsciiLetter(ch: string): boolean {
  return /^[A-Za-z]$/.test(ch);
}

function isCJK(ch: string): boolean {
  // Rough ranges for CJK Unified Ideographs and Hangul/Kana
  return /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uAC00-\uD7AF]/.test(
    ch,
  );
}

function normalizeUsername(username?: string): string {
  const raw = (username ?? "").trim();
  if (!raw) return "";
  // If it's an email, use the local part
  const at = raw.indexOf("@");
  if (at > 0) return raw.slice(0, at);
  return raw;
}

// Exported main helper
export function getAvatarFallback(
  username?: string,
  options: AvatarFallbackOptions = {},
): string {
  const { maxLength = 1 } = options;
  const name = normalizeUsername(username);
  if (!name) return "?";

  const graphemes = segmentGraphemes(name);
  if (graphemes.length === 0) return "?";

  // Strategy:
  // - If starts with ASCII letter and contains spaces, take initials from first two words
  // - If starts with ASCII letter and single word, take first 1–2 letters
  // - If CJK, take the first character
  // - Otherwise, take the first grapheme

  const first = graphemes[0];

  // Detect multi-word names (Latin) to build two-letter initials
  const words = name.split(/\s+/).filter(Boolean);
  const isLatin = isAsciiLetter(first);

  if (isLatin) {
    if (words.length >= 2) {
      const w1 = segmentGraphemes(words[0]).find(isAsciiLetter) ?? words[0][0];
      const w2 = segmentGraphemes(words[1]).find(isAsciiLetter) ?? words[1][0];
      return (w1 + w2)
        .toUpperCase()
        .slice(0, Math.max(1, Math.min(2, maxLength)));
    }
    // Single word latin name: take up to maxLength letters
    const letters = graphemes
      .filter(isAsciiLetter)
      .slice(0, Math.max(1, Math.min(2, maxLength)));
    if (letters.length > 0) return letters.join("").toUpperCase();
    return first.toUpperCase();
  }

  // CJK: prefer first character
  if (isCJK(first)) {
    return first;
  }

  // Fallback: first grapheme
  return first;
}
