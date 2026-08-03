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

# 多维动态规划

## [不同路径](https://leetcode.cn/problems/unique-paths/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：机器人从 `m x n` 网格左上角出发，每次只能向右或向下移动，求到达右下角的不同路径数。

**算法解析** ：令 `dp[i][j]` 表示到达格子 `(i, j)` 的路径数，只能由上方或左方转移而来，即 `dp[i][j] = dp[i - 1][j] + dp[i][j - 1]`。由于每行只依赖上一行和当前行左侧，可用一维数组压缩空间。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
};

int main() {
    int m, n;
    cin >> m >> n;
    Solution solution;
    cout << solution.uniquePaths(m, n) << endl;
    return 0;
}
```

## [最小路径和](https://leetcode.cn/problems/minimum-path-sum/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定非负整数网格，从左上角走到右下角，每次只能向右或向下，求路径上的最小数字和。

**算法解析** ：令 `dp[j]` 表示处理到当前行第 `j` 列时的最小路径和。当前位置只能从上方 `dp[j]` 或左方 `dp[j - 1]` 转移，取较小者再加上当前格子的值。第一行和第一列需要单独处理边界。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<int> dp(n, INT_MAX / 2);
        dp[0] = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (j == 0) dp[j] = dp[j] + grid[i][j];
                else dp[j] = min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }
        return dp[n - 1];
    }
};

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cin >> grid[i][j];
    }

    Solution solution;
    cout << solution.minPathSum(grid) << endl;
    return 0;
}
```

## [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定字符串 `s`，返回其中最长的回文子串。

**算法解析** ：令 `dp[i][j]` 表示子串 `s[i..j]` 是否为回文。若 `s[i] == s[j]`，并且子串长度不超过 `2` 或内部 `dp[i + 1][j - 1]` 为真，则当前子串为回文。由于依赖更短区间，需要从短到长枚举长度。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        int start = 0, maxLen = 1;

        for (int len = 1; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && (len <= 2 || dp[i + 1][j - 1])) {
                    dp[i][j] = true;
                    if (len > maxLen) {
                        start = i;
                        maxLen = len;
                    }
                }
            }
        }
        return s.substr(start, maxLen);
    }
};

int main() {
    string s;
    cin >> s;
    Solution solution;
    cout << solution.longestPalindrome(s) << endl;
    return 0;
}
```

## [最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定两个字符串 `text1` 和 `text2`，返回它们最长公共子序列的长度。

**算法解析** ：令 `dp[i][j]` 表示 `text1` 前 `i` 个字符和 `text2` 前 `j` 个字符的最长公共子序列长度。若当前字符相同，则由 `dp[i - 1][j - 1] + 1` 转移；否则取删除任一侧当前字符后的最大值。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
};

int main() {
    string text1, text2;
    cin >> text1 >> text2;
    Solution solution;
    cout << solution.longestCommonSubsequence(text1, text2) << endl;
    return 0;
}
```

## [编辑距离](https://leetcode.cn/problems/edit-distance/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定两个单词 `word1` 和 `word2`，每次可以插入、删除或替换一个字符，求把 `word1` 转换成 `word2` 的最少操作数。

**算法解析** ：令 `dp[i][j]` 表示 `word1` 前 `i` 个字符转换为 `word2` 前 `j` 个字符的最少操作数。若末尾字符相同，不需要额外操作；否则在插入、删除、替换三种操作中取最小值再加一。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]}) + 1;
                }
            }
        }
        return dp[m][n];
    }
};

int main() {
    string word1, word2;
    cin >> word1 >> word2;
    Solution solution;
    cout << solution.minDistance(word1, word2) << endl;
    return 0;
}
```
