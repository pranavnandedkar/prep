const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function makeSearchIndex(sections, topics) {
  return [
    ...topics.map((topic) => {
      const section = sections.find((item) => item.id === topic.section);
      return { ...topic, kind: 'topic', subtitle: section.title, color: section.color, icon: section.icon, href: `#/topic/${topic.id}`, searchText: [topic.title, topic.description, section.title, ...(topic.keywords || []), ...(topic.blocks || []).flatMap((block) => [block.heading, block.text || '', ...(block.bullets || [])])].join(' ') };
    }),
    ...sections.map((section) => ({ ...section, kind: 'section', subtitle: 'Section', href: `#/section/${section.id}`, searchText: `${section.title} ${section.description}` })),
  ];
}

export function searchEntries(index, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const words = normalizedQuery.split(' ');
  return index.map((entry) => {
    const title = normalize(entry.title);
    const searchText = normalize(entry.searchText);
    if (!words.every((word) => searchText.includes(word))) return null;
    const tokens = new Set(searchText.split(' '));
    const score = title === normalizedQuery ? 100 : title.startsWith(normalizedQuery) ? 80 : title.includes(normalizedQuery) ? 60 : words.every((word) => title.includes(word)) ? 40 : words.every((word) => tokens.has(word)) ? 20 : 10;
    return { entry, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).map(({ entry }) => entry);
}
