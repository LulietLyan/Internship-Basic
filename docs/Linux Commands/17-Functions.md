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

# 第 17 章 创建函数

> 函数封装逻辑；作用域、返回值、数组与库文件。

## 17.1 定义与调用

```bash
func1() {
  echo "Hello $1"
}
func1 arg

function func2 { ... }   # 旧语法
```

**必须在调用前定义** （或 source 库文件）。

## 17.2 返回值

```bash
func() { return 3; }    # 退出码 0–255
func
echo $?                 # 3

func() { echo "result"; }
result=$(func)          # 捕获输出
```

## 17.3 变量作用域

```bash
global=1
func() {
  local localvar=2      # 局部
  global=99
}
```

## 17.4 数组与函数

```bash
func() {
  echo "First: ${array[0]}"
}
array=(a b c)
func
# 传递数组：func "${array[@]}"
```

## 17.5 递归

```bash
factorial() {
  if [ $1 -eq 1 ]; then echo 1
  else echo $(( $1 * $(factorial $(( $1 - 1 ))) ))
  fi
}
```

## 17.6 函数库

```bash
# lib.sh
func1() { ... }

# main.sh
source /path/lib.sh     # 或 . lib.sh
func1
```

## 17.7 命令行函数

```bash
# 临时
dive() { cd $1; ls; }
# 持久：写入 ~/.bashrc
```
