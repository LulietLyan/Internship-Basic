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

# 滑动窗口

## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个字符串，找出其中不含重复字符的最长子串的长度。通过滑动窗口动态维护一个无重复字符的子串，遇到重复字符时移动左指针直至无重复。

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

    string s;
    cin >> s;

    Solution sol;
    cout << sol.lengthOfLongestSubstring(s) << '\n';

    return 0;
}
```

## [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/?envType=study-plan-v2&envId=top-100-liked)

在字符串 `s` 中查找所有 `p` 的异位词(字母重排)在 `s` 中的起始索引位置。通过滑动窗口维护一个固定长度的窗口，并比较每个窗口的字符计数是否与 `p` 相同。

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

    string s, p;
    cin >> s >> p;

    Solution sol;
    vector<int> res = sol.findAnagrams(s, p);

    for (int idx : res)
        cout << idx << ' ';
    cout << '\n';

    return 0;
}
```
