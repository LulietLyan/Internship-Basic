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

# 第 19 章 初识 sed 和 gawk

> 流编辑器 sed 按规则逐行处理；gawk 按字段/模式处理列数据。

## 19.1 sed

```bash
sed 's/old/new/' file           # 每行首个替换
sed 's/old/new/g' file          # 全局
sed 's/old/new/g' -i file       # 原地修改
sed -n '2,5p' file              # 打印 2–5 行
sed '2d' file                   # 删第 2 行
sed '/pattern/d' file
sed -f script.sed file          # 脚本文件

# 多命令
sed 's/a/A/; s/b/B/' file
```

**script.sed** 一行一条命令。

## 19.2 gawk

```bash
gawk '{print $1, $3}' file      # 打印第 1、3 字段
gawk -F: '{print $1}' /etc/passwd   # 指定分隔符
gawk '/pattern/ {print $0}' file
gawk 'BEGIN {sum=0} {sum+=$1} END {print sum}' file

gawk -f script.awk file
```

**字段变量**：`$0` 整行，`$1`…`$NF`，`NF` 字段数，`FS`/`OFS` 分隔符。

**BEGIN / END**：处理前后各执行一次。

## 19.3 日志处理实战

```bash
# 统计 nginx 404
awk '$9 == 404 {print $7}' access.log | sort | uniq -c | sort -rn | head

# 提取 JSON 日志某字段（空格分隔）
awk '{print $1, $3}' app.log

# 删空行
sed '/^$/d' file

# 替换并备份
sed -i.bak 's/debug/info/g' config.yaml
```
