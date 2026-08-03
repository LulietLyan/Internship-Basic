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

# 第 12 章 结构化命令

> if/test/case 与数值、字符串、文件条件测试。

## 12.1 if-then / if-then-else

```bash
if command; then
  commands
fi

if command; then
  commands
else
  commands
fi

if cmd1; then
  ...
elif cmd2; then
  ...
else
  ...
fi
```

**注意** ：if 判断的是 **退出状态码** ，非输出内容；`if grep q /etc/passwd` 找到则成功。

## 12.2 test / [ ]

```bash
if [ condition ]; then ... fi
if test condition; then ... fi
```

### 数值比较（`-eq -ne -gt -ge -lt -le`）

```bash
if [ $val1 -gt $val2 ]; then echo bigger; fi
```

### 字符串比较

| 运算符 | 含义 |
|--------|------|
| `=` / `==` | 相等 |
| `!=` | 不等 |
| `<` `>` | 字典序（需转义或 `[[ ]]`） |
| `-n str` | 非空 |
| `-z str` | 空 |

**`[[ ]]`**（bash 扩展）：支持 `==` 模式匹配、`&&` `||`、无需转义 `<`。

```bash
[[ $str == *.log ]]              # 通配匹配
[[ $a -gt 0 && $b -lt 10 ]]
(( count++ ))                     # 算术测试，非 0 为真
```

### 算术比较 `(( ))`

```bash
if (( val1 > val2 )); then echo ok; fi
((total += 1))
```

### 文件测试

| 运算符 | 含义 |
|--------|------|
| `-e` | 存在 |
| `-f` | 普通文件 |
| `-d` | 目录 |
| `-r -w -x` | 可读/写/执行 |
| `-s` | 非空 |
| `-nt -ot` | 比另一文件新/旧 |
| `-ef` | 同一文件（硬链接） |

```bash
if [ -f $HOME/file ]; then ...; fi
```

## 12.3 case

```bash
case $var in
  pattern1) cmds ;;
  pattern2|pattern3) cmds ;;
  *) default ;;
esac
```
