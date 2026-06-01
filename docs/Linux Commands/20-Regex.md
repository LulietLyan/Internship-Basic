---
statistics: true
comments: true
---

<style>
body { position: relative; }
body::before {
  --size: 35px;
  --line: color-mix(in hsl, canvasText, transparent 60%);
  content: '';
  height: 100vh; width: 100%; position: absolute;
  background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
  mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0; pointer-events: none; z-index: -1;
}
@media (max-width: 768px) { body::before { display: none; } }
</style>

# 第 20 章 正则表达式

> 文本模式匹配；基本正则 BRE vs 扩展正则 ERE。

## 20.1 元字符（常见）

| 元字符 | 含义 |
|--------|------|
| `.` | 任意单字符 |
| `*` | 前一字符 0 次或多次 |
| `+` | 1 次或多次（ERE） |
| `?` | 0 或 1 次（ERE） |
| `^` `$` | 行首 / 行尾 |
| `[]` | 字符类 |
| `[^]` | 否定类 |
| `\|` | 或（ERE） |
| `()` | 分组（ERE） |
| `{n,m}` | 重复次数（ERE） |

## 20.2 字符类

```regex
[abc]  [a-z]  [^0-9]
[[:digit:]]  [[:alpha:]]  [[:space:]]
```

## 20.3 工具中的正则

| 工具 | 默认 | 扩展 |
|------|------|------|
| grep | BRE | `grep -E` |
| sed | BRE | `sed -E` |
| gawk | ERE | — |
| bash `[[ =~ ]]` | ERE | — |

## 20.4 实用示例

```bash
grep -E '^[0-9]{3}-[0-9]{4}$' phones.txt
grep -E '^(root|bin):' /etc/passwd
sed -E 's/([0-9]+)/NUM/g' file
```

## 20.5 开发常见模式

```regex
^[a-zA-Z_][a-zA-Z0-9_]*$     # 标识符
^\d+\.\d+\.\d+$              # 简单版本号
\b(error|fatal|panic)\b      # 日志级别（grep -E）
https?://[^\s]+              # URL 粗匹配
```

**注意**：贪婪 `.*` 用非贪婪或更精确类；优先 `grep -E` / `ripgrep` 做代码搜索。
