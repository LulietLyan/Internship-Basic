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

# 栈

## [有效的括号](https://leetcode.cn/problems/valid-parentheses/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定只包含 `()[]{}` 的字符串，判断括号是否按正确顺序闭合。

**算法解析**：使用栈保存尚未匹配的左括号。遇到左括号入栈；遇到右括号时，若栈空或栈顶不是对应左括号，则非法。遍历结束后栈为空才说明所有括号都被匹配。时间复杂度 `O(n)`，空间复杂度 `O(n)`。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};

int main() {
    string s;
    cin >> s;
    Solution solution;
    cout << (solution.isValid(s) ? "true" : "false") << endl;
    return 0;
}
```

## [最小栈](https://leetcode.cn/problems/min-stack/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：设计一个支持 `push`、`pop`、`top`、`getMin` 的栈，并要求在常数时间内获取栈内最小值。

**算法解析**：维护两个栈：普通栈保存元素，辅助栈 `mins` 保存当前层级下的最小值。每次压入元素时，同时把 `min(x, mins.top())` 压入辅助栈；弹出时两个栈同步弹出。这样栈顶、最小值都可以 `O(1)` 获取。

```C++
#include <bits/stdc++.h>
using namespace std;

class MinStack {
private:
    stack<int> data;
    stack<int> mins;

public:
    void push(int val) {
        data.push(val);
        if (mins.empty()) mins.push(val);
        else mins.push(min(val, mins.top()));
    }

    void pop() {
        data.pop();
        mins.pop();
    }

    int top() {
        return data.top();
    }

    int getMin() {
        return mins.top();
    }
};

int main() {
    int q;
    cin >> q;
    MinStack minStack;
    while (q--) {
        string op;
        cin >> op;
        if (op == "push") {
            int x;
            cin >> x;
            minStack.push(x);
        } else if (op == "pop") {
            minStack.pop();
        } else if (op == "top") {
            cout << minStack.top() << endl;
        } else if (op == "getMin") {
            cout << minStack.getMin() << endl;
        }
    }
    return 0;
}
```

## [字符串解码](https://leetcode.cn/problems/decode-string/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定编码字符串，例如 `3[a2[c]]`，按规则展开为原始字符串。

**算法解析**：遇到数字累积重复次数；遇到 `[` 时把当前数字和当前字符串入栈，并开启新的子串；遇到 `]` 时弹出上一个上下文，将当前子串重复指定次数后拼回。嵌套结构天然适合用栈维护上下文。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string decodeString(string s) {
        stack<int> counts;
        stack<string> prevStrings;
        string cur;
        int num = 0;

        for (char c : s) {
            if (isdigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '[') {
                counts.push(num);
                prevStrings.push(cur);
                num = 0;
                cur.clear();
            } else if (c == ']') {
                int times = counts.top();
                counts.pop();
                string prev = prevStrings.top();
                prevStrings.pop();
                while (times--) prev += cur;
                cur = prev;
            } else {
                cur += c;
            }
        }
        return cur;
    }
};

int main() {
    string s;
    cin >> s;
    Solution solution;
    cout << solution.decodeString(s) << endl;
    return 0;
}
```

## [每日温度](https://leetcode.cn/problems/daily-temperatures/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定每天的温度数组，返回每一天需要等待多少天才会出现更高温度；若之后没有更高温度则为 `0`。

**算法解析**：维护一个单调递减栈，栈中存放还没有找到更高温度的下标。遍历到第 `i` 天时，只要当前温度大于栈顶下标对应温度，就说明栈顶答案为 `i - st.top()`，不断弹出直到恢复单调性。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int idx = st.top();
                st.pop();
                ans[idx] = i - idx;
            }
            st.push(i);
        }
        return ans;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> temperatures(n);
    for (int i = 0; i < n; i++) cin >> temperatures[i];

    Solution solution;
    vector<int> ans = solution.dailyTemperatures(temperatures);
    for (int i = 0; i < ans.size(); i++) {
        if (i) cout << " ";
        cout << ans[i];
    }
    cout << endl;
    return 0;
}
```

## [柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：给定柱状图高度数组，求能组成的最大矩形面积。

**算法解析**：用单调递增栈维护柱子下标。当遇到更矮的柱子时，栈顶柱子的右边界已经确定，左边界是弹出后新的栈顶。对每个被弹出的高度计算一次最大宽度。末尾添加高度 `0` 的哨兵，统一处理剩余柱子。

```C++
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        heights.push_back(0);
        stack<int> st;
        int ans = 0;

        for (int i = 0; i < heights.size(); i++) {
            while (!st.empty() && heights[i] < heights[st.top()]) {
                int h = heights[st.top()];
                st.pop();
                int left = st.empty() ? -1 : st.top();
                ans = max(ans, h * (i - left - 1));
            }
            st.push(i);
        }
        heights.pop_back();
        return ans;
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> heights(n);
    for (int i = 0; i < n; i++) cin >> heights[i];

    Solution solution;
    cout << solution.largestRectangleArea(heights) << endl;
    return 0;
}
```
