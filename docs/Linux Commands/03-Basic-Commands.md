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

# 第 3 章 Bash 基础命令

> 文件导航、增删改查、查看内容——日常 CLI 的核心。

## 3.1 启动 Shell

- `/etc/passwd` 第 7 字段 = 默认 Shell（如 `/bin/bash`）
- 虚拟控制台登录 → 直接出现提示符；图形登录 → 需打开终端仿真器

## 3.2 提示符

- 普通用户： **$** ；root： **#**
- 格式因发行版而异：`user@host:path$` 或 `[user@host ~]$`

## 3.3 获取帮助

| 方式 | 用法 |
|------|------|
| **man** | `man cmd`；`q` 退出；`man -k keyword` 搜索 |
| **info** | `info cmd` |
| **help** | 内建命令：`help cmd` |
| **--help** | `cmd -h` 或 `cmd --help` |

**命令格式** ：`COMMAND [OPTION]... [ARGUMENT]...`（`[]` 可选，`...` 可多个）

**man 节号** ：1=用户命令，2=系统调用，5=文件格式，8=管理员命令。

## 3.4 文件系统导航

- Linux 单根 **/** 虚拟目录，无盘符；路径用 **/** 分隔
- **挂载点** ：额外存储挂到目录树（如 `/home`）

**常见顶层目录** ：

| 目录 | 用途 |
|------|------|
| `/bin` `/sbin` | 用户/管理员命令 |
| `/etc` | 配置 |
| `/home` | 用户主目录 |
| `/dev` | 设备节点 |
| `/proc` `/sys` | 内核/进程信息 |
| `/tmp` | 临时文件 |
| `/usr` | 次级层次，共享只读数据 |
| `/var` | 日志等可变数据 |

```bash
cd [目录]          # 无参数 → 主目录
cd -               # 上一个目录
pwd                # 当前路径
```

- **绝对路径** ：以 `/` 开头，如 `/usr/bin`
- **相对路径** ：`.` 当前，`..` 上级，`~` 主目录

## 3.5 列出目录

```bash
ls                 # 基本列表
ls -l              # 长格式（权限、大小、时间）
ls -a              # 含隐藏文件（. 开头）
ls -F              # 类型标记（/ 目录，* 可执行）
ls -R              # 递归
ls -l test?        # ? 单字符；* 多字符通配
```

## 3.6 文件操作

```bash
touch file         # 创建空文件 / 更新时间戳
cp src dst         # 复制；-r 递归目录
cp -i / cp -R      # 交互 / 递归
ln file link       # 硬链接（同 inode）
ln -s file link    # 符号链接（软链接）
mv old new         # 移动或重命名
rm file            # 删除；-r 目录；-f 强制
```

**Tab 补全** ：唯一匹配自动补全，多匹配按两次 Tab 列出。

## 3.7 目录操作

```bash
mkdir dir          # -p 创建父目录链
rmdir dir          # 仅删空目录
rm -r dir          # 删非空目录
```

## 3.8 查看文件

```bash
file name          # 判断文件类型
cat file           # 全部输出（大文件慎用）
more file          # 分页（只能向下）
less file          # 分页（可上下，推荐）
head file          # 默认前 10 行；-n N 指定行数
tail -f app.log         # 跟踪日志；-n 100 先看最后 100 行
tail -F app.log         # 日志轮转后仍跟踪（推荐）
```

## 3.9 find 与 xargs

```bash
find . -name "*.go"                    # 按名
find . -type f -mtime -7               # 7 天内修改的文件
find . -type f -size +100M             # 大于 100MB
find . -perm /u+x -type f              # 用户可执行
find /var/log -name "*.log" -mtime +30 -delete   # 删 30 天前日志

# 对结果执行命令
find . -name "*.tmp" -print0 | xargs -0 rm
find . -name "*.sh" -exec chmod +x {} \;
```

**`-print0 | xargs -0`**：避免文件名含空格出错。

## 3.10 重定向、管道与 tee

```bash
cmd > file              # 覆盖 stdout
cmd >> file             # 追加
cmd 2>&1 | tee log.txt  # stderr 合并后同时写文件和屏幕
cmd &> /dev/null        # 丢弃全部输出
cmd < input.txt
echo "data" | cmd       # 管道
```

**tee** ：一份输出进管道/文件，一份仍显示在终端，调试脚本常用。

## 3.11 文本统计与对比

```bash
wc -l file              # 行数
wc -w -c file           # 词数、字节
diff file1 file2        # 行级差异
diff -u a b             # unified 格式（patch 友好）
comm -12 <(sort a) <(sort b)   # 两文件交集（需排序）
```

## 3.12 网络下载（简要）

```bash
curl -O url             # 下载保留文件名
curl -L url -o out.bin  # -L 跟随重定向
curl -I url             # 只看 HTTP 头
wget -c url             # 断点续传
```

## 3.13 开发者快捷键

| 快捷键 | 作用 |
|--------|------|
| **Ctrl+C** | 中断当前命令 |
| **Ctrl+Z** | 挂起（`fg`/`bg` 恢复） |
| **Ctrl+D** | EOF / 退出 Shell |
| **Ctrl+L** | 清屏 |
| **Ctrl+R** | 历史反向搜索 |
| **Ctrl+A / E** | 行首 / 行尾 |
| **Alt+.** | 上一条命令最后一个参数 |
