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

# 链表

## [相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/?envType=study-plan-v2&envId=top-100-liked)

给定两个单链表 headA 和 headB，找出它们的第一个公共节点，如果没有交点则返回 nullptr。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB)
    {
        ListNode *pA = headA, *pB = headB;
        int lenA = 0, lenB = 0;
        while (pA != nullptr)
            pA = pA->next, lenA++;
        while (pB != nullptr)
            pB = pB->next, lenB++;

        if (lenA - lenB > 0)
        {
            ListNode *p1 = headA, *p2 = headB;
            for (int i = 0; i < lenA - lenB; i++)
                p1 = p1->next;
            while (p1 != p2)
                p1 = p1->next, p2 = p2->next;
            return p1;
        }
        else
        {
            ListNode *p1 = headA, *p2 = headB;
            for (int i = 0; i < lenB - lenA; i++)
                p2 = p2->next;
            while (p1 != p2)
                p1 = p1->next, p2 = p2->next;
            return p1;
        }
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, m, k;
    cin >> n >> m >> k;
    vector<int> A(n), B(m);
    for (int& x : A) cin >> x;
    for (int i = 0; i < k; ++i) cin >> B[i];

    ListNode* headA = buildList(A);
    ListNode* headB = buildList(vector<int>(B.begin(), B.begin() + k));

    ListNode* pA = headA;
    for (int i = 0; i < k; ++i) pA = pA->next;

    ListNode* pB = headB;
    while (pB && pB->next) pB = pB->next;
    if (pB) pB->next = pA;

    Solution sol;
    ListNode* inter = sol.getIntersectionNode(headA, headB);
    cout << (inter ? inter->val : -1) << '\n';

    return 0;
}
```

## [反转链表](https://leetcode.cn/problems/reverse-linked-list/description/?envType=study-plan-v2&envId=top-100-liked)

将一个单链表反转。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *reverseList(ListNode *head)
    {
        if (!head || !head->next)
            return head;

        ListNode *pre = nullptr, *now = head;
        while (now)
        {
            ListNode *nxt = now->next;
            now->next = pre;
            pre = now;
            now = nxt;
        }

        return pre;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    ListNode* head = buildList(n);

    Solution sol;
    ListNode* reversed = sol.reverseList(head);

    printList(reversed);

    return 0;
}
```

## [回文链表](https://leetcode.cn/problems/palindrome-linked-list/?envType=study-plan-v2&envId=top-100-liked)

判断一个链表是否为回文结构。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    bool isPalindrome(ListNode *head)
    {
        if(!head || !head->next)
            return true;

        int len = 0;
        ListNode *p = head;

        while (p)
            p = p->next, len++;

        ListNode *pre = nullptr, *now = nullptr;
        p = head;

        for (int i = 0; i < len / 2; i++)
        {
            now = p->next;
            p->next = pre;
            pre = p;
            p = now;
        }

        if (len & 1)
            p = p->next;

        while (p)
        {
            if (pre->val != p->val)
                return false;
            p = p->next, pre = pre->next;
        }

        return true;
    }
};

ListNode* buildList(const vector<int>& vals) 
{
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* cur = head;
    for (int i = 1; i < vals.size(); ++i) 
    {
        cur->next = new ListNode(vals[i]);
        cur = cur->next;
    }
    return head;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<int> vals(n);
    for (int& x : vals) cin >> x;

    ListNode* head = buildList(vals);
    Solution sol;
    cout << (sol.isPalindrome(head) ? "true" : "false") << '\n';

    return 0;
}
```

## [环形链表](https://leetcode.cn/problems/linked-list-cycle/?envType=study-plan-v2&envId=top-100-liked)

判断链表是否存在环。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    bool hasCycle(ListNode *head)
    {
        if (!head || !head->next)
            return false;

        ListNode *slow = head;
        ListNode *fast = head->next;
        while (slow != fast)
        {
            if (!fast || !fast->next)
                return false;
            slow = slow->next;
            fast = fast->next->next;
        }
        return true;
    }
};

ListNode* buildListWithCycle(const vector<int>& vals, int pos) 
{
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* cur = head;
    ListNode* cycleEntry = nullptr;
    if (pos == 0) cycleEntry = head;
    for (int i = 1; i < vals.size(); ++i) 
    {
        cur->next = new ListNode(vals[i]);
        cur = cur->next;
        if (i == pos) cycleEntry = cur;
    }
    if (pos != -1) cur->next = cycleEntry;
    return head;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, pos;
    cin >> n >> pos;
    vector<int> vals(n);
    for (int& x : vals) cin >> x;
    ListNode* head = buildListWithCycle(vals, pos);
    Solution sol;
    cout << (sol.hasCycle(head) ? "true" : "false") << '\n';

    return 0;
}
```

## [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/description/?envType=study-plan-v2&envId=top-100-liked)

给定一个链表，若其中存在环，返回入环的第一个节点，否则返回 nullptr。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        if(!head || !head->next)
            return nullptr;

        ListNode *rabbit = head->next, *turtle = head;

        unordered_map<ListNode*, int> m;

        while(rabbit != turtle)
        {
            if (!rabbit || !rabbit->next)
                return nullptr;
            m[turtle]++;
            turtle = turtle->next;
            rabbit = rabbit->next->next;
        }

        while(1)
        {
            if(m[turtle]++)
                return turtle;

            turtle = turtle->next;
        }
    }
};

ListNode* buildListWithCycle(const vector<int>& vals, int pos) 
{
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* cur = head;
    ListNode* entry = nullptr;
    if (pos == 0) entry = head;
    for (int i = 1; i < vals.size(); ++i) 
    {
        cur->next = new ListNode(vals[i]);
        cur = cur->next;
        if (i == pos) entry = cur;
    }
    if (pos != -1) cur->next = entry;
    return head;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, pos;
    cin >> n >> pos;
    vector<int> vals(n);
    for (int& x : vals) cin >> x;
    ListNode* head = buildListWithCycle(vals, pos);
    Solution sol;
    ListNode* node = sol.detectCycle(head);
    cout << (node ? node->val : -1) << '\n';

    return 0;
}
```

## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/description/?envType=study-plan-v2&envId=top-100-liked)

将两个升序链表合并为一个新的升序链表并返回。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *mergeTwoLists(ListNode *list1, ListNode *list2)
    {
        ListNode *now = new ListNode(0), *head = now;

        while (list1 && list2)
            if (list1->val < list2->val)
            {
                now->next = list1;
                now = now->next;
                list1 = list1->next;
            }
            else
            {
                now->next = list2;
                now = now->next;
                list2 = list2->next;
            }

        now->next = list1 ? list1 : list2;

        return head->next;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n1, n2;
    cin >> n1 >> n2;
    ListNode* list1 = buildList(n1);
    ListNode* list2 = buildList(n2);

    Solution sol;
    ListNode* merged = sol.mergeTwoLists(list1, list2);
    printList(merged);

    return 0;
}
```

## [两数相加](https://leetcode.cn/problems/add-two-numbers/description/?envType=study-plan-v2&envId=top-100-liked)

给定两个非空链表表示两个非负整数，按位相加返回一个新的链表表示它们的和。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *addTwoNumbers(ListNode *l1, ListNode *l2)
    {
        ListNode *s1 = l1, *s2 = l2;
        ListNode *header = new ListNode(), *p = header;
        int t = 0;
        bool count = 0;
        while (s1 != nullptr || s2 != nullptr || t)
        {
            if (count)
                p->next = new ListNode(t), p = p->next;
            else
                count = !count;
            if (s1 != nullptr)
                t += s1->val, s1 = s1->next;
            if (s2 != nullptr)
                t += s2->val, s2 = s2->next;
            p->val = t % 10;
            t /= 10;
        }
        return header;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n1, n2;
    cin >> n1 >> n2;
    ListNode* l1 = buildList(n1);
    ListNode* l2 = buildList(n2);

    Solution sol;
    ListNode* result = sol.addTwoNumbers(l1, l2);
    printList(result);

    return 0;
}
```

## [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/?envType=study-plan-v2&envId=top-100-liked)

删除链表的倒数第 N 个节点，并返回链表头节点。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *removeNthFromEnd(ListNode *head, int& n)
    {
        if (head == nullptr || head->next == nullptr)
            return nullptr;

        int len = 0;
        ListNode *p = head;
        while (p)
            len++, p = p->next;

        if (len == n)
            return head->next;

        p = head;
        ListNode *pre = head;

        for (int i = 0; i < len - n; i++)
        {
            p = p->next;
            if (i == len - n - 2)
                pre = p;
        }

        pre->next = p->next;

        return head;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, k;
    cin >> n >> k;
    ListNode* head = buildList(n);

    Solution sol;
    ListNode* result = sol.removeNthFromEnd(head, k);
    printList(result);

    return 0;
}
```

## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/description/?envType=study-plan-v2&envId=top-100-liked)

交换链表中相邻的节点对，返回交换后的链表。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *swapPairs(ListNode *head)
    {
        if (!head || !head->next)
            return head;
        ListNode *newHead = new ListNode(0, head);
        ListNode *p = newHead;

        while (p->next && p->next->next)
        {
            ListNode *n1 = p->next, *n2 = p->next->next;
            p->next = n2;
            n1->next = n2->next;
            n2->next = n1;
            p = n1;
        }
        p = newHead->next;
        delete newHead;
        return p;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    ListNode* head = buildList(n);

    Solution sol;
    ListNode* res = sol.swapPairs(head);
    printList(res);

    return 0;
}
```

## [K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/?envType=study-plan-v2&envId=top-100-liked)

以 k 个节点为一组翻转链表，返回翻转后的链表。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *reverseKGroup(ListNode *head, int k)
    {
        int len = 0;
        for (ListNode *cur = head; cur; cur = cur->next)
            len++;

        ListNode *dummy = new ListNode(0, head);
        ListNode *p0 = dummy;
        ListNode *pre = nullptr;
        ListNode *cur = head;

        for (; len >= k; len -= k)
        {
            for (int i = 0; i < k; i++)
            {
                ListNode *nxt = cur->next;
                cur->next = pre;
                pre = cur;
                cur = nxt;
            }

            ListNode *nxt = p0->next;
            p0->next->next = cur;
            p0->next = pre;
            p0 = nxt;
        }

        p0 = dummy->next;
        delete dummy;
        return p0;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n, k;
    cin >> n >> k;
    ListNode* head = buildList(n);

    Solution sol;
    ListNode* res = sol.reverseKGroup(head, k);
    printList(res);

    return 0;
}
```

## [随机链表的复制](https://leetcode.cn/problems/copy-list-with-random-pointer/description/?envType=study-plan-v2&envId=top-100-liked)

复制一个带有随机指针的链表，返回复制链表的头节点。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(!head)
            return head;
        Node* p = head;

        unordered_map<Node*, Node*> m;
        
        while(p)
        {
            if(!m[p])
                m[p] = new Node(p->val);
            
            if(p->next && !m[p->next])
                m[p->next] = new Node(p->next->val);
            m[p]->next = m[p->next];
            
            if(p->random && !m[p->random])
                m[p->random] = new Node(p->random->val);
            m[p]->random = m[p->random];

            p = p->next;
        }


        return m[head];
    }
};

Node* buildRandomList(int n) 
{
    if (n == 0) return nullptr;
    vector<Node*> nodes(n);
    for (int i = 0; i < n; ++i) 
    {
        int val; cin >> val;
        nodes[i] = new Node(val);
        if (i > 0) nodes[i - 1]->next = nodes[i];
    }
    for (int i = 0; i < n; ++i) 
    {
        int idx; cin >> idx;
        nodes[i]->random = (idx == -1) ? nullptr : nodes[idx];
    }
    return nodes[0];
}

void printRandomList(Node* head) 
{
    unordered_map<Node*, int> idxMap;
    vector<Node*> nodes;
    Node* cur = head;
    int idx = 0;
    while (cur) 
    {
        idxMap[cur] = idx++;
        nodes.push_back(cur);
        cur = cur->next;
    }
    for (auto node : nodes) cout << node->val << " ";
    cout << "\n";
    for (auto node : nodes) cout << (node->random ? idxMap[node->random] : -1) << " ";
    cout << "\n";
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    Node* head = buildRandomList(n);

    Solution sol;
    Node* res = sol.copyRandomList(head);
    printRandomList(res);

    return 0;
}
```

## [排序链表](https://leetcode.cn/problems/sort-list/description/?envType=study-plan-v2&envId=top-100-liked)

对链表进行排序，返回排序后的链表。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *sortList(ListNode *head)
    {
        if (!head || !head->next)
            return head;

        ListNode *fast = head;
        ListNode *slow = head;

        while (fast->next && fast->next->next)
        {
            fast = fast->next->next;
            slow = slow->next;
        }

        // 中间断开
        fast = slow->next;
        slow->next = nullptr;

        // 递归，中间断开
        ListNode *left = sortList(head);
        ListNode *right = sortList(fast);
        
        // 哨兵节点
        ListNode *vHead = new ListNode(-1);
        ListNode *cur = vHead;

        while (left && right)
        {
            if (left->val <= right->val)
                cur->next = left, left = left->next;
            else
                cur->next = right, right = right->next;

            cur = cur->next;
        }
        
        cur->next = left ? left : right;

        return vHead->next;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;

    if (n == 0) return 0;

    ListNode* head = buildList(n);

    Solution sol;
    ListNode* sorted = sol.sortList(head);

    printList(sorted);

    return 0;
}
```

## [合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/description/?envType=study-plan-v2&envId=top-100-liked)

将 K 个升序链表合并成一个升序链表并返回。

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

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

class Solution
{
public:
    struct Status
    {
        int val;
        ListNode *ptr;
        bool operator<(const Status &rhs) const
        {
            return val > rhs.val;
        }
    };

    priority_queue<Status> q;

    ListNode *mergeKLists(vector<ListNode *> &lists)
    {
        if (!lists.size())
            return {};

        for (auto &node : lists)
            if (node)
                q.push({node->val, node});

        if (!q.size())
            return {};

        ListNode *head, *tail;

        bool first_time = true;

        while (!q.empty())
            if (first_time)
            {
                first_time = false;
                auto f = q.top();
                q.pop();
                head = f.ptr;
                tail = head;
                if (f.ptr->next)
                    q.push({f.ptr->next->val, f.ptr->next});
            }
            else
            {
                auto f = q.top();
                q.pop();
                tail->next = f.ptr;
                tail = tail->next;
                if (f.ptr->next)
                    q.push({f.ptr->next->val, f.ptr->next});
            }

        return head;
    }
};

// 构造链表
ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

// 打印链表
void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int k; // 链表的数量
    cin >> k;

    vector<ListNode*> lists(k);

    for (int i = 0; i < k; ++i)
    {
        int len;
        cin >> len;
        if (len == 0) {
            lists[i] = nullptr;
            continue;
        }
        lists[i] = buildList(len);
    }

    Solution sol;
    ListNode* merged = sol.mergeKLists(lists);

    printList(merged);

    return 0;
}
```

## [LRU 缓存](https://leetcode.cn/problems/lru-cache/description/?envType=study-plan-v2&envId=top-100-liked)

实现一个基于最近最少使用（LRU）缓存策略的数据结构，支持插入、获取操作。

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

class Node
{
public:
    int key;
    int value;
    Node *prev;
    Node *next;

    Node(int k = 0, int v = 0) : key(k), value(v) {}
};

class LRUCache
{
private:
    int capacity;
    // 哨兵节点
    Node *dummy;
    // 映射
    unordered_map<int, Node *> key_to_node;

    // 去除 x
    void remove(Node *x)
    {
        x->prev->next = x->next;
        x->next->prev = x->prev;
    }

    // 头插
    void push_front(Node *x)
    {
        x->prev = dummy;
        x->next = dummy->next;
        dummy->next = x;
        x->next->prev = x;
    }

    // 搜索
    Node *get_node(int key)
    {
        auto it = key_to_node.find(key);
        if (it == key_to_node.end())
            return nullptr;
        Node *node = it->second;
        remove(node);
        push_front(node);
        return node;
    }

public:
    LRUCache(int capacity)
    {
        this->capacity = capacity;
        this->dummy = new Node();
        dummy->prev = dummy;
        dummy->next = dummy;
    }

    int get(int key)
    {
        Node *node = get_node(key);
        return node ? node->value : -1;
    }

    void put(int key, int value)
    {
        Node *node = get_node(key);
        if (node)
        {
            node->value = value;
            return;
        }
        key_to_node[key] = node = new Node(key, value);
        push_front(node);
        if (key_to_node.size() > capacity)
        {
            Node *back_node = dummy->prev;
            key_to_node.erase(back_node->key);
            remove(back_node);
            delete back_node;
        }
    }
};

ListNode* buildList(int n)
{
    if (n == 0) return nullptr;
    int x;
    cin >> x;
    ListNode* head = new ListNode(x);
    ListNode* tail = head;
    for (int i = 1; i < n; ++i)
    {
        cin >> x;
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return head;
}

void printList(ListNode* head)
{
    while (head)
    {
        cout << head->val << (head->next ? " " : "\n");
        head = head->next;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int task;
    cin >> task;
    if (task == 1) // sortList
    {
        int n;
        cin >> n;
        ListNode* head = buildList(n);
        Solution1 sol;
        head = sol.sortList(head);
        printList(head);
    }
    else if (task == 2) // mergeKLists
    {
        int k;
        cin >> k;
        vector<ListNode*> lists(k);
        for (int i = 0; i < k; ++i)
        {
            int n;
            cin >> n;
            lists[i] = buildList(n);
        }
        Solution2 sol;
        ListNode* head = sol.mergeKLists(lists);
        printList(head);
    }
    else if (task == 3) // LRUCache
    {
        int capacity;
        cin >> capacity;
        LRUCache lru(capacity);
        int op;
        while (cin >> op)
        {
            if (op == 1) // put
            {
                int k, v;
                cin >> k >> v;
                lru.put(k, v);
            }
            else if (op == 2) // get
            {
                int k;
                cin >> k;
                cout << lru.get(k) << endl;
            }
        }
    }


    return 0;
}
```