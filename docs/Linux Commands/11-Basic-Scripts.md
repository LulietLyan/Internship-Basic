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

# 第 11 章 构建基础脚本

> Shebang + 权限 + 变量 + 重定向 + 管道 + 算术 + 退出码。

## 11.1 脚本结构

```bash
#!/usr/bin/env bash       # 推荐：env 找 bash 路径
set -euo pipefail         # 严格模式（生产脚本建议）
IFS=$'\n\t'               # 可选：收紧字段分隔

# 注释
command1
command2
```

```bash
chmod +x script.sh
./script.sh          # 或 bash script.sh
```

## 11.1.1 引号规则

| 引号 | 变量/命令替换 | 转义 |
|------|--------------|------|
| 无 | 展开 | 部分字符 |
| `'...'` | **不** 展开 | 字面量 |
| `"..."` | 展开 | `\\` `\"` `$` |

```bash
echo "$HOME"         # 推荐双引号包变量
echo '${HOME}'       # 单引号内不展开
```

## 11.2 输出与变量

```bash
echo "Hello"
echo -n "no newline"
echo -e "line1\nline2"

name=Rich            # 等号无空格
echo $name
echo ${name}         # 推荐花括号

readonly var         # 只读
unset var
```

**环境变量** ：`$HOME` `$PATH`；脚本内 `export VAR=val`。

**命令替换** ：

```bash
today=$(date +%y%m%d)
files=`ls /tmp`
```

## 11.3 重定向

```bash
cmd > file           # stdout 覆盖
cmd >> file          # stdout 追加
cmd 2> file          # stderr
cmd 2>&1             # stderr 指向 stdout
cmd &> file          #  stdout+stderr
cmd < file           # 输入重定向
cmd << EOF           # Here 文档
text
EOF
```

## 11.4 管道

```bash
cmd1 | cmd2          # cmd1 的 stdout → cmd2 的 stdin
cmd1 | cmd2 | cmd3
```

## 11.5 算术

```bash
expr 5 + 3           # 注意空格
result=$(expr 5 \* 3)

$((5 + 3))
$(( $var1 + $var2 ))
var=$((5 * 3))

# 浮点
bc <<< "scale=4; 10/3"
echo "scale=2; $var" | bc
```

## 11.6 退出状态

```bash
echo $?              # 上一条命令退出码，0=成功
exit 0               # 脚本退出并返回码
exit 1
```

**逻辑组合** ：

```bash
cmd1 && cmd2 || echo "cmd1 failed"
if ! cmd; then echo fail; fi
```
