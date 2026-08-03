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

# 技巧

## [只出现一次的数字](https://leetcode.cn/problems/single-number/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定非空整数数组，除某个元素只出现一次外，其余元素都出现两次，找出只出现一次的元素。

**算法解析**：利用异或性质：`x ^ x = 0`，`x ^ 0 = x`，且异或满足交换律和结合律。把所有数字异或起来，成对出现的数字会抵消，剩下的就是只出现一次的数字。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ans = 0;
        for (int x : nums) ans ^= x;
        return ans;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << solution.singleNumber(nums) << endl;
    return 0;
}
```

## [多数元素](https://leetcode.cn/problems/majority-element/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定大小为 `n` 的数组，找出出现次数大于 `n / 2` 的多数元素。

**算法解析**：使用 Boyer-Moore 投票算法。维护候选人和计数，遇到相同元素计数加一，否则减一；计数归零时更换候选人。由于多数元素超过一半，最终留下的候选人一定是答案。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = 0;
        int count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate ? 1 : -1);
        }
        return candidate;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << solution.majorityElement(nums) << endl;
    return 0;
}
```

## [颜色分类](https://leetcode.cn/problems/sort-colors/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定只包含 `0`、`1`、`2` 的数组，原地将它们按红、白、蓝顺序排序。

**算法解析**：荷兰国旗问题。用 `left` 指向下一个 `0` 应放的位置，`right` 指向下一个 `2` 应放的位置，`i` 扫描数组。遇到 `0` 与 `left` 交换并同时前进；遇到 `2` 与 `right` 交换，仅收缩右边界，因为换回来的元素还需要继续判断。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void sortColors(vector<int>& nums) {
        int left = 0, i = 0, right = nums.size() - 1;
        while (i <= right) {
            if (nums[i] == 0) {
                swap(nums[i], nums[left]);
                i++;
                left++;
            } else if (nums[i] == 2) {
                swap(nums[i], nums[right]);
                right--;
            } else {
                i++;
            }
        }
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    solution.sortColors(nums);
    for (int i = 0; i < nums.size(); i++) {
        if (i) cout << " ";
        cout << nums[i];
    }
    cout << endl;
    return 0;
}
```

## [下一个排列](https://leetcode.cn/problems/next-permutation/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定整数数组，原地将其变为字典序中的下一个排列；如果不存在更大的排列，则变为最小排列。

**算法解析**：从右向左找到第一个满足 `nums[i] < nums[i + 1]` 的位置，它是需要变大的低位。再从右向左找到第一个大于 `nums[i]` 的元素并交换，最后反转 `i + 1` 之后的后缀，使后缀变为最小升序。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    solution.nextPermutation(nums);
    for (int i = 0; i < nums.size(); i++) {
        if (i) cout << " ";
        cout << nums[i];
    }
    cout << endl;
    return 0;
}
```

## [寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定包含 `n + 1` 个整数的数组，数字都在 `[1, n]` 范围内，只有一个重复数字，要求不修改数组并使用常数额外空间找出它。

**算法解析**：把数组看作链表：下标 `i` 指向 `nums[i]`。由于数字范围在 `[1, n]` 且有重复值，这个链表一定存在环，重复数就是环入口。使用 Floyd 快慢指针先找到相遇点，再让一个指针从起点出发，两个指针每次走一步，相遇位置就是入口。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << solution.findDuplicate(nums) << endl;
    return 0;
}
```
