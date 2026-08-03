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

# 滑动窗口

## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：

给定一个字符串，找出其中不含重复字符的最长子串的长度。

**示例** ：
```
输入：s = "abcabcbb"
输出：3
解释：因为无重复字符的最长子串是 "abc"，所以其长度为 3

输入：s = "bbbbb"
输出：1
解释：因为无重复字符的最长子串是 "b"，所以其长度为 1

输入：s = "pwwkew"
输出：3
解释：因为无重复字符的最长子串是 "wke"，所以其长度为 3
```

**说明** ：


- 0 <= s.length <= 5 * 10^4
- s 由英文字母、数字、符号和空格组成

**算法解析** ：

这道题使用 **滑动窗口** 技术：

1. **核心思想** ：维护一个无重复字符的滑动窗口，遇到重复字符时移动左指针

2. **算法步骤** ：

   - 使用双指针i和j维护滑动窗口

   - 使用数组sum记录每个字符的出现次数

   - 当遇到重复字符时，移动左指针直到无重复

3. **具体实现** ：

   - 初始化sum数组为0，记录字符出现次数

   - 右指针i向右移动，增加字符计数

   - 当字符计数大于1时，移动左指针j减少计数

   - 更新最大长度

4. **时间复杂度** ：O(n) - 每个字符最多被访问两次

5. **空间复杂度** ：O(1) - 使用固定大小的数组

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
    int lengthOfLongestSubstring(string& s)
    {
        int ans = 0;
        string sum(128, '\0');
        for (int i = 0, j = 0; i < s.size(); i++)
        {
            sum[s[i]]++;
            while (sum[s[i]] > 1 && i > j)
                sum[s[j++]]--;
            ans = max(ans, i - j + 1);
        }

        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：s = "abcabcbb"
    string s = "abcabcbb";

    Solution sol;
    int result = sol.lengthOfLongestSubstring(s);

    cout << "字符串: " << s << endl;
    cout << "无重复字符的最长子串长度: " << result << endl;

    return 0;
}
```

## [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/?envType=study-plan-v2&envId=top-100-liked)

**题目描述** ：

在字符串 `s` 中查找所有 `p` 的异位词(字母重排)在 `s` 中的起始索引位置。

**示例** ：
```
输入：s = "cbaebabacd", p = "abc"
输出：[0,6]
解释：
起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。

输入：s = "abab", p = "ab"
输出：[0,1,2]
解释：
起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
```

**说明** ：


- 1 <= s.length, p.length <= 3 * 10^4
- s 和 p 仅包含小写字母

**算法解析** ：

这道题使用 **滑动窗口** 技术：

1. **核心思想** ：维护一个固定长度的滑动窗口，比较窗口内字符计数是否与目标字符串相同

2. **算法步骤** ：

   - 统计目标字符串p的字符频率

   - 使用滑动窗口遍历字符串s

   - 比较窗口内字符频率是否与p相同

3. **具体实现** ：

   - 使用字符串表示字符频率数组

   - 维护窗口大小等于p的长度

   - 当窗口内字符频率与p相同时，记录起始位置

4. **时间复杂度** ：O(n) - n为字符串s的长度

5. **空间复杂度** ：O(1) - 使用固定大小的字符频率数组

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
    vector<int> findAnagrams(string s, string p)
    {
        vector<int> ans;
        if (s.size() >= p.size())
        {
            string s_hash = "00000000000000000000000000", p_hash = "00000000000000000000000000";
            for (auto c : p)
                p_hash[c - 'a']++;
            for (int left = 0, right = 0; right < s.size(); right++)
            {
                s_hash[s[right] - 'a']++;
                if (right - left == p.size() - 1)
                {
                    if (s_hash == p_hash)
                        ans.push_back(left);
                    s_hash[s[left] - 'a']--;
                    left++;
                }
            }
        }
        return ans;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    // 构造测试用例：s = "cbaebabacd", p = "abc"
    string s = "cbaebabacd";
    string p = "abc";

    Solution sol;
    vector<int> res = sol.findAnagrams(s, p);

    cout << "字符串s: " << s << endl;
    cout << "字符串p: " << p << endl;
    cout << "异位词起始索引: ";
    for (int idx : res)
        cout << idx << ' ';
    cout << endl;

    return 0;
}
```
