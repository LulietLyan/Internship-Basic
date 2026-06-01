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

# 第 22 章 gawk 进阶

> 变量、数组、函数、格式化输出与结构化编程。

## 22.1 内置变量

| 变量 | 含义 |
|------|------|
| `NR` | 当前行号 |
| `NF` | 当前行字段数 |
| `FS` / `OFS` | 输入/输出字段分隔符 |
| `RS` / `ORS` | 记录分隔符 |
| `FILENAME` | 当前文件名 |
| `FNR` | 当前文件内行号 |

## 22.2 数组与循环

```awk
arr["key"] = value
for (k in arr) print k, arr[k]
for (i=1; i<=NF; i++) print $i
```

## 22.3 条件与函数

```awk
if (x > 0) print x
else print "zero"

function sum(a, b) { return a + b }
```

## 22.4 格式化输出

```awk
printf "%-10s %5d\n", $1, $2
```

## 22.5 多文件

```bash
gawk -f prog.awk file1 file2
# FNR==1 { print "---" FILENAME "---" }
```

## 22.6 日志聚合示例

```awk
# 按 HTTP 状态码计数
$9 ~ /^[0-9]+$/ { cnt[$9]++ }
END { for (k in cnt) print k, cnt[k] }

# 计算第 4 列平均值（跳过标题）
NR>1 { sum+=$4; n++ } END { if(n) print sum/n }
```
