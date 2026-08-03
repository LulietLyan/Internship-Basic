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

# 第 13 章 更多结构化命令

> for/while/until 循环与 C 风格 for。

## 13.1 for

```bash
for var in list; do
  commands
done

for file in /home/*; do echo $file; done

# C 风格
for (( i=1; i<=10; i++ )); do echo $i; done
```

## 13.2 while / until

```bash
while [ condition ]; do
  commands
done

until [ condition ]; do   # 条件为假时循环
  commands
done
```

**读取文件** ：

```bash
while IFS= read -r line; do
  echo "$line"
done < file
```

## 13.3 循环控制

```bash
break          # 跳出循环
break 2        # 跳出外层（嵌套层级）
continue       # 下一轮
```

## 13.4 并行处理

```bash
for f in *.log; do
  process $f &
done
wait           # 等待所有后台任务
```

## 13.5 timeout 与 xargs 并行

```bash
timeout 30s long_cmd           # 超时退出（124）
timeout -k 5 30s cmd           # 超时后 5 秒 SIGKILL

find . -name '*.test' -print0 | xargs -0 -P 4 -n 1 run_test
# -P 4 最多 4 进程并行
```
