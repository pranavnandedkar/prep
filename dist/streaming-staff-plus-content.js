export const streamingStaffSections = [
  {
    "id": "architecture-design",
    "items": [
      {
        "answers": [
          "Start with regional clusters and a <strong>control plane</strong> for standards, identity, schemas and observability.",
          "Use asynchronous replication for selected topics; avoid pretending cross-region ordering is free.",
          "Define RPO/RTO, failover ownership, residency rules and a tested regional evacuation process.",
          "Offer self-service with quotas, paved-road templates and chargeback/showback."
        ],
        "number": 1,
        "question": "Design a multi-region event-streaming platform for hundreds of engineering teams."
      },
      {
        "answers": [
          "Use <strong>synchronous APIs</strong> when the caller needs an immediate answer.",
          "Use <strong>queues</strong> for work distribution and competing consumers.",
          "Use <strong>event logs</strong> for durable facts, multiple consumers and replay.",
          "Use <strong>batch</strong> when latency is relaxed and simplicity/cost matter more than freshness."
        ],
        "number": 2,
        "question": "How would you decide between event streaming, message queues, batch processing, and synchronous APIs?"
      },
      {
        "answers": [
          "Quantify payload size, peak throughput, p99 latency, retention and replication before choosing technology.",
          "Partition by a stable key; provision headroom and spread leaders across failure domains.",
          "Batch/compress producer writes, use efficient serialization and isolate heavy consumers.",
          "Load-test the entire path, including storage, network and downstream sinks—not only brokers."
        ],
        "number": 3,
        "question": "Design a platform capable of processing millions of events per second with predictable latency."
      },
      {
        "answers": [
          "Apply quotas for produce, consume, storage, connections and request rate.",
          "Separate critical workloads by cluster, account, namespace or node pool when quotas are insufficient.",
          "Use priority classes, admission control and per-tenant SLOs.",
          "Expose usage and throttling clearly so teams can correct behavior."
        ],
        "number": 4,
        "question": "How would you isolate workloads so one tenant cannot affect others?"
      },
      {
        "answers": [
          "A central cluster improves utilization and governance but increases blast radius and coordination.",
          "Multiple clusters improve isolation and autonomy but raise cost and operational inconsistency.",
          "Prefer a <strong>federated model</strong>: standard platform/control plane with clusters split by region, sensitivity or criticality.",
          "Make the boundary an explicit risk and ownership decision, not a team-preference decision."
        ],
        "number": 5,
        "question": "Should an organization operate one central streaming cluster or multiple domain-owned clusters?"
      },
      {
        "answers": [
          "Keep local ingestion available during link failure; replicate asynchronously across the WAN.",
          "Minimize cross-boundary chatter and compress/batch transfers.",
          "Use consistent identity, schema governance, encryption and observability across environments.",
          "Design for duplicate delivery, reordered events and long disconnections."
        ],
        "number": 6,
        "question": "How would you design a streaming platform spanning cloud and on-premises environments?"
      },
      {
        "answers": [
          "Calculate peak bytes/sec and events/sec for produce and consume, including replication.",
          "Partitions = max of throughput need, consumer parallelism and recovery-time need—with growth headroom.",
          "Storage = ingress × retention × replication, adjusted for compression and compaction.",
          "Benchmark realistic payloads; formulas are a starting point, not a substitute for tests."
        ],
        "number": 7,
        "question": "How do you estimate partitions, throughput, storage, and compute capacity?"
      },
      {
        "answers": [
          "Buffer in the durable log and size for the expected burst duration, not only the rate.",
          "Use producer backoff, quotas and admission control to protect the platform.",
          "Autoscale consumers on lag plus processing latency, with downstream rate limits.",
          "Define degradation: delay noncritical streams, shed optional events or sample telemetry."
        ],
        "number": 8,
        "question": "How would you handle traffic bursts that are ten times the normal volume?"
      },
      {
        "answers": [
          "Centralize security, naming, schema compatibility, retention guardrails, SLOs and observability.",
          "Standardize SDKs and safe defaults, not every implementation detail.",
          "Teams own event meaning, business SLIs, consumer logic and domain evolution.",
          "Use exceptions with expiry and recorded rationale."
        ],
        "number": 9,
        "question": "What should be standardized centrally, and what should remain under individual teams’ control?"
      },
      {
        "answers": [
          "Identify business outcomes first; do not migrate merely to adopt streaming.",
          "Introduce an outbox or CDC feed, then run old and new paths in parallel.",
          "Compare outputs, reconcile gaps and move consumers incrementally.",
          "Define rollback, data ownership and decommission criteria before cutover."
        ],
        "number": 10,
        "question": "How would you migrate from a legacy queue or batch system to an event-driven architecture?"
      }
    ],
    "name": "Architecture & design"
  },
  {
    "id": "events-contracts",
    "items": [
      {
        "answers": [
          "It represents an immutable business fact in past tense and has a clear owner.",
          "Include stable identity, event time, schema version, trace/correlation IDs and useful domain context.",
          "Keep semantics precise and independent of one consumer.",
          "Classify sensitive fields and define retention and compatibility expectations."
        ],
        "number": 11,
        "question": "What makes a well-designed event?"
      },
      {
        "answers": [
          "An <strong>event</strong> states a fact; a <strong>command</strong> requests an action and may be rejected.",
          "A notification is usually a lightweight signal telling consumers where to fetch state.",
          "A state-change record describes before/after or changed fields, often close to storage representation.",
          "Naming the type clarifies ownership, coupling and delivery expectations."
        ],
        "number": 12,
        "question": "How do events differ from commands, notifications, and state-change records?"
      },
      {
        "answers": [
          "Full state simplifies consumers and replay but increases size and sensitive-data exposure.",
          "Deltas reduce volume but require ordered history and consumer state.",
          "Use facts/deltas for domain events; use snapshots or compacted streams for current-state distribution.",
          "Choose per use case and document reconstruction rules."
        ],
        "number": 13,
        "question": "Should an event contain the complete entity state or only the changed fields?"
      },
      {
        "answers": [
          "The domain producing the fact owns its meaning, schema and lifecycle.",
          "Record owners in a catalog with contacts, SLOs, classification and dependencies.",
          "Platform teams enforce compatibility and policy; they should not own business semantics.",
          "Consumers influence contracts but do not unilaterally control producer models."
        ],
        "number": 14,
        "question": "How would you define ownership of topics and event schemas?"
      },
      {
        "answers": [
          "Prefer additive optional fields and tolerant readers.",
          "Enforce backward/forward compatibility in CI and the schema registry.",
          "Give fields stable semantics; never reuse a removed field identifier.",
          "For semantic breaks, publish a versioned event/topic and migrate consumers deliberately."
        ],
        "number": 15,
        "question": "How do you evolve schemas without breaking existing consumers?"
      },
      {
        "answers": [
          "Only when semantics truly change, compatibility blocks safety, or accumulated debt outweighs migration cost.",
          "Create a new contract/version rather than silently changing the old one.",
          "Inventory consumers, communicate deadlines, dual-publish and observe adoption.",
          "Retire the old version only after evidence shows no active dependency."
        ],
        "number": 16,
        "question": "When would you allow breaking schema changes?"
      },
      {
        "answers": [
          "Minimize data at the source; publish references or tokens instead of raw sensitive fields.",
          "Classify schemas and block unauthorized fields through policy checks.",
          "Encrypt in transit/at rest and enforce least-privilege topic access.",
          "Use short retention, audit consumption and support deletion through encryption keys or externalized data."
        ],
        "number": 17,
        "question": "How would you prevent personally identifiable or sensitive data from spreading through events?"
      },
      {
        "answers": [
          "Choose the smallest business aggregate requiring order, such as account or order ID.",
          "Measure key distribution and cardinality; avoid time-based or globally constant keys.",
          "Salt/shard hot keys only if the business can tolerate weaker ordering or downstream merge logic.",
          "Treat key changes as a contract change because partition placement changes."
        ],
        "number": 18,
        "question": "How do you design event keys to preserve ordering while distributing load?"
      },
      {
        "answers": [
          "First remove unnecessary fields and use compact serialization/compression.",
          "For large blobs, store the object separately and publish a secured reference plus checksum.",
          "Set size limits and monitor oversized-event rejections.",
          "Account for reference expiry, access control and atomicity between blob and event."
        ],
        "number": 19,
        "question": "How do you handle large event payloads?"
      },
      {
        "answers": [
          "Usually no: internal models change for implementation reasons and leak coupling.",
          "Publish deliberate contracts reflecting stable business facts.",
          "Translate internal models at the boundary and test contract compatibility.",
          "Direct publication may be acceptable for a tightly bounded internal stream with explicit ownership."
        ],
        "number": 20,
        "question": "Should producers publish internal domain models directly as events? Why or why not?"
      }
    ],
    "name": "Events & contracts"
  },
  {
    "id": "delivery-correctness",
    "items": [
      {
        "answers": [
          "At-most-once may lose messages but does not retry duplicates.",
          "At-least-once retries until acknowledged, so consumers must tolerate duplicates.",
          "Exactly-once means each input affects the defined transactional boundary once—not that the network delivers only once.",
          "State the boundary and failure assumptions whenever using these terms."
        ],
        "number": 21,
        "question": "Explain at-most-once, at-least-once, and exactly-once processing."
      },
      {
        "answers": [
          "Only within a controlled transactional boundary, such as broker read-process-write with transactions.",
          "External email, payments or arbitrary databases break that boundary unless they support compatible idempotency/transactions.",
          "Aim for <strong>effectively once</strong>: durable retries, idempotency keys, deduplication and reconciliation.",
          "Define the business invariant rather than promising a slogan."
        ],
        "number": 22,
        "question": "Is end-to-end exactly-once processing actually achievable?"
      },
      {
        "answers": [
          "Use a stable event or business-operation ID.",
          "Store the deduplication marker atomically with the state change.",
          "Prefer naturally idempotent upserts or state transitions guarded by version.",
          "Choose retention for keys based on maximum replay/retry horizon."
        ],
        "number": 23,
        "question": "How would you make a consumer idempotent?"
      },
      {
        "answers": [
          "Create a business idempotency key for the payment intent.",
          "Persist the intent and result under a unique constraint before acknowledging the event.",
          "Pass the same key to the payment provider and safely return the prior result on retry.",
          "Reconcile provider records against internal state; never rely only on broker offsets."
        ],
        "number": 24,
        "question": "How do you prevent duplicate business actions, such as charging a customer twice?"
      },
      {
        "answers": [
          "If supported, use a transaction containing the business update and inbox/dedup row.",
          "Acknowledge/commit the stream offset only after the database transaction succeeds.",
          "For a new outgoing event, write an outbox record in the same transaction.",
          "Accept redelivery and design for idempotency because DB and broker rarely share one transaction."
        ],
        "number": 25,
        "question": "How would you process an event and update a database atomically?"
      },
      {
        "answers": [
          "Outbox: reliable business event written with application data; requires a relay and cleanup.",
          "CDC: low-touch capture of database changes; may expose storage semantics and ordering complexity.",
          "Dual write: simplest code but inconsistent when only one write succeeds.",
          "Prefer outbox/CDC for reliability; use dual write only with explicit reconciliation and acceptable risk."
        ],
        "number": 26,
        "question": "Compare the transactional outbox, change-data capture, and dual-write approaches."
      },
      {
        "answers": [
          "A transactional producer atomically writes records/offsets across Kafka partitions; read-committed consumers hide aborted writes.",
          "Producer IDs and epochs fence stale producers.",
          "Transactions do not make external databases or APIs atomic with Kafka.",
          "They add operational/latency cost and still require clear timeout and retry handling."
        ],
        "number": 27,
        "question": "How do Kafka transactions work, and what problems do they not solve?"
      },
      {
        "answers": [
          "Enable idempotent production and use acknowledgements appropriate to durability.",
          "Reuse producer identity/session correctly and bound in-flight requests as required by the client.",
          "Attach a stable event ID for downstream deduplication across restarts or application-level retries.",
          "Monitor ambiguous timeouts: success may have occurred even when the response was lost."
        ],
        "number": 28,
        "question": "How would you handle producer retries without producing duplicate events?"
      },
      {
        "answers": [
          "Keep it in the same transactional store as the side effect whenever possible.",
          "Key it by event ID or business operation ID with a unique constraint.",
          "Retain it beyond the maximum retry, replay and disaster-recovery window.",
          "For permanent financial invariants, business records may be better than expiring cache entries."
        ],
        "number": 29,
        "question": "Where should deduplication state live, and how long should it be retained?"
      },
      {
        "answers": [
          "Inject broker, network, process and dependency failures at each acknowledgement boundary.",
          "Verify invariants: no lost accepted events, expected duplicates, no duplicate business effect.",
          "Test crashes before/after state write and before/after offset commit.",
          "Reconcile input IDs to outputs and automate the test under sustained load."
        ],
        "number": 30,
        "question": "How would you test that delivery guarantees hold during failures?"
      }
    ],
    "name": "Delivery & correctness"
  },
  {
    "id": "ordering-time-state",
    "items": [
      {
        "answers": [
          "Typically, order is guaranteed only within one partition and only for successfully appended records.",
          "No global order exists across partitions without coordination.",
          "Retries, replication and consumers can affect observed order depending on configuration.",
          "Define the exact business key whose order matters."
        ],
        "number": 31,
        "question": "What ordering guarantees does a partitioned streaming system provide?"
      },
      {
        "answers": [
          "Partition by customer ID so all customer events share one ordered partition.",
          "Scale across customers, not within one customer's ordered stream.",
          "Use enough partitions and monitor skew.",
          "If a single customer is too hot, revisit whether every event truly requires total per-customer order."
        ],
        "number": 32,
        "question": "How would you preserve ordering for a customer while still scaling horizontally?"
      },
      {
        "answers": [
          "One partition/broker and one consumer lane saturate while others remain idle.",
          "Apply producer quotas and diagnose whether the key reflects a real aggregate or poor key design.",
          "Options: split the logical key, pre-aggregate, isolate the tenant or use two-stage processing.",
          "Each split trades away simple total ordering and requires explicit merge semantics."
        ],
        "number": 33,
        "question": "What happens when a partition key becomes a hot key?"
      },
      {
        "answers": [
          "Use event time, watermarks and an explicit allowed-lateness policy.",
          "Keep state until lateness expires; emit corrections/upserts for late results.",
          "Route extremely late or invalid events for analysis rather than silently dropping them.",
          "Match policy to business cost: fraud and billing differ from dashboards."
        ],
        "number": 34,
        "question": "How should a system handle late or out-of-order events?"
      },
      {
        "answers": [
          "Event time is when the business event occurred; ingestion time is platform arrival.",
          "Processing time is when compute handled it.",
          "A watermark estimates that most events before a time have arrived.",
          "Watermarks enable bounded state and timely windows but intentionally trade completeness for latency."
        ],
        "number": 35,
        "question": "Explain event time, processing time, ingestion time, and watermarks."
      },
      {
        "answers": [
          "Measure the real arrival-delay distribution by source and failure mode.",
          "Balance result freshness, correction cost, state size and business tolerance.",
          "Use stricter thresholds for interactive views and longer ones for settlement/accuracy.",
          "Monitor late-event rate and revisit the threshold as source behavior changes."
        ],
        "number": 36,
        "question": "How would you choose an acceptable lateness threshold?"
      },
      {
        "answers": [
          "Tumbling windows are fixed, adjacent and non-overlapping.",
          "Sliding/hopping windows overlap and update more frequently, increasing compute/state.",
          "Session windows group activity separated by an inactivity gap.",
          "Choose based on business meaning, not only implementation convenience."
        ],
        "number": 37,
        "question": "How do tumbling, sliding, and session windows differ?"
      },
      {
        "answers": [
          "Store keyed state through the engine's managed, durable checkpoint mechanism.",
          "Checkpoint source positions and state consistently; use deterministic processing where possible.",
          "Place checkpoints in replicated external storage and test restore time.",
          "Make sinks transactional/idempotent so recovery does not duplicate effects."
        ],
        "number": 38,
        "question": "How would you build a stateful streaming application that can recover safely?"
      },
      {
        "answers": [
          "Snapshots capture a point-in-time copy of operator state.",
          "Changelogs record incremental mutations and can rebuild local state.",
          "Checkpoints coordinate state with input positions and sometimes sink commits.",
          "Recovery time depends on checkpoint size, frequency, storage speed and replay distance."
        ],
        "number": 39,
        "question": "How do checkpoints, snapshots, and changelogs support recovery?"
      },
      {
        "answers": [
          "Latency rises, checkpoints slow or fail, and recovery may exceed the SLO.",
          "Bound state with TTLs, watermarks, aggregation or partitioning.",
          "Use disk-backed state and incremental checkpoints where supported.",
          "Treat unbounded keys/windows as a design flaw unless capacity and lifecycle are explicit."
        ],
        "number": 40,
        "question": "What happens when a streaming job’s state grows beyond available memory or local storage?"
      }
    ],
    "name": "Ordering, time & state"
  },
  {
    "id": "failure-resilience",
    "items": [
      {
        "answers": [
          "Apply bounded concurrency, timeouts, circuit breakers and exponential backoff with jitter.",
          "Let durable lag absorb temporary outages; do not retry in a tight loop.",
          "Protect the downstream with rate limits and bulkheads.",
          "Define when to pause, degrade, route to retry storage or alert an operator."
        ],
        "number": 41,
        "question": "How should consumers behave when downstream dependencies become slow or unavailable?"
      },
      {
        "answers": [
          "Backpressure occurs when downstream processing is slower than upstream production.",
          "Detect it through growing lag, queue depth, blocked time, checkpoint duration and end-to-end latency.",
          "Manage it with flow control, bounded buffers, autoscaling, batching and rate limits.",
          "If sustained, reduce input or increase capacity; memory queues only delay the failure."
        ],
        "number": 42,
        "question": "What is backpressure, and how would you detect and manage it?"
      },
      {
        "answers": [
          "Classify errors: timeouts/5xx are usually transient; schema, validation and missing-required-data errors are often permanent.",
          "Retry only known transient classes with a budget and jitter.",
          "Send permanent failures to a governed quarantine path with reason and context.",
          "Allow re-drive after correction and track error rates by producer/schema."
        ],
        "number": 43,
        "question": "How do you distinguish transient failures from permanently invalid events?"
      },
      {
        "answers": [
          "Use short in-process retries for brief faults, then delayed retry topics for longer recovery.",
          "Cap attempts and total age; preserve original ID, payload, error and attempt metadata.",
          "Use DLQs for exceptional manual/automated remediation, not routine control flow.",
          "Define ownership, alerts, retention and a safe replay mechanism."
        ],
        "number": 44,
        "question": "What is your strategy for retries, retry topics, and dead-letter queues?"
      },
      {
        "answers": [
          "They make the main pipeline look healthy while silently accumulating lost business work.",
          "Without ownership, alerting and replay tooling, records are never resolved.",
          "Payloads can become stale, incompatible or noncompliant during retention.",
          "Track age/count/value at risk and require a remediation SLO."
        ],
        "number": 45,
        "question": "Why can dead-letter queues become operational graveyards?"
      },
      {
        "answers": [
          "Identify deterministic failures and capture the event plus error safely.",
          "After bounded retries, quarantine it and commit past it only if business policy allows.",
          "For strict ordering, pause the key/partition and remediate instead of skipping.",
          "Preserve auditability and offer controlled re-drive after the fix."
        ],
        "number": 46,
        "question": "How would you recover from a poison-pill event without stopping an entire partition?"
      },
      {
        "answers": [
          "Partition ownership moves between members; processing may pause.",
          "Consumers must stop revoked work, flush/commit safely and initialize newly assigned partitions.",
          "Poor handling can cause duplicates, long stalls or concurrent processing.",
          "Frequent rebalances usually indicate unstable membership, slow polls or scaling churn."
        ],
        "number": 47,
        "question": "What happens during a consumer-group rebalance?"
      },
      {
        "answers": [
          "Use cooperative/incremental assignment and static membership where appropriate.",
          "Keep the poll loop responsive; move long work off it with bounded handoff.",
          "Tune session and processing timeouts based on measured behavior.",
          "Avoid rapid autoscaling oscillation and excessive partition counts."
        ],
        "number": 48,
        "question": "How would you minimize disruption caused by rebalances?"
      },
      {
        "answers": [
          "Stop producers/consumers to prevent further divergence and preserve evidence.",
          "Restore from cross-cluster replication, archive/object storage or upstream source of truth.",
          "Recreate configuration/ACLs/schemas and replay from a known checkpoint.",
          "Reconcile outputs, then add deletion protection, backups and tested restore drills."
        ],
        "number": 49,
        "question": "How do you recover from accidentally deleting or corrupting a topic?"
      },
      {
        "answers": [
          "Follow declared RPO/RTO: stop, degrade or fail over only the streams designed for it.",
          "Fence the failed region to avoid split-brain writers.",
          "Redirect producers/consumers, restore offsets/state and accept documented duplicates or loss.",
          "Reconcile on recovery and test this process regularly—not only on paper."
        ],
        "number": 50,
        "question": "How would the platform behave during a regional failure?"
      }
    ],
    "name": "Failure & resilience"
  },
  {
    "id": "replay-reprocessing",
    "items": [
      {
        "answers": [
          "Replay when logic was wrong, a derived view is rebuildable, or many records are affected.",
          "Use manual correction for isolated cases where replay would trigger dangerous side effects.",
          "Ensure source history is complete and compatible with current code.",
          "Make the choice auditable and validate the corrected outcome."
        ],
        "number": 51,
        "question": "When should an event be replayed rather than corrected manually?"
      },
      {
        "answers": [
          "Use a separate consumer group/job and often a separate replay topic or isolated cluster resources.",
          "Throttle replay and prioritize live workloads.",
          "Write to shadow outputs first; compare before cutover.",
          "Tag replay context so consumers can suppress notifications or irreversible actions."
        ],
        "number": 52,
        "question": "How would you replay historical events without affecting live production traffic?"
      },
      {
        "answers": [
          "Separate state-building consumers from effectful consumers.",
          "Use business idempotency keys and a ledger of completed effects.",
          "Disable or route effects to a sandbox during replay.",
          "Require an explicit replay mode, scope, approval and reconciliation plan."
        ],
        "number": 53,
        "question": "How do you prevent replay from repeating irreversible side effects?"
      },
      {
        "answers": [
          "Create a new view/version and replay from the earliest valid offset or snapshot.",
          "Apply deterministic upserts keyed by entity and version.",
          "Catch up to live traffic, compare counts/checksums/business invariants, then switch reads.",
          "Keep the old view for rollback until confidence is high."
        ],
        "number": 54,
        "question": "How would you rebuild a materialized view from an event log?"
      },
      {
        "answers": [
          "New code may interpret old schemas or business rules differently.",
          "Use schema-aware deserialization and explicit upcasters/adapters.",
          "Version business logic when historical truth must reproduce prior outcomes.",
          "Test a representative historical sample before full replay."
        ],
        "number": 55,
        "question": "What happens when replaying old events against new application code?"
      },
      {
        "answers": [
          "Retain schemas as long as events are replayable.",
          "Guarantee readers can process every retained version or provide deterministic transformations.",
          "Never change a field's meaning in place.",
          "Include compatibility tests using archived historical payloads."
        ],
        "number": 56,
        "question": "How should schema evolution and replay be designed together?"
      },
      {
        "answers": [
          "Ask whether it contains complete, authoritative facts needed to reconstruct state.",
          "Verify retention, legal durability, correction semantics and ownership.",
          "If events are lossy notifications or expire early, the source database remains authoritative.",
          "Document the authority per entity; do not assume every Kafka topic is a ledger."
        ],
        "number": 57,
        "question": "How do you determine whether the event log is a system of record?"
      },
      {
        "answers": [
          "Choose start time/offset and ensure schemas/data are still available.",
          "Run isolated with controlled parallelism and rate limits.",
          "Write idempotently, monitor lag and validate totals/invariants.",
          "Only enable live side effects after the backfill reaches a safe boundary."
        ],
        "number": 58,
        "question": "How would you backfill a newly introduced consumer?"
      },
      {
        "answers": [
          "Compare record counts, unique keys, checksums and domain aggregates.",
          "Check invariants and sample records against the source of truth.",
          "Diff old versus rebuilt outputs and explain every intentional difference.",
          "Capture replay parameters and results for audit and repeatability."
        ],
        "number": 59,
        "question": "How do you validate that a replay produced the correct outcome?"
      },
      {
        "answers": [
          "Keep hot broker retention for operational replay and archive older events to cheaper object storage.",
          "Use compaction for latest-state streams, not as a substitute for immutable audit history.",
          "Set retention by recovery, legal and consumer needs per data class.",
          "Measure restore time and archive usability; cheap data that cannot be replayed is not a backup."
        ],
        "number": 60,
        "question": "What retention strategy supports both recovery requirements and cost constraints?"
      }
    ],
    "name": "Replay & reprocessing"
  },
  {
    "id": "observability-operations",
    "items": [
      {
        "answers": [
          "Ingress/egress rate, request latency/errors, partition availability, replication health and disk/network saturation.",
          "Consumer lag, lag age, processing latency, retry/DLQ rate and checkpoint health.",
          "End-to-end freshness, completeness and correctness for business-critical flows.",
          "Capacity headroom and quota/throttle events by tenant."
        ],
        "number": 61,
        "question": "Which metrics define the health of a streaming platform?"
      },
      {
        "answers": [
          "Offset lag ignores event age and varies with production rate.",
          "Low lag can coexist with dropped, corrupt or wrongly processed events.",
          "A stopped producer can make lag look healthy while data is stale.",
          "Combine lag with last-event age, end-to-end latency, throughput and business reconciliation."
        ],
        "number": 62,
        "question": "Why is consumer lag useful but insufficient?"
      },
      {
        "answers": [
          "Compare production rate, broker request latency/throttling and consumer fetch rate.",
          "Inspect consumer processing time, pauses, rebalances, GC/CPU and partition skew.",
          "Measure downstream call latency, error and pool saturation.",
          "Trace one event end to end and correlate the onset across layers."
        ],
        "number": 63,
        "question": "How would you determine whether lag is caused by producers, brokers, consumers, or downstream systems?"
      },
      {
        "answers": [
          "Freshness: event-time-to-visible-time percentile and age of newest successfully processed event.",
          "Completeness: accepted source events represented in the destination within a window.",
          "Correctness: invariant/checksum or reconciliation success rate.",
          "Define SLOs by critical journey, with exclusions and measurement points explicit."
        ],
        "number": 64,
        "question": "What service-level indicators would you use for streaming freshness and completeness?"
      },
      {
        "answers": [
          "Propagate trace context plus stable correlation, causation and business IDs in event headers.",
          "Create spans for produce, broker wait, consume and downstream calls.",
          "Link traces rather than forcing one infinitely long parent-child chain.",
          "Keep searchable audit metadata while protecting sensitive payloads."
        ],
        "number": 65,
        "question": "How would you trace a business transaction across several asynchronous services?"
      },
      {
        "answers": [
          "Reconcile counts and IDs across source, log and sink.",
          "Use checksums, canary events and domain invariants.",
          "Monitor schema/content distributions for unexpected shifts.",
          "Periodically rebuild or sample against the source of truth."
        ],
        "number": 66,
        "question": "How do you monitor silent data loss or semantic corruption when infrastructure appears healthy?"
      },
      {
        "answers": [
          "Platform owns broker availability, replication, storage, quotas, shared security and control-plane failures.",
          "Applications own processing failures, semantic validity, business freshness and DLQ remediation.",
          "Share end-to-end SLO alerts with explicit primary responder and escalation.",
          "Alerts must be actionable and tied to runbooks."
        ],
        "number": 67,
        "question": "What alerts should be platform-owned versus application-owned?"
      },
      {
        "answers": [
          "Stamp trustworthy event time and record timestamps at publish, broker, consume and sink visibility.",
          "Report percentiles and segment by topic, partition, tenant and stage.",
          "Separate transport latency from queue wait and processing time.",
          "Handle clock skew or use duration measured by trace spans where possible."
        ],
        "number": 68,
        "question": "How would you measure end-to-end event latency?"
      },
      {
        "answers": [
          "Use production-like payloads, keys, consumer behavior and downstream limits.",
          "Test steady state, bursts, skew, broker loss, network partitions and dependency failure.",
          "Measure SLOs, data invariants, recovery time and operational effort.",
          "Repeat regularly and convert discoveries into capacity and runbook changes."
        ],
        "number": 69,
        "question": "How do you conduct load, failure, and recovery testing?"
      },
      {
        "answers": [
          "Current health, SLO status, throughput, latency, errors, lag age and capacity headroom.",
          "Top throttled tenants, hot partitions, failed jobs, retries/DLQs and schema changes.",
          "Ownership, dependencies, recent deployments and runbook links.",
          "Provide drill-down from business flow to cluster/topic/partition without exposing sensitive payloads."
        ],
        "number": 70,
        "question": "What information should be available in a streaming platform’s operational dashboard?"
      }
    ],
    "name": "Observability & operations"
  },
  {
    "id": "security-governance",
    "items": [
      {
        "answers": [
          "Use workload identities and role/group-based policies, not shared credentials.",
          "Generate least-privilege ACLs from declarative ownership metadata.",
          "Separate produce, consume and administration permissions.",
          "Continuously audit drift, stale access and unusual consumption."
        ],
        "number": 71,
        "question": "How would you implement topic-level authorization for hundreds of teams?"
      },
      {
        "answers": [
          "Use short-lived workload identity/federation instead of embedded secrets.",
          "Rotate automatically and scope credentials to environment and purpose.",
          "Encrypt in transit and at rest; manage keys through a central KMS with audited access.",
          "Support revocation without restarting the whole platform."
        ],
        "number": 72,
        "question": "How should service identities, credentials, and encryption keys be managed?"
      },
      {
        "answers": [
          "Avoid putting deletable personal data in long-lived logs; store a token/reference instead.",
          "Delete referenced data or destroy per-subject encryption keys where policy permits.",
          "Use tombstones/compaction for current-state streams, understanding old segments/backups persist until expiry.",
          "Document retention and downstream deletion propagation with legal/security review."
        ],
        "number": 73,
        "question": "How do you satisfy deletion or “right to be forgotten” requirements in immutable logs?"
      },
      {
        "answers": [
          "Attach classification, owner and purpose metadata to schemas/topics.",
          "Use policy-as-code to restrict fields, regions, consumers and maximum retention.",
          "Scan payloads/registries for violations and block unsafe deployment where justified.",
          "Audit exceptions and expire them automatically."
        ],
        "number": 74,
        "question": "How do you enforce data classification and retention policies?"
      },
      {
        "answers": [
          "Require authenticated identities and log every authorization decision.",
          "Alert on denied requests, new access patterns, unusual volume and cross-domain reads.",
          "Reconcile runtime ACLs with declared ownership continuously.",
          "Use network boundaries and broker audit logs for investigation."
        ],
        "number": 75,
        "question": "How would you identify unauthorized producers or consumers?"
      },
      {
        "answers": [
          "Yes through self-service APIs with guardrails, templates, quotas and ownership metadata.",
          "Default replication, retention, encryption and naming should be safe.",
          "High-risk data or exceptional capacity can require approval.",
          "Prevent direct unmanaged broker administration."
        ],
        "number": 76,
        "question": "Should teams be allowed to create topics themselves?"
      },
      {
        "answers": [
          "Register schemas and enforce compatibility in CI and at publish time.",
          "Run consumer-driven contract and historical-payload tests.",
          "Restrict incompatible changes and require versioned migration.",
          "Observe new schema adoption and support fast producer rollback."
        ],
        "number": 77,
        "question": "How do you prevent breaking contracts from reaching production?"
      },
      {
        "answers": [
          "Who created/changed/deleted topics, schemas, ACLs, retention and quotas—and when.",
          "Producer/consumer identity and access decisions for sensitive streams.",
          "Replay, re-drive and administrative actions with scope and reason.",
          "Retain audit logs separately under tamper-resistant, policy-aligned controls."
        ],
        "number": 78,
        "question": "What audit information should be retained?"
      },
      {
        "answers": [
          "Use explicit contracts, allowlists, mutual authentication and encryption.",
          "Minimize/filter fields at the boundary and validate schemas.",
          "Apply region-specific residency, retention and key management.",
          "Isolate shared topics/accounts and monitor egress and consumer behavior."
        ],
        "number": 79,
        "question": "How would you secure cross-region or cross-company event sharing?"
      },
      {
        "answers": [
          "Encode governance into paved-road tooling and safe defaults.",
          "Automate routine approvals and make policy errors explainable.",
          "Reserve human review for material risk or exception paths.",
          "Measure lead time, exception rate and incidents to tune the controls."
        ],
        "number": 80,
        "question": "How do you balance governance with developer self-service?"
      }
    ],
    "name": "Security & governance"
  },
  {
    "id": "technology-trade-offs",
    "items": [
      {
        "answers": [
          "Kafka: broad ecosystem, durable log and operational control; Pulsar: strong multi-tenancy and separated storage/compute.",
          "Kinesis/Pub/Sub: managed cloud integration and lower operations, with provider limits/lock-in.",
          "Traditional queue: task distribution, per-message ack and simpler work semantics.",
          "Choose from requirements, team capability, ecosystem, cost and exit strategy—not popularity."
        ],
        "number": 81,
        "question": "When would you choose Kafka, Pulsar, Kinesis, Pub/Sub, or a traditional queue?"
      },
      {
        "answers": [
          "Flink for sophisticated stateful/event-time processing and low latency.",
          "Kafka Streams for embedded Kafka-centric services with simpler operations.",
          "Spark Structured Streaming for teams already using Spark and mixed batch/stream workloads.",
          "Database-native features for smaller, local transformations; benchmark semantics and scale."
        ],
        "number": 82,
        "question": "When should stream processing use Flink, Kafka Streams, Spark, or a database-native solution?"
      },
      {
        "answers": [
          "Managed reduces operations and speeds adoption but may cost more and constrain configuration/portability.",
          "Self-hosted gives control and potential scale economics but requires deep 24×7 expertise.",
          "Compare total cost, compliance, SLO responsibility, upgrade pace and failure ownership.",
          "Avoid self-hosting unless control is strategically valuable."
        ],
        "number": 83,
        "question": "What are the trade-offs between managed and self-hosted streaming platforms?"
      },
      {
        "answers": [
          "For keyed streams where the latest value per key matters, such as configuration or entity state.",
          "It reduces history but does not guarantee only one record per key at every moment.",
          "Tombstones support deletion after configured retention.",
          "Do not use it when complete immutable history is required."
        ],
        "number": 84,
        "question": "When is log compaction appropriate?"
      },
      {
        "answers": [
          "More partitions increase parallelism but also metadata, file handles, rebalances and recovery work.",
          "Higher replication improves durability/availability but multiplies storage and network cost.",
          "Too few partitions cap throughput; too many make operations slow.",
          "Size from measured workload and failure/recovery targets with headroom."
        ],
        "number": 85,
        "question": "How do partition count and replication factor affect performance, cost, and availability?"
      },
      {
        "answers": [
          "Controller/metadata pressure, longer elections and rebalances, more open files and memory use.",
          "Sparse partitions waste resources and complicate capacity planning.",
          "Operational tasks and recovery take longer.",
          "Use lifecycle automation, quotas and topic/partition reviews."
        ],
        "number": 86,
        "question": "What are the risks of having too many topics or partitions?"
      },
      {
        "answers": [
          "Use CDC for legacy systems, replication, caches/search and low-touch integration.",
          "Use application events when business intent and semantics matter.",
          "Raw CDC exposes table design and may miss intent spanning multiple rows.",
          "A common pattern transforms CDC/outbox records into governed domain events."
        ],
        "number": 87,
        "question": "When would you use change-data capture instead of application-produced events?"
      },
      {
        "answers": [
          "Event sourcing stores domain events as the authoritative state model for an aggregate.",
          "Event streaming transports/stores records for asynchronous processing and does not imply event-sourced design.",
          "An event-sourced system often publishes streams, but many streams are not systems of record.",
          "Event sourcing adds versioning, correction and modeling obligations."
        ],
        "number": 88,
        "question": "How do event sourcing and event streaming differ?"
      },
      {
        "answers": [
          "Pull gives consumers control over pace, batching and backpressure.",
          "Push can reduce latency and simplify clients but requires receiver availability and flow control.",
          "Pull naturally suits durable logs; push suits webhooks/notifications.",
          "Both need retries, authentication, idempotency and overload protection."
        ],
        "number": 89,
        "question": "What are the trade-offs between push- and pull-based consumption?"
      },
      {
        "answers": [
          "When minutes/hours of latency are acceptable and batch is simpler.",
          "When the workflow requires a synchronous answer or strong cross-entity transaction.",
          "When event volume/consumer count is tiny and operations exceed the value.",
          "When the organization cannot own contracts, observability and failure handling."
        ],
        "number": 90,
        "question": "When is a streaming architecture unnecessary or harmful?"
      }
    ],
    "name": "Technology trade-offs"
  },
  {
    "id": "staff-leadership",
    "items": [
      {
        "answers": [
          "Start from business capabilities and current pain, not a product roadmap.",
          "Define principles, target operating model, platform boundaries, SLO tiers and governance.",
          "Sequence migration into measurable increments with adoption and reliability metrics.",
          "Include skills, funding, decommissioning and explicit review points as assumptions change."
        ],
        "number": 91,
        "question": "How would you define a three-year streaming strategy for an enterprise?"
      },
      {
        "answers": [
          "Treat it as a product when many teams need a consistent self-service experience.",
          "Shared infrastructure alone may suit a small expert user base.",
          "A platform needs customers, roadmap, support, SLOs and adoption measures—not only clusters.",
          "Choose ownership based on strategic leverage and recurring cognitive load."
        ],
        "number": 92,
        "question": "How would you decide whether streaming should be a platform, a product, or shared infrastructure?"
      },
      {
        "answers": [
          "Time to onboard and ship a new use case; percentage using paved roads.",
          "Freshness/reliability improvements and incidents avoided or recovered faster.",
          "Engineering effort and infrastructure cost per workload.",
          "Business outcomes enabled—fraud latency, inventory freshness, customer experience—not topic count."
        ],
        "number": 93,
        "question": "How would you measure whether the streaming platform is delivering business value?"
      },
      {
        "answers": [
          "Make the paved road faster, safer and cheaper than custom solutions.",
          "Start with high-value lighthouse teams and publish measured wins.",
          "Provide migration support, good documentation and useful defaults.",
          "Mandate only cross-company safety/interop standards; earn preference for the rest."
        ],
        "number": 94,
        "question": "How do you gain adoption without forcing every team onto the platform?"
      },
      {
        "answers": [
          "Map the business capability and source of truth, then assign ownership to that domain.",
          "Separate production ownership from shared contract governance.",
          "Document decision rights, consumer needs and change process.",
          "Escalate using enterprise principles and risk, not organizational seniority."
        ],
        "number": 95,
        "question": "How would you resolve disagreement between teams over event ownership?"
      },
      {
        "answers": [
          "Inventory patterns, risks and successful practices before prescribing.",
          "Define a small mandatory baseline for identity, schemas, ownership and observability.",
          "Offer adapters and gradual migration rather than a flag day.",
          "Track exceptions, set sunset dates and evolve standards from evidence."
        ],
        "number": 96,
        "question": "How would you introduce standards into an organization with many existing streaming implementations?"
      },
      {
        "answers": [
          "Standardize interfaces, policies, telemetry and lifecycle—not every internal choice.",
          "Provide reference architectures and reusable building blocks.",
          "Create clear criteria for deviations and make them visible.",
          "Use architecture reviews for novel risk, not routine gatekeeping."
        ],
        "number": 97,
        "question": "How do you prevent architectural fragmentation while allowing local autonomy?"
      },
      {
        "answers": [
          "Set non-negotiable safety/security floors and SLO tiers by business criticality.",
          "Quantify trade-offs with incidents, toil, lead time, utilization and risk.",
          "Prioritize bottlenecks affecting many teams or existential business risk.",
          "Make deferred work and accepted risk explicit to accountable leaders."
        ],
        "number": 98,
        "question": "How would you prioritize reliability, developer experience, cost, security, and feature delivery?"
      },
      {
        "answers": [
          "Create shared outcomes, dependency map, owners and decision forum.",
          "Migrate in slices with dual run, reconciliation, rollback and readiness gates.",
          "Publish status and risks using business language.",
          "Keep old-path retirement as a planned deliverable with an accountable date."
        ],
        "number": 99,
        "question": "Describe how you would lead a high-risk streaming migration involving many teams."
      },
      {
        "answers": [
          "Identify differentiating capabilities versus commodity operations.",
          "Compare five-year total cost, skills, compliance, SLOs, ecosystem and lock-in.",
          "Run a representative proof of value with failure and migration tests.",
          "Build only what creates strategic leverage; retain an exit path."
        ],
        "number": 100,
        "question": "How would you decide whether to buy, build, or adopt an open-source platform?"
      },
      {
        "answers": [
          "A platform team owns shared control plane, paved roads and platform SLOs.",
          "Domain teams own event semantics, producer quality and business consumer outcomes.",
          "Enablement/SRE/security capabilities may be embedded or partnered with clear escalation.",
          "Use a federated council for standards, not a committee for every change."
        ],
        "number": 101,
        "question": "What operating model and team structure would you recommend?"
      },
      {
        "answers": [
          "Connect risks to revenue, customer impact, compliance and recovery time.",
          "Use scenarios and quantified exposure, not broker terminology.",
          "Present options with cost, risk reduction and time-to-value.",
          "Ask for a decision and name the residual risk of doing nothing."
        ],
        "number": 102,
        "question": "How would you explain streaming risks and investment needs to executives?"
      },
      {
        "answers": [
          "Postpone irreversible choices when scale, tenancy or recovery requirements remain unknown.",
          "Use a reversible baseline with measurement points and thresholds.",
          "Examples: active-active regions, custom platform, or premature event sourcing.",
          "Record the trigger and owner for revisiting the decision."
        ],
        "number": 103,
        "question": "Describe a streaming architecture decision you would deliberately postpone."
      },
      {
        "answers": [
          "Use catalog ownership, access logs, consumer-group activity and lineage.",
          "Contact owners and verify business/legal retention before removal.",
          "Deprecate, block new dependencies, observe a quiet period, then archive/delete.",
          "Automate stale-resource reporting and cost visibility."
        ],
        "number": 104,
        "question": "How do you identify and retire unnecessary event streams and consumers?"
      },
      {
        "answers": [
          "Domain ownership; immutable facts; versioned, compatible contracts.",
          "At-least-once by default with idempotent consumers and explicit ordering scope.",
          "Security/data minimization, observable SLOs and tested replay/recovery.",
          "Self-service guardrails, lifecycle ownership and documented exceptions."
        ],
        "number": 105,
        "question": "What principles would you include in an enterprise streaming architecture standard?"
      }
    ],
    "name": "Staff+ leadership"
  },
  {
    "id": "deep-scenarios",
    "items": [
      {
        "answers": [
          "Declare impact; check lag age, partition skew, rebalances, errors and downstream payment latency.",
          "Stop unsafe retries and protect payment idempotency.",
          "Restore dependency/capacity, then increase controlled parallelism without violating account/order ordering.",
          "Reconcile every payment intent and communicate backlog-clearance time."
        ],
        "number": 106,
        "question": "A payment consumer is six hours behind. How would you investigate and recover safely?"
      },
      {
        "answers": [
          "Rate-limit/isolate the tenant immediately and confirm whether per-customer total order is required.",
          "If not, shard by customer plus sub-key/bucket and merge where necessary.",
          "If yes, isolate to dedicated capacity or pre-aggregate at the producer.",
          "Add skew-aware capacity alerts and tenant quotas."
        ],
        "number": 107,
        "question": "One customer produces 40% of all traffic and overloads a partition. What would you change?"
      },
      {
        "answers": [
          "Stop or roll back the producer; identify offsets, topics and affected consumers.",
          "Preserve bad events, deploy an adapter/fixed version and reprocess safely.",
          "Validate consumer recovery and reconcile missed side effects.",
          "Add registry enforcement, historical contract tests and deployment gates."
        ],
        "number": 108,
        "question": "An event schema was changed incompatibly and deployed. How would you contain and repair the incident?"
      },
      {
        "answers": [
          "Effectful consumers lacked business idempotency and replay awareness.",
          "Replay was not isolated, scoped, rate-limited or approval-gated.",
          "There was no dry run/shadow output or value-at-risk check.",
          "Add kill switches, effect ledgers and explicit replay modes with audit."
        ],
        "number": 109,
        "question": "A replay accidentally sent millions of customer notifications. What controls were missing?"
      },
      {
        "answers": [
          "Check producer freshness first; zero lag can hide a stopped producer.",
          "Trace event time through consumer, transformations, caches and serving layer.",
          "Inspect semantic filters, watermark lateness, failed writes and stale cache invalidation.",
          "Add end-to-end freshness canaries and business SLIs."
        ],
        "number": 110,
        "question": "Broker metrics are healthy, but customers report stale data. How would you diagnose it?"
      },
      {
        "answers": [
          "Confirm the promised delivery semantic—duplicates are normal under at-least-once.",
          "Inspect crashes/rebalances between side effect and offset commit plus producer duplicates.",
          "Check whether event IDs and business idempotency prevent duplicate outcomes.",
          "It is a defect if the business invariant is violated or the documented contract promised otherwise."
        ],
        "number": 111,
        "question": "A consumer occasionally processes the same event twice. How do you determine whether this is a defect?"
      },
      {
        "answers": [
          "Ask which business decision needs order and across which entities/time horizon.",
          "Usually reduce it to per-aggregate ordering or version checks.",
          "True global order forces one sequencing bottleneck and hurts availability/scale.",
          "If unavoidable, use a single sequencer/partition and make the throughput/failure trade-off explicit."
        ],
        "number": 112,
        "question": "A team requests global event ordering. How would you challenge or satisfy the requirement?"
      },
      {
        "answers": [
          "Keep short hot retention on brokers and tier immutable history to compressed object storage.",
          "Compact only current-state streams; preserve required audit logs separately.",
          "Classify topics by legal/recovery value and delete low-value data on schedule.",
          "Show restore-time/cost trade-offs and test archive replay."
        ],
        "number": 113,
        "question": "The business wants indefinite retention, while finance wants to reduce storage cost by 70%. What architecture would you propose?"
      },
      {
        "answers": [
          "Use globally unique IDs, region/causality metadata and idempotent merge.",
          "Define conflict rules per domain: version/vector, deterministic winner, CRDT or manual resolution.",
          "Never assume arrival order represents truth.",
          "Reconcile duplicates and invariant violations before restoring normal replication."
        ],
        "number": 114,
        "question": "Two regions continue accepting writes during a network partition. How do you reconcile events afterward?"
      },
      {
        "answers": [
          "Treat the log as the durable buffer; enforce a global 500-RPS token bucket.",
          "Batch or coalesce updates and cache/deduplicate when semantics permit.",
          "Scale workers only within the downstream limit; use backoff/circuit breaking.",
          "Forecast backlog drain time and negotiate degradation or higher downstream capacity if the SLO cannot hold."
        ],
        "number": 115,
        "question": "A downstream API supports only 500 requests per second, while the stream peaks at 20,000 events per second. Design the consumer."
      },
      {
        "answers": [
          "Prefer tokenized events with personal data stored in a deletable system.",
          "Delete the record/key and propagate deletion to derived stores.",
          "If raw PII already exists, rewrite/expire affected segments and backups according to approved policy, or use crypto-shredding.",
          "Audit completion across every consumer and retention tier."
        ],
        "number": 116,
        "question": "Regulations require deleting one customer’s information from retained events. How would you support this?"
      },
      {
        "answers": [
          "Create a new version/topic with clear semantics and migration guide.",
          "Inventory consumers; dual-publish and provide adapters/testing fixtures.",
          "Track adoption and compare outputs during a defined coexistence window.",
          "Block new use of the old contract, then retire it with evidence and rollback coverage."
        ],
        "number": 117,
        "question": "Hundreds of consumers depend on an event that must be redesigned. How would you manage the transition?"
      },
      {
        "answers": [
          "Which business effect must occur once, and what duplicate/loss cost exists?",
          "What is the full boundary—broker only, database, payment provider, email?",
          "Can the effect accept idempotency keys, unique constraints or reconciliation?",
          "What latency, availability and complexity trade-offs are acceptable?"
        ],
        "number": 118,
        "question": "A team claims it needs exactly-once delivery. What questions would you ask before designing the solution?"
      },
      {
        "answers": [
          "Inventory criticality, data residency, versions, workloads, cost and ownership.",
          "Model blast radius, noisy-neighbor risk and migration dependency.",
          "Consolidate control plane/standards first; cluster consolidation is optional.",
          "Pilot low-risk workloads and compare reliability, cost and team autonomy."
        ],
        "number": 119,
        "question": "Leadership wants to consolidate ten independent Kafka environments. How would you evaluate whether consolidation is appropriate?"
      },
      {
        "answers": [
          "Define the decisions and freshness SLO—“real time” is not a requirement by itself.",
          "Measure source completeness, delay and correction behavior.",
          "Stabilize capture with outbox/CDC, durable buffering and data-quality contracts.",
          "Deliver one trusted use case end to end before scaling the platform."
        ],
        "number": 120,
        "question": "The company wants real-time analytics, but its source systems are unreliable. Where would you begin?"
      }
    ],
    "name": "Deep scenarios"
  }
];
