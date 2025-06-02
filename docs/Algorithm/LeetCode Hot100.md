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
  --line: color-mix(in hsl, canvasText, transparent 80%); /* 调整线条透明度 */
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
  -webkit-mask: linear-gradient(-20deg, transparent 50%, white);
          mask: linear-gradient(-20deg, transparent 50%, white);
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

# LeetCode Hot100

## 哈希

### [两数之和](https://leetcode.cn/problems/two-sum/?envType=study-plan-v2&envId=top-100-liked)

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
    vector<int> twoSum(vector<int> &nums, int target)
    {
        unordered_map<int, int> m;
        for (int i = 0; i < nums.size(); i++)
        {
            auto ptr = m.find(target - nums[i]);
            if (ptr != m.end())
                return {i, ptr->second};
            m[nums[i]] = i;
        }
        return {};
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    vector<int> nums = {2, 7, 11, 5};
    int target = 9;

    Solution solve;

    vector<int> ans = solve.twoSum(nums, target);

    for (auto i : ans)
        cout << i << ' ';

    return 0;
}
```

### [字母异位词分组](https://leetcode.cn/problems/group-anagrams/description/?envType=study-plan-v2&envId=top-100-liked)

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
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        vector<vector<string>> ans;
        unordered_map<string, vector<string>> m;

        for (auto& str : strs)
        {
            string tmp = "00000000000000000000000000";
            for (auto c : str)
                tmp[c - 'a']++;
            m[tmp].push_back(str);
        }

        for (auto& item : m)
            ans.push_back(item.second);

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    vector<string> strs = {"eat", "tea", "tan", "ate", "nat", "bat"};

    Solution solve;

    vector<vector<string>> ans = solve.groupAnagrams(strs);

    for(auto strs : ans)
    {
      for(auto str : strs)
        cout << str << ' ';
      cout << '\n';
    }

    return 0;
}
```

### [最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-100-liked)

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
    int longestConsecutive(vector<int> &nums)
    {
        int ans = 0;
        unordered_set<int> st(nums.begin(), nums.end());
        for (int x : st)
        {
            if (st.contains(x - 1))
            {
                continue;
            }
            int y = x + 1;
            while (st.contains(y))
            {
                y++;
            }
            ans = max(ans, y - x);
        }
        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    vector<int> nums = {100, 4, 200, 1, 3, 2};

    Solution solve;

    int ans = solve.longestConsecutive(nums);

    cout << ans;

    return 0;
}
```