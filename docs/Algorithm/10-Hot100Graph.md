---
statistics: true
comments: true
---

<style>
body {
  position: relative; /* 确保 body 元素的 position 属性为非静态值 */
}

body::before {
  --size: 35px; /* 调整网格单元大小 */
  --line: color-mix(in hsl, canvasText, transparent 60%); /* 调整线条透明度 */
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute; /* 修改为 absolute 以使其随页面滚动 */
  background: linear-gradient(
        90deg,
        var(--line) 1px,
        transparent 1px var(--size)
      )
      50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
      var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
          mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

@media (max-width: 768px) {
  body::before {
    display: none; /* 在手机端隐藏网格效果 */
  }
}
</style>

# 图论

## [岛屿数量](https://leetcode.cn/problems/number-of-islands/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个由 `'1'`(陆地)和 `'0'`(水)组成的二维网格，计算岛屿数量。岛屿由水平或垂直方向相邻的陆地连接形成，网格四周都被水包围。

**算法解析**：

遍历整个网格，遇到一块未访问的陆地，就说明发现了一个新的岛屿。随后用 DFS 或 BFS 把与它连通的所有陆地都标记掉，避免重复计数。

1. 遍历每个格子
2. 如果当前位置是 `'1'`，答案加一
3. 从当前位置出发进行 DFS，把上下左右连通的 `'1'` 改成 `'0'`
4. 遍历结束后，答案就是岛屿数量

时间复杂度：`O(mn)`；空间复杂度：递归栈最坏 `O(mn)`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int m, n;
    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};

    void dfs(vector<vector<char>>& grid, int x, int y) {
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] != '1') return;
        grid[x][y] = '0';
        for (int k = 0; k < 4; k++) {
            dfs(grid, x + dx[k], y + dy[k]);
        }
    }

    int numIslands(vector<vector<char>>& grid) {
        m = grid.size();
        n = grid[0].size();
        int ans = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    ans++;
                    dfs(grid, i, j);
                }
            }
        }
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m, n;
    cin >> m >> n;
    vector<vector<char>> grid(m, vector<char>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cin >> grid[i][j];
    }

    Solution solve;
    cout << solve.numIslands(grid) << '\n';
    return 0;
}
```

## [腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

在一个二维网格中，`0` 表示空格，`1` 表示新鲜橘子，`2` 表示腐烂橘子。每分钟腐烂橘子会使上下左右相邻的新鲜橘子腐烂，求直到没有新鲜橘子所需的最小分钟数。如果不可能，返回 `-1`。

**算法解析**：

这是多源 BFS。所有初始腐烂橘子同时作为 BFS 起点，按层扩散，每扩散一层代表一分钟。

1. 将所有腐烂橘子加入队列，统计新鲜橘子数量
2. BFS 按层扩散，每一层时间加一
3. 每腐烂一个新鲜橘子，新鲜数量减一
4. BFS 结束后，如果仍有新鲜橘子，返回 `-1`，否则返回时间

时间复杂度：`O(mn)`；空间复杂度：`O(mn)`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        queue<pair<int, int>> q;
        int fresh = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.push({i, j});
                if (grid[i][j] == 1) fresh++;
            }
        }

        int minute = 0;
        int dx[4] = {1, -1, 0, 0};
        int dy[4] = {0, 0, 1, -1};
        while (!q.empty() && fresh > 0) {
            int sz = q.size();
            minute++;
            while (sz--) {
                auto [x, y] = q.front();
                q.pop();
                for (int k = 0; k < 4; k++) {
                    int a = x + dx[k], b = y + dy[k];
                    if (a < 0 || a >= m || b < 0 || b >= n || grid[a][b] != 1) continue;
                    grid[a][b] = 2;
                    fresh--;
                    q.push({a, b});
                }
            }
        }
        return fresh == 0 ? minute : -1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m, n;
    cin >> m >> n;
    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cin >> grid[i][j];
    }

    Solution solve;
    cout << solve.orangesRotting(grid) << '\n';
    return 0;
}
```

## [课程表](https://leetcode.cn/problems/course-schedule/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定课程总数 `numCourses` 和先修关系 `prerequisites`，其中 `prerequisites[i] = [a, b]` 表示学习课程 `a` 前必须先学习课程 `b`。判断是否可以完成所有课程。

**算法解析**：

课程依赖可以看作有向图。如果图中有环，就存在循环依赖，无法完成所有课程。可以用拓扑排序判断是否能访问所有点。

1. 建图：`b -> a`
2. 统计每门课的入度
3. 将入度为 0 的课程入队
4. 每次取出一门课，将其指向课程的入度减一
5. 如果最终处理课程数等于总课程数，说明无环

时间复杂度：`O(n + m)`；空间复杂度：`O(n + m)`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> g(numCourses);
        vector<int> indeg(numCourses);
        for (auto& e : prerequisites) {
            int a = e[0], b = e[1];
            g[b].push_back(a);
            indeg[a]++;
        }

        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indeg[i] == 0) q.push(i);
        }

        int cnt = 0;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            cnt++;
            for (int v : g[u]) {
                if (--indeg[v] == 0) q.push(v);
            }
        }
        return cnt == numCourses;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int numCourses, m;
    cin >> numCourses >> m;
    vector<vector<int>> prerequisites(m, vector<int>(2));
    for (int i = 0; i < m; i++) cin >> prerequisites[i][0] >> prerequisites[i][1];

    Solution solve;
    cout << (solve.canFinish(numCourses, prerequisites) ? "true" : "false") << '\n';
    return 0;
}
```

## [实现 Trie 前缀树](https://leetcode.cn/problems/implement-trie-prefix-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

实现 Trie，支持插入字符串、查找完整字符串、判断是否存在某个前缀。

**算法解析**：

Trie 是一棵多叉树，每条边代表一个字符。从根到某节点的路径表示一个前缀。节点需要保存子节点指针和是否为单词结尾。

1. 插入时，从根开始按字符向下走，不存在的节点就新建
2. 单词最后一个字符对应节点标记 `isEnd = true`
3. 搜索完整单词时，要求路径存在且最后节点 `isEnd = true`
4. 搜索前缀时，只要求路径存在

时间复杂度：每次操作 `O(L)`，`L` 为字符串长度。

```C++
#include <bits/stdc++.h>
using namespace std;

class Trie {
public:
    struct Node {
        bool isEnd = false;
        Node* son[26]{};
    };

    Node* root;

    Trie() {
        root = new Node();
    }

    void insert(string word) {
        Node* p = root;
        for (char c : word) {
            int u = c - 'a';
            if (!p->son[u]) p->son[u] = new Node();
            p = p->son[u];
        }
        p->isEnd = true;
    }

    bool search(string word) {
        Node* p = find(word);
        return p && p->isEnd;
    }

    bool startsWith(string prefix) {
        return find(prefix) != nullptr;
    }

    Node* find(const string& s) {
        Node* p = root;
        for (char c : s) {
            int u = c - 'a';
            if (!p->son[u]) return nullptr;
            p = p->son[u];
        }
        return p;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int q;
    cin >> q;
    Trie trie;
    while (q--) {
        string op, s;
        cin >> op >> s;
        if (op == "insert") trie.insert(s);
        else if (op == "search") cout << (trie.search(s) ? "true" : "false") << '\n';
        else if (op == "prefix") cout << (trie.startsWith(s) ? "true" : "false") << '\n';
    }
    return 0;
}
```
