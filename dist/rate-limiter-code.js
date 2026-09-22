export const rateLimiterCodeExamples = {
  'fixed-window': {
    title: 'Fixed Window Counter',
    subtitle: 'Java 17 · O(1) state per key',
    note: 'Small and fast. Call out the boundary burst: a client can use one full quota just before reset and another just after.',
    code: `import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

public final class FixedWindowLimiter {
    private final long limit;
    private final long windowMs;
    private final ConcurrentHashMap<String, Counter> state =
            new ConcurrentHashMap<>();

    public FixedWindowLimiter(long limit, Duration window) {
        this.limit = limit;
        this.windowMs = window.toMillis();
    }

    public boolean allow(String key) {
        long windowId = System.currentTimeMillis() / windowMs;
        AtomicBoolean allowed = new AtomicBoolean();

        state.compute(key, (ignored, current) -> {
            long count = current == null || current.windowId != windowId
                    ? 1 : current.count + 1;
            allowed.set(count <= limit);
            return new Counter(windowId, count);
        });
        return allowed.get();
    }

    private record Counter(long windowId, long count) {}
}`,
  },
  'sliding-log': {
    title: 'Sliding Window Log',
    subtitle: 'Java 17 · Exact, O(requests in window)',
    note: 'Exact inside the window, but memory grows with request volume. Use it when precision matters more than compact state.',
    code: `import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

public final class SlidingLogLimiter {
    private final int limit;
    private final long windowMs;
    private final ConcurrentHashMap<String, Deque<Long>> logs =
            new ConcurrentHashMap<>();

    public SlidingLogLimiter(int limit, Duration window) {
        this.limit = limit;
        this.windowMs = window.toMillis();
    }

    public boolean allow(String key) {
        long now = System.currentTimeMillis();
        Deque<Long> log = logs.computeIfAbsent(
                key, ignored -> new ArrayDeque<>());

        synchronized (log) {
            long cutoff = now - windowMs;
            while (!log.isEmpty() && log.peekFirst() <= cutoff) {
                log.removeFirst();
            }
            if (log.size() >= limit) return false;
            log.addLast(now);
            return true;
        }
    }
}`,
  },
  'sliding-counter': {
    title: 'Sliding Window Counter',
    subtitle: 'Java 17 · Approximate, O(1) state per key',
    note: 'Weights the previous window by how much of it still overlaps. It smooths boundaries without storing every timestamp.',
    code: `import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

public final class SlidingCounterLimiter {
    private final long limit;
    private final long windowMs;
    private final ConcurrentHashMap<String, State> states =
            new ConcurrentHashMap<>();

    public SlidingCounterLimiter(long limit, Duration window) {
        this.limit = limit;
        this.windowMs = window.toMillis();
    }

    public boolean allow(String key) {
        long now = System.currentTimeMillis();
        long windowId = now / windowMs;
        State state = states.computeIfAbsent(key, ignored ->
                new State(windowId));

        synchronized (state) {
            if (windowId != state.windowId) {
                state.previous = windowId == state.windowId + 1
                        ? state.current : 0;
                state.current = 0;
                state.windowId = windowId;
            }

            double elapsed = (now % windowMs) / (double) windowMs;
            double estimate = state.previous * (1 - elapsed)
                    + state.current;
            if (estimate >= limit) return false;
            state.current++;
            return true;
        }
    }

    private static final class State {
        long windowId, current, previous;
        State(long windowId) { this.windowId = windowId; }
    }
}`,
  },
  'token-bucket': {
    title: 'Token Bucket',
    subtitle: 'Java 17 · Controlled bursts, O(1) state per key',
    note: 'Capacity controls the maximum burst; refill rate controls sustained traffic. For distributed use, run this read-refill-consume sequence atomically in Redis.',
    code: `import java.util.concurrent.ConcurrentHashMap;

public final class TokenBucketLimiter {
    private final double capacity;
    private final double refillPerSecond;
    private final ConcurrentHashMap<String, Bucket> buckets =
            new ConcurrentHashMap<>();

    public TokenBucketLimiter(double capacity,
                              double refillPerSecond) {
        this.capacity = capacity;
        this.refillPerSecond = refillPerSecond;
    }

    public boolean allow(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, ignored ->
                new Bucket(capacity, System.nanoTime()));

        synchronized (bucket) {
            long now = System.nanoTime();
            double elapsed = (now - bucket.updatedAt) / 1_000_000_000.0;
            bucket.tokens = Math.min(capacity,
                    bucket.tokens + elapsed * refillPerSecond);
            bucket.updatedAt = now;

            if (bucket.tokens < 1) return false;
            bucket.tokens -= 1;
            return true;
        }
    }

    private static final class Bucket {
        double tokens;
        long updatedAt;
        Bucket(double tokens, long updatedAt) {
            this.tokens = tokens;
            this.updatedAt = updatedAt;
        }
    }
}`,
  },
  'leaky-bucket': {
    title: 'Leaky Bucket',
    subtitle: 'Java 17 · Steady drain, O(1) policing state per key',
    note: 'This policing form rejects overflow immediately. A shaping form would queue accepted work and drain it with a worker at a fixed rate.',
    code: `import java.util.concurrent.ConcurrentHashMap;

public final class LeakyBucketLimiter {
    private final double capacity;
    private final double leakPerSecond;
    private final ConcurrentHashMap<String, Bucket> buckets =
            new ConcurrentHashMap<>();

    public LeakyBucketLimiter(double capacity,
                              double leakPerSecond) {
        this.capacity = capacity;
        this.leakPerSecond = leakPerSecond;
    }

    public boolean allow(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, ignored ->
                new Bucket(System.nanoTime()));

        synchronized (bucket) {
            long now = System.nanoTime();
            double elapsed = (now - bucket.updatedAt) / 1_000_000_000.0;
            bucket.level = Math.max(0,
                    bucket.level - elapsed * leakPerSecond);
            bucket.updatedAt = now;

            if (bucket.level + 1 > capacity) return false;
            bucket.level += 1;
            return true;
        }
    }

    private static final class Bucket {
        double level;
        long updatedAt;
        Bucket(long updatedAt) { this.updatedAt = updatedAt; }
    }
}`,
  },
};
