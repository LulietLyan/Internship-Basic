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

# 普通数组

## [最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个整数数组 `nums`，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**示例**：
```
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

输入：nums = [1]
输出：1

输入：nums = [5,4,-1,7,8]
输出：23
```

**说明**：


- 1 <= nums.length <= 10^5

- -10^4 <= nums[i] <= 10^4

**算法解析**：

这道题使用 **动态规划** 的思想，具体来说是 **Kadane算法** ：

1. **核心思想** ：对于每个位置，我们有两种选择：

   - 将当前元素加入到前面的子数组中

   - 以当前元素作为新的子数组的起点

2. **状态定义** ：`sum` 表示以当前位置结尾的最大子数组和

3. **状态转移** ：`sum = max(sum + nums[i], nums[i])`

   - 如果前面的和是负数，那么重新开始计算

   - 如果前面的和是正数，那么继续累加

4. **时间复杂度** ：O(n)

5. **空间复杂度** ：O(1)

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
    
    // 构造测试用例：[-2,1,-3,4,-1,2,1,-5,4]
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    
    Solution sol;
    int result = sol.maxSubArray(nums);
    
    cout << "最大子数组和: " << result << endl;

    return 0;
}
```

## [合并区间](https://leetcode.cn/problems/merge-intervals/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]`。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。

**示例**：
```
输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].

输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
```

**说明**：

- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= starti <= endi <= 10^4

**算法解析**：

这道题使用 **排序 + 贪心** 的思想：

1. **核心思想** ：先将所有区间按照起始位置排序，然后遍历合并重叠的区间

2. **算法步骤** ：
   - 按起始位置排序所有区间
   - 维护当前合并区间的左右边界
   - 遍历每个区间，如果与当前区间重叠则合并，否则开始新区间

3. **判断重叠** ：如果新区间的起始位置 <= 当前区间的结束位置，则重叠

4. **时间复杂度** ：O(n log n) - 排序的时间复杂度
5. **空间复杂度** ：O(1) - 不考虑输出数组

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

    // 构造测试用例：[[1,3],[2,6],[8,10],[15,18]]
    vector<vector<int>> intervals = {{1,3}, {2,6}, {8,10}, {15,18}};
    
    Solution sol;
    vector<vector<int>> ans = sol.merge(intervals);
    
    cout << "合并后的区间:" << endl;
    for(auto& p : ans)
        cout << "[" << p[0] << "," << p[1] << "] ";
    cout << endl;

    return 0;
}
```

## [轮转数组](https://leetcode.cn/problems/rotate-array/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个整数数组 `nums`，将数组中的元素向右轮转 `k` 个位置，其中 `k` 是非负数。

**示例**：
```
输入：nums = [1,2,3,4,5,6,7], k = 3
输出：[5,6,7,1,2,3,4]
解释：
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]

输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
解释：
向右轮转 1 步: [99,-1,-100,3]
向右轮转 2 步: [3,99,-1,-100]
```

**说明**：

- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^5

**算法解析**：

这道题使用 **三次反转** 的方法，这是一个经典的数组旋转技巧：

1. **核心思想** ：通过三次反转来实现数组旋转
   - 第一次：反转整个数组
   - 第二次：反转前k个元素
   - 第三次：反转剩余元素

2. **算法步骤** ：
   - 先对k取模，因为旋转n次等于不旋转
   - 反转整个数组
   - 反转前k个元素
   - 反转后n-k个元素

3. **举例说明** ：
   - 原数组：[1,2,3,4,5,6,7], k=3
   - 反转整个：[7,6,5,4,3,2,1]
   - 反转前3个：[5,6,7,4,3,2,1]
   - 反转后4个：[5,6,7,1,2,3,4]

4. **时间复杂度** ：O(n)
5. **空间复杂度** ：O(1)

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

    // 构造测试用例：[1,2,3,4,5,6,7], k = 3
    vector<int> nums = {1, 2, 3, 4, 5, 6, 7};
    int k = 3;
    
    Solution sol;
    sol.rotate(nums, k);
    
    cout << "轮转后的数组: ";
    for(auto x : nums)
        cout << x << ' ';
    cout << endl;

    return 0;
}
```

## [除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个整数数组 `nums`，返回数组 `answer`，其中 `answer[i]` 等于 `nums` 中除 `nums[i]` 之外其余各元素的乘积。

题目数据保证数组 `nums` 之中任意元素的全部前缀元素和后缀的乘积都在 32 位整数范围内。

请不要使用除法，且在 O(n) 时间复杂度内完成此题。

**示例**：
```
输入：nums = [1,2,3,4]
输出：[24,12,8,6]
解释：answer[0] = 3×4×2 = 24, answer[1] = 1×4×3 = 12, answer[2] = 1×2×4 = 8, answer[3] = 1×2×3 = 6

输入：nums = [-1,1,0,-3,3]
输出：[0,0,9,0,0]
解释：answer[0] = 1×0×(-3)×3 = 0, answer[1] = (-1)×0×(-3)×3 = 0, answer[2] = (-1)×1×(-3)×3 = 9, answer[3] = (-1)×1×0×3 = 0, answer[4] = (-1)×1×0×(-3) = 0
```

**说明**：

- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- 保证数组 nums 之中任意元素的全部前缀元素和后缀的乘积都在 32 位整数范围内

**算法解析**：

这道题使用 **左右乘积列表** 的方法，避免使用除法：

1. **核心思想** ：将每个位置的乘积分解为左边所有数的乘积 × 右边所有数的乘积

2. **算法步骤** ：
   - 从左到右遍历，计算每个位置左边所有数的乘积
   - 从右到左遍历，计算每个位置右边所有数的乘积
   - 将两个乘积相乘得到最终结果

3. **具体实现** ：
   - 使用一个变量记录当前累积的乘积
   - 第一次遍历：从左到右，每个位置存储左边所有数的乘积
   - 第二次遍历：从右到左，用右边所有数的乘积乘以之前存储的值

4. **时间复杂度** ：O(n)
5. **空间复杂度** ：O(1) - 不考虑输出数组

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

    // 构造测试用例：[1,2,3,4]
    vector<int> nums = {1, 2, 3, 4};
    
    Solution sol;
    vector<int> ans = sol.productExceptSelf(nums);
    
    cout << "除自身以外数组的乘积: ";
    for(auto x : ans)
        cout << x << ' ';
    cout << endl;

    return 0;
}
```

## [缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个未排序的整数数组 `nums`，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

**示例**：
```
输入：nums = [1,2,0]
输出：3

输入：nums = [3,4,-1,1]
输出：2

输入：nums = [7,8,9,11,12]
输出：1
```

**说明**：

- 1 <= nums.length <= 5 * 10^5
- -2^31 <= nums[i] <= 2^31 - 1

**算法解析**：

这道题使用 **原地哈希** 的方法，将数组本身作为哈希表：

1. **核心思想** ：将数组中的每个正整数放到它应该在的位置上
   - 数字1应该放在索引0的位置
   - 数字2应该放在索引1的位置
   - 以此类推...

2. **算法步骤** ：
   - 遍历数组，将每个正整数放到正确的位置
   - 再次遍历数组，找到第一个不在正确位置的数字
   - 返回缺失的最小正整数

3. **具体实现** ：
   - 对于每个位置i，如果nums[i]在[1,n]范围内，将其放到nums[nums[i]-1]的位置
   - 使用while循环确保交换后的数字也被放到正确位置
   - 最后遍历数组，找到第一个nums[i] != i+1的位置

4. **时间复杂度** ：O(n) - 每个数字最多被交换一次
5. **空间复杂度** ：O(1) - 只使用常数额外空间

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

    // 构造测试用例：[3,4,-1,1]
    vector<int> nums = {3, 4, -1, 1};
    
    Solution sol;
    int result = sol.firstMissingPositive(nums);
    
    cout << "缺失的第一个正数: " << result << endl;

    return 0;
}
```