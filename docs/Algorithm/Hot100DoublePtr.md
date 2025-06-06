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

## 双指针

### [移动零](https://leetcode.cn/problems/move-zeroes/description/?envType=study-plan-v2&envId=top-100-liked)

将数组中的所有零移动到末尾，同时保持非零元素的相对顺序不变。要求在原地操作，不额外开辟空间，并尽可能减少操作次数。

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

给定一个表示每个柱子高度的数组，求两个柱子与横轴围成的容器的最大容量。使用双指针从两端向中间逼近，找出最大值。

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

在数组中找出所有不重复的三元组，使得三数之和为零。先排序数组，再通过双指针在每个固定元素右侧寻找符合条件的两个数。

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

计算柱状图中能够接住的雨水总量。使用双指针从两侧向中间遍历，同时维护左右的最大高度，依据较小的一侧决定当前可接的水量。

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
