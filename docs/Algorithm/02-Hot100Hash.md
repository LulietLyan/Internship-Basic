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

# 哈希

## [两数之和](https://leetcode.cn/problems/two-sum/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个整数数组 `nums` 和一个整数目标值 `target`，在该数组中找出和为目标值 `target` 的两个整数，并返回它们的数组下标。假设每种输入只会对应一个答案，且数组中同一个元素在答案里不能重复出现。可以按任意顺序返回答案。

**示例**：
```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]

输入：nums = [3,2,4], target = 6
输出：[1,2]

输入：nums = [3,3], target = 6
输出：[0,1]
```

**说明**：


- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- 只会存在一个有效答案

**算法解析**：

这道题使用 **哈希表** 来优化查找：

1. **核心思想** ：对于每个元素，检查target减去该元素的值是否在哈希表中

2. **算法步骤** ：

   - 遍历数组，对于每个元素nums[i]

   - 检查target - nums[i]是否在哈希表中

   - 如果存在，返回当前索引和哈希表中的索引

   - 否则将当前元素和索引加入哈希表

3. **具体实现** ：

   - 使用unordered_map存储元素值和索引的映射

   - 遍历数组，查找补数

   - 找到后立即返回结果

4. **时间复杂度** ：O(n) - 只需要遍历一次数组

5. **空间复杂度** ：O(n) - 哈希表最多存储n个元素

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

    // 构造测试用例：nums = [2,7,11,15], target = 9
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;

    Solution solve;
    vector<int> ans = solve.twoSum(nums, target);

    cout << "数组: ";
    for (int num : nums) {
        cout << num << " ";
    }
    cout << endl;
    
    cout << "目标和: " << target << endl;
    cout << "结果: ";
    for (auto i : ans)
        cout << i << ' ';
    cout << endl;

    return 0;
}
```

## [字母异位词分组](https://leetcode.cn/problems/group-anagrams/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个字符串数组 strs，将字母异位词组合在一起。字母异位词指字母相同但排列不同的字符串。可以按任意顺序返回结果列表。

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

    int n;
    vector<string> strs;
    cin >> n;
    while(n--)
    {
        string tmp;
        cin >> tmp;
        strs.push_back(tmp);
    }

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

## [最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个未排序的整数数组 nums，找出数字连续的最长序列(不要求序列元素在原数组中连续)的长度。要求设计时间复杂度为 O(n) 的算法解决此问题。

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

    int n;
    vector<int> nums;
    cin >> n;
    while(n--)
    {
        int x;
        cin >> x;
        nums.push_back(x);
    }

    Solution solve;

    int ans = solve.longestConsecutive(nums);

    cout << ans;

    return 0;
}
```
