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

# 第 2 章 走进 Shell

> 进入 CLI 的两条路：虚拟控制台（GUI 外）或图形终端仿真器（GUI 内）。

## 2.1 CLI 访问方式

| 方式 | 说明 |
|------|------|
| **虚拟控制台** | 全屏文本登录，系统内存中的 tty 会话 |
| **终端仿真器** | 桌面窗口中模拟控制台（GNOME Terminal、Konsole 等） |

GUI 栈： **客户端** → **显示服务器** （Wayland/X）→ **窗口管理器** → **小部件库** 。

## 2.2 虚拟控制台

- 切换： **Ctrl+Alt+F1~F7** （发行版映射不同，Ubuntu/CentOS 常用 F1）
- 查看当前 tty：`tty`（如 `/dev/tty3`）
- 虚拟控制台 **不能** 运行图形程序
- 密码输入 **无回显**

**setterm 常用选项** ：

```bash
setterm --inversescreen on|off    # 反色
setterm --background white        # 背景色
setterm --foreground black        # 前景色
setterm --reset                   # 恢复默认
```

颜色：black、red、green、yellow、blue、magenta、cyan、white。

## 2.3 图形终端仿真器

常见：GNOME Terminal、Konsole、xterm、Alacritty、Terminator 等。

### GNOME Terminal

- 启动：Activities → 搜索 **terminal**
- 常用： **Ctrl+Shift+T** 新标签， **Ctrl+Shift+N** 新窗口
- Profile 可改字体、颜色、滚动缓冲区

### Konsole（KDE）

- 启动：`konsole` 或 **Ctrl+Alt+T**
- **Ctrl+Shift+C/V** 复制粘贴； **Ctrl+Shift+M** 显示菜单栏
- 书签、分屏、Monitor for Silence/Activity

### xterm

- 最老牌，资源占用低，VT102/VT220 仿真
- 示例：`xterm -ti vt100 -bg white -fg black`
- 选项：`+/-bc` 光标闪烁、`+/-cm` ANSI 颜色等

## 2.4 tmux / screen — 会话保活（开发者常用）

SSH 断线后进程不退出；本地多窗格开发。

### tmux（推荐）

```bash
tmux                         # 新建会话
tmux new -s dev              # 命名会话
tmux attach -t dev           # 重新连接
tmux ls                      # 列出会话
```

| 前缀键 | 默认 **Ctrl+b** 后按 |
|--------|----------------------|
| `%` | 左右分屏 |
| `"` | 上下分屏 |
| 方向键 | 切换窗格 |
| `d` | **detach** 脱离（进程继续跑） |
| `c` | 新窗口 |
| `&` | 关闭当前窗口 |

配置：`~/.tmux.conf` 可改前缀、启用鼠标。

### screen（传统）

```bash
screen -S dev
# Ctrl+a d  detach
screen -r dev
```
