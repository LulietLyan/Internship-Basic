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

# 第 4 章 更多 Bash 命令

> 开发者日常排查：**谁占 CPU/内存、端口被谁占用、磁盘/log 怎么看**——本章 4.1–4.8 重点展开。

## 4.1 ps — 进程快照

```bash
ps aux             # 最常用：所有进程，BSD 风格
ps -ef             # Unix 风格，含 PPID
ps aux --sort=-%cpu | head       # CPU 占用 Top N
ps aux --sort=-%mem | head       # 内存占用 Top N
ps -p PID -o pid,ppid,cmd,%cpu,%mem,etime   # 指定进程详情
ps --forest      # 树形看父子关系
ps -u user       # 某用户进程
```

**ps aux 列含义**：

| 列 | 含义 |
|----|------|
| USER | 进程属主 |
| PID / PPID | 进程号 / 父进程号 |
| %CPU / %MEM | CPU、物理内存占比 |
| VSZ | 虚拟内存（KB） |
| RSS | 常驻物理内存（KB） |
| STAT | 状态：R 运行，S 休眠，D 不可中断 IO，Z 僵尸，T 停止 |
| START / TIME | 启动时间 / 累计 CPU 时间 |
| COMMAND | 命令行 |

**STAT 附加字符**：`<` 高优先级，`N` 低优先级，`l` 多线程，`+` 前台进程。

**配合 grep 查服务**：

```bash
ps aux | grep nginx
pgrep -a nginx          # 只输出 PID + 命令行
pidof nginx             # 仅 PID
```

---

## 4.2 top — 实时进程监控（重点）

`top` 默认 **每 3 秒刷新**，按 **%CPU** 降序排列，是线上排查「卡死 / 飙 CPU / 内存泄漏」的第一工具。

### 4.2.1 输出区域解读

**第 1 行 — 系统概况**：

```text
top - 14:32:01 up 3 days,  2:15,  2 users,  load average: 0.52, 0.58, 0.61
```

| 字段 | 含义 |
|------|------|
| up | 系统运行时长 |
| users | 当前登录用户数 |
| load average | 1 / 5 / 15 分钟 **平均负载**（可运行+等待 IO 的进程数均值） |

负载是否过高取决于 **CPU 核数**：4 核机器 load 长期 > 4 才需警惕；对比自身基线比绝对值更重要。

**第 2 行 — Tasks**：

```text
Tasks: 312 total,   2 running, 310 sleeping,   0 stopped,   0 zombie
```

- **zombie > 0**：子进程已退出但父进程未 wait，需找父进程处理
- **running 长期接近核数且 load 高**：CPU 瓶颈

**第 3 行 — %Cpu(s)**：

```text
%Cpu(s): 12.3 us,  2.1 sy,  0.0 ni, 84.2 id,  1.2 wa,  0.0 hi,  0.2 si
```

| 字段 | 含义 |
|------|------|
| us | 用户态 CPU |
| sy | 内核态 CPU |
| id | 空闲 |
| wa | **等待 IO**（wa 高 → 磁盘/网络 IO 瓶颈） |
| st | 被虚拟机「偷走」的 CPU（云主机常见） |

**第 4–5 行 — 内存 / Swap**：

```text
MiB Mem : 16384.0 total,  2048.0 free,  8192.0 used,  6144.0 buff/cache
MiB Swap:  8192.0 total,  8192.0 free,     0.0 used.  7680.0 avail Mem
```

- 看 **available / avail Mem**，不要只看 free（buff/cache 可回收）
- **Swap 持续 used** → 物理内存压力，可能触发 OOM

**进程列表列**：

| 列 | 含义 |
|----|------|
| VIRT | 虚拟内存总量 |
| RES | **实际物理内存**（排查内存占用看这项） |
| SHR | 共享内存（多进程共享库） |
| S | 状态（同 ps） |
| %CPU | 单进程 CPU 占比（多核可 >100%） |
| %MEM | 物理内存占比 |
| TIME+ | 累计 CPU 时间 |
| COMMAND | 启动命令 |

### 4.2.2 交互快捷键（运行中按键）

| 键 | 作用 |
|----|------|
| **q** | 退出 |
| **h** | 帮助 |
| **1** | 显示每个 CPU 核心单独一行 |
| **M** | 按 **RES 内存** 排序 |
| **P** | 按 **%CPU** 排序（默认） |
| **T** | 按累计 TIME 排序 |
| **k** | 输入 PID **杀进程**（默认 SIGTERM） |
| **r** | **renice** 改优先级 |
| **f** | 选择显示/隐藏列 |
| **o** | 添加筛选条件（如 `COMMAND=java`） |
| **c** | 切换 COMMAND 显示完整路径 |
| **V** | 树形显示父子进程 |
| **d** / **s** | 改刷新间隔（秒） |
| **W** | 保存当前配置到 `~/.toprc` |

### 4.2.3 批处理 / 脚本用法

```bash
top -b -n 1              # 批处理模式，输出一次（可管道）
top -b -n 1 | head -20
top -p 1234,5678           # 只监控指定 PID
top -u nginx               # 只显示某用户进程
```

### 4.2.4 典型排查流程

1. **CPU 飙高**：`top` → **P** 排序 → 看 COMMAND → `k` 或 `kill` / 进服务日志
2. **内存不足**：**M** 排序 → 看 RES / %MEM → `ps -p PID -o cmd` 确认
3. **load 高但 CPU idle 低 wa**：磁盘或网络 IO 问题 → `iostat`、`iotop`
4. **僵尸进程**：Tasks 行 zombie > 0 → `ps aux | grep Z` → 重启或修复父进程

---

## 4.3 htop 与 watch

### htop（推荐交互替代）

```bash
htop                       # 需安装；彩色、鼠标、横向 CPU 条
```

| 操作 | 说明 |
|------|------|
| F6 | 选择排序字段 |
| F9 | 杀进程（可选信号） |
| F5 | 树形视图 |
| / | 搜索进程名 |
| u | 按用户筛选 |

### watch — 周期性执行命令

```bash
watch -n 1 'ps aux --sort=-%cpu | head -10'
watch -n 2 df -h
watch -d 'ss -s'           # -d 高亮变化
```

---

## 4.4 内存与 CPU 统计

### free

```bash
free -h                    # 人类可读
free -h -s 3               # 每 3 秒刷新
```

关注 **available**；`used` 含 cache，不等于「已用尽」。

### vmstat — 系统整体吞吐

```bash
vmstat 1 5                 # 每 1 秒采样，共 5 次
```

| 列 | 含义 |
|----|------|
| r | 运行队列长度（等 CPU） |
| b | 阻塞在 IO 的进程数 |
| swpd | swap 使用（KB） |
| si / so | swap 换入/换出 |
| us / sy / id / wa | CPU 分项（同 top） |

**经验**：`wa` 持续高 → IO 瓶颈；`si/so` 持续 > 0 → 内存换页严重。

### uptime

```bash
uptime                     # 一行：时间、运行时长、load average
```

---

## 4.5 磁盘 IO（简要）

```bash
iostat -x 1                # 扩展统计，每秒刷新
iotop                      # 类似 top，按进程看 IO（需 root）
lsof +D /path              # 谁占用了某目录下文件
```

`iostat` 中 **%util** 接近 100% 表示磁盘饱和；**await** 高表示 IO 延迟大。

---

## 4.6 网络与端口

### ss（推荐，替代 netstat）

```bash
ss -tuln                   # 所有 TCP/UDP 监听（不解析名）
ss -tunp                   # 含进程名（需 root 看全）
ss -tan state time-wait | wc -l   # TIME_WAIT 数量
ss -o state established '( dport = :8080 )'   # 连到 8080 的 ESTABLISHED
```

| 选项 | 含义 |
|------|------|
| -t / -u | TCP / UDP |
| -l | 监听端口 |
| -n | 数字显示端口 |
| -p | 关联进程 |

### lsof — 文件 / 端口 / 进程

```bash
lsof -i :8080              # 谁占用 8080 端口
lsof -i TCP:8080 -s TCP:LISTEN
lsof -p PID                # 进程打开了哪些文件
lsof +L1                   # 已删除但仍被进程占用的文件（磁盘空间不释放）
lsof -u user               # 某用户打开的文件
```

**端口被占用**：

```bash
lsof -i :3000
kill $(lsof -t -i :3000)   # 谨慎使用
```

### netstat（旧系统仍常见）

```bash
netstat -tuln
netstat -tunp              # 需 root
```

---

## 4.7 结束进程与调试

### 常用信号

| 信号 | 值 | 默认行为 | 典型场景 |
|------|-----|----------|----------|
| SIGTERM | 15 | 优雅终止 | `kill PID` 默认 |
| SIGKILL | 9 | 强制杀死 | 无法捕获，最后手段 |
| SIGHUP | 1 | 挂起/重载 | 很多 daemon 用来 **reload 配置** |
| SIGINT | 2 | 中断 | Ctrl+C |
| SIGSTOP / SIGCONT | 19/18 | 暂停/继续 | 调试 |

```bash
kill PID
kill -9 PID
kill -HUP PID              # 如 nginx reload
pkill -f 'java.*app.jar'   # 按完整命令行匹配
killall nginx              # 按名称（精确）
```

### strace — 跟踪系统调用（开发调试）

```bash
strace -p PID              # 附加到运行中进程
strace -e open,read,write ./app
strace -c ./app            # 汇总统计各 syscall 耗时
```

适合：**程序卡死、权限错误、找不到文件** 时看它在调什么内核接口。

---

## 4.8 日志与内核消息

### journalctl（systemd）

```bash
journalctl -u nginx -f     # 跟踪某服务日志（类似 tail -f）
journalctl -u docker --since "1 hour ago"
journalctl -p err -b       # 本次启动以来的 error
journalctl -k              # 内核消息
```

### dmesg — 内核环缓冲

```bash
dmesg | tail
dmesg -T                   # 人类可读时间戳
dmesg | grep -i oom        # OOM killer 记录
```

### 传统日志文件

```bash
tail -f /var/log/syslog
tail -f /var/log/nginx/error.log
grep -i error /var/log/messages
```

---

## 4.9 磁盘空间

```bash
df -h                      # 分区使用率
df -i                      # inode 使用率（小文件过多会满）
du -sh *                   # 当前目录各项大小
du -h --max-depth=1 /var    # 一层子目录汇总
ncdu                       # 交互式浏览（需安装）
```

**挂载**：

```bash
mount | column -t
mount /dev/sdb1 /mnt
umount /mnt                # 设备 busy → 退出该目录或 lsof 查占用
```

---

## 4.10 文本处理与归档

### sort / grep

```bash
sort -t : -k 3 -n /etc/passwd
grep -rn "pattern" src/
grep -E 'error|warn' app.log | tail -100
```

### 压缩与 tar

```bash
tar -zcvf backup.tar.gz dir/
tar -zxvf backup.tar.gz
tar -tvf backup.tar.gz
gzip -k file               # 保留原文件
```
