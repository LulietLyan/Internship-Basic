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

# 回溯

## [全排列](https://leetcode.cn/problems/permutations/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个不含重复数字的数组 `nums`，返回其所有可能的全排列。

**算法解析**：

回溯本质是枚举决策树。每一层选择一个尚未使用的数字加入路径，当路径长度等于数组长度时得到一个排列。

1. 使用 `path` 保存当前排列
2. 使用 `used` 标记数字是否已经使用
3. 每层枚举所有未使用数字
4. 递归后撤销选择，继续尝试下一个数字

时间复杂度：`O(n! * n)`；空间复杂度：`O(n)`，不计答案。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> ans;
    vector<int> path;
    vector<int> used;

    void dfs(vector<int>& nums) {
        if (path.size() == nums.size()) {
            ans.push_back(path);
            return;
        }
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            used[i] = 1;
            path.push_back(nums[i]);
            dfs(nums);
            path.pop_back();
            used[i] = 0;
        }
    }

    vector<vector<int>> permute(vector<int>& nums) {
        used.assign(nums.size(), 0);
        dfs(nums);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solve;
    auto ans = solve.permute(nums);
    for (auto& v : ans) {
        for (int x : v) cout << x << ' ';
        cout << '\n';
    }
    return 0;
}
```

## [子集](https://leetcode.cn/problems/subsets/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个不含重复元素的整数数组 `nums`，返回该数组所有可能的子集。

**算法解析**：

每个元素都有选或不选两种状态。也可以用“从当前位置开始枚举下一个选择”的方式，每进入一个节点就把当前路径加入答案。

1. 当前路径本身就是一个合法子集
2. 从 `start` 开始枚举下一个加入的元素
3. 递归进入下一层时，起点变成 `i + 1`
4. 回溯撤销选择

时间复杂度：`O(n * 2^n)`；空间复杂度：`O(n)`，不计答案。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> ans;
    vector<int> path;

    void dfs(vector<int>& nums, int start) {
        ans.push_back(path);
        for (int i = start; i < nums.size(); i++) {
            path.push_back(nums[i]);
            dfs(nums, i + 1);
            path.pop_back();
        }
    }

    vector<vector<int>> subsets(vector<int>& nums) {
        dfs(nums, 0);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solve;
    auto ans = solve.subsets(nums);
    for (auto& v : ans) {
        cout << "[";
        for (int i = 0; i < v.size(); i++) {
            if (i) cout << ",";
            cout << v[i];
        }
        cout << "]\n";
    }
    return 0;
}
```

## [电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个只包含数字 `2-9` 的字符串，返回它能表示的所有字母组合。数字到字母的映射与电话按键相同。

**算法解析**：

每一位数字对应若干个候选字母，从左到右逐位选择。递归层数等于数字个数，当路径长度等于输入长度时得到一个答案。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> ans;
    string path;
    vector<string> mp = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    void dfs(const string& digits, int u) {
        if (u == digits.size()) {
            ans.push_back(path);
            return;
        }
        for (char c : mp[digits[u] - '0']) {
            path.push_back(c);
            dfs(digits, u + 1);
            path.pop_back();
        }
    }

    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        dfs(digits, 0);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string digits;
    cin >> digits;
    Solution solve;
    auto ans = solve.letterCombinations(digits);
    for (auto& s : ans) cout << s << '\n';
    return 0;
}
```

## [组合总和](https://leetcode.cn/problems/combination-sum/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定无重复元素数组 `candidates` 和目标值 `target`，找出所有和为 `target` 的组合。每个数字可以被无限次使用。

**算法解析**：

为了避免组合重复，递归时规定只能从当前下标及其后面选择。由于每个数字可以重复使用，选择 `candidates[i]` 后下一层仍从 `i` 开始。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> ans;
    vector<int> path;

    void dfs(vector<int>& candidates, int target, int start) {
        if (target == 0) {
            ans.push_back(path);
            return;
        }
        if (target < 0) return;
        for (int i = start; i < candidates.size(); i++) {
            path.push_back(candidates[i]);
            dfs(candidates, target - candidates[i], i);
            path.pop_back();
        }
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        dfs(candidates, target, 0);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, target;
    cin >> n >> target;
    vector<int> candidates(n);
    for (int i = 0; i < n; i++) cin >> candidates[i];

    Solution solve;
    auto ans = solve.combinationSum(candidates, target);
    for (auto& v : ans) {
        for (int x : v) cout << x << ' ';
        cout << '\n';
    }
    return 0;
}
```

## [括号生成](https://leetcode.cn/problems/generate-parentheses/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

数字 `n` 表示生成括号的对数，返回所有可能且有效的括号组合。

**算法解析**：

构造过程中维护左右括号数量：

- 左括号数量小于 `n` 时，可以继续放左括号
- 右括号数量小于左括号数量时，可以放右括号
- 当字符串长度为 `2n` 时得到合法答案

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> ans;
    string path;

    void dfs(int n, int l, int r) {
        if (path.size() == 2 * n) {
            ans.push_back(path);
            return;
        }
        if (l < n) {
            path.push_back('(');
            dfs(n, l + 1, r);
            path.pop_back();
        }
        if (r < l) {
            path.push_back(')');
            dfs(n, l, r + 1);
            path.pop_back();
        }
    }

    vector<string> generateParenthesis(int n) {
        dfs(n, 0, 0);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    Solution solve;
    auto ans = solve.generateParenthesis(n);
    for (auto& s : ans) cout << s << '\n';
    return 0;
}
```

## [单词搜索](https://leetcode.cn/problems/word-search/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定字符网格 `board` 和字符串 `word`，判断网格中是否存在一条路径可以组成该单词。路径只能上下左右移动，同一个单元格不能重复使用。

**算法解析**：

从每个格子作为起点尝试 DFS。递归参数记录当前位置和匹配到的下标，匹配失败或越界立即返回。为了避免重复使用格子，可以临时修改当前字符，回溯时恢复。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int m, n;
    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};

    bool dfs(vector<vector<char>>& board, string& word, int x, int y, int u) {
        if (u == word.size()) return true;
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] != word[u]) return false;

        char t = board[x][y];
        board[x][y] = '#';
        for (int k = 0; k < 4; k++) {
            if (dfs(board, word, x + dx[k], y + dy[k], u + 1)) {
                board[x][y] = t;
                return true;
            }
        }
        board[x][y] = t;
        return false;
    }

    bool exist(vector<vector<char>>& board, string word) {
        m = board.size(), n = board[0].size();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m, n;
    cin >> m >> n;
    vector<vector<char>> board(m, vector<char>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cin >> board[i][j];
    }
    string word;
    cin >> word;

    Solution solve;
    cout << (solve.exist(board, word) ? "true" : "false") << '\n';
    return 0;
}
```

## [分割回文串](https://leetcode.cn/problems/palindrome-partitioning/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个字符串 `s`，将 `s` 分割成若干子串，使每个子串都是回文串，返回所有可能的分割方案。

**算法解析**：

从左到右枚举当前要切出的子串 `[start, i]`。如果该子串是回文串，就加入路径并递归处理 `i + 1` 后面的部分。为了避免反复判断回文，可以先预处理 `isPal[i][j]`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<string>> ans;
    vector<string> path;
    vector<vector<int>> isPal;

    void dfs(string& s, int start) {
        if (start == s.size()) {
            ans.push_back(path);
            return;
        }
        for (int i = start; i < s.size(); i++) {
            if (!isPal[start][i]) continue;
            path.push_back(s.substr(start, i - start + 1));
            dfs(s, i + 1);
            path.pop_back();
        }
    }

    vector<vector<string>> partition(string s) {
        int n = s.size();
        isPal.assign(n, vector<int>(n, true));
        for (int len = 2; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                isPal[l][r] = (s[l] == s[r]) && (len == 2 || isPal[l + 1][r - 1]);
            }
        }
        dfs(s, 0);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    cin >> s;
    Solution solve;
    auto ans = solve.partition(s);
    for (auto& v : ans) {
        for (auto& x : v) cout << x << ' ';
        cout << '\n';
    }
    return 0;
}
```

## [N 皇后](https://leetcode.cn/problems/n-queens/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

按照国际象棋规则，皇后可以攻击同一行、同一列、同一斜线上的棋子。给定整数 `n`，返回所有不同的 `n` 皇后摆放方案，使得任意两个皇后都不能互相攻击。

**算法解析**：

逐行放皇后。由于每行只放一个皇后，需要维护列、主对角线、副对角线是否被占用。

- 列编号：`col`
- 主对角线：`row - col + n`
- 副对角线：`row + col`

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<string>> ans;
    vector<string> board;
    vector<int> col, diag1, diag2;

    void dfs(int row, int n) {
        if (row == n) {
            ans.push_back(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (col[c] || diag1[row - c + n] || diag2[row + c]) continue;
            board[row][c] = 'Q';
            col[c] = diag1[row - c + n] = diag2[row + c] = 1;
            dfs(row + 1, n);
            col[c] = diag1[row - c + n] = diag2[row + c] = 0;
            board[row][c] = '.';
        }
    }

    vector<vector<string>> solveNQueens(int n) {
        board.assign(n, string(n, '.'));
        col.assign(n, 0);
        diag1.assign(2 * n + 1, 0);
        diag2.assign(2 * n + 1, 0);
        dfs(0, n);
        return ans;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    Solution solve;
    auto ans = solve.solveNQueens(n);
    for (auto& board : ans) {
        for (auto& row : board) cout << row << '\n';
        cout << '\n';
    }
    return 0;
}
```
