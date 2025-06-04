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

    int n, target;
    vector<int> nums;
    cin >> n >> target;
    while(n--)
    {
        int x;
        cin >> x;
        nums.push_back(x);
    }

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

## 双指针

### [移动零](https://leetcode.cn/problems/move-zeroes/description/?envType=study-plan-v2&envId=top-100-liked)

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
    void moveZeroes(vector<int> &nums)
    {
        for (int i = 0, j = 0; j < nums.size();)
        {
            if (nums[j])
                swap(nums[i], nums[j]), i++;
            j++;
        }
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    vector<int> nums;

    cin >> n;
    while (n--)
    {
        int x;
        cin >> x;
        nums.push_back(x);
    }

    Solution solve;

    solve.moveZeroes(nums);

    for (auto num : nums)
        cout << num << ' ';

    return 0;
}
```

### [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/description/?envType=study-plan-v2&envId=top-100-liked)

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
    int maxArea(vector<int> &height)
    {
        int ans = -1;

        for (int i = 0, j = height.size() - 1; i < j;)
        {
            ans = max(ans, (j - i) * min(height[i], height[j]));
            height[i] < height[j] ? i++ : j--;
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    vector<int> height;

    cin >> n;
    while (n--)
    {
        int x;
        cin >> x;
        height.push_back(x);
    }

    Solution solve;

    cout << solve.maxArea(height);

    return 0;
}
```

### [三数之和](https://leetcode.cn/problems/3sum/description/?envType=study-plan-v2&envId=top-100-liked)

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
    vector<vector<int>> threeSum(vector<int> &nums)
    {
        vector<vector<int>> ans;

        sort(nums.begin(), nums.end());

        for (int l = 0; l < nums.size() - 2; l++)
        {
            if (l > 0 && nums[l] == nums[l - 1])
                continue;

            int r = l + 1, k = nums.size() - 1, target = -nums[l];

            while (r < k)
            {
                if (nums[r] + nums[k] == target)
                {
                    ans.push_back({nums[l], nums[r++], nums[k]});
                    while (r < k && nums[r] == nums[r - 1])
                        r++;
                }
                else if (nums[r] + nums[k] < target)
                    r++;
                else
                    k--;
            }
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    vector<int> nums;

    cin >> n;
    while (n--)
    {
        int x;
        cin >> x;
        nums.push_back(x);
    }

    Solution solve;

    vector<vector<int>> ans = solve.threeSum(nums);

    for (auto v : ans)
    {
        for (auto num : v)
            cout << num << ' ';
        cout << '\n';
    }

    return 0;
}
```

### [接雨水](https://leetcode.cn/problems/trapping-rain-water/description/?envType=study-plan-v2&envId=top-100-liked)

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
    int trap(vector<int> &height)
    {
        int ans = 0;
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;

        while (left < right)
        {
            leftMax = max(leftMax, height[left]);
            rightMax = max(rightMax, height[right]);

            if (height[left] < height[right])
                ans += leftMax - height[left++];
            else
                ans += rightMax - height[right--];
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    vector<int> height;

    cin >> n;
    while (n--)
    {
        int x;
        cin >> x;
        height.push_back(x);
    }

    Solution solve;

    cout << solve.trap(height);

    return 0;
}
```

## 滑动窗口

## 子串

## 普通数组

## 矩阵

## 链表

## 图论

## 回溯

## 二分查找

## 栈

## 堆

## 贪心算法

## 动态规划

## 多维动态规划

## 技巧