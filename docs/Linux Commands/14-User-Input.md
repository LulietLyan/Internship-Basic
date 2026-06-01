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

# 第 14 章 处理用户输入

> 命令行参数、选项与交互式输入。

## 14.1 参数

```bash
# script.sh arg1 arg2
echo $0          # 脚本名
echo $1 $2       # 位置参数
echo $#          # 参数个数
echo $@          # 全部参数（独立字符串）
echo $*          # 全部参数（单字符串）
shift            # 左移，$2→$1
shift 2
```

## 14.2 getopts

```bash
while getopts ":ab:c:" opt; do
  case $opt in
    a) flag_a=1 ;;
    b) val_b=$OPTARG ;;
    c) val_c=$OPTARG ;;
    \?) echo "Invalid: -$OPTARG" ;;
    :) echo "Option -$OPTARG needs arg" ;;
  esac
done
shift $((OPTIND - 1))   # 剩余参数
```

- 选项字符串：`:` 前缀表示该选项需要参数
- 首字符 `:` 静默错误

## 14.3 交互输入

```bash
read -p "Name: " name
read -s -p "Password: " pass   # -s 不回显
read -t 5 -n 1 key             # 超时 5 秒，读 1 字符

# 从文件读
while read line; do ...; done < data.txt
```

## 14.4 脚本参数模板

```bash
#!/usr/bin/env bash
set -euo pipefail
usage() { echo "Usage: $0 [-v] [-f file]"; exit 1; }
verbose=0; file=""
while getopts ":vf:" opt; do
  case $opt in
    v) verbose=1 ;;
    f) file=$OPTARG ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))
# 剩余位置参数: $@
```
