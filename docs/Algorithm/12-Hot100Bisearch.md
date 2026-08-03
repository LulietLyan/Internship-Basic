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

# 二分查找

## [搜索插入位置](https://leetcode.cn/problems/search-insert-position/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个排序数组 `nums` 和目标值 `target`，如果目标值存在则返回下标；否则返回它按顺序插入的位置。

**算法解析**：

本题本质是找第一个大于等于 `target` 的位置，也就是 `lower_bound`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int l = 0, r = nums.size();
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] >= target) r = mid;
            else l = mid + 1;
        }
        return l;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solve;
    cout << solve.searchInsert(nums, target) << '\n';
    return 0;
}
```

## [搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个满足每行递增、每行第一个数大于上一行最后一个数的矩阵，判断目标值是否存在。

**算法解析**：

整个矩阵可以视为一个长度为 `m * n` 的有序数组。下标 `idx` 对应矩阵位置 `(idx / n, idx % n)`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int x = matrix[mid / n][mid % n];
            if (x == target) return true;
            if (x < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m, n, target;
    cin >> m >> n >> target;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cin >> matrix[i][j];
    }

    Solution solve;
    cout << (solve.searchMatrix(matrix, target) ? "true" : "false") << '\n';
    return 0;
}
```

## [在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定非递减数组 `nums` 和目标值 `target`，找出目标值的起始位置和结束位置，不存在则返回 `[-1, -1]`。

**算法解析**：

分别二分找：

- 第一个大于等于 `target` 的位置
- 第一个大于 `target` 的位置，再减一就是右边界

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int lower(vector<int>& nums, int target) {
        int l = 0, r = nums.size();
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] >= target) r = mid;
            else l = mid + 1;
        }
        return l;
    }

    vector<int> searchRange(vector<int>& nums, int target) {
        int left = lower(nums, target);
        int right = lower(nums, target + 1) - 1;
        if (left <= right && right < nums.size() && nums[left] == target) return {left, right};
        return {-1, -1};
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solve;
    auto ans = solve.searchRange(nums, target);
    cout << ans[0] << ' ' << ans[1] << '\n';
    return 0;
}
```

## [搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

整数数组原本升序排列，经过旋转后得到 `nums`。给定 `target`，若存在则返回下标，否则返回 `-1`。

**算法解析**：

每次二分时，左右两半至少有一半是有序的。先判断哪一半有序，再判断 `target` 是否落在有序区间内。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solve;
    cout << solve.search(nums, target) << '\n';
    return 0;
}
```

## [寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个升序数组旋转后的结果，数组中不含重复元素，返回最小元素。

**算法解析**：

用右端点作为参照：

- 如果 `nums[mid] > nums[r]`，说明最小值在右半边
- 否则最小值在左半边或就是 `mid`

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
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
    cout << solve.findMin(nums) << '\n';
    return 0;
}
```

## [寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定两个正序数组 `nums1` 和 `nums2`，返回这两个正序数组的中位数，要求时间复杂度为 `O(log(m+n))`。

**算法解析**：

将问题转化为找两个有序数组中的第 `k` 小元素。每次比较两个数组当前第 `k/2` 个候选元素，丢弃较小一侧的前 `k/2` 个元素，因为它们不可能是第 `k` 小。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int getKth(vector<int>& a, int i, vector<int>& b, int j, int k) {
        if (i >= a.size()) return b[j + k - 1];
        if (j >= b.size()) return a[i + k - 1];
        if (k == 1) return min(a[i], b[j]);

        int ni = min((int)a.size(), i + k / 2) - 1;
        int nj = min((int)b.size(), j + k / 2) - 1;
        if (a[ni] <= b[nj]) {
            return getKth(a, ni + 1, b, j, k - (ni - i + 1));
        }
        return getKth(a, i, b, nj + 1, k - (nj - j + 1));
    }

    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int total = nums1.size() + nums2.size();
        if (total % 2) return getKth(nums1, 0, nums2, 0, total / 2 + 1);
        int left = getKth(nums1, 0, nums2, 0, total / 2);
        int right = getKth(nums1, 0, nums2, 0, total / 2 + 1);
        return (left + right) / 2.0;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int m, n;
    cin >> m >> n;
    vector<int> a(m), b(n);
    for (int i = 0; i < m; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];

    Solution solve;
    cout << fixed << setprecision(5) << solve.findMedianSortedArrays(a, b) << '\n';
    return 0;
}
```

