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

# 二叉树

## [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉树的根节点 `root`，返回它的中序遍历结果。

**示例**：
```
输入：root = [1,null,2,3]
输出：[1,3,2]
```

**说明**：

- 中序遍历：左子树 -> 根节点 -> 右子树

- 树中节点数目在范围 [0, 100] 内

- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **迭代法** 实现中序遍历，使用栈来模拟递归过程：

1. **核心思想** ：模拟递归的中序遍历过程

   - 先遍历左子树（将所有左子节点入栈）

   - 访问根节点

   - 再遍历右子树

2. **算法步骤** ：

   - 将当前节点及其所有左子节点依次入栈

   - 弹出栈顶元素并访问

   - 将弹出节点的右子节点设为当前节点，重复上述过程

3. **具体实现** ：

   - 使用do-while循环确保至少执行一次

   - 内层while循环将所有左子节点入栈

   - 弹出栈顶元素并加入结果

   - 将右子节点设为当前节点继续遍历

4. **时间复杂度** ：O(n) - 每个节点被访问一次

5. **空间复杂度** ：O(h) - h为树的高度，最坏情况下为O(n)

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
    vector<int> inorderTraversal(TreeNode* root) 
    {
        stack<TreeNode*> s;
        vector<int> v;
        if(root==NULL) return v;
        do
        {
            while(root!=NULL)
            {
                s.push(root);
                root = root->left;
            }
            if(!s.empty())
            {
                root = s.top();
                s.pop();
                v.push_back(root->val);
                root = root->right;
            }
        }
        while(root!=NULL||!s.empty());
        return v;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [1,null,2,3]
    TreeNode* root = new TreeNode(1);
    root->right = new TreeNode(2);
    root->right->left = new TreeNode(3);
    
    Solution solution;
    vector<int> result = solution.inorderTraversal(root);
    
    cout << "中序遍历结果: ";
    for (int val : result) {
        cout << val << " ";
    }
    cout << endl;

    return 0;
}
```

## [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**示例**：
```
输入：root = [3,9,20,null,null,15,7]
输出：3
```

**说明**：

- 叶子节点是指没有子节点的节点

- 树中节点数目在范围 [0, 10^4] 内

- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **递归法** 计算二叉树的最大深度：

1. **核心思想** ：二叉树的最大深度等于左右子树的最大深度加1
   - 如果节点为空，深度为0
   - 否则深度 = max(左子树深度, 右子树深度) + 1

2. **算法步骤** ：
   - 使用递归函数遍历每个节点
   - 记录每个节点的深度
   - 返回所有深度的最大值

3. **具体实现** ：
   - 使用getval函数递归遍历树
   - 将每个节点的值按深度存储在二维数组中
   - 返回数组的大小即为最大深度

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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
    vector<vector<int>>& getval(vector<vector<int>>& v,TreeNode* root,int depth)
    {
        if(root)
        {
            if(v.size()<depth+1) v.resize(v.size()+1);
            v[depth].push_back(root->val);
            if(root->left)
            {
                v = getval(v,root->left,depth+1);
            }
            if(root->right)
            {
                v = getval(v,root->right,depth+1);
            }
        }
        return v;
    }
    int maxDepth(TreeNode* root) 
    {
       vector<vector<int>> v;v = getval(v,root,0);
       return v.size();
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [3,9,20,null,null,15,7]
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);
    
    Solution solution;
    int result = solution.maxDepth(root);
    
    cout << "二叉树的最大深度: " << result << endl;

    return 0;
}
```

## [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一棵二叉树的根节点 `root`，翻转这棵二叉树，并返回其根节点。

**示例**：
```
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

**说明**：
- 翻转二叉树：交换每个节点的左右子树
- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **递归法** 翻转二叉树：

1. **核心思想** ：翻转二叉树就是交换每个节点的左右子树
   - 从根节点开始，递归地交换左右子树
   - 直到所有节点都被处理

2. **算法步骤** ：
   - 如果节点为空，直接返回
   - 交换当前节点的左右子树
   - 递归翻转左子树
   - 递归翻转右子树

3. **具体实现** ：
   - 使用reverseTree函数进行递归翻转
   - 只有当节点有子节点时才进行交换
   - 交换后递归处理左右子树

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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
   void reverseTree(TreeNode *root)
   {
       if(root==NULL) return;
       if(root->left!=NULL||root->right!=NULL)
       {
           TreeNode *p = root->left;
           root->left = root->right;
           root->right = p;
           reverseTree(root->left);
           reverseTree(root->right);
       }
   } 
   TreeNode* invertTree(TreeNode* root) 
    {
        reverseTree(root);
        return root;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [4,2,7,1,3,6,9]
    TreeNode* root = new TreeNode(4);
    root->left = new TreeNode(2);
    root->right = new TreeNode(7);
    root->left->left = new TreeNode(1);
    root->left->right = new TreeNode(3);
    root->right->left = new TreeNode(6);
    root->right->right = new TreeNode(9);
    
    Solution solution;
    TreeNode* result = solution.invertTree(root);
    
    cout << "翻转二叉树完成，根节点值: " << result->val << endl;

    return 0;
}
```

## [对称二叉树](https://leetcode.cn/problems/symmetric-tree/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个二叉树的根节点 `root`，检查它是否轴对称。

**示例**：
```
输入：root = [1,2,2,3,4,4,3]
输出：true

输入：root = [1,2,2,null,3,null,3]
输出：false
```

**说明**：
- 轴对称：左子树与右子树镜像对称
- 树中节点数目在范围 [1, 1000] 内
- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **递归法** 判断二叉树是否对称：

1. **核心思想** ：对称二叉树要求左右子树镜像对称
   - 左子树的左子节点 = 右子树的右子节点
   - 左子树的右子节点 = 右子树的左子节点

2. **算法步骤** ：
   - 从根节点的左右子树开始判断
   - 递归比较左子树的左子节点与右子树的右子节点
   - 递归比较左子树的右子节点与右子树的左子节点

3. **具体实现** ：
   - 使用check函数递归比较两个节点
   - 如果两个节点都为空，返回true
   - 如果只有一个为空，返回false
   - 如果值不相等，返回false
   - 递归比较左右子树

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    bool check(TreeNode *l, TreeNode *r)
    {
        if (!l && !r)
            return true;
        if (!l || !r)
            return false;
        return l->val == r->val && check(l->left, r->right) && check(l->right, r->left);
    }
    bool isSymmetric(TreeNode *root)
    {
        return check(root->left, root->right);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：对称二叉树 [1,2,2,3,4,4,3]
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(2);
    root->left->left = new TreeNode(3);
    root->left->right = new TreeNode(4);
    root->right->left = new TreeNode(4);
    root->right->right = new TreeNode(3);
    
    Solution solution;
    bool result = solution.isSymmetric(root);
    
    cout << "二叉树是否对称: " << (result ? "true" : "false") << endl;

    return 0;
}
```

## [二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。

**示例**：
```
输入：root = [1,2,3,4,5]
输出：3
解释：路径 [4,2,1,3] 或者 [5,2,1,3] 的长度为 3
```

**说明**：
- 两结点之间的路径长度是以它们之间边的数目表示
- 给定树的结点数在 [1, 10^4] 范围内
- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **深度优先搜索** 计算二叉树的直径：

1. **核心思想** ：二叉树的直径是任意两个节点路径长度的最大值
   - 直径可能经过根节点，也可能不经过
   - 对于每个节点，计算经过该节点的最长路径

2. **算法步骤** ：
   - 使用DFS遍历每个节点
   - 对于每个节点，计算左右子树的高度
   - 更新全局最大直径：ans = max(ans, left + right + 1)
   - 返回以当前节点为根的子树高度

3. **具体实现** ：
   - 使用dfs函数递归计算每个节点的高度
   - 在递归过程中更新全局变量ans
   - 返回max(左子树高度, 右子树高度) + 1

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    int ans;
    int dfs(TreeNode *p)
    {
        if (!p)
            return 0;
        int l = dfs(p->left), r = dfs(p->right);
        ans = max(ans, l + r + 1);
        return max(l, r) + 1;
    }
    int diameterOfBinaryTree(TreeNode *root)
    {
        ans = 1;
        dfs(root);
        return ans - 1;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [1,2,3,4,5]
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    root->left->right = new TreeNode(5);
    
    Solution solution;
    int result = solution.diameterOfBinaryTree(root);
    
    cout << "二叉树的直径: " << result << endl;

    return 0;
}
```

## [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你二叉树的根节点 `root`，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。

**示例**：
```
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]
```

**说明**：
- 层序遍历：从上到下逐层遍历，每层从左到右
- 树中节点数目在范围 [0, 2000] 内
- -1000 <= Node.val <= 1000

**算法解析**：

这道题使用 **递归法** 实现层序遍历：

1. **核心思想** ：按深度层次遍历二叉树
   - 使用递归函数记录每个节点的深度
   - 将同一深度的节点放在同一个数组中

2. **算法步骤** ：
   - 使用getval函数递归遍历树
   - 记录每个节点的深度
   - 将节点值按深度存储在二维数组中
   - 返回按深度分组的节点值

3. **具体实现** ：
   - 使用depth参数记录当前节点的深度
   - 如果v数组大小小于depth+1，则扩展数组
   - 将当前节点值加入对应深度的数组
   - 递归处理左右子树

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(n) - 需要存储所有节点的值

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
    vector<vector<int>>& getval(vector<vector<int>>& v,TreeNode* root,int depth)
    {
        if(root)
        {
            if(v.size()<depth+1) v.resize(v.size()+1);
            v[depth].push_back(root->val);
            if(root->left)
            {
                v = getval(v,root->left,depth+1);
            }
            if(root->right)
            {
                v = getval(v,root->right,depth+1);
            }
        }
        return v;
    }
    vector<vector<int>> levelOrder(TreeNode* root) 
    {
        vector<vector<int>>v;
        v = getval(v,root,0);
        return v;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [3,9,20,null,null,15,7]
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);
    
    Solution solution;
    vector<vector<int>> result = solution.levelOrder(root);
    
    cout << "层序遍历结果:" << endl;
    for (int i = 0; i < result.size(); i++) {
        cout << "第" << i << "层: ";
        for (int val : result[i]) {
            cout << val << " ";
        }
        cout << endl;
    }

    return 0;
}
```

## [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个整数数组 `nums`，其中元素已经按升序排列，请你将其转换为一棵高度平衡二叉搜索树。

高度平衡二叉树是一棵满足「每个节点的左右两个子树的高度差的绝对值不超过 1 」的二叉树。

**示例**：
```
输入：nums = [-10,-3,0,5,9]
输出：[0,-3,9,-10,null,5]
```

**说明**：
- 1 <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4
- nums 按严格递增顺序排列

**算法解析**：

这道题使用 **分治法** 将有序数组转换为平衡二叉搜索树：

1. **核心思想** ：利用有序数组的特性构建平衡BST
   - 数组中间的元素作为根节点
   - 左半部分构建左子树
   - 右半部分构建右子树

2. **算法步骤** ：
   - 找到数组的中间元素作为根节点
   - 递归构建左子树（左半部分）
   - 递归构建右子树（右半部分）
   - 返回构建好的树

3. **具体实现** ：
   - 使用generateNode函数递归构建节点
   - 计算中间位置：mid = (l + r) / 2
   - 创建根节点：new TreeNode(nums[mid])
   - 递归构建左右子树

4. **时间复杂度** ：O(n) - 每个元素被访问一次
5. **空间复杂度** ：O(log n) - 递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    TreeNode *generateNode(vector<int> &nums, int l, int r)
    {
        if (l > r)
            return nullptr;

        int mid = l + r >> 1;
        TreeNode *p = new TreeNode(nums[mid]);

        p->left = generateNode(nums, l, mid - 1);
        p->right = generateNode(nums, mid + 1, r);

        return p;
    }

    TreeNode *sortedArrayToBST(vector<int> &nums)
    {
        return generateNode(nums, 0, nums.size() - 1);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：有序数组 [-10,-3,0,5,9]
    vector<int> nums = {-10, -3, 0, 5, 9};
    
    Solution solution;
    TreeNode* result = solution.sortedArrayToBST(nums);
    
    cout << "有序数组转换为二叉搜索树完成" << endl;
    cout << "根节点值: " << result->val << endl;

    return 0;
}
```

## [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你一个二叉树的根节点 `root`，判断其是否是一个有效的二叉搜索树。

有效二叉搜索树定义如下：
- 节点的左子树只包含小于当前节点的数
- 节点的右子树只包含大于当前节点的数
- 所有左子树和右子树自身必须也是二叉搜索树

**示例**：
```
输入：root = [2,1,3]
输出：true

输入：root = [5,1,4,null,null,3,6]
输出：false
```

**说明**：
- 树中节点数目范围在[1, 10^4] 内
- -2^31 <= Node.val <= 2^31 - 1

**算法解析**：

这道题使用 **递归法** 验证二叉搜索树：

1. **核心思想** ：BST的每个节点都有上下界约束
   - 左子树的所有节点值 < 当前节点值
   - 右子树的所有节点值 > 当前节点值
   - 递归检查每个节点是否满足约束

2. **算法步骤** ：
   - 使用helper函数递归检查每个节点
   - 传递当前节点的上下界
   - 检查当前节点值是否在范围内
   - 递归检查左右子树

3. **具体实现** ：
   - 使用LONG_MIN和LONG_MAX作为初始上下界
   - 检查当前节点值是否在(lower, upper)范围内
   - 递归检查左子树：范围变为(lower, root->val)
   - 递归检查右子树：范围变为(root->val, upper)

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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
    bool helper(TreeNode* root, long long lower, long long upper) {
        if (root == nullptr) {
            return true;
        }
        if (root -> val <= lower || root -> val >= upper) {
            return false;
        }
        return helper(root -> left, lower, root -> val) && helper(root -> right, root -> val, upper);
    }
    bool isValidBST(TreeNode* root) {
        return helper(root, LONG_MIN, LONG_MAX);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：有效二叉搜索树 [2,1,3]
    TreeNode* root = new TreeNode(2);
    root->left = new TreeNode(1);
    root->right = new TreeNode(3);
    
    Solution solution;
    bool result = solution.isValidBST(root);
    
    cout << "是否为有效二叉搜索树: " << (result ? "true" : "false") << endl;

    return 0;
}
```

## [二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉搜索树的根节点 `root`，和一个整数 `k`，请你设计一个算法查找其中第 `k` 个最小元素（从 1 开始计数）。

**示例**：
```
输入：root = [3,1,4,null,2], k = 1
输出：1

输入：root = [5,3,6,2,4,null,null,1], k = 3
输出：3
```

**说明**：
- 树中的节点数为 n
- 1 <= k <= n <= 10^4
- 0 <= Node.val <= 10^4

**算法解析**：

这道题使用 **迭代法** 实现中序遍历找到第K小的元素：

1. **核心思想** ：BST的中序遍历是有序的
   - 中序遍历BST得到升序序列
   - 第K小的元素就是中序遍历的第K个元素

2. **算法步骤** ：
   - 使用栈模拟中序遍历
   - 将所有左子节点入栈
   - 弹出栈顶元素，计数器减1
   - 如果计数器为0，返回当前元素
   - 将右子节点设为当前节点继续遍历

3. **具体实现** ：
   - 使用while循环遍历树
   - 内层while循环将所有左子节点入栈
   - 弹出栈顶元素并检查是否为第K个
   - 将右子节点设为当前节点

4. **时间复杂度** ：O(H + k) - H为树的高度，k为要找到的元素位置
5. **空间复杂度** ：O(H) - 栈的最大深度为树的高度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    int kthSmallest(TreeNode *root, int& k)
    {
        stack<TreeNode *> s;

        while (root || s.size())
        {
            while (root)
            {
                s.push(root);
                root = root->left;
            }

            root = s.top();
            s.pop();
            if (--k == 0)
                return root->val;

            root = root->right;
        }

        return -1;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉搜索树 [3,1,4,null,2], k = 1
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(1);
    root->right = new TreeNode(4);
    root->left->right = new TreeNode(2);
    
    int k = 1;
    
    Solution solution;
    int result = solution.kthSmallest(root, k);
    
    cout << "第" << k << "小的元素: " << result << endl;

    return 0;
}
```

## [二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉树的根节点 `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**示例**：
```
输入：root = [1,2,3,null,5,null,4]
输出：[1,3,4]

输入：root = [1,null,3]
输出：[1,3]
```

**说明**：
- 二叉树的节点个数的范围是 [0,100]
- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **深度优先搜索** 获取二叉树的右视图：

1. **核心思想** ：右视图是每层最右边的节点
   - 使用DFS遍历，优先访问右子树
   - 记录每个深度第一次访问的节点

2. **算法步骤** ：
   - 使用DFS遍历树，优先访问右子树
   - 记录当前深度
   - 如果当前深度等于结果数组大小，说明是第一次访问该深度
   - 将当前节点值加入结果数组

3. **具体实现** ：
   - 使用dfs函数递归遍历
   - 参数u表示当前深度
   - 如果u == res.size()，说明是第一次访问该深度
   - 优先访问右子树，再访问左子树

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
    vector<int> res;
    void dfs(TreeNode *node, int u){
        if(u == res.size()) res.push_back(node->val);
        if(node->right) dfs(node->right, u+1);
        if(node->left) dfs(node->left, u+1);
    }
public:
    vector<int> rightSideView(TreeNode* root) {
        if(root) dfs(root, 0);
        return res;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [1,2,3,null,5,null,4]
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->right = new TreeNode(5);
    root->right->right = new TreeNode(4);
    
    Solution solution;
    vector<int> result = solution.rightSideView(root);
    
    cout << "右视图: ";
    for (int val : result) {
        cout << val << " ";
    }
    cout << endl;

    return 0;
}
```

## [二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给你二叉树的根节点 `root`，请你将它展开为一个单链表：

- 展开后的单链表应该同样使用 `TreeNode`，其中 `right` 子指针指向链表中下一个结点，而 `left` 子指针始终为 `null`。
- 展开后的单链表应该与二叉树先序遍历顺序相同。

**示例**：
```
输入：root = [1,2,5,3,4,null,6]
输出：[1,null,2,null,3,null,4,null,5,null,6]
```

**说明**：
- 树中结点数在范围 [0, 2000] 内
- -100 <= Node.val <= 100

**算法解析**：

这道题使用 **Morris遍历** 的思想将二叉树展开为链表：

1. **核心思想** ：将二叉树按前序遍历展开为右链表
   - 找到当前节点左子树的最右节点
   - 将右子树接到最右节点后面
   - 将左子树移到右子树位置

2. **算法步骤** ：
   - 遍历每个节点
   - 如果当前节点有左子树：
     - 找到predecessor（左子树的最右节点）
     - 将右子树接到predecessor后面
     - 将左子树移到右子树位置
     - 将左子树设为null

3. **具体实现** ：
   - 使用while循环遍历每个节点
   - 如果root->left存在：
     - 找到predecessor（左子树的最右节点）
     - 将右子树接到predecessor后面
     - 将左子树移到右子树位置
     - 将左子树设为null

4. **时间复杂度** ：O(n) - 每个节点被访问一次
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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    void flatten(TreeNode *root)
    {
        // TreeNode *root = root;
        while (root)
        {
            if (root->left)
            {
                TreeNode *next = root->left;
                TreeNode *predecessor = next;
                while (predecessor->right)
                    predecessor = predecessor->right;
                predecessor->right = root->right;
                root->left = nullptr;
                root->right = next;
            }
            root = root->right;
        }
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [1,2,5,3,4,null,6]
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(5);
    root->left->left = new TreeNode(3);
    root->left->right = new TreeNode(4);
    root->right->right = new TreeNode(6);
    
    Solution solution;
    solution.flatten(root);
    
    cout << "展开后的链表: ";
    TreeNode* current = root;
    while (current) {
        cout << current->val << " ";
        current = current->right;
    }
    cout << endl;

    return 0;
}
```

## [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定两个整数数组 `preorder` 和 `inorder`，其中 `preorder` 是二叉树的先序遍历，`inorder` 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

**示例**：
```
输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出：[3,9,20,null,null,15,7]
```

**说明**：
- preorder 和 inorder 均无重复元素
- inorder 均出现在 preorder 中
- preorder 保证为二叉树的前序遍历序列
- inorder 保证为二叉树的中序遍历序列

**算法解析**：

这道题使用 **分治法** 根据前序和中序遍历序列构造二叉树：

1. **核心思想** ：利用前序和中序遍历的特性
   - 前序遍历：根节点 -> 左子树 -> 右子树
   - 中序遍历：左子树 -> 根节点 -> 右子树
   - 前序的第一个元素是根节点

2. **算法步骤** ：
   - 从前序序列中取第一个元素作为根节点
   - 在中序序列中找到根节点的位置
   - 根据根节点位置分割中序序列
   - 递归构建左右子树

3. **具体实现** ：
   - 使用build函数递归构建树
   - 在中序序列中查找根节点位置
   - 计算左右子树的边界
   - 递归构建左右子树

4. **时间复杂度** ：O(n²) - 每次查找根节点位置需要O(n)
5. **空间复杂度** ：O(n) - 递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    TreeNode *build(vector<int> &pre, vector<int> &in, int p_begin, int p_end, int i_begin, int i_end)
    {
        if (i_begin >= i_end)
            return nullptr;

        int index = 0;
        for (int i = i_begin; i < i_end; i++)
            if (in[i] == pre[p_begin])
            {
                index = i;
                break;
            }

        return new TreeNode(
            pre[p_begin],
            build(pre, in, p_begin + 1, p_begin + index - i_begin + 1, i_begin, index),
            build(pre, in, p_end - i_end + index + 1, p_end, index + 1, i_end));
    }

    TreeNode *buildTree(vector<int> &preorder, vector<int> &inorder)
    {
        return build(preorder,
                     inorder,
                     0,
                     preorder.size(),
                     0,
                     inorder.size());
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：前序遍历 [3,9,20,15,7], 中序遍历 [9,3,15,20,7]
    vector<int> preorder = {3, 9, 20, 15, 7};
    vector<int> inorder = {9, 3, 15, 20, 7};
    
    Solution solution;
    TreeNode* result = solution.buildTree(preorder, inorder);
    
    cout << "构造的二叉树根节点值: " << result->val << endl;

    return 0;
}
```

## [路径总和 III](https://leetcode.cn/problems/path-sum-iii/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉树的根节点 `root`，和一个整数 `targetSum`，求该二叉树里节点值之和等于 `targetSum` 的路径的数目。

路径不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

**示例**：
```
输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
输出：3
解释：和等于 8 的路径有 3 条，如图所示。
```

**说明**：
- 二叉树的节点个数的范围是 [0,1000]
- -10^9 <= Node.val <= 10^9
- -1000 <= targetSum <= 1000

**算法解析**：

这道题使用 **递归法** 计算路径总和：

1. **核心思想** ：
   - 以每个节点为根节点，计算从该节点开始的路径和
   - 使用递归函数 `rootPathSum` 计算以当前节点为根的路径和
   - 使用 `pathSum` 函数计算以当前节点为根的路径和，并递归处理左右子树

2. **算法步骤** ：
   - 如果当前节点为空，返回0
   - 计算以当前节点为根的路径和：`targetSum == root->val` 或 `pathSum(root->right, targetSum - root->val)` 或 `pathSum(root->left, targetSum - root->val)`
   - 递归处理左右子树，并累加结果

3. **具体实现** ：
   - 使用 `rootPathSum` 函数递归计算以当前节点为根的路径和
   - 在 `pathSum` 函数中，累加 `rootPathSum` 的结果
   - 递归处理左右子树

4. **时间复杂度** ：O(n²) - 每个节点都可能作为根节点，每个节点都可能被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    int rootPathSum(TreeNode *root, long long targetSum)
    {
        if (!root)
            return 0;

        return rootPathSum(root->left, targetSum - root->val) +
               rootPathSum(root->right, targetSum - root->val) +
               (targetSum == root->val);
    }

    int pathSum(TreeNode *root, long long targetSum)
    {
        if (!root)
            return 0;

        return (targetSum == root->val) +
               pathSum(root->right, targetSum) +
               rootPathSum(root->right, targetSum - root->val) +
               pathSum(root->left, targetSum) +
               rootPathSum(root->left, targetSum - root->val);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
    TreeNode* root = new TreeNode(10);
    root->left = new TreeNode(5);
    root->right = new TreeNode(-3);
    root->left->left = new TreeNode(3);
    root->left->right = new TreeNode(2);
    root->right->right = new TreeNode(11);
    root->left->left->left = new TreeNode(3);
    root->left->left->right = new TreeNode(-2);
    root->left->right->right = new TreeNode(1);
    
    int targetSum = 8;
    
    Solution solution;
    int result = solution.pathSum(root, targetSum);
    
    cout << "路径总和为 " << targetSum << " 的路径数目: " << result << endl;

    return 0;
}
```

## [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

给定一个二叉树，找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为："对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。"

**示例**：
```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出：3
解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
```

**说明**：
- 树中节点个数的范围是 [2, 10^5]
- -10^9 <= Node.val <= 10^9
- 所有 Node.val 互不相同
- p != q
- p 和 q 均存在于给定的二叉树中

**算法解析**：

这道题使用 **递归法** 查找二叉树的最近公共祖先：

1. **核心思想** ：
   - 如果当前节点是p或q，或者当前节点是空，则返回当前节点
   - 递归查找左子树和右子树
   - 如果左子树和右子树都找到p或q，则当前节点是最近公共祖先
   - 如果只在左子树或右子树找到p或q，则返回找到的节点

2. **算法步骤** ：
   - 如果当前节点是p或q，或者当前节点是空，则返回当前节点
   - 递归查找左子树和右子树
   - 如果左子树和右子树都找到p或q，则当前节点是最近公共祖先
   - 如果只在左子树或右子树找到p或q，则返回找到的节点

3. **具体实现** ：
   - 使用递归函数 `lowestCommonAncestor` 查找最近公共祖先
   - 如果当前节点是p或q，或者当前节点是空，则返回当前节点
   - 递归查找左子树和右子树
   - 如果左子树和右子树都找到p或q，则当前节点是最近公共祖先
   - 如果只在左子树或右子树找到p或q，则返回找到的节点

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    TreeNode *lowestCommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q)
    {
        if (!root || p == root || q == root)
            return root;
        TreeNode *l = lowestCommonAncestor(root->left, p, q);
        TreeNode *r = lowestCommonAncestor(root->right, p, q);
        if (l && r)
            return root;
        else if (l)
            return l;
        else
            return r;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(5);
    root->right = new TreeNode(1);
    root->left->left = new TreeNode(6);
    root->left->right = new TreeNode(2);
    root->right->left = new TreeNode(0);
    root->right->right = new TreeNode(8);
    root->left->right->left = new TreeNode(7);
    root->left->right->right = new TreeNode(4);
    
    TreeNode* p = root->left;  // 节点5
    TreeNode* q = root->right; // 节点1
    
    Solution solution;
    TreeNode* result = solution.lowestCommonAncestor(root, p, q);
    
    cout << "最近公共祖先的节点值: " << result->val << endl;

    return 0;
}
```

## [二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述**：

路径被定义为一条从树中任意节点开始，到任意节点结束的序列。同一个节点在一条路径序列中至多出现一次。该路径至少包含一个节点，且不一定经过根节点。

路径和是路径中各节点值的总和。

给你一个二叉树的根节点 `root`，返回其最大路径和。

**示例**：
```
输入：root = [1,2,3]
输出：6
解释：最优路径是 2 -> 1 -> 3，路径和为 2 + 1 + 3 = 6

输入：root = [-10,9,20,null,null,15,7]
输出：42
解释：最优路径是 15 -> 20 -> 7，路径和为 15 + 20 + 7 = 42
```

**说明**：
- 树中节点数目范围是 [1, 3 * 10^4]
- -1000 <= Node.val <= 1000

**算法解析**：

这道题使用 **递归法** 计算二叉树的最大路径和：

1. **核心思想** ：
   - 对于每个节点，计算经过该节点的最大路径和
   - 路径和可以是左子树的最大路径和 + 当前节点值 + 右子树的最大路径和
   - 更新全局最大路径和 `ans`
   - 返回以当前节点为根的子树的最大路径和

2. **算法步骤** ：
   - 使用 `maxGain` 函数递归计算每个节点为根的最大路径和
   - 在递归过程中更新全局变量 `ans`
   - 返回 `max(左子树最大路径和, 右子树最大路径和) + 当前节点值`

3. **具体实现** ：
   - 如果当前节点为空，返回0
   - 计算左子树的最大路径和 `leftGain`
   - 计算右子树的最大路径和 `rightGain`
   - 更新 `ans = max(ans, node->val + leftGain + rightGain)`
   - 返回 `node->val + max(leftGain, rightGain)`

4. **时间复杂度** ：O(n) - 每个节点被访问一次
5. **空间复杂度** ：O(h) - h为树的高度，递归调用栈的深度

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

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    int ans = INT_MIN;
    int maxGain(TreeNode *node)
    {
        if (!node)
            return 0;

        int leftGain = max(maxGain(node->left), 0);
        int rightGain = max(maxGain(node->right), 0);

        ans = max(ans, node->val + leftGain + rightGain);

        return node->val + max(leftGain, rightGain);
    }

    int maxPathSum(TreeNode *root)
    {
        maxGain(root);

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：二叉树 [-10,9,20,null,null,15,7]
    TreeNode* root = new TreeNode(-10);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);
    
    Solution solution;
    int result = solution.maxPathSum(root);
    
    cout << "二叉树中的最大路径和: " << result << endl;

    return 0;
}
```
