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

# 第 6 章 Linux 环境变量

> 环境变量传递配置与状态；区分全局/局部，掌握启动文件加载顺序。

## 6.1 概念

- **环境变量** ：子进程继承的全局变量（`export` 后）
- **局部变量** ：仅当前 Shell 可见

```bash
echo $HOME $PATH $USER $SHELL $PWD
set                # 所有变量
env                # 环境变量
printenv VAR
```

## 6.2 设置与删除

```bash
MYVAR=hello        # 局部
export MYVAR       # 导出为环境变量
export MYVAR=world # 一步完成
unset MYVAR        # 删除
```

**规则** ：赋值 **等号两侧无空格** ；引用用 `$VAR` 或 `${VAR}`。

**参数扩展（常用）** ：

```bash
${VAR:-default}         # VAR 空或未设置 → 用 default（不赋值）
${VAR:=default}         # 同上，且把 default 赋给 VAR
${VAR:+value}           # VAR 已设置 → value，否则空
${#VAR}                 # 字符串长度
${VAR/old/new}          # 替换首个
```

## 6.3 开发者常见变量

| 变量 | 含义 |
|------|------|
| `HOME` | 主目录 |
| `PATH` | 命令搜索路径 |
| `PWD` / `OLDPWD` | 当前 / 上次目录 |
| `USER` / `LOGNAME` | 当前用户名 |
| `SHELL` | 当前 Shell |
| `EDITOR` / `VISUAL` | 默认编辑器（crontab、git 等会读） |
| `LANG` / `LC_ALL` |  locale；排查乱码时 `LC_ALL=C` |
| `SSH_AUTH_SOCK` | ssh-agent 套接字 |
| `HISTSIZE` / `HISTFILESIZE` | 历史条数 |
| `PS1` | 主提示符 |

## 6.4 PATH

```bash
echo $PATH         # 冒号分隔目录列表
PATH=$PATH:/my/bin
export PATH
```

## 6.5 启动文件加载顺序

**登录 Shell** ：

1. `/etc/profile`（全局）
2. `~/.bash_profile` / `~/.bash_login` / `~/.profile`（按存在顺序，读第一个）

**交互非登录 Shell** ：

- `~/.bashrc`（通常 source `/etc/bashrc`）

**非交互 Shell** ：

- 读 `BASH_ENV` 或 `~/.bashrc`（视配置而定）

**持久化技巧** ：

- 全局：`/etc/profile.d/*.sh`
- 用户：别名/函数 → `~/.bashrc`；环境变量 → `~/.bash_profile` 或 `~/.bashrc`

**cron 注意** ：cron 环境极简，脚本里应写 **绝对路径** 或脚本内 `export PATH=...`。

## 6.6 数组

```bash
myarray=(one two three)
echo ${myarray[1]}
echo ${myarray[@]}     # 全部元素
echo ${#myarray[@]}    # 元素个数
```
