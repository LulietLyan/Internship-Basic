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

# 贪心算法

## [买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定股票每天价格，只能买入一次并卖出一次，求最大利润。

**算法解析**：从左到右扫描，维护历史最低买入价 `minPrice`，当前天作为卖出日时利润为 `price - minPrice`。每一天只需要判断是否更新最低价和最大利润。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int ans = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            ans = max(ans, price - minPrice);
        }
        return ans;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];

    Solution solution;
    cout << solution.maxProfit(prices) << endl;
    return 0;
}
```

## [跳跃游戏](https://leetcode.cn/problems/jump-game/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定数组 `nums`，每个位置的值表示从该位置最多能跳的步数，判断是否能到达最后一个位置。

**算法解析**：维护当前能到达的最远位置 `far`。遍历到下标 `i` 时，如果 `i > far`，说明这个位置不可达；否则用 `i + nums[i]` 更新最远位置。只要最远位置覆盖末尾即可成功。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool canJump(vector<int>& nums) {
        int far = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (i > far) return false;
            far = max(far, i + nums[i]);
        }
        return true;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << (solution.canJump(nums) ? "true" : "false") << endl;
    return 0;
}
```

## [跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定数组 `nums`，每个位置表示最多可跳步数，求到达最后一个位置的最少跳跃次数。

**算法解析**：按层贪心。`end` 表示当前跳跃次数能覆盖的右边界，`far` 表示下一跳能覆盖的最远位置。遍历到 `end` 时必须增加一次跳跃，并把边界扩展到 `far`。这个过程类似 BFS 的按层扩展。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int jump(vector<int>& nums) {
        int jumps = 0;
        int end = 0;
        int far = 0;
        for (int i = 0; i < nums.size() - 1; i++) {
            far = max(far, i + nums[i]);
            if (i == end) {
                jumps++;
                end = far;
            }
        }
        return jumps;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << solution.jump(nums) << endl;
    return 0;
}
```

## [划分字母区间](https://leetcode.cn/problems/partition-labels/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定字符串 `s`，把字符串划分为尽可能多的片段，使得同一字母最多出现在一个片段中，返回每个片段长度。

**算法解析**：先记录每个字符最后一次出现的位置。扫描字符串时，用当前片段内所有字符最后出现位置的最大值作为片段右边界；当扫描下标到达右边界时，就能切出一个合法片段。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> partitionLabels(string s) {
        vector<int> last(26);
        for (int i = 0; i < s.size(); i++) last[s[i] - 'a'] = i;

        vector<int> ans;
        int start = 0, end = 0;
        for (int i = 0; i < s.size(); i++) {
            end = max(end, last[s[i] - 'a']);
            if (i == end) {
                ans.push_back(end - start + 1);
                start = i + 1;
            }
        }
        return ans;
    }
};

int main() {
    string s;
    cin >> s;
    Solution solution;
    vector<int> ans = solution.partitionLabels(s);
    for (int i = 0; i < ans.size(); i++) {
        if (i) cout << " ";
        cout << ans[i];
    }
    cout << endl;
    return 0;
}
```
