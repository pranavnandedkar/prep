import { sections, topics } from './content.js?v=2026-09-23-casebook';
import { makeSearchIndex, searchEntries } from './search.js?v=2026-09-23-deep-search';
import { rateLimiterCodeExamples } from './rate-limiter-code.js';
import { highlightJava } from './java-highlight.js';
import { codingPatternCodeExamples } from './coding-pattern-code.js';
import { fullKafkaArchitectContent } from './kafka-content.js';
import { streamingStaffSections } from './streaming-staff-plus-content.js';
import { gcpPlaybookSections } from './gcp-playbook-content.js';
import { staffScenarioSections } from './staff-scenarios-content.js';
import { gcpSystemDesignCases } from './gcp-system-design-cases-content.js';

const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paths = {
  system: '<rect x="8" y="3" width="8" height="5" rx="1"/><rect x="2" y="16" width="7" height="5" rx="1"/><rect x="15" y="16" width="7" height="5" rx="1"/><path d="M12 8v4M5.5 16v-4h13v4"/>',
  code: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',
  stream: '<path d="M3 7h5l3 5 3-5h7M3 17h5l3-5 3 5h7"/><circle cx="3" cy="7" r="1"/><circle cx="21" cy="17" r="1"/>',
  ai: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  note: '<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v15"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>',
};
const icon = (name, className = '') => `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.note}</svg>`;
const sectionIcon = (section, small = false) => `<span class="section-icon ${section.color} ${small ? 'small' : ''}">${icon(section.icon)}</span>`;
const sectionTopics = (id) => topics.filter((topic) => topic.section === id);
const countLabel = (count) => `${count} ${count === 1 ? 'topic' : 'topics'}`;
const badge = (topic) => topic.blocks.length ? '<span class="outline-badge">Notes</span>' : `<span class="outline-badge">${icon('note')} Outline</span>`;
const searchIndex = makeSearchIndex(sections, topics);
const preparedTopicPages = new Map();
let activeResults = [];
let activeIndex = 0;
let activeSectionFilter = 'all';
let codeSheetTrigger = null;

$('search-icon').innerHTML = icon('search');
$('menu-toggle').innerHTML = icon('menu');

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('theme-toggle').innerHTML = icon(dark ? 'sun' : 'moon');
  $('theme-toggle').setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
  $('theme-toggle').title = dark ? 'Use light theme' : 'Use dark theme';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#07101d' : '#17242b';
}

function setTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem('prep-theme', theme);
  updateThemeButton();
}

updateThemeButton();
$('theme-toggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  $('main').focus();
});
$('workspace-count').textContent = `${countLabel(topics.length)} · ${sections.length} sections`;
if (!/Mac|iPhone|iPad/.test(navigator.platform)) $('search-shortcut').textContent = 'Ctrl K';

function renderNavigation(sectionId, topicId, isHome) {
  $('navigation').innerHTML = `<a class="nav-item ${isHome ? 'active' : ''}" href="#/" ${isHome ? 'aria-current="page"' : ''}>${icon('grid')} All topics <span class="nav-count">${topics.length}</span></a><div class="nav-label">YOUR SECTIONS</div>${sections.map((section) => {
    const items = sectionTopics(section.id);
    return `<a class="nav-item ${sectionId === section.id && !topicId ? 'active' : ''}" href="#/section/${section.id}" ${sectionId === section.id && !topicId ? 'aria-current="page"' : ''}>${icon(section.icon)}<span class="nav-section-label">${section.shortTitle}</span><span class="nav-count">${items.length}</span></a><div class="nav-topics">${items.length ? items.map((topic) => `<a class="nav-topic ${topic.id === topicId ? 'active' : ''}" href="#/topic/${topic.id}" ${topic.id === topicId ? 'aria-current="page"' : ''}>${escapeHTML(topic.title)}</a>`).join('') : '<span class="nav-empty">No topics yet</span>'}</div>`;
  }).join('')}`;
}

function breadcrumb(section, topic) {
  return `<div class="breadcrumb"><a href="#/">Workspace</a>${icon('chevron')}${section ? `<a href="#/section/${section.id}" ${!topic ? 'class="current"' : ''}>${escapeHTML(section.title)}</a>${topic ? `${icon('chevron')}<span class="current">${escapeHTML(topic.title)}</span>` : ''}` : '<span class="current">All topics</span>'}</div>`;
}

function directory(items) {
  return `<div class="directory"><div class="directory-columns" aria-hidden="true"><span>TOPIC</span><span class="topic-section">SECTION</span><span>CONTENT</span><span></span></div>${items.map((topic) => {
    const section = sections.find((item) => item.id === topic.section);
    return `<a class="topic-row" href="#/topic/${topic.id}"><span><span class="topic-name">${escapeHTML(topic.title)}</span><span class="topic-description">${escapeHTML(topic.description)}</span></span><span class="topic-section">${escapeHTML(section.shortTitle)}</span>${badge(topic)}${icon('arrow', 'topic-arrow')}</a>`;
  }).join('')}</div>`;
}

function homePage() {
  return `${breadcrumb()}<div class="heading-row"><div><p class="eyebrow">THE LIBRARY</p><h1>Interview prep, organized.</h1><p class="intro">A quick path from a topic to the essentials.</p></div><span class="library-count">${icon('book')} ${countLabel(topics.length)}</span></div><div class="section-grid">${sections.map((section, index) => `<a class="section-card" href="#/section/${section.id}"><div class="card-top">${sectionIcon(section)}<span class="card-index">0${index + 1}</span></div><h2>${escapeHTML(section.title)}</h2><p>${escapeHTML(section.description)}</p><div class="card-bottom"><span>${countLabel(sectionTopics(section.id).length)}</span>${icon('arrow')}</div></a>`).join('')}</div><div class="directory-heading"><h2>All topics</h2></div>${directory(topics)}<div class="library-note">${icon('note')}<span>Outline pages are ready for your revision notes.</span></div>`;
}

function sectionPage(section) {
  const items = sectionTopics(section.id);
  return `${breadcrumb(section)}<div class="section-summary">${sectionIcon(section)}<div class="heading-row"><div><p class="eyebrow">YOUR SECTIONS / 0${sections.indexOf(section) + 1}</p><h1>${escapeHTML(section.title)}</h1><p class="intro">${escapeHTML(section.description)}</p></div><span class="library-count">${countLabel(items.length)}</span></div></div>${items.length ? directory(items) : `<div class="empty-state">${sectionIcon(section)}<h2>${section.id === 'behavioral' ? 'Make room for your stories.' : 'Ready for your first topic.'}</h2><p>${section.id === 'behavioral' ? 'Your behavioral and leadership notes will live here.' : `Your ${escapeHTML(section.title)} revision notes will live here.`}</p><a class="text-link" href="#/">View all topics ${icon('arrow')}</a></div>`}`;
}

function annotateTopicContent(topic, section, html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const entries = [];
  let heading = '';
  let subheading = '';
  let question = '';
  let count = 0;
  for (const element of template.content.querySelectorAll('h2, h3, h4, p, li, summary, td, th, .question, .callout, .probe, .redflag')) {
    if (element.closest('nav, [role="img"], .streaming-guide-tools, .source-note')) continue;
    const text = element.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 5) continue;
    if (element.matches('h2')) { heading = text; subheading = ''; question = ''; }
    if (element.matches('h3, h4')) { subheading = text; question = ''; }
    if (element.matches('summary')) question = text.replace(/^\d+\s*/, '');
    // Search anchors are generated in document order and inserted into the cached page HTML.
    const anchor = element.id || `find-${topic.id}-${++count}`;
    if (!element.id) element.id = anchor;
    const title = element.matches('h2, h3, h4, summary') ? (question || text) : (question || subheading || heading || topic.title);
    const context = [section.title, topic.title, heading !== title ? heading : ''].filter(Boolean).join(' › ');
    entries.push({ id: `${topic.id}:${anchor}`, kind: 'content', sectionId: section.id, title, subtitle: context, snippet: text, searchText: text, href: `#/topic/${topic.id}/${anchor}`, color: section.color, icon: section.icon });
  }
  return { html: template.innerHTML, entries };
}

function topicPage(topic, section) {
  if (preparedTopicPages.has(topic.id)) return preparedTopicPages.get(topic.id).html;
  const siblings = sectionTopics(section.id);
  const index = siblings.findIndex((item) => item.id === topic.id);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  const content = topic.id === 'rate-limiter' ? rateLimiterContent() : topic.id === 'kafka-architect' ? fullKafkaArchitectContent() : topic.id === 'streaming-staff-plus' ? streamingStaffGuideContent() : topic.id === 'gcp-data-engineering' ? gcpPlaybookContent() : topic.id === 'staff-architect-scenarios' ? staffScenariosContent() : topic.id === 'gcp-system-design-cases' ? gcpSystemDesignCasesContent() : topic.id === 'coding-patterns' ? codingPatternsContent() : topic.blocks.length ? topic.blocks.map((block) => `<section class="content-block"><h2>${escapeHTML(block.heading)}</h2>${block.text ? `<p>${escapeHTML(block.text)}</p>` : ''}${block.bullets?.length ? `<ul>${block.bullets.map((bullet) => `<li>${escapeHTML(bullet)}</li>`).join('')}</ul>` : ''}</section>`).join('') : `<section class="placeholder-page"><div class="placeholder-label">${icon('note')} TOPIC OUTLINE</div><h2>Ready for the essentials.</h2><p>The page is in place. Your revision notes and section structure will go here.</p><div aria-hidden="true"><div class="placeholder-line"></div><div class="placeholder-line"></div></div></section>`;
  const prepared = annotateTopicContent(topic, section, content);
  const html = `${breadcrumb(section, topic)}<div class="topic-header"><p class="eyebrow">${escapeHTML(section.title.toUpperCase())}</p><div class="heading-row"><h1>${escapeHTML(topic.title)}</h1>${badge(topic)}</div><p class="intro">${escapeHTML(topic.description)}</p></div><div class="topic-body">${prepared.html}</div><nav class="topic-pagination" aria-label="Adjacent topics">${previous ? `<a href="#/topic/${previous.id}"><span>Previous topic</span>← ${escapeHTML(previous.title)}</a>` : `<a href="#/section/${section.id}"><span>Back to section</span>← ${escapeHTML(section.title)}</a>`}${next ? `<a class="next" href="#/topic/${next.id}"><span>Next topic</span>${escapeHTML(next.title)} →</a>` : ''}</nav>`;
  preparedTopicPages.set(topic.id, { html, entries: prepared.entries });
  return html;
}

function distributedDiagram() {
  return `<figure class="system-diagram architecture-diagram" aria-labelledby="distributed-diagram-title">
    <figcaption><strong id="distributed-diagram-title">Distributed limiter: hot path + control plane</strong><span>Keep policy local; make quota spend atomic.</span></figcaption>
    <div class="control-plane" role="img" aria-label="A policy store publishes versioned rules to a local cache in the gateway.">
      <span class="plane-label">CONTROL PLANE</span><div class="diagram-card"><b>Policy store</b><small>limits · identity · mode</small></div><span class="flow-arrow">→</span><div class="diagram-card"><b>Config stream</b><small>versioned + audited</small></div><span class="flow-arrow">→</span><div class="diagram-card accent"><b>Gateway cache</b><small>no config read on hot path</small></div>
    </div>
    <div class="data-plane" role="img" aria-label="A client request reaches a gateway limiter. The limiter executes one atomic Lua operation on the Redis shard selected from identity and rule. Allowed requests reach the API; denied requests return 429.">
      <span class="plane-label">DATA PLANE</span>
      <div class="request-flow"><div class="diagram-card"><b>Client</b><small>tenant · user · IP</small></div><span class="flow-arrow">→</span><div class="diagram-card gateway"><b>Gateway limiter</b><small>match all rules · strictest wins</small></div><div class="decision-stack"><span class="allow">ALLOW → API</span><span class="deny">DENY → 429</span></div></div>
      <div class="redis-link"><span>hash(identity + rule)</span><i>↓ atomic Lua · one RTT</i></div>
      <div class="redis-cluster"><div class="cluster-title"><b>Redis Cluster</b><span>authoritative bucket state</span></div><div class="shards"><span><b>Shard 0</b><small>primary + replica</small></span><span><b>Shard 1</b><small>primary + replica</small></span><span><b>Shard N</b><small>primary + replica</small></span></div></div>
    </div>
    <p class="diagram-note"><strong>Invariant:</strong> every request for the same identity and rule reaches the same shard. A local 100 req/s counter on 100 pods could otherwise admit 10,000 req/s.</p>
  </figure>`;
}

function regionDiagram() {
  return `<figure class="system-diagram region-diagram" aria-labelledby="region-diagram-title">
    <figcaption><strong id="region-diagram-title">Multi-region: choose the contract</strong><span>There is no free global counter.</span></figcaption>
    <div class="region-options">
      <article><div class="option-heading"><span>A</span><div><b>Regional budgets</b><small>US 60% · EU 40%</small></div></div><div class="mini-flow"><span>US → local Redis</span><span>EU → local Redis</span></div><p><strong>Wins:</strong> low latency, partition survival.</p><p><strong>Pays:</strong> stranded quota and bounded imbalance.</p><em>Choose when availability matters more than an exact global cap.</em></article>
      <article><div class="option-heading"><span>B</span><div><b>Global coordination</b><small>one logical authority</small></div></div><div class="mini-flow global-flow"><span>US + EU → global limiter</span></div><p><strong>Wins:</strong> strict global enforcement.</p><p><strong>Pays:</strong> cross-region latency and a wider failure domain.</p><em>Choose for costly or compliance-sensitive operations.</em></article>
    </div>
  </figure>`;
}

function rateLimiterContent() {
  return `<article class="rate-guide">
    <nav class="topic-jump" aria-label="Rate limiter page sections">
      <button type="button" data-scroll-to="rl-snapshot">Snapshot</button><button type="button" data-scroll-to="rl-algorithms">Algorithms</button><button type="button" data-scroll-to="rl-distributed">Distributed</button><button type="button" data-scroll-to="rl-failures">Failures</button><button type="button" data-scroll-to="rl-deep-dives">Deep dives</button><button type="button" data-scroll-to="rl-interview">Interview</button>
    </nav>

    <section class="revision-card summary-card" id="rl-snapshot">
      <div><span class="revision-kicker">60-SECOND ANSWER</span><h2>Protect a resource with a fast allow / deny decision.</h2></div>
      <p>Key each request by <strong>tenant, user, API key, IP, or endpoint</strong>. For bursty APIs, use a token bucket. In a multi-pod system, keep authoritative state in Redis and run refill → check → consume atomically. Return <strong>429 + Retry-After</strong>; define fail-open or fail-closed per endpoint.</p>
    </section>

    <section class="guide-section">
      <div class="guide-title"><span>01</span><div><h2>Clarify before designing</h2><p>The algorithm follows the contract.</p></div></div>
      <div class="compact-grid clarify-grid">
        <div class="mini-card"><strong>Identity</strong><span>Who shares the quota?</span><code>tenant:user:endpoint</code></div>
        <div class="mini-card"><strong>Policy</strong><span>Rate, window, burst</span><code>100 rps · burst 200</code></div>
        <div class="mini-card"><strong>Scope</strong><span>Per pod, region, or global?</span><code>global tenant quota</code></div>
        <div class="mini-card"><strong>Failure</strong><span>Protect or stay available?</span><code>fail-open / fail-closed</code></div>
      </div>
    </section>

    <section class="guide-section" id="rl-algorithms">
      <div class="guide-title"><span>02</span><div><h2>Pick the algorithm</h2><p>Default to token bucket when bursts are allowed.</p></div></div>
      <div class="algorithm-table" aria-label="Rate limiting algorithm comparison">
        <div class="algorithm-row table-head"><span>Algorithm</span><span>Behavior</span><span>State</span><span>Use when</span><span></span></div>
        <button class="algorithm-row" type="button" data-code-example="fixed-window"><strong>Fixed window</strong><span class="algorithm-behavior">Boundary burst</span><code>1 counter</code><span class="algorithm-use">Simple quotas</span><span class="code-cta">Code ${icon('chevron')}</span></button>
        <button class="algorithm-row" type="button" data-code-example="sliding-log"><strong>Sliding log</strong><span class="algorithm-behavior">Exact window</span><code>timestamps</code><span class="algorithm-use">Strict, low volume</span><span class="code-cta">Code ${icon('chevron')}</span></button>
        <button class="algorithm-row" type="button" data-code-example="sliding-counter"><strong>Sliding counter</strong><span class="algorithm-behavior">Smooth estimate</span><code>2 counters</code><span class="algorithm-use">Large scale</span><span class="code-cta">Code ${icon('chevron')}</span></button>
        <button class="algorithm-row recommended" type="button" data-code-example="token-bucket"><strong>Token bucket <em>default</em></strong><span class="algorithm-behavior">Controlled burst</span><code>tokens + time</code><span class="algorithm-use">Bursty APIs</span><span class="code-cta">Code ${icon('chevron')}</span></button>
        <button class="algorithm-row" type="button" data-code-example="leaky-bucket"><strong>Leaky bucket</strong><span class="algorithm-behavior">Steady output</span><code>queue / level</code><span class="algorithm-use">Traffic shaping</span><span class="code-cta">Code ${icon('chevron')}</span></button>
      </div>
      <div class="formula-strip"><span><b>Capacity</b> = maximum burst</span><span><b>Refill rate</b> = sustained traffic</span><span><b>Allow</b> when tokens ≥ request cost</span></div>
    </section>

    <section class="guide-section" id="rl-distributed">
      <div class="guide-title"><span>03</span><div><h2>Make it distributed</h2><p>All instances must spend from the same logical bucket.</p></div></div>
      ${distributedDiagram()}
      <div class="distributed-details">
        <div class="revision-card">
          <span class="revision-kicker">ATOMIC DECISION</span>
          <h3>One datastore round trip</h3>
          <ol class="tight-list"><li>Read tokens + last refill</li><li>Refill using datastore time</li><li>Allow or deny</li><li>Persist state + TTL</li><li>Return remaining + retry delay</li></ol>
          <p class="callout warning"><strong>Avoid:</strong> GET → compare → INCR. Two pods can read the same count and both allow.</p>
        </div>
        <div class="revision-card">
          <span class="revision-kicker">KEY + RESPONSE</span>
          <h3>Keep the contract small</h3>
          <pre><code>rl:{tenant}:{route}

allowed: true
remaining: 42
retryAfterMs: 0
resetAtMs: …</code></pre>
          <p class="callout"><strong>Denied:</strong> return HTTP 429 with an accurate <code>Retry-After</code>.</p>
        </div>
      </div>
      ${regionDiagram()}
    </section>

    <section class="guide-section" id="rl-failures">
      <div class="guide-title"><span>04</span><div><h2>Failure decisions</h2><p>Name the trade-off, then choose by endpoint risk.</p></div></div>
      <div class="failure-grid">
        <div><strong>Redis unavailable</strong><span>Low-risk reads: fail-open. Payments / expensive work: fail-closed. Add a coarse local emergency limit.</span></div>
        <div><strong>Redis slow</strong><span>Short timeout, circuit breaker, local fallback. Track fallback rate.</span></div>
        <div><strong>Hot key</strong><span>Hierarchical limits, shard an extreme tenant, or pre-allocate local quota.</span></div>
        <div><strong>Clock skew</strong><span>Use Redis time for shared state; monotonic time for local elapsed duration.</span></div>
        <div><strong>Memory growth</strong><span>TTL idle keys. Prefer compact counters over timestamp logs at high cardinality.</span></div>
        <div><strong>Retry storm</strong><span>Return Retry-After; clients use exponential backoff with jitter.</span></div>
      </div>
    </section>

    <section class="guide-section" id="rl-deep-dives">
      <div class="guide-title"><span>05</span><div><h2>Staff+ deep dives</h2><p>State the invariant, quantify the trade-off, and cover rollout and operations.</p></div></div>
      <div class="staff-lens"><strong>Interview allocation</strong><span>Move through the basic design quickly. Spend most of the discussion on contention, failure modes, multi-region semantics, safe rollout, and evidence from production.</span></div>
      <div class="deep-dive-list">
        <details open><summary><span>How do four limits apply to one request?</span><em>user · IP · endpoint · global</em></summary><p>Evaluate every applicable rule and enforce the most restrictive result. Cross-shard atomicity is expensive: co-locate related keys when possible, or accept a documented bounded overshoot. Explain whether a denied request consumes any other quota.</p></details>
        <details><summary><span>What breaks during Redis failover?</span><em>replication lag · duplicate allowance</em></summary><p>An asynchronous replica may promote with older counters, briefly restoring spent quota. Bound the risk with short windows, conservative fallback, replication health gates, and an explicit fail-open or fail-closed policy per endpoint.</p></details>
        <details><summary><span>Can local caching remove Redis from the hot path?</span><em>leases · overshoot bound</em></summary><p>Lease small token batches to each gateway. Latency drops, but the worst-case overshoot is roughly active nodes × unspent lease. Keep leases short, revoke by policy epoch, and use this only when that error budget is acceptable.</p></details>
        <details><summary><span>How do you survive a hot tenant?</span><em>legitimate spike or abuse?</em></summary><p>First classify it. Premium traffic may need a dedicated shard or reserved capacity; abuse belongs at the edge or DDoS layer. A NATed IP can represent thousands of real users, so IP-only policies can create false positives.</p></details>
        <details><summary><span>How do you change rules without an outage?</span><em>version · shadow · canary · rollback</em></summary><p>Distribute immutable, versioned policies through push with polling as a repair path. Shadow-evaluate first, compare decisions, canary by tenant or region, then ramp enforcement. Preserve old state until rollback is no longer needed.</p></details>
        <details><summary><span>What is the multi-region consistency contract?</span><em>latency · availability · strictness</em></summary><p>Regional budgets give low latency and partition tolerance with bounded imbalance. A global authority gives a harder cap but adds cross-region latency and dependency. State the permitted overshoot and behavior during a partition.</p></details>
        <details><summary><span>How do you size and shard it?</span><em>benchmark p99, then add headroom</em></summary><p>At 1M checks/s, a measured 100k checks/s per shard implies at least 10 shards before replicas, failover, and headroom. Hash a stable identity plus rule, watch skew, and plan online resharding before saturation.</p></details>
        <details><summary><span>How do you prove the limiter is correct?</span><em>decision log · SLO · on-call</em></summary><p>Track decision latency, allows and denies by rule, false-positive reports, config age, shard saturation, hot keys, Redis errors, and fallback mode. Sample a reason code with policy version so an operator can explain any 429.</p></details>
      </div>
    </section>

    <section class="guide-section" id="rl-interview">
      <div class="guide-title"><span>06</span><div><h2>Interview close</h2><p>Show that the algorithm is only one design choice.</p></div></div>
      <div class="interview-grid">
        <ol class="walkthrough-list"><li><span>1</span>Clarify identity + quota</li><li><span>2</span>Choose burst semantics</li><li><span>3</span>Draw request path</li><li><span>4</span>Make state atomic</li><li><span>5</span>Handle failures + regions</li><li><span>6</span>Measure decisions</li></ol>
        <blockquote>“I’d use a token bucket for bursty traffic, with shared Redis state updated atomically. I’d return 429 + Retry-After, define fallback behavior per endpoint, and monitor decision latency, rejects, errors, hot keys, and fallback usage. A hard global multi-region quota needs explicit coordination; otherwise I’d allocate quota per region.”</blockquote>
      </div>
      <div class="metrics-strip"><span><b>Metrics</b></span><span>allowed / rejected</span><span>p50 / p95 / p99 latency</span><span>Redis errors</span><span>hot keys</span><span>fallback usage</span></div>
      <p class="source-note">Further reading: <a href="https://pranavnandedkar.github.io/system-design/rate-limiter.html#distributed" target="_blank" rel="noreferrer">detailed reference</a> · <a href="https://www.hellointerview.com/learn/system-design/problem-breakdowns/distributed-rate-limiter" target="_blank" rel="noreferrer">Staff+ problem breakdown</a> · <a href="https://redis.io/docs/latest/develop/use-cases/rate-limiter/" target="_blank" rel="noreferrer">Redis guide</a></p>
    </section>
  </article>`;
}

function kafkaArchitectContent() {
  return `<article class="rate-guide kafka-guide">
    <nav class="topic-jump" aria-label="Kafka architect page sections"><button type="button" data-scroll-to="ka-snapshot">Snapshot</button><button type="button" data-scroll-to="ka-math">Capacity</button><button type="button" data-scroll-to="ka-architecture">Architecture</button><button type="button" data-scroll-to="ka-isolation">Isolation</button><button type="button" data-scroll-to="ka-operations">Operations</button><button type="button" data-scroll-to="ka-interview">Interview</button></nav>
    <section class="revision-card summary-card" id="ka-snapshot"><div><span class="revision-kicker">90-SECOND ANSWER</span><h2>Shared by default. Quota protected. Selectively isolated.</h2></div><p>Treat 100M events/sec as a platform problem: tenant-aware admission, Kafka quotas, benchmark-driven partitions, isolated consumer compute, downstream bulkheads, and policy-driven promotion to dedicated capacity. Kafka is the hot replayable log; object storage holds long-term history.</p></section>
    <section class="guide-section" id="ka-math"><div class="guide-title"><span>01</span><div><h2>Start with capacity math</h2><p>Expose the physical cost before drawing boxes.</p></div></div><div class="capacity-grid"><div><b>100M/s</b><span>peak event rate</span></div><div><b>≈100 GB/s</b><span>logical ingress at 1 KB/event</span></div><div><b>≈8.64 PB/day</b><span>raw logical data</span></div><div><b>≈25.9 PB/day</b><span>RF=3 copy volume</span></div></div><p class="callout"><strong>Size from measurements:</strong> required partitions ≈ total throughput ÷ benchmarked sustainable throughput per partition. Add skew, recovery, replication, and growth headroom.</p></section>
    <section class="guide-section" id="ka-architecture"><div class="guide-title"><span>02</span><div><h2>Separate control and data planes</h2><p>The control plane changes placement; the data plane moves events.</p></div></div><figure class="system-diagram kafka-architecture"><figcaption><strong>Multi-tenant streaming platform</strong><span>Admission before shared infrastructure.</span></figcaption><div class="kafka-control"><span class="plane-label">CONTROL PLANE</span><b>Tenant registry</b><i>Policy + quotas</i><i>Capacity manager</i><i>Placement + promotion</i></div><div class="kafka-flow"><span class="plane-label">DATA PLANE</span><div>Producers<small>tenant identity</small></div><b>→</b><div class="accent">Admission + router<small>quota · buffer · placement</small></div><b>→</b><div>Shared Kafka<small>small / medium</small></div><div>Dedicated Kafka<small>large / extreme</small></div><b>→</b><div>Consumer pools<small>shared + isolated</small></div><b>→</b><div>Downstreams<small>DB · lake · search</small></div></div><p class="diagram-note"><strong>Burst invariant:</strong> a buffer buys time; it does not create capacity. If ingress exceeds drain rate, backlog grows by the difference.</p></figure></section>
    <section class="guide-section" id="ka-isolation"><div class="guide-title"><span>03</span><div><h2>Design tenant isolation as a ladder</h2><p>Promotion is a policy decision, not a reflex to every spike.</p></div></div><div class="tier-table"><div class="table-head"><span>Tier</span><span>Placement</span><span>Protection</span></div><div><b>Small</b><span>Shared cluster</span><span>Kafka quota + shared consumers</span></div><div><b>Medium</b><span>Shared + reservation</span><span>Quota + partitions + autoscaling</span></div><div><b>Large</b><span>Isolated pool / cluster</span><span>Dedicated capacity</span></div><div><b>Extreme</b><span>Dedicated cluster</span><span>Brokers + consumers + policy</span></div></div><div class="burst-path"><div><b>Short burst</b><span>Throttle → buffer → backpressure → drain</span></div><div><b>Sustained growth</b><span>Detect → approve → promote → rebalance</span></div><div><b>Downstream limit</b><span>Consumer bulkhead → rate limit → DLQ</span></div></div></section>
    <section class="guide-section" id="ka-operations"><div class="guide-title"><span>04</span><div><h2>Production decisions</h2><p>Ordering, recovery, and side effects define the hard parts.</p></div></div><div class="failure-grid"><div><strong>Partition key</strong><span>Hash the business key for per-key ordering. A hot key may force explicit sharding and weaker ordering.</span></div><div><strong>Broker sizing</strong><span>Use max(network, disk, CPU) with RF=3, AZ failure, consumer load, and recovery headroom.</span></div><div><strong>Consumer lag</strong><span>Scale only within downstream capacity. A faster consumer can simply move the outage to the database.</span></div><div><strong>Replay</strong><span>Use a separate consumer group. Make external side effects idempotent before replay.</span></div><div><strong>Schema</strong><span>Compatibility checks plus event ID, type, version, event time, and tracing context.</span></div><div><strong>Multi-region DR</strong><span>Regional ingestion, selective async replication, measured lag, and an explicit RPO.</span></div></div></section>
    <section class="guide-section" id="ka-interview"><div class="guide-title"><span>05</span><div><h2>Staff+ follow-up drill</h2><p>Answer with an invariant, a threshold, and an operating procedure.</p></div></div><div class="deep-dive-list"><details open><summary><span>Why quotas and a gateway?</span><em>different protection layers</em></summary><p>The gateway applies tenant-aware admission and business policy. Kafka quotas protect broker resources. Use both because neither protects the full path alone.</p></details><details><summary><span>When do you promote a tenant?</span><em>sustained threshold + SLA</em></summary><p>Use sustained throughput, burst frequency, partition skew, lag, and SLA risk. Automate detection, but make placement changes versioned, observable, and reversible.</p></details><details><summary><span>How many partitions?</span><em>benchmark, never folklore</em></summary><p>Benchmark the real event size, compression, acks, replication, consumers, and failure mode. Divide peak throughput by the safe measured target, then add skew and recovery headroom.</p></details><details><summary><span>What if every buffer fills?</span><em>admission is the final guardrail</em></summary><p>Throttle or reject according to tenant policy, preserve critical tiers, surface retry guidance, and shed optional work. Unbounded buffering converts overload into a delayed outage.</p></details><details><summary><span>Exactly once?</span><em>scope the guarantee</em></summary><p>Kafka transactions can protect Kafka-to-Kafka processing. External payments, notifications, and database writes still need business-level idempotency and deduplication.</p></details><details><summary><span>What belongs on the dashboard?</span><em>tenant + partition + dependency</em></summary><p>Ingress, throttle time, rejected bytes, partition skew, under-replicated partitions, ISR changes, consumer lag, buffer age, downstream saturation, replication lag, and promotion state.</p></details></div><p class="source-note">Source: <a href="https://pranavnandedkar.github.io/StreamingDocs/kafka-architect-prep.html" target="_blank" rel="noreferrer">Kafka Architect Interview Prep</a></p></section>
  </article>`;
}

function codingPatternsContent() {
  const patterns = [
    ['two-pointers', 'Two pointers', 'Sorted pair, palindrome, in-place scan', 'O(n) · O(1)'],
    ['sliding-window', 'Sliding window', 'Contiguous range with a validity rule', 'O(n) · O(k)'],
    ['binary-search', 'Binary search', 'Sorted data or monotonic answer space', 'O(log n)'],
    ['bfs', 'BFS', 'Minimum edges, levels, nearest state', 'O(V + E)'],
    ['dfs', 'DFS', 'Reachability, components, tree state', 'O(V + E)'],
    ['top-k', 'Heap / Top K', 'Keep the best K without full sorting', 'O(n log k)'],
    ['intervals', 'Intervals', 'Overlap, scheduling, sweep frontier', 'O(n log n)'],
    ['monotonic-stack', 'Monotonic stack', 'Nearest greater/smaller element', 'O(n)'],
    ['backtracking', 'Backtracking', 'Enumerate constrained choices', 'O(branches^depth)'],
    ['dynamic-programming', 'Dynamic programming', 'Overlapping states + optimal substructure', 'state × transition'],
  ];
  return `<article class="rate-guide patterns-guide"><nav class="topic-jump" aria-label="Coding patterns page sections"><button type="button" data-scroll-to="cp-decision">Decision guide</button><button type="button" data-scroll-to="cp-patterns">Patterns</button><button type="button" data-scroll-to="cp-interview">Interview</button></nav><section class="revision-card summary-card" id="cp-decision"><div><span class="revision-kicker">PATTERN FIRST</span><h2>Constraints reveal the algorithm.</h2></div><p>Ask: contiguous or arbitrary? sorted or monotonic? nearest / shortest? top K? enumerate all choices? repeated state? Then name the invariant, choose the data structure, and derive time and space before coding.</p></section><section class="guide-section"><div class="decision-tree"><div><b>Contiguous range?</b><span>Sliding window / prefix sum</span></div><div><b>Sorted or monotonic?</b><span>Two pointers / binary search</span></div><div><b>Connections?</b><span>BFS / DFS / union-find</span></div><div><b>Best K?</b><span>Heap / quickselect</span></div><div><b>All valid choices?</b><span>Backtracking</span></div><div><b>Repeated subproblems?</b><span>Dynamic programming</span></div></div></section><section class="guide-section" id="cp-patterns"><div class="guide-title"><span>01</span><div><h2>Core templates</h2><p>Select a pattern to open its Java 17 implementation.</p></div></div><div class="pattern-grid">${patterns.map(([id, title, cue, complexity]) => `<button type="button" data-code-example="${id}"><span><b>${title}</b><small>${cue}</small></span><em>${complexity}</em><i>Java ${icon('chevron')}</i></button>`).join('')}</div></section><section class="guide-section" id="cp-interview"><div class="guide-title"><span>02</span><div><h2>Interview checklist</h2><p>Make correctness visible before optimization.</p></div></div><div class="failure-grid"><div><strong>Clarify</strong><span>Nulls, duplicates, ordering, mutation, input size, output contract.</span></div><div><strong>Example</strong><span>Walk one normal case and one edge case before coding.</span></div><div><strong>Invariant</strong><span>Say what remains true after every loop or recursive call.</span></div><div><strong>Complexity</strong><span>Derive it from visits and data-structure operations.</span></div><div><strong>Test</strong><span>Empty, singleton, duplicates, overflow, skewed shape, impossible case.</span></div><div><strong>Improve</strong><span>Optimize only after a correct baseline and a named bottleneck.</span></div></div><p class="source-note">Reference: <a href="https://leetcode.com/explore/interview/card/cheatsheets/720/resources/4723/" target="_blank" rel="noreferrer">LeetCode interview cheat sheet</a></p></section></article>`;
}

function streamingStaffGuideContent() {
  const total = streamingStaffSections.reduce((count, section) => count + section.items.length, 0);
  const nav = streamingStaffSections.map((section) => `<button type="button" data-stream-domain="ss-${section.id}"><span>${escapeHTML(section.name)}</span><em>${section.items.length}</em></button>`).join('');
  const content = streamingStaffSections.map((section) => `<section class="streaming-domain-section" id="ss-${section.id}" data-stream-section><header><div><h2>${escapeHTML(section.name)}</h2><span>${section.items.length} questions</span></div></header><div class="streaming-question-list">${section.items.map((item) => `<details class="streaming-question" data-stream-question data-search="${escapeHTML(`${item.question} ${item.answers.join(' ')}`.replace(/<[^>]*>/g, ' ')).toLowerCase()}"><summary><span>${String(item.number).padStart(3, '0')}</span><strong>${escapeHTML(item.question)}</strong><i aria-hidden="true">＋</i></summary><div class="streaming-answer"><ul>${item.answers.map((answer) => `<li>${answer}</li>`).join('')}</ul><button type="button" data-reviewed="${item.number}">Mark reviewed</button></div></details>`).join('')}</div></section>`).join('');
  return `<article class="streaming-guide-full"><nav class="streaming-domain-nav" aria-label="Question domains"><span>QUESTION DOMAINS</span>${nav}</nav><div class="streaming-guide-content"><section class="revision-card streaming-guide-hero"><div><span class="revision-kicker">STAFF+ / ARCHITECT REVISION GUIDE</span><h2>Streaming systems, in interview-sized answers.</h2><p>${total} architecture questions covering event streaming, delivery semantics, state, resilience, governance, technology trade-offs, leadership, and incident scenarios.</p></div><div class="streaming-guide-metrics"><b>${total}<small>questions</small></b><b>${streamingStaffSections.length}<small>domains</small></b></div></section><div class="streaming-guide-tools"><label>${icon('search')}<input type="search" id="streaming-question-search" placeholder="Search all questions and answers" aria-label="Search streaming questions and answers"></label><span id="streaming-question-count">Showing ${total} of ${total}</span><span id="streaming-reviewed-count">Reviewed 0 / ${total}</span><button type="button" data-stream-toggle>Expand all</button></div>${content}<section class="revision-card interview-pattern"><span class="revision-kicker">INTERVIEW PATTERN</span><p>Clarify requirements → quantify scale and SLOs → identify failure modes → explain trade-offs → cover operations and ownership.</p></section></div></article>`;
}

function gcpPlaybookContent() {
  const nav = gcpPlaybookSections.map((section) => `<button type="button" data-scroll-to="gcp-${section.id}">${escapeHTML(section.title)}</button>`).join('');
  const content = gcpPlaybookSections.map((section) => `<section class="gcp-section" id="gcp-${section.id}">${section.html}</section>`).join('');
  return `<article class="rate-guide gcp-playbook"><nav class="topic-jump" aria-label="GCP playbook sections"><span>PLAYBOOK INDEX</span>${nav}</nav><section class="revision-card gcp-hero"><div><span class="revision-kicker">INTERVIEW FIELD GUIDE / STAFF+</span><h2>GCP data engineering. Know what matters.</h2><p>A compact preparation map for engineers who already know Spark, Airflow, Flink, and Kafka. Focus on architectural judgment, GCP depth, production correctness, and cross-team leadership.</p></div><div class="gcp-priorities"><span><b>01</b> BigQuery</span><span><b>02</b> Beam & Dataflow</span><span><b>03</b> SQL & modeling</span></div></section>${content}</article>`;
}

function staffScenariosContent() {
  const nav = staffScenarioSections.map((section, index) => `<button type="button" data-scroll-to="scenario-${section.id}"><b>${String(index).padStart(2, '0')}</b><span>${escapeHTML(section.title)}</span></button>`).join('');
  const content = staffScenarioSections.map((section) => `<section class="staff-scenario-section" id="scenario-${section.id}">${section.html}</section>`).join('');
  return `<article class="rate-guide staff-scenarios"><nav class="topic-jump" aria-label="Staff architect scenario index"><span>SCENARIO INDEX</span>${nav}</nav><section class="scenario-hero"><span class="revision-kicker">SCENARIO WORKBOOK / STAFF+ ARCHITECT</span><h2>Answer beyond the <em>technology.</em></h2><p>Practice how you frame ambiguity, choose principles, align teams, retire risk, measure outcomes, and learn. Use these response blueprints as adaptable structures, not scripts.</p><div><b>16 realistic scenarios</b><b>Model responses</b><b>Follow-up probes</b><b>Red flags</b></div></section>${content}</article>`;
}

function gcpSystemDesignCasesContent() {
  const nav = gcpSystemDesignCases.map((section, index) => `<button type="button" data-scroll-to="case-${section.id}"><b>${String(index).padStart(2, '0')}</b><span>${escapeHTML(section.title)}</span></button>`).join('');
  const content = gcpSystemDesignCases.map((section) => section.html).join('');
  return `<article class="rate-guide gcp-casebook"><nav class="topic-jump" aria-label="GCP system design case index"><span>CASE INDEX</span>${nav}</nav><header class="casebook-hero"><span class="revision-kicker">SYSTEM DESIGN CASEBOOK / STAFF+</span><h2>One skeleton. <em>Eight complete designs.</em></h2><p>Move from an ambiguous prompt to requirements, scale, guarantees, data model, architecture, and operations. Then defend the trade-offs like a Staff+ architect.</p><div><b>Assumptions stated</b><b>Scale math</b><b>GCP architecture</b><b>Failure + cost</b><b>Follow-up probes</b></div></header>${content}</article>`;
}

const streamingReviewKey = 'prep-streaming-reviewed';

function streamingReviewed() {
  try { return new Set(JSON.parse(localStorage.getItem(streamingReviewKey) || '[]')); }
  catch { return new Set(); }
}

function refreshStreamingReviewed() {
  const reviewed = streamingReviewed();
  document.querySelectorAll('[data-reviewed]').forEach((button) => {
    const complete = reviewed.has(Number(button.dataset.reviewed));
    button.classList.toggle('complete', complete);
    button.setAttribute('aria-pressed', String(complete));
    button.textContent = complete ? 'Reviewed ✓' : 'Mark reviewed';
  });
  const count = $('streaming-reviewed-count');
  if (count) count.textContent = `Reviewed ${reviewed.size} / 120`;
}

function filterStreamingQuestions(query) {
  const normalized = query.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('[data-stream-section]').forEach((section) => {
    let sectionCount = 0;
    section.querySelectorAll('[data-stream-question]').forEach((question) => {
      const match = !normalized || question.dataset.search.includes(normalized);
      question.hidden = !match;
      if (match) { visible += 1; sectionCount += 1; }
    });
    section.hidden = sectionCount === 0;
  });
  if ($('streaming-question-count')) $('streaming-question-count').textContent = `Showing ${visible} of 120`;
}

function render({ focus = false } = {}) {
  closeCodeSheet();
  const route = location.hash || '#/';
  const [, type, id, extra, codeId, overflow] = route.split('/');
  let section;
  let topic;
  let title;
  let html;
  if (type === 'topic' && id && !overflow && (!extra || (extra.startsWith('find-') && !codeId) || (extra === 'code' && codeId)) && (topic = topics.find((item) => item.id === id))) {
    section = sections.find((item) => item.id === topic.section);
    html = topicPage(topic, section);
    title = topic.title;
  } else if (type === 'section' && id && !extra && (section = sections.find((item) => item.id === id))) {
    html = sectionPage(section);
    title = section.title;
  } else if (route === '#/' || route === '#') {
    html = homePage();
    title = 'Interview library';
  } else {
    html = `${breadcrumb()}<div class="empty-state">${icon('search')}<h1>Topic not found.</h1><p>This page is not in your notebook.</p><a class="text-link" href="#/">Back to all topics ${icon('arrow')}</a></div>`;
    title = 'Page not found';
  }
  $('main').innerHTML = html;
  $('main').className = ['rate-limiter', 'kafka-architect', 'coding-patterns', 'gcp-data-engineering', 'staff-architect-scenarios', 'gcp-system-design-cases'].includes(topic?.id) ? 'rate-limiter-page' : topic?.id === 'streaming-staff-plus' ? 'streaming-guide-page' : '';
  document.title = `${title} · prep`;
  renderNavigation(section?.id, topic?.id, title === 'Interview library');
  if (topic?.id === 'streaming-staff-plus') refreshStreamingReviewed();
  closeSearch();
  setMenu(false);
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (extra?.startsWith('find-')) {
    const target = document.getElementById(extra);
    if (target) {
      target.closest('details')?.setAttribute('open', '');
      target.classList.add('search-target');
      requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: 'instant' }));
    }
  } else if (extra === 'code' && codeId) {
    const trigger = $('main').querySelector(`[data-code-example="${codeId}"]`);
    if (trigger) openCodeSheet(codeId, trigger);
  } else if (focus) $('main').focus({ preventScroll: true });
}

function closeSearch() {
  $('search-panel').hidden = true;
  $('search-input').setAttribute('aria-expanded', 'false');
  $('search-input').removeAttribute('aria-activedescendant');
}

function openCodeSheet(exampleId, trigger) {
  const example = rateLimiterCodeExamples[exampleId] || codingPatternCodeExamples[exampleId];
  if (!example) return;
  codeSheetTrigger = trigger;
  $('code-sheet-title').textContent = example.title;
  $('code-sheet-subtitle').textContent = example.subtitle;
  $('code-sheet-note').textContent = example.note;
  $('code-sheet-content').innerHTML = highlightJava(example.code);
  $('code-sheet-footer-context').textContent = codingPatternCodeExamples[exampleId] ? 'Interview template · explain the invariant before coding' : 'Local implementation · discuss Redis atomicity for distributed use';
  $('code-sheet-layer').hidden = false;
  document.querySelector('.workspace').inert = true;
  $('sidebar').inert = true;
  document.body.classList.add('sheet-open');
  $('code-sheet-close').focus();
}

function closeCodeSheet() {
  if ($('code-sheet-layer').hidden) return;
  $('code-sheet-layer').hidden = true;
  document.querySelector('.workspace').inert = false;
  $('sidebar').inert = matchMedia('(max-width: 650px)').matches && !$('sidebar').classList.contains('open');
  document.body.classList.remove('sheet-open');
  codeSheetTrigger?.focus();
  codeSheetTrigger = null;
}

function dismissCodeSheet() {
  closeCodeSheet();
  const match = location.hash.match(/^#\/topic\/([a-z0-9-]+)\/code\/[a-z0-9-]+$/);
  if (match) history.replaceState(null, '', `#/topic/${match[1]}`);
}

function updateSelectedResult() {
  document.querySelectorAll('.search-result').forEach((element, index) => element.setAttribute('aria-selected', String(index === activeIndex)));
  if (activeResults[activeIndex]) $('search-input').setAttribute('aria-activedescendant', `result-${activeIndex}`);
  else $('search-input').removeAttribute('aria-activedescendant');
}

function highlightSearchText(value, query) {
  const words = [...new Set((query.toLowerCase().match(/[a-z0-9]+/g) || []).filter((word) => word.length > 1))].sort((a, b) => b.length - a.length);
  if (!words.length) return escapeHTML(value);
  const expression = new RegExp(`(${words.join('|')})`, 'gi');
  return String(value).split(expression).map((part) => words.includes(part.toLowerCase()) ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part)).join('');
}

function updateSearch() {
  const query = $('search-input').value;
  $('clear-search').hidden = !query;
  $('search-shortcut').hidden = Boolean(query);
  const allMatches = searchEntries(searchIndex, query);
  const availableSections = sections.filter((section) => allMatches.some((entry) => entry.sectionId === section.id));
  if (activeSectionFilter !== 'all' && !availableSections.some((section) => section.id === activeSectionFilter)) activeSectionFilter = 'all';
  $('search-filters').innerHTML = allMatches.length ? [{ id: 'all', title: 'All' }, ...availableSections.map((section) => ({ id: section.id, title: section.shortTitle }))].map((filter) => `<button type="button" data-search-filter="${filter.id}" aria-pressed="${filter.id === activeSectionFilter}">${escapeHTML(filter.title)}</button>`).join('') : '';
  const matches = activeSectionFilter === 'all' ? allMatches : allMatches.filter((entry) => entry.sectionId === activeSectionFilter);
  activeResults = matches.slice(0, 50);
  activeIndex = 0;
  if (!query.trim()) { activeSectionFilter = 'all'; closeSearch(); $('search-announcement').textContent = ''; return; }
  $('search-panel').hidden = false;
  $('search-input').setAttribute('aria-expanded', 'true');
  const resultCount = matches.length > activeResults.length ? `First 50 of ${matches.length} results` : `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
  $('result-count').textContent = resultCount;
  $('search-announcement').textContent = resultCount;
  $('search-results').innerHTML = activeResults.length ? activeResults.map((entry, index) => `<div class="search-result" id="result-${index}" role="option" aria-selected="${index === 0}" data-result-index="${index}">${sectionIcon(entry, true)}<span class="result-copy"><span class="result-title">${highlightSearchText(entry.title, entry.matchedQuery || query)}</span><span class="result-subtitle">${escapeHTML(entry.subtitle)}</span>${entry.excerpt && entry.excerpt !== entry.title ? `<span class="result-excerpt">${highlightSearchText(entry.excerpt, entry.matchedQuery || query)}</span>` : ''}</span><span class="result-enter" aria-hidden="true">↵</span></div>`).join('') : '<div class="no-results">No matches. Try a topic, question, or phrase from your notes.</div>';
  updateSelectedResult();
}

function openResult(index) {
  const entry = activeResults[index];
  if (!entry) return;
  $('search-input').value = '';
  updateSearch();
  $('search-input').blur();
  if (location.hash === entry.href) render({ focus: true });
  else location.hash = entry.href;
}

$('search-input').addEventListener('input', updateSearch);
$('search-input').addEventListener('focus', updateSearch);
$('search-input').addEventListener('keydown', (event) => {
  if (event.isComposing) return;
  if (event.key === 'Escape') { closeSearch(); event.preventDefault(); return; }
  if (event.key === 'Tab') { closeSearch(); return; }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if ($('search-panel').hidden) updateSearch();
    if (!activeResults.length) return;
    event.preventDefault();
    activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + activeResults.length) % activeResults.length;
    updateSelectedResult();
    $(`result-${activeIndex}`).scrollIntoView({ block: 'nearest' });
  } else if (event.key === 'Enter' && !$('search-panel').hidden) { event.preventDefault(); openResult(activeIndex); }
});
$('search-results').addEventListener('mousedown', (event) => event.preventDefault());
$('search-filters').addEventListener('click', (event) => {
  const filter = event.target.closest('[data-search-filter]');
  if (!filter) return;
  activeSectionFilter = filter.dataset.searchFilter;
  updateSearch();
});
$('search-results').addEventListener('click', (event) => {
  const option = event.target.closest('[data-result-index]');
  if (option) openResult(Number(option.dataset.resultIndex));
});
$('search-results').addEventListener('pointermove', (event) => {
  const option = event.target.closest('[data-result-index]');
  if (option && event.pointerType === 'mouse') { activeIndex = Number(option.dataset.resultIndex); updateSelectedResult(); }
});
$('clear-search').addEventListener('click', () => { $('search-input').value = ''; updateSearch(); $('search-input').focus(); });
document.addEventListener('click', (event) => { if (!$('search-container').contains(event.target)) closeSearch(); });
document.addEventListener('keydown', (event) => {
  const typing = event.target.matches('input,textarea,[contenteditable="true"]');
  if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey)) {
    event.preventDefault(); setMenu(false); $('search-input').focus(); $('search-input').select();
  }
  if (event.key === 'Escape' && $('sidebar').classList.contains('open')) { setMenu(false); $('menu-toggle').focus(); }
  if (event.key === 'Tab' && $('sidebar').classList.contains('open')) {
    const links = [...$('sidebar').querySelectorAll('a')];
    const first = links[0]; const last = links.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

function setMenu(open) {
  $('sidebar').classList.toggle('open', open);
  $('sidebar-backdrop').hidden = !open;
  $('menu-toggle').setAttribute('aria-expanded', String(open));
  $('menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  $('sidebar').inert = matchMedia('(max-width: 650px)').matches && !open;
  document.querySelector('.workspace').inert = open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) $('sidebar').querySelector('a').focus();
}
$('menu-toggle').addEventListener('click', () => setMenu(!$('sidebar').classList.contains('open')));
$('sidebar-backdrop').addEventListener('click', () => { setMenu(false); $('menu-toggle').focus(); });
$('navigation').addEventListener('click', (event) => {
  if (event.target.closest('a')) { setMenu(false); $('main').focus(); }
});
$('main').addEventListener('click', (event) => {
  const domainButton = event.target.closest('[data-stream-domain]');
  if (domainButton) {
    document.getElementById(domainButton.dataset.streamDomain)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const reviewedButton = event.target.closest('[data-reviewed]');
  if (reviewedButton) {
    const reviewed = streamingReviewed();
    const number = Number(reviewedButton.dataset.reviewed);
    if (reviewed.has(number)) reviewed.delete(number); else reviewed.add(number);
    localStorage.setItem(streamingReviewKey, JSON.stringify([...reviewed].sort((a, b) => a - b)));
    refreshStreamingReviewed();
    return;
  }
  const streamToggle = event.target.closest('[data-stream-toggle]');
  if (streamToggle) {
    const questions = [...document.querySelectorAll('[data-stream-question]:not([hidden])')];
    const shouldOpen = questions.some((question) => !question.open);
    questions.forEach((question) => { question.open = shouldOpen; });
    streamToggle.textContent = shouldOpen ? 'Collapse all' : 'Expand all';
    return;
  }
  const codeButton = event.target.closest('[data-code-example]');
  if (codeButton) { openCodeSheet(codeButton.dataset.codeExample, codeButton); return; }
  const jump = event.target.closest('[data-scroll-to]');
  if (!jump) return;
  document.getElementById(jump.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('main').addEventListener('input', (event) => {
  if (event.target.id === 'streaming-question-search') filterStreamingQuestions(event.target.value);
});
$('code-sheet-close').addEventListener('click', dismissCodeSheet);
$('code-sheet-backdrop').addEventListener('click', dismissCodeSheet);
document.addEventListener('keydown', (event) => {
  if ($('code-sheet-layer').hidden) return;
  if (event.key === 'Escape') { event.preventDefault(); dismissCodeSheet(); return; }
  if (event.key !== 'Tab') return;
  const controls = [...$('code-sheet').querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hidden);
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
$('sidebar').querySelector('.brand').addEventListener('click', () => { setMenu(false); $('main').focus(); });
window.addEventListener('hashchange', () => render({ focus: true }));
matchMedia('(max-width: 650px)').addEventListener('change', () => setMenu(false));
for (const topic of topics) {
  topicPage(topic, sections.find((section) => section.id === topic.section));
  searchIndex.push(...preparedTopicPages.get(topic.id).entries);
}
for (const [topicId, examples] of [['rate-limiter', rateLimiterCodeExamples], ['coding-patterns', codingPatternCodeExamples]]) {
  const topic = topics.find((item) => item.id === topicId);
  const section = sections.find((item) => item.id === topic.section);
  for (const [exampleId, example] of Object.entries(examples)) {
    searchIndex.push({ id: `${topicId}:code:${exampleId}`, kind: 'code', sectionId: section.id, title: `${example.title} · Java`, subtitle: `${section.title} › ${topic.title} › Code`, snippet: `${example.note} ${example.code}`, searchText: `${example.title} ${example.note} ${example.code}`, href: `#/topic/${topicId}/code/${exampleId}`, color: section.color, icon: 'code' });
  }
}
render();
