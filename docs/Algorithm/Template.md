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

# ACM 模式的算法题

一般而言，面试可能不允许我们使用平常训练使用的核心代码模式，故本站提供相关的模板写法以及 LeetCode Hot100 的 ACM 模式写法。

## 常用的头文件

```C++
#include <iostream>         // 重要
#include <vector>           // 重要
#include <list>             // 重要
#include <map>              // 重要
#include <set>              // 重要
#include <queue>            // 重要
#include <stack>            // 重要
#include <deque>            // 重要
#include <unordered_map>    // 重要
#include <unordered_set>    // 重要
#include <utility>          // 重要
#include <algorithm>        // 重要
#include <iomanip>          // 重要
#include <bitset>
#include <complex>
#include <exception>
#include <fstream>
#include <functional>
#include <ios>
#include <iosfwd>
#include <istream>
#include <iterator>
#include <limits>
#include <locale>
#include <memory>
#include <numeric>
#include <ostream>
#include <sstream>
#include <stdexcept>
#include <streambuf>
#include <string>
#include <typeinfo>
#include <valarray>
```

## ACM 模式的 Hot100 如何处理输入输出？

主要在链表和二叉树的处理上。

### ListNode 链表

```C++
#include <iostream>
using namespace std;

struct ListNode {
    int val;        // 存储节点的整数值
    ListNode* next; // 指向下一个节点的指针,next 是一个指向 ListNode 类型的指针

    // 默认构造函数，初始化 val 和 next 为默认值
    ListNode() : val(0), next(nullptr) {}

    // 构造函数，接受一个整数参数 x，初始化 val 为 x，next 为 nullptr
    ListNode(int x) : val(x), next(nullptr) {}

    // 构造函数，接受两个参数，分别是整数值 x 和指向下一个节点的指针 next
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* function(ListNode* head) {
        // Your_Code_Here
    }
};

int main() {
    // 创建链表节点
    ListNode* node1 = new ListNode(1);
    ListNode* node2 = new ListNode(2);
    ListNode* node3 = new ListNode(3);

    // 连接链表节点
    node1->next = node2;
    node2->next = node3;

    Solution solution;
    ListNode* res = solution.function(node1);

    // Your_Code_Here

    return 0;
}
```

### TreeNode 二叉树

```C++
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    ListNode* function(ListNode* head) {
        // Your_Code_Here
    }
};

int main() {
    // 也可以通过 vector 提供层序遍历的输入，利用 2n + 1 和 2n + 2 索引建立树的左右节点
    TreeNode *root = new TreeNode(1);
    root->right = new TreeNode(2);
    root->right->left = new TreeNode(3);

    Solution solution;
    vector<int> result = solution.function(root);

    //Your_Code_Here

    return 0;
}
```