// This is the single source for navigation, topic pages, and global search.
// Add your own topics here. A topic's blocks stay empty until its format is decided.
export const sections = [
  { id: 'system-design', title: 'System design', shortTitle: 'System design', icon: 'system', color: 'green', description: 'Systems, scale, and the decisions in between.' },
  { id: 'streaming', title: 'Streaming', shortTitle: 'Streaming', icon: 'stream', color: 'purple', description: 'Kafka, event platforms, and real-time data.' },
  { id: 'coding', title: 'Coding', shortTitle: 'Coding', icon: 'code', color: 'blue', description: 'Your questions, patterns, and approaches.' },
  { id: 'ai-ml', title: 'AI / ML', shortTitle: 'AI / ML', icon: 'ai', color: 'pink', description: 'Models, platforms, evaluation, and production trade-offs.' },
  { id: 'behavioral', title: 'Behavioral / Leadership', shortTitle: 'Behavioral / Leadership', icon: 'people', color: 'orange', description: 'Experiences, decisions, and the impact you made.' },
];

export const topics = [
  {
    id: 'rate-limiter',
    section: 'system-design',
    title: 'Rate limiter',
    description: 'Control traffic. Protect your services.',
    keywords: ['rate limiting', 'throttling', 'requests', 'token bucket', 'fixed window', 'sliding window', 'redis', 'redis cluster', 'lua', 'distributed', '429', 'retry-after', 'hot key', 'consistent hashing', 'replication lag', 'failover', 'connection pooling', 'dynamic configuration', 'canary', 'shadow mode', 'staff'],
    blocks: [
      { heading: 'Requirements', bullets: ['identity key', 'quota', 'window', 'burst', 'consistency'] },
      { heading: 'Algorithms', bullets: ['fixed window', 'sliding log', 'sliding counter', 'token bucket', 'leaky bucket'] },
      { heading: 'Distributed design', bullets: ['shared Redis state', 'atomic Lua operation', 'local fallback', 'multi-region quota'] },
      { heading: 'Failure modes', bullets: ['Redis unavailable', 'hot key', 'clock skew', 'retry storm'] },
      { heading: 'Staff+ deep dives', bullets: ['multi-rule limits', 'replication lag', 'local leases', 'hot tenants', 'versioned policy rollout', 'observability'] },
    ],
  },
  { id: 'leaderboard', section: 'system-design', title: 'Leaderboard', description: 'Keep scores ordered and rankings current.', keywords: ['ranking', 'scores', 'leader board'], blocks: [] },
  { id: 'reservation-system', section: 'system-design', title: 'Reservation system', description: 'Manage availability and coordinate bookings.', keywords: ['booking', 'reservations', 'availability'], blocks: [] },
  {
    id: 'kafka-architect', section: 'streaming', title: 'Kafka architect',
    description: 'Design a 100M events/sec multi-tenant streaming platform.',
    keywords: ['kafka', 'streaming', 'events', 'multi tenant', 'noisy neighbor', 'quotas', 'partitions', 'brokers', 'consumer lag', 'schema registry', 'replay', 'disaster recovery', 'control plane', 'burst handling'],
    blocks: [{ heading: 'Architecture', bullets: ['capacity math', 'tenant isolation', 'admission control', 'partition sizing', 'consumer protection', 'multi-region DR'] }],
  },
  {
    id: 'streaming-staff-plus', section: 'streaming', title: 'Streaming Staff+ guide',
    description: '120 architect-level streaming questions across eleven domains.',
    keywords: ['streaming staff plus', 'architect', 'event contracts', 'delivery semantics', 'correctness', 'ordering', 'event time', 'watermarks', 'state', 'resilience', 'replay', 'reprocessing', 'observability', 'governance', 'technology trade-offs', 'leadership', 'incident scenarios'],
    blocks: [{ heading: 'Question bank', bullets: ['architecture and design', 'events and contracts', 'delivery and correctness', 'ordering time and state', 'failure and resilience', 'replay and reprocessing', 'observability and operations', 'security and governance', 'technology trade-offs', 'Staff+ leadership', 'deep scenarios'] }],
  },
  {
    id: 'gcp-data-engineering', section: 'streaming', title: 'GCP data engineering',
    description: 'Staff+ playbook for BigQuery, Dataflow, SQL, modeling, operations, and leadership.',
    keywords: ['gcp', 'google cloud', 'data engineering', 'bigquery', 'apache beam', 'dataflow', 'pubsub', 'pub/sub', 'data modeling', 'advanced sql', 'dataproc', 'spark', 'flink', 'airflow', 'dataform', 'datastream', 'bigtable', 'spanner', 'data governance', 'staff leadership', 'six week plan'],
    blocks: [{ heading: 'Interview playbook', bullets: ['advanced SQL', 'data modeling', 'data platform foundations', 'BigQuery', 'Beam and Dataflow', 'Kafka and Pub/Sub', 'GCP landscape', 'production engineering', 'system design', 'Staff+ leadership'] }],
  },
  {
    id: 'coding-patterns', section: 'coding', title: 'Coding patterns',
    description: 'Recognize the shape, choose the template, state the invariant.',
    keywords: ['leetcode', 'cheat sheet', 'two pointers', 'sliding window', 'binary search', 'bfs', 'dfs', 'heap', 'top k', 'intervals', 'monotonic stack', 'backtracking', 'dynamic programming'],
    blocks: [{ heading: 'Patterns', bullets: ['two pointers', 'sliding window', 'binary search', 'graph traversal', 'heap', 'intervals', 'monotonic stack', 'backtracking', 'dynamic programming'] }],
  },
];
