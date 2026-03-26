---
statistics: true
comments: true
---

<style>
body {
  position: relative;
}

body::before {
  --size: 35px;
  --line: color-mix(in hsl, canvasText, transparent 60%);
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute;
  background: linear-gradient(
        90deg,
        var(--line) 1px,
        transparent 1px var(--size)
      )
      50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
      var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
          mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

@media (max-width: 768px) {
  body::before {
    display: none;
  }
}
</style>

# 🔧 Docker 安装

本章概述安装Docker的步骤。根据你所用的操作系统，安装时或许会遇到一些小问题；不过运气好的话，安装过程应该是简单和轻松的。

## Docker 的系统要求

Docker对系统并没有太多要求，不过你需要：

- 一个较新的内核（编写本书时是3.10或以上版本）。可以通过执行`uname -r`来检查你的内核版本
- 如果你使用的发行版是RHEL或CentOS，便需要7或之后的版本
- 系统架构必须是64位。系统架构可以通过执行`uname -m`查询，结果应为`x86_64`

## 在 Linux 上安装 Docker

目前为止，在Linux上安装Docker最好的方法就是使用Docker提供的安装脚本。虽然大部分主流Linux发行版都有自己的软件包，但很多时候这些软件包的版本都落后于Docker的发布版本。鉴于Docker开发的步伐较快，因此绝不能忽略这个问题的严重性。

你可以通过 [https://get.docker.com](https://get.docker.com) 提供的脚本来自动安装Docker。按照官方的说明，只需执行`curl -sSL https://get.docker.com | sh`或`wget -qO- https://get.docker.com | sh`就可以了，但建议在执行脚本前先检查一下它的内容，确保你接受它对你的系统所作的改动：

```bash
$ curl https://get.docker.com > /tmp/install.sh
$ cat /tmp/install.sh
...
$ chmod +x /tmp/install.sh
$ /tmp/install.sh
```

这个脚本会先做数个检查，然后用适合你的系统的包安装Docker。如果它发现系统缺少了一些安全和文件系统功能所需要的依赖关系，还会把它们一并安装。

如果你完全不想使用安装程序，或者希望使用一个安装程序未提供的Docker版本，你也可以在Docker网站下载二进制文件。这样做的缺点是它不会检查依赖关系，并且以后需要手动安装更新。

### 将 SELinux 置于宽容模式下运行

如果你正在运行基于红帽的发行版，包括RHEL、CentOS和Fedora，那么很有可能已经安装了SELinux安全模块。

刚开始使用Docker时，建议以宽容（permissive）模式运行SELinux，这样SELinux将只把错误写进日志，而非强制执行。如果以强制（enforcing）模式运行SELinux，那么很有可能在执行范例时，会遇到各种莫名其妙的"权限不足"（Permission Denied）错误。

要查看你的SELinux处于什么模式，可以通过执行`sestatus`命令的结果得知：

```bash
$ sestatus
SELinux status: enabled
SELinuxfs mount: /sys/fs/selinux
SELinux root directory: /etc/selinux
Loaded policy name: targeted
Current mode: enforcing  # 如果这里显示"enforcing"，代表SELinux已生效并会强制执行规则
Mode from config file: permissive
...
```

要将SELinux设为宽容模式，只需执行：

```bash
$ sudo setenforce 0
```

### 不使用 sudo 命令执行 Docker

因为Docker运行时需要特殊权限，所以默认执行命令时都必须在前面加上sudo。但这样做确实使人厌烦，一个可行的解决方法是把用户放进docker用户组里。在Ubuntu下你可以输入：

```bash
$ sudo usermod -aG docker $USER
```

如果docker用户组不存在，这个命令会创建它，并且把当前的用户添加到组里。然后，你需要先注销并再登入系统。其他Linux发行版的做法应该大同小异。

你还需要重启Docker服务，不同发行版的操作方法也不一样。Ubuntu下的操作方法如下：

```bash
$ sudo service docker restart
```

!!! warning "安全提示"
    将用户加入docker用户组等同于赋予他root权限。因此，你应了解它所带来的安全隐患，如果你的机器是共享的，那么尤其要注意。

## 在 Mac OS 及 Windows 上安装 Docker

如果你使用的操作系统是Windows或Mac OS，那么你需要某种虚拟化技术才能使用Docker。你可以下载整套的虚拟机并按照Linux的说明来安装Docker，或选择安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)。

Docker Desktop包含一个极小的虚拟机以及一些Docker工具，例如Compose和Swarm。

Toolbox成功安装后，便可以打开Docker的quickstart终端使用Docker。除此以外，也可以通过以下命令来配置当前的终端：

```bash
$ docker-machine start default
Starting VM...
Started machines may have new IP addresses. You may need to rerun the `docker-machine env` command.
$ eval $(docker-machine env default)
```

!!! note "注意"
    使用Docker Desktop时务必注意以下事项：
    
    - 本书的范例假设Docker运行在主机上。如果你使用Docker Desktop，可能需要把提到localhost的地方一概换成虚拟机的IP地址
    - 本地操作系统与Docker容器之间的映射数据卷必须同时挂载于虚拟机上

## 快速确认

可以通过执行`docker version`命令得知一切是否已正确安装并且可用。你应该会看到类似下面的输出结果：

```bash
$ docker version
Client:
 Version:           24.0.0
 API version:       1.43
 Go version:        go1.20.5
 Git commit:        ceddd72
 Built:             Tue Jun 13 20:44:32 2023
 OS/Arch:           linux/amd64
 Context:           default

Server:
 Version:           24.0.0
 API version:       1.43 (minimum version 1.12)
 Go version:        go1.20.5
 Git commit:        ceddd72
 Built:             Tue Jun 13 20:44:32 2023
 OS/Arch:           linux/amd64
 Experimental:      false
```

如果结果相符，这代表你已经准备就绪，可以开始使用Docker了！
