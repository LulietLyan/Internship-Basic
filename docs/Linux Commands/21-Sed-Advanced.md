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

# 第 21 章 sed 进阶

> 多行、地址、 hold 空间与高级替换。

## 21.1 地址

```bash
sed '3s/old/new/' file         # 仅第 3 行
sed '2,5s/old/new/' file
sed '/pattern/s/old/new/' file
sed '/start/,/end/s/old/new/' file
sed '1,10!s/old/new/' file     # ! 排除
```

## 21.2 删除与插入

```bash
sed '/pattern/d' file
sed '1i\Header line' file       # 行前插入
sed '$a\Footer line' file       # 行后追加
sed '2c\New line' file         # 替换行
```

## 21.3 多行与 next

```bash
sed N                          # 读下一行到 pattern space
sed '/start/,/end/{N;s/\n/ /;}' file
```

## 21.4 hold / pattern 空间

- **pattern space** ：当前处理行
- **hold space** ：缓存区 `h/H/g/G/x`

用于倒序行、合并行等复杂转换。

## 21.5 替换修饰符

```bash
s/old/new/g      # 全局
s/old/new/2      # 每行第 2 次
s/old/new/i      # 忽略大小写
s/old/new/w out  # 匹配行写入文件
```
