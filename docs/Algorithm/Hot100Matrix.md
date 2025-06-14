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

# 矩阵

## [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。

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
    void setZeroes(vector<vector<int>> &matrix)
    {
        bool flag_col0 = false;
        for (int i = 0; i < matrix.size(); i++)
        {
            // 任意一行起始列为 0 标记为 true，最后这一列和 i 行会为 0
            if (!matrix[i][0])
                flag_col0 = true;

            for (int j = 1; j < matrix[0].size(); j++)
                if (!matrix[i][j])
                    matrix[i][0] = matrix[0][j] = 0;
        }

        for (int i = matrix.size() - 1; i >= 0; i--)
        {
            for (int j = 1; j < matrix[0].size(); j++)
                if (!matrix[i][0] || !matrix[0][j])
                    matrix[i][j] = 0;

            if (flag_col0)
                matrix[i][0] = 0;
        }
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (auto &row : matrix)
        for (auto &val : row)
            cin >> val;

    Solution().setZeroes(matrix);

    for (const auto &row : matrix) {
        for (int val : row)
            cout << val << ' ';
        cout << '\n';
    }

    return 0;
}
```

## [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/?envType=study-plan-v2&envId=top-100-liked)

给你一个 m x n 的矩阵，请按照顺时针螺旋顺序，返回矩阵中的所有元素。

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
    vector<int> spiralOrder(vector<vector<int>> &matrix)
    {
        vector<int> ans;
        int n = matrix.size(), m = matrix[0].size(), size = n * m;
        int i = 0, j = 0, dx = 0, dy = 1, tmp = 0;
        while (size--)
        {
            ans.push_back(matrix[i][j]);
            matrix[i][j] = -101;
            if (i + dx < n && i + dx >= 0 && j + dy < m && j + dy >= 0 && matrix[i + dx][j + dy] != -101)
                i += dx, j += dy;
            else
                tmp = dy, dy = -dx, dx = tmp, i += dx, j += dy;
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int m, n;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (auto &row : matrix)
        for (auto &val : row)
            cin >> val;

    vector<int> res = Solution().spiralOrder(matrix);
    for (int val : res)
        cout << val << ' ';
    cout << '\n';

    return 0;
}
```

## [旋转图像](https://leetcode.cn/problems/rotate-image/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个 n x n 的二维矩阵表示一个图像，请将图像顺时针旋转 90 度。必须原地旋转，不能使用额外空间。

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
    void rotate(vector<vector<int>> &matrix)
    {
        for (int i = 0; i < matrix[0].size(); i++)
            for (int j = 0; j < matrix[0].size() - i; j++)
                swap(matrix[i][j], matrix[matrix[0].size() - 1 - j][matrix[0].size() - 1 - i]);

        for (int i = 0; i < matrix[0].size() / 2; i++)
            for (int j = 0; j < matrix[0].size(); j++)
                swap(matrix[i][j], matrix[matrix[0].size() - i - 1][j]);
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (auto &row : matrix)
        for (auto &val : row)
            cin >> val;

    Solution().rotate(matrix);

    for (const auto &row : matrix) {
        for (int val : row)
            cout << val << ' ';
        cout << '\n';
    }

    return 0;
}
```

## [搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/description/?envType=study-plan-v2&envId=top-100-liked)

给你一个满足下述属性的 m x n 整数矩阵：

- **每行的整数从左到右按升序排列**
- **每列的整数从上到下按升序排列**

给你一个整数 target，请你判断 target 是否存在于矩阵中。

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
    bool searchMatrix(vector<vector<int>> &matrix, int& target)
    {
        int x = 0, y = matrix[0].size() - 1;
        
        while (x < matrix.size() && y >= 0)
        {
            if (matrix[x][y] == target)
                return true;
            if (matrix[x][y] > target)
                --y;
            else
                ++x;
        }

        return false;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int m, n, target;
    cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (auto &row : matrix)
        for (auto &val : row)
            cin >> val;
    cin >> target;

    cout << (Solution().searchMatrix(matrix, target) ? "true" : "false") << '\n';

    return 0;
}
```