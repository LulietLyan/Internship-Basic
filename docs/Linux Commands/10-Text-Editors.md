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

# 第 10 章 文本编辑器

> 写脚本前选趁手的编辑器；CLI 常用 vim/nano，GUI 常用 gedit/Kate。

## 10.1 vim

**模式**：

| 模式 | 作用 |
|------|------|
| 普通 | 移动、删除、复制 |
| 插入（i/a/o） | 编辑文本 |
| 命令（:） | 保存、退出、替换 |

```vim
vim file
i          " 插入
Esc        " 回普通模式
:w         " 保存
:q         " 退出
:wq / :x   " 保存退出
:q!        " 强制不保存退出
dd         " 删行
yy / p     " 复制行 / 粘贴
/pattern   " 搜索
:%s/old/new/g   " 全文替换
u          " 撤销
:set number    " 行号
:set paste     " 粘贴模式（免缩进错乱）
gg / G       " 文件头 / 尾
0 / $        " 行首 / 行尾
w / b        " 下一词 / 上一词
x / dw       " 删字符 / 删词
cc           " 改整行
>>           " 缩进
:%s/old/new/gc  " 全文替换前确认
```

**.vimrc 最小配置**：

```vim
set number relativenumber
set expandtab shiftwidth=2 tabstop=2
syntax on
filetype plugin indent on
```

## 10.2 nano

```bash
nano file
# 底部提示：^O 保存 ^X 退出 ^W 搜索
```

## 10.3 Emacs（简述）

`C-x C-f` 打开，`C-x C-s` 保存，`C-x C-c` 退出；`C-s` 搜索。

## 10.4 GUI 编辑器

- **KWrite / Kate**（KDE）：语法高亮、插件
- **gedit**（GNOME）：轻量，支持插件

脚本开发最低要求：语法高亮 + 行号 + 缩进。
