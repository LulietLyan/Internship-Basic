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

# 第 15 章 呈现数据

> 格式化输出、重定向 FD、临时文件与 exec。

## 15.1 格式化 echo / printf

```bash
printf "Name: %s, Age: %d\n" "$name" "$age"
printf "%10s %5d\n" str num    # 宽度对齐
```

## 15.2 文件描述符

| FD | 用途 |
|----|------|
| 0 | stdin |
| 1 | stdout |
| 2 | stderr |

```bash
exec 3> file       # 打开 FD 3 写
echo "data" >&3
exec 3>&-          # 关闭

exec 3<> file      # 读写
read line <&3
```

## 15.3 临时文件

```bash
tmp=$(mktemp /tmp/myapp.XXXXXX)
trap "rm -f $tmp" EXIT

tmpdir=$(mktemp -d)
```

## 15.4 忽略信号

```bash
trap "echo Caught; exit" SIGINT SIGTERM
trap '' SIGINT       # 忽略 Ctrl+C
trap - SIGINT        # 恢复默认
```

## 15.5 tee 与调试输出

```bash
cmd 2>&1 | tee run.log          # stdout+stderr 写日志且显示
exec > >(tee -a deploy.log) 2>&1   # 整个脚本输出 tee
set -x                          # 调试：打印每条命令
set +x                          # 关闭
```
