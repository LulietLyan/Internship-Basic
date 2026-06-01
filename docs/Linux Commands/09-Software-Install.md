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

# 第 9 章 安装软件

> 包管理器因发行版而异：Debian 系 apt，Red Hat 系 dnf；另有 snap/flatpak 与源码编译。

## 9.1 基础概念

- **仓库（repository）**：远程/本地软件包源
- **依赖**：安装前自动解析并安装依赖包

## 9.2 Debian / Ubuntu — apt

底层 **dpkg**；前端 **apt** / **apt-get** / **apt-cache**。

```bash
sudo apt update                    # 更新索引
sudo apt upgrade                   # 升级已安装
sudo apt install pkg               # 安装
sudo apt remove pkg                # 卸载（保留配置）
sudo apt purge pkg                 # 卸载含配置
apt search keyword
apt show pkg
dpkg -l                            # 已安装列表
dpkg -L pkg                        # 包内文件
```

仓库配置：`/etc/apt/sources.list` 与 `/etc/apt/sources.list.d/`。

## 9.3 Red Hat / Fedora — dnf（原 yum）

底层 **rpm**。

```bash
sudo dnf install pkg
sudo dnf update pkg
sudo dnf remove pkg
dnf list installed
dnf search keyword
rpm -qa                            # 所有已装 RPM
rpm -qi pkg                        # 包信息
dnf repoquery --deplist pkg        # 依赖
```

## 9.4 容器化包

| 工具 | 说明 |
|------|------|
| **snap** | Ubuntu 主推，自包含依赖 |
| **flatpak** | 沙箱，Flathub 仓库 |

```bash
snap install name
flatpak install flathub app.id
```

## 9.5 源码安装（通用三步）

```bash
tar -xvf pkg.tar.gz && cd pkg/
./configure --prefix=/usr/local   # 检查依赖，生成 Makefile
make
sudo make install
```

卸载常无包管理器记录，需 `make uninstall`（若作者提供）或手动删除。

## 9.6 开发者常用补充

```bash
which go python3 node     # 命令实际路径
type -a python            # 所有同名命令
apt-file search bin/name  # 未安装时查属于哪个包（Debian）
apt install ./pkg.deb     # 本地 deb

# 语言级（通常不用 root，用虚拟环境）
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm install / go mod download
```

**容器**：应用运行环境见 Docker 专栏；宿主机上用 `docker` / `docker compose` 管理即可。
