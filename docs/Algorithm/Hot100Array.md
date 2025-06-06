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

# 普通数组

## [最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个整数数组 nums，找到一个具有最大和的连续子数组(至少包含一个元素)，并返回其最大和。

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
    int maxSubArray(vector<int> &nums)
    {
        int ans = nums[0], sum = 0;

        for (auto n : nums)
            sum = max(sum + n, n), ans = max(ans, sum);

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    
    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++)
        cin >> nums[i];
    
    Solution sol;
    cout << sol.maxSubArray(nums) << '\n';

    return 0;
}
```

## [合并区间](https://leetcode.cn/problems/merge-intervals/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个区间集合 intervals(每个区间表示为 [start, end])，合并所有重叠的区间，并返回不重叠的区间集合(按 start 排序)。

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
    vector<vector<int>> merge(vector<vector<int>> &intervals)
    {
        sort(intervals.begin(), intervals.end());

        vector<vector<int>> ans;
        int l{intervals[0][0]}, r{intervals[0][1]};
        for (auto &p : intervals)
            if (p[0] > r)
            {
                ans.push_back({l, r});
                l = p[0];
                r = p[1];
            }
            else
                r = max(r, p[1]);

        ans.push_back({l, r});
        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<vector<int>> intervals(n, vector<int>(2));
    for(int i = 0; i < n; i++)
        cin >> intervals[i][0] >> intervals[i][1];
    
    Solution sol;
    vector<vector<int>> ans = sol.merge(intervals);
    
    for(auto& p : ans)
        cout << p[0] << ' ' << p[1] << '\n';

    return 0;
}
```

## [轮转数组](https://leetcode.cn/problems/rotate-array/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个整数数组 nums 和一个整数 k，将数组中的元素向右轮转 k 个位置(k 为非负数)。要求空间复杂度为 O(1)。

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
    void reverse(vector<int> &nums, int start, int end)
    {
        while (start < end)
            swap(nums[start++], nums[end--]);
    }
    void rotate(vector<int> &nums, int &k)
    {
        k %= nums.size();
        reverse(nums, 0, nums.size() - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.size() - 1);
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
    for(int i = 0; i < n; i++)
        cin >> nums[i];
    
    Solution sol;
    sol.rotate(nums, k);
    
    for(auto x : nums)
        cout << x << ' ';
    cout << '\n';

    return 0;
}
```

## [除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个整数数组 nums，返回一个数组 ans，其中 ans[i] 等于 nums 中除 nums[i] 外其余所有元素的乘积。要求时间复杂度 O(n)，空间复杂度 O(1)(输出数组不计入空间复杂度)。

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
    vector<int> productExceptSelf(vector<int> &nums)
    {
        vector<int> ans(nums.size(), 1);

        int pre = 1, suf = 1;

        for (int i = 0, j = nums.size() - 1; i < nums.size() - 1; i++, j--)
        {
            pre *= nums[i];
            suf *= nums[j];
            ans[i + 1] *= pre;
            ans[j - 1] *= suf;
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
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++)
        cin >> nums[i];
    
    Solution sol;
    vector<int> ans = sol.productExceptSelf(nums);
    
    for(auto x : ans)
        cout << x << ' ';
    cout << '\n';

    return 0;
}
```

## [缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个未排序的整数数组 nums，找出其中没有出现的最小正整数。要求时间复杂度为 O(n)，空间复杂度为 O(1)。

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
    int firstMissingPositive(vector<int> &nums)
    {
        for (int i = 0; i < nums.size(); ++i)
            while (nums[i] > 0 && nums[i] <= nums.size() && nums[nums[i] - 1] != nums[i])
                swap(nums[nums[i] - 1], nums[i]);

        for (int i = 0; i < nums.size(); ++i)
            if (nums[i] != i + 1)
                return i + 1;

        return nums.size() + 1;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++)
        cin >> nums[i];
    
    Solution sol;
    cout << sol.firstMissingPositive(nums) << '\n';

    return 0;
}
```