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

# 堆

## [数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定整数数组和整数 `k`，返回数组中第 `k` 个最大的元素。

**算法解析** ：维护一个大小为 `k` 的小根堆。遍历数组时把元素压入堆；若堆大小超过 `k`，弹出最小值。最终堆顶就是第 `k` 大元素。时间复杂度 `O(nlogk)`，适合 `k` 明显小于 `n` 的场景。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;
        for (int x : nums) {
            heap.push(x);
            if (heap.size() > k) heap.pop();
        }
        return heap.top();
    }
};

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    cout << solution.findKthLargest(nums, k) << endl;
    return 0;
}
```

## [前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：给定整数数组和整数 `k`，返回出现频率最高的 `k` 个元素。

**算法解析** ：先用哈希表统计频率，再用大小为 `k` 的小根堆保存当前频率最高的元素。堆中按频率从小到大排序，超过 `k` 时弹出频率最小的元素。最后堆内元素即为答案。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int x : nums) freq[x]++;

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> heap;
        for (auto [num, cnt] : freq) {
            heap.push({cnt, num});
            if (heap.size() > k) heap.pop();
        }

        vector<int> ans;
        while (!heap.empty()) {
            ans.push_back(heap.top().second);
            heap.pop();
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    Solution solution;
    vector<int> ans = solution.topKFrequent(nums, k);
    for (int i = 0; i < ans.size(); i++) {
        if (i) cout << " ";
        cout << ans[i];
    }
    cout << endl;
    return 0;
}
```

## [数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：设计一个数据结构，支持不断加入数字，并随时返回当前数据流的中位数。

**算法解析** ：用两个堆维护有序划分：大根堆 `left` 保存较小的一半，小根堆 `right` 保存较大的一半。保持 `left.size() >= right.size()` 且两者大小差不超过 `1`。若总数为奇数，中位数是 `left.top()`；否则是两个堆顶平均值。

```C++
#include <bits/stdc++.h>
using namespace std;

class MedianFinder {
private:
    priority_queue<int> left;
    priority_queue<int, vector<int>, greater<int>> right;

public:
    void addNum(int num) {
        if (left.empty() || num <= left.top()) left.push(num);
        else right.push(num);

        if (left.size() > right.size() + 1) {
            right.push(left.top());
            left.pop();
        } else if (right.size() > left.size()) {
            left.push(right.top());
            right.pop();
        }
    }

    double findMedian() {
        if (left.size() == right.size()) {
            return (left.top() + right.top()) / 2.0;
        }
        return left.top();
    }
};

int main() {
    int q;
    cin >> q;
    MedianFinder finder;
    while (q--) {
        string op;
        cin >> op;
        if (op == "add") {
            int x;
            cin >> x;
            finder.addNum(x);
        } else if (op == "median") {
            cout << fixed << setprecision(5) << finder.findMedian() << endl;
        }
    }
    return 0;
}
```
