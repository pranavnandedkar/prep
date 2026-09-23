const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const aliases = {
  cdc: ['change data capture'],
  'change data capture': ['cdc'],
  dlq: ['dead letter queue'],
  'dead letter queue': ['dlq'],
  pubsub: ['pub sub'],
  'pub sub': ['pubsub'],
  'vpc sc': ['vpc service controls'],
  'vpc service controls': ['vpc sc'],
};

function excerptAround(text, query) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 170) return clean;
  const lower = clean.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const first = words.map((word) => lower.indexOf(word)).filter((position) => position >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, first - 48);
  const end = Math.min(clean.length, Math.max(start + 170, first + 115));
  return `${start ? '…' : ''}${clean.slice(start, end).trim()}${end < clean.length ? '…' : ''}`;
}

export function makeSearchIndex(sections, topics) {
  return [
    ...topics.map((topic) => {
      const section = sections.find((item) => item.id === topic.section);
      return { ...topic, kind: 'topic', sectionId: section.id, subtitle: section.title, color: section.color, icon: section.icon, href: `#/topic/${topic.id}`, searchText: [topic.title, topic.description, section.title, ...(topic.keywords || []), ...(topic.blocks || []).flatMap((block) => [block.heading, block.text || '', ...(block.bullets || [])])].join(' ') };
    }),
    ...sections.map((section) => ({ ...section, kind: 'section', sectionId: section.id, subtitle: 'Section', href: `#/section/${section.id}`, searchText: `${section.title} ${section.description}` })),
  ];
}

export function searchEntries(index, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const variants = [normalizedQuery, ...(aliases[normalizedQuery] || [])];
  return index.map((entry) => {
    const title = normalize(entry.title);
    const searchText = normalize(entry.searchText);
    const tokens = new Set(searchText.split(' '));
    let best = null;
    for (const variant of variants) {
      const words = variant.split(' ');
      if (!words.every((word) => searchText.includes(word))) continue;
      const phraseInText = words.length > 1 && searchText.includes(variant);
      const score = (title === variant ? 100 : title.startsWith(variant) ? 80 : title.includes(variant) ? 60 : words.every((word) => title.includes(word)) ? 40 : phraseInText ? 30 : words.every((word) => tokens.has(word)) ? 20 : 10) - (variant === normalizedQuery ? 0 : 5);
      if (!best || score > best.score) best = { entry, score, matchedQuery: variant };
    }
    return best;
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).map(({ entry, matchedQuery }) => ({ ...entry, matchedQuery, excerpt: excerptAround(entry.snippet || entry.description || '', matchedQuery) }));
}
