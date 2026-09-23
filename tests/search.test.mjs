import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSearchIndex, searchEntries } from '../dist/search.js';
import { sections, topics } from '../dist/content.js';
import { rateLimiterCodeExamples } from '../dist/rate-limiter-code.js';
import { highlightJava } from '../dist/java-highlight.js';
import { codingPatternCodeExamples } from '../dist/coding-pattern-code.js';
import { streamingStaffSections } from '../dist/streaming-staff-plus-content.js';
import { gcpPlaybookSections } from '../dist/gcp-playbook-content.js';
import { staffScenarioSections } from '../dist/staff-scenarios-content.js';

const index = makeSearchIndex(sections, topics);
test('exact topic names are the first result for Enter', () => {
  for (const topic of topics) assert.equal(searchEntries(index, topic.title)[0].id, topic.id);
});
test('partial names, aliases, punctuation, and case match', () => {
  for (const query of ['RATE LIM', 'rate-limiter', 'throttling']) assert.equal(searchEntries(index, query)[0].id, 'rate-limiter');
  for (const query of ['lua', 'distributed', 'retry-after']) assert.equal(searchEntries(index, query)[0].id, 'rate-limiter');
  assert.equal(searchEntries(index, 'booking')[0].id, 'reservation-system');
  assert.equal(searchEntries(index, 'leader board')[0].id, 'leaderboard');
});
test('empty and unmatched queries return no results', () => {
  for (const query of ['', '   ', '!!!', 'unmatched-topic-123']) assert.deepEqual(searchEntries(index, query), []);
});
test('the same index includes all three sections and new topic content', () => {
  const expanded = makeSearchIndex(sections, [...topics,
    { id: 'two-sum', section: 'coding', title: 'Two sum', keywords: ['hash map'], blocks: [] },
    { id: 'conflict', section: 'behavioral', title: 'Resolving conflict', blocks: [{ heading: 'Result', bullets: ['Aligned stakeholders'] }] },
  ]);
  assert.equal(searchEntries(expanded, 'hash map')[0].id, 'two-sum');
  assert.equal(searchEntries(expanded, 'stakeholders')[0].id, 'conflict');
  assert.equal(searchEntries(expanded, 'leadership')[0].id, 'behavioral');
  assert.equal(searchEntries(expanded, 'coding')[0].id, 'coding');
});
test('every topic has a unique, valid route and existing section', () => {
  assert.equal(new Set(topics.map((topic) => topic.id)).size, topics.length);
  for (const topic of topics) {
    assert.match(topic.id, /^[a-z0-9-]+$/);
    assert.ok(sections.some((section) => section.id === topic.section));
    assert.ok(Array.isArray(topic.blocks));
  }
});
test('every rate limiter algorithm has a complete code example', () => {
  assert.deepEqual(Object.keys(rateLimiterCodeExamples), [
    'fixed-window', 'sliding-log', 'sliding-counter', 'token-bucket', 'leaky-bucket',
  ]);
  for (const example of Object.values(rateLimiterCodeExamples)) {
    assert.match(example.code, /public final class/);
    assert.match(example.code, /boolean allow\(String key\)/);
    assert.ok(example.note.length > 40);
  }
});
test('Java syntax highlighting escapes input and classifies useful tokens', () => {
  const highlighted = highlightJava('public String value = "<unsafe>"; // note\nlong count = 42L;');
  assert.match(highlighted, /tok-keyword">public/);
  assert.match(highlighted, /tok-type">String/);
  assert.match(highlighted, /&lt;unsafe&gt;/);
  assert.match(highlighted, /tok-comment">\/\/ note/);
  assert.match(highlighted, /tok-number">42L/);
  assert.doesNotMatch(highlighted, /<unsafe>/);
});
test('new sections, Kafka, and coding patterns are globally searchable', () => {
  assert.equal(searchEntries(index, 'kafka')[0].id, 'kafka-architect');
  assert.equal(searchEntries(index, 'noisy neighbor')[0].id, 'kafka-architect');
  assert.equal(searchEntries(index, 'sliding window')[0].id, 'coding-patterns');
  assert.equal(searchEntries(index, 'AI ML')[0].id, 'ai-ml');
  assert.equal(Object.keys(codingPatternCodeExamples).length, 10);
  assert.equal(searchEntries(index, 'watermarks')[0].id, 'streaming-staff-plus');
  assert.equal(searchEntries(index, 'deep scenarios')[0].id, 'streaming-staff-plus');
  assert.equal(searchEntries(index, 'BigQuery')[0].id, 'gcp-data-engineering');
  assert.equal(searchEntries(index, 'Beam Dataflow')[0].id, 'gcp-data-engineering');
  assert.equal(searchEntries(index, 'standards without authority')[0].id, 'staff-architect-scenarios');
  assert.equal(searchEntries(index, 'principal conflict')[0].id, 'staff-architect-scenarios');
});
test('the complete Staff+ scenario workbook is stored locally', () => {
  assert.equal(staffScenarioSections.length, 18);
  assert.equal(staffScenarioSections[0].id, 'method');
  assert.equal(staffScenarioSections.at(-1).id, 'rapid');
  assert.ok(staffScenarioSections.every((section) => section.id && section.title && section.html.length > 500));
});
test('the complete GCP interview playbook is stored locally', () => {
  assert.equal(gcpPlaybookSections.length, 17);
  assert.equal(gcpPlaybookSections[0].title, 'Focus first');
  assert.equal(gcpPlaybookSections.at(-1).title, 'Readiness check');
  assert.ok(gcpPlaybookSections.every((section) => section.id && section.html.length > 500));
});
test('the complete Streaming Staff+ guide is stored locally', () => {
  assert.equal(streamingStaffSections.length, 11);
  assert.equal(streamingStaffSections.reduce((count, section) => count + section.items.length, 0), 120);
  assert.equal(streamingStaffSections[0].items[0].number, 1);
  assert.equal(streamingStaffSections.at(-1).items.at(-1).number, 120);
  for (const section of streamingStaffSections) {
    assert.ok(section.name);
    for (const item of section.items) {
      assert.ok(item.question);
      assert.equal(item.answers.length, 4);
    }
  }
});
