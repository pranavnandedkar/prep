export const codingPatternCodeExamples = {
  'two-pointers': {
    title: 'Two Pointers', subtitle: 'JAVA 17 · SORTED PAIRS · O(N)',
    note: 'Use when two indices can eliminate candidates monotonically. State why moving either pointer is safe.',
    code: `public boolean hasPairWithSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        long sum = (long) nums[left] + nums[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
  },
  'sliding-window': {
    title: 'Sliding Window', subtitle: 'JAVA 17 · VARIABLE WINDOW · O(N)',
    note: 'Use for a contiguous range with a monotonic validity condition. Expand right, then shrink until valid.',
    code: `public int longestAtMostKDistinct(String s, int k) {
    Map<Character, Integer> count = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        count.merge(s.charAt(right), 1, Integer::sum);
        while (count.size() > k) {
            char c = s.charAt(left++);
            count.compute(c, (key, value) -> value == 1 ? null : value - 1);
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
  },
  'binary-search': {
    title: 'Binary Search', subtitle: 'JAVA 17 · FIRST TRUE · O(LOG N)',
    note: 'Search a monotonic answer space. Define the invariant and use an overflow-safe midpoint.',
    code: `public int firstTrue(int low, int high, IntPredicate feasible) {
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (feasible.test(mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}`,
  },
  'bfs': {
    title: 'Breadth-First Search', subtitle: 'JAVA 17 · SHORTEST UNWEIGHTED PATH',
    note: 'Use for level order or minimum edges in an unweighted graph. Mark visited when enqueuing.',
    code: `public int shortestPath(List<List<Integer>> graph, int start, int target) {
    Queue<Integer> queue = new ArrayDeque<>();
    boolean[] seen = new boolean[graph.size()];
    queue.add(start);
    seen[start] = true;
    for (int distance = 0; !queue.isEmpty(); distance++) {
        for (int size = queue.size(); size > 0; size--) {
            int node = queue.remove();
            if (node == target) return distance;
            for (int next : graph.get(node)) {
                if (!seen[next]) { seen[next] = true; queue.add(next); }
            }
        }
    }
    return -1;
}`,
  },
  'dfs': {
    title: 'Depth-First Search', subtitle: 'JAVA 17 · COMPONENTS · O(V + E)',
    note: 'Use for reachability, components, cycle structure, and recursive tree state. Guard against revisits.',
    code: `private void dfs(int node, List<List<Integer>> graph, boolean[] seen) {
    if (seen[node]) return;
    seen[node] = true;
    for (int next : graph.get(node)) dfs(next, graph, seen);
}`,
  },
  'top-k': {
    title: 'Top K with a Heap', subtitle: 'JAVA 17 · O(N LOG K)',
    note: 'Keep a min-heap of the best K candidates when sorting the entire input is unnecessary.',
    code: `public int[] topK(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int value : nums) {
        heap.add(value);
        if (heap.size() > k) heap.remove();
    }
    return heap.stream().mapToInt(Integer::intValue).toArray();
}`,
  },
  'intervals': {
    title: 'Merge Intervals', subtitle: 'JAVA 17 · SORT + SWEEP · O(N LOG N)',
    note: 'Sort on the dimension that makes the next decision local, then maintain the merged frontier.',
    code: `public List<int[]> merge(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    List<int[]> result = new ArrayList<>();
    for (int[] current : intervals) {
        if (result.isEmpty() || result.get(result.size() - 1)[1] < current[0]) {
            result.add(current.clone());
        } else {
            int[] last = result.get(result.size() - 1);
            last[1] = Math.max(last[1], current[1]);
        }
    }
    return result;
}`,
  },
  'monotonic-stack': {
    title: 'Monotonic Stack', subtitle: 'JAVA 17 · NEXT GREATER · O(N)',
    note: 'Use when each item needs its nearest greater or smaller neighbor. Every index enters and leaves once.',
    code: `public int[] nextGreater(int[] nums) {
    int[] answer = new int[nums.length];
    Arrays.fill(answer, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            answer[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return answer;
}`,
  },
  backtracking: {
    title: 'Backtracking', subtitle: 'JAVA 17 · CHOOSE · EXPLORE · UNCHOOSE',
    note: 'Use for constrained enumeration. Make state mutation and rollback visibly symmetric.',
    code: `private void subsets(int index, int[] nums, List<Integer> path,
        List<List<Integer>> result) {
    if (index == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    subsets(index + 1, nums, path, result);
    path.add(nums[index]);
    subsets(index + 1, nums, path, result);
    path.remove(path.size() - 1);
}`,
  },
  'dynamic-programming': {
    title: 'Dynamic Programming', subtitle: 'JAVA 17 · STATE TRANSITION · O(N)',
    note: 'Define state, transition, base case, and evaluation order before coding. Compress space only after proving dependencies.',
    code: `public int minCost(int[] cost) {
    int previousTwo = 0, previousOne = 0;
    for (int value : cost) {
        int current = value + Math.min(previousOne, previousTwo);
        previousTwo = previousOne;
        previousOne = current;
    }
    return Math.min(previousOne, previousTwo);
}`,
  },
};
