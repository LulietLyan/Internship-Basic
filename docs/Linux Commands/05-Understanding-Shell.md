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

# 第 5 章 理解 Shell

> Shell 是进程：区分父/子 Shell、内建与外部命令，善用进程列表与别名。

## 5.1 Shell 类型

| 类型 | 说明 |
|------|------|
| **登录 Shell** | 登录时启动，读 `/etc/profile`、~/.bash_profile 等 |
| **交互 Shell** | 终端中等待输入 |
| **非交互 Shell** | 脚本执行，读环境变量或 `BASH_ENV` |
| **默认 Shell** | `/etc/passwd` 第 7 字段；系统脚本常用 `/bin/sh` |

## 5.2 父子 Shell

```bash
ps -f              # 查看 PPID
echo $$            # 当前 Shell PID
echo $PPID         # 父 Shell PID
```

**创建子 Shell 的方式** ：

- `( cmd )` — **进程列表** ，在子 Shell 中执行
- `cmd1 | cmd2` — 管道各段可能在子 Shell
- **`bash`** — 启动新 bash 子 Shell
- **`coproc cmd`** — 协程，异步管道

**不会** 创建子 Shell：`export`、`cd`、`alias`（当前 Shell 内生效）。

子 Shell 中 **`cd` 不影响父 Shell 工作目录** ；变量默认不向上传递（除非 export）。

### 后台与协程

```bash
cmd &              # 后台运行
( sleep 10; cmd ) &   # 进程列表后台
coproc cmd         # 协程，输出在 COPROC 数组
```

## 5.3 内建 vs 外部

```bash
type cmd           # 显示类型：builtin / file / alias
which cmd          # 外部命令路径
whereis cmd        # 二进制、源码、man 位置
```

| | 内建命令 | 外部命令 |
|---|---------|---------|
| 示例 | cd、echo、exit、pwd、alias | ls、ps、copy 程序 |
| 子进程 | 否 | 是（fork + exec） |
| 性能 | 更高 | 需创建新环境 |

### history

```bash
history            # 列表
!!                 # 上一条
!N                 # 第 N 条
!string            # 最近以 string 开头的命令
Ctrl+R             # 反向搜索历史
```

历史文件：`~/.bash_history`；`HISTSIZE` / `HISTFILESIZE` 控制条数。

### alias

```bash
alias ll='ls -alF'
alias li='ls -i'
unalias ll
```

别名仅在 **当前 Shell** 有效；持久化写入 `~/.bashrc`（见第 6 章）。

## 5.4 命令组合

```bash
{ cmd1; cmd2; }        # 当前 Shell 内顺序执行（不创建子 Shell）
(cmd1; cmd2)           # 子 Shell 内执行
cmd1 && cmd2           # cmd1 成功才执行 cmd2
cmd1 || cmd2           # cmd1 失败才执行 cmd2
cmd1; cmd2             # 无论成败都执行 cmd2
```

**`source script.sh` / `. script.sh`** ：在当前 Shell 执行（环境变量会保留）；直接 `./script.sh` 则在子 Shell。

## 5.5 脚本安全选项（预览）

在脚本开头常用（详见第 11 章）：

```bash
set -euo pipefail
# -e 遇错即退  -u 未定义变量报错  -o pipefail 管道任一失败则失败
```
