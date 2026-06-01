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

# 第 1 章 初识 Linux Shell

> Linux = 内核 + GNU 工具 + 桌面环境 + 应用软件；Shell 是命令行交互入口。

## 1.1 Linux 组成

| 组件 | 作用 |
|------|------|
| **Linux 内核** | 管理硬件、内存、进程、文件系统 |
| **GNU 工具** | coreutils：文件/文本/进程实用工具 |
| **桌面环境** | X.org / Wayland 之上的 GUI |
| **应用软件** | 各发行版预装或自行安装的程序 |

## 1.1.1 内核四大职能

**内存管理**：物理内存 + 交换空间（swap）实现虚拟内存；页面换入/换出。

**进程管理**：

- 第一个进程 **init**（现多为 **systemd**）启动其余进程
- SysVinit 用 **运行级** 0–6（如 5 = 图形多用户）；`runlevel` 查看
- systemd 用 **target** 与 unit 文件；`systemctl get-default` 查看默认 target

**硬件管理**：驱动以 **内核模块** 动态加载；设备视为 **设备文件**（字符/块/网络），含主/次设备号。

**文件系统**：内核通过 **VFS** 统一访问 ext4、xfs、ntfs 等多种 FS。

## 1.1.2 GNU 与 Shell

- **coreutils**：ls、cp、grep 等基础命令
- 默认 Shell：**bash**（Bourne Again Shell）
- 其他 Shell：ash、korn、tcsh、**zsh**
- Shell 脚本：把多条命令写入文件批量执行

## 1.1.3 常见桌面

| 桌面 | 特点 |
|------|------|
| **KDE Plasma** | 类 Windows，面板 + K 菜单 |
| **GNOME 3** | Activities / Calendar / System 三菜单 |
| **Cinnamon / MATE** | GNOME 2 风格延续 |
| **Xfce / Fluxbox** | 轻量，适合老旧硬件 |

显示底层：**X.org**（X11）或 **Wayland**。

## 1.2 发行版

- **核心发行版**：Slackware、RHEL、Debian、Gentoo、openSUSE 等，ISO 镜像安装
- **特定用途发行版**：Ubuntu、Fedora、Mint、MX Linux、Puppy 等，硬件检测更友好
- **LiveCD/DVD**：免安装直接体验

## 1.3 开发者速查：systemd 常用

```bash
systemctl status nginx
systemctl start|stop|restart|reload nginx
systemctl enable nginx              # 开机自启
journalctl -u nginx -f              # 服务日志
systemctl list-units --type=service --state=running
```
