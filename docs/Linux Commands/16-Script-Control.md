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

# 第 16 章 脚本控制

> 信号、后台作业、nice/renice 与脚本自启。

## 16.1 信号

| 信号 | 默认 | 含义 |
|------|------|------|
| SIGINT (2) | 终止 | Ctrl+C |
| SIGQUIT (3) | 终止+core | Ctrl+\\ |
| SIGKILL (9) | 终止 | 不可捕获 |
| SIGTERM (15) | 终止 | kill 默认 |
| SIGHUP (1) | 终止 | 终端断开 |

```bash
kill -l            # 列出信号
trap 'cleanup' SIGINT SIGTERM
```

## 16.2 后台与作业控制

```bash
cmd &              # 后台
jobs               # 列表
fg %1              # 前台
bg %1              # 后台继续
```

## 16.2.1 nohup 与 disown

```bash
nohup long_cmd > out.log 2>&1 &    # SSH 断开仍运行
disown -h %1                       # 从 jobs 表移除，SIGHUP 不杀
setsid cmd                         # 新会话运行
```

## 16.3 优先级

```bash
nice -n 10 cmd     # 降低优先级（nice 值越大越低）
renice -n 5 -p PID
```

## 16.4 脚本自动化运行

- **cron**：`crontab -e`

```
分 时 日 月 周 命令
0 2 * * * /path/script.sh
```

- **at**：一次性定时

```bash
at 10:00
at> script.sh
Ctrl+D
```

- **systemd timer**：现代替代 cron 的方式

**crontab 示例**：

```cron
PATH=/usr/local/bin:/usr/bin
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
*/5 * * * * curl -sf http://localhost/health || mail -s alert admin@host
```
