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

# 子串

## [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个整数数组 `nums` 和一个整数 `k`，统计该数组中连续子数组的和恰好等于 `k` 的个数。

**示例**：
```
输入：nums = [1,1,1], k = 2
输出：2
解释：连续子数组 [1,1] 和 [1,1] 的和为 2

输入：nums = [1,2,3], k = 3
输出：2
解释：连续子数组 [1,2] 和 [3] 的和为 3
```

**说明**：


- 1 <= nums.length <= 2 * 10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7

**算法解析**：

这道题使用 **前缀和 + 哈希表** 的方法：

1. **核心思想** ：利用前缀和的性质，如果两个前缀和的差值为k，那么这两个位置之间的子数组和为k

2. **算法步骤** ：

   - 维护一个前缀和变量pre和哈希表mp

   - 遍历数组，计算当前前缀和

   - 检查是否存在前缀和为pre-k的位置

   - 更新哈希表中当前前缀和的出现次数

3. **具体实现** ：

   - 初始化哈希表mp[0] = 1，表示空数组的前缀和为0

   - 遍历数组，累加得到当前前缀和pre

   - 如果mp中存在pre-k，说明找到了和为k的子数组

   - 将当前前缀和加入哈希表

4. **时间复杂度** ：O(n) - 只需要遍历一次数组

5. **空间复杂度** ：O(n) - 哈希表最多存储n个不同的前缀和

```C++
#define itn int
#define nit int
#define nti int
#define tin int
#define tni int
#define retrun return
#define reutrn return
#define rutren return
#define INF 0x3f3f3f3f
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
typedef long long LL;

class Solution
{
public:
    int subarraySum(vector<int> &nums, int &k)
    {
        unordered_map<int, int> mp;
        mp[0] = 1;
        int count = 0, pre = 0;
        for (auto &x : nums)
        {
            pre += x;
            if (mp.find(pre - k) != mp.end())
            {
                count += mp[pre - k];
            }
            mp[pre]++;
        }
        return count;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：nums = [1,1,1], k = 2
    vector<int> nums = {1, 1, 1};
    int k = 2;

    Solution sol;
    int result = sol.subarraySum(nums, k);
    
    cout << "和为 " << k << " 的子数组个数: " << result << endl;

    return 0;
}
```

## [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个整数数组 nums 和一个整数 k，有一个大小为 k 的滑动窗口从数组最左侧移动到最右侧。每次移动窗口时返回窗口内的最大值，最终返回所有移动过程中窗口最大值组成的数组。

```C++
#define itn int
#define nit int
#define nti int
#define tin int
#define tni int
#define retrun return
#define reutrn return
#define rutren return
#define INF 0x3f3f3f3f
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
typedef long long LL;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int& k) {
        deque<int> q;
        vector<int> ans;

        for (int i = 0; i < nums.size(); i++) {
            while (!q.empty() && q.back() < nums[i]) q.pop_back();
            q.push_back(nums[i]);

            if (i - k >= 0 && q.front() == nums[i - k]) q.pop_front();
            if (i - k + 1 >= 0) ans.push_back(q.front());
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, k;
    cin >> n >> k;

    vector<int> nums(n);
    for (int i = 0; i < n; ++i) {
        cin >> nums[i];
    }

    Solution sol;
    vector<int> res = sol.maxSlidingWindow(nums, k);

    for (int x : res)
        cout << x << ' ';
    cout << '\n';

    return 0;
}
```

## [最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/?envType=study-plan-v2&envId=top-100-liked)

给定两个字符串 s 和 t，在字符串 s 中找出包含 t 所有字符的最小子串(连续子字符串)。如果不存在符合条件的子串，返回空字符串。要求时间复杂度为 O(n)。

**自信之作——时空复杂度击败 100% 用户，个中手段无所不用其极，臭不要脸优化** ：

```C++
#define itn int
#define nit int
#define nti int
#define tin int
#define tni int
#define retrun return
#define reutrn return
#define rutren return
#define INF 0x3f3f3f3f
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
typedef long long LL;

class Solution {
public:
    string minWindow(string& s, string& t) {
        int ans_l = -1, ans_r = s.size();
        int less = 0;
        vector<int> cnt(128, 0);

        for (auto& c : t) {
            if (!cnt[c])
                less++;
            cnt[c]++;
        }

        for(int l = 0, r = 0; r < s.size(); r++)
        {
            cnt[s[r]]--;
            if(!cnt[s[r]]) less--;

            while(!less)
            {
                if(r - l < ans_r - ans_l) ans_r = r, ans_l = l;

                if(!cnt[s[l]]) less++;
                cnt[s[l]]++;
                l++;
            }
        }

        return ans_l < 0 ? "" : s.substr(ans_l, ans_r - ans_l + 1);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    string s, t;
    cin >> s >> t;

    Solution sol;
    cout << sol.minWindow(s, t) << '\n';

    return 0;
}
```
