---
comments: true
---
<h1 align="center">Docker 简明教程</h1>

# Contents
- [Contents](#contents)
- [🤔 Docker 概览](#-docker-概览)
    - [为什么要有 Docker？](#为什么要有-docker)
    - [容器和虚拟机技术的区别](#容器和虚拟机技术的区别)
    - [Docker：赢](#docker赢)
- [🥰 Docker 的安装](#-docker-的安装)
    - [Mac OS 及 Windows 系统下 Docker 的安装](#mac-os-及-windows-系统下-docker-的安装)
    - [Linux 系统下 Docker 的安装](#linux-系统下-docker-的安装)
    - [不使用 sudo 命令执行 Docker](#不使用-sudo-命令执行-docker)
    - [快速确认](#快速确认)
- [😆 Docker：从这里开始](#-docker从这里开始)
    - [Hello World](#hello-world)
    - [Docker 的基本命令](#docker-的基本命令)
    - [1. Docker 运行](#1-docker-运行)
    - [2. Docker 构建](#2-docker-构建)
    - [3. Docker pull](#3-docker-pull)
    - [4. Docker push](#4-docker-push)
    - [5. Docker images](#5-docker-images)
    - [6. Docker ps](#6-docker-ps)
    - [7. Docker stop](#7-docker-stop)
    - [8. Docker start](#8-docker-start)
    - [9. Docker restart](#9-docker-restart)
    - [10. Docker kill](#10-docker-kill)
    - [11. Docker rm/docker rmi](#11-docker-rmdocker-rmi)
    - [12. Docker exec](#12-docker-exec)
    - [13. Docker logs](#13-docker-logs)
    - [14. Docker inspect](#14-docker-inspect)
    - [15. Docker cp](#15-docker-cp)
    - [16. Docker system prune](#16-docker-system-prune)
    - [17. Docker network](#17-docker-network)
    - [18. Docker volume](#18-docker-volume)
    - [19. Docker-compose](#19-docker-compose)
    - [20. Docker swarm](#20-docker-swarm)
    - [21. Dockerfile](#21-dockerfile)
    - [22. Docker 登录和认证](#22-docker-登录和认证)
    - [23. Docker 容器日志管理](#23-docker-容器日志管理)
- [😣 Docker 进阶](#-docker-进阶)
    - [Docker 系统架构](#docker-系统架构)
    - [什么是镜像](#什么是镜像)
    - [容器：万物互联](#容器万物互联)
    - [利用数据卷和数据容器管理数据](#利用数据卷和数据容器管理数据)

# 🤔 Docker 概览

## 为什么要有 Docker？

- 假如您开发了一个可以在 **本机运行的项目**，这没有什么问题
- 但如果项目版本更新，可能会导致 **服务不可使用**，后期维护起来很繁琐
- 因为对于每一个运行您项目的机器，都需要进行 **环境的部署与配置** 
- 在这一点上，为了方便部署您的项目，您可能会想到 **虚拟机技术**。虚拟机是一种通过软件模拟的、具有完整硬件系统功能的、运行在一个完全隔离环境中的 **完整计算机系统** 
- 但虚拟机真的好吗——我的意思是它占用大量系统资源的同时也有比较繁琐的配置步骤，性能上也不尽如人意···也许我们需要一种更加 **轻量化的虚拟机**， **Docker**  应运而生

## 容器和虚拟机技术的区别

- **传统的虚拟机**：可以虚拟出一个完整的操作系统，在这个操作系统上安装和运行所需的软件
- **容器内的应用可以直接运行在宿主主机的内核中**：容器没有自己的内核，也不用虚拟硬件(轻便)
- **每个容器是相互隔离的**：每个容器内都有属于自己的文件系统，之间互不影响
- **容器能与主机的操作系统共享资源**，因而它的效率高出一个数量级。启动和停止容器均只需一瞬间。相比在主机上直接运行程序，容器的性能损耗非常低，甚至是零损耗
- **容器具有可移植性**，这极有可能彻底解决由于运行环境的些许改变而导致的问题，甚至有可能彻底终止开发者的抱怨：“可是程序在我的计算机上能正常工作！”
- **容器是轻量的**，这意味着开发者能同时运行数十个容器，并能模拟分布式系统在真实运
行环境下的情况。运维工程师在一台主机上能运行的容器数量，远远超过仅使用虚拟机时。
- 对于最终用户及开发者而言，容器的优势不仅仅体现在云端部署。用户 **可以下载并执行复杂的应用程序，而无需花费大量时间在配置和安装的问题上，也无需担心对系统本身的改动**。另一方面，应用程序的开发者不用再操心用户环境的差异，以及依赖关系是否满足。

## Docker：赢

1.  **应用于更快速的交付和部署** 
    - **虚拟机**：通过大量的帮助文档，安装程序
    - **Docker**：打包镜像发布测试，一键运行
2.  **更便捷的升级和扩缩容** 
    - 通过使用 Docker，部署应用如同搭积木一样
3.  **更简单的系统运维** 
    - 使用容器化后开发和测试环境是 **高度一致** 的
4.  **更高效的计算资源利用** 
    - Docker 是内核级别的虚拟化：可以在 **同一物理机上运行多个容器**，让服务器的性能发挥到极致

Docker 利用现有的  **Linux 容器技术**，以不同方式将其封装及扩展——主要是通过提供可移植的镜像，以及一个用户友好的接口——来创建一套完整的容器创建及发布方案。Docker 平台拥有两个不同部分：负责 **创建与运行容器的 Docker 引擎**，以及用来 **发布容器的云服务 Docker Hub**。

容器技术的兴起很大一部分是 **由开发者所驱动的**，也是他们首次使用了能真正发挥容器潜力的工具。对实施快速迭代开发模式的开发者来说，Docker 容器能迅速启动至关重要，因为他们可以很快看到代码变更后的结果。容器能保障的可移植性及隔离特性，使得开发与运维部门之间更容易协作，因为开发者知道他们的代码在不同环境下都能工作，而运维部门只需专注于容器的托管及服务编排，而无需担心任何关于代码的事。

 **Docker 为软件开发带来了翻天覆地的变化**。假如没有 Docker，在很长一段时间内容器将仍是一种鲜为人知的技术。

# 🥰 Docker 的安装

## Mac OS 及 Windows 系统下 Docker 的安装

如果你使用的操作系统是  **Windows 或 Mac OS**，那么你需要某种虚拟化技术才能使用 Docker。你可以下载整套的虚拟机并按照 Linux 的说明来安装 Docker，或选择安装 [Docker Toolbox 工具箱](https://www.docker.com/toolbox)。Docker Toolbox 包含一个极小的 boot2docker 虚拟机以及一些 Docker 工具，例如 Compose 和 Swarm。如果使用 Homebrew 在 Mac 下安装应用，你会发现 boot2docker 的 brew recipe；不过一般建议使用官方的 Toolbox 来安装，以免遇到问题。

## Linux 系统下 Docker 的安装

 **在 Linux 上安装 Docker 最好的方法就是使用 Docker 提供的安装脚本**。虽然大部分主流 Linux 发行版都有自己的软件包，但很多时候这些软件包的版本都落后于 Docker 的发布版本。鉴于 Docker 开发的步伐较快，因此绝不能忽略这个问题的严重性。

可以通过 [官方](https://get.docker.com) 提供的脚本来自动安装 Docker。按照官方的说明，只需执行 `curl -sSL | sh 或 wget -qO- | sh` 就可以了，但建议在执行脚本前先检查一下它的内容，确保你接受它对你的系统所作的改动。

### 不使用 sudo 命令执行 Docker

输入：
```bash
  sudo usermod -aG docker $USER
```

重启 Docker 服务：
```bash
  sudo service docker restart
```

## 快速确认

可以通过执行 `docker version` 命令得知一切是否已正确安装并且可用。

# 😆 Docker：从这里开始

## Hello World

我们尝试执行下面的命令：

```bash
  sudo docker run debian echo "Hello World"
```

结果如下：

![](../Figures/Docker/Hello%20World.png)

- 输出结果的第一行告诉我们 **本地没有 Debian 镜像** 
- Docker 会在 Docker Hub 进行 **在线搜索** 并下载 Debian 最新版本的镜像
- 镜像下载后 Docker 将它 **转成容器并运行** 
- 然后在容器中执行我们指定的命令——echo "Hello World"。命令的结果则显示在输出内容的 **最后一行** 

## Docker 的基本命令

### 1\. Docker 运行

要在 Docker 中 **运行容器**，可以使用以下命令：

```bash
  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

- `docker run`：运行容器的命令
- `[OPTIONS]`：可选参数，用于配置容器的各种选项，如端口映射、容器名称等
- `IMAGE`：要运行的镜像名称或 ID
- `[COMMAND] [ARG...]`：可选的命令和参数，用于在容器内执行特定的命令

### 2\. Docker 构建

要 **构建自己的 Docker 镜像**，可以使用以下命令：

```bash
  docker build [OPTIONS] PATH | URL | -
```

- `docker build`：构建镜像的命令
- `[OPTIONS]`：可选参数，用于配置构建过程，如镜像标签、构建上下文路径等
- `PATH | URL | -`：Dockerfile 所在的路径、URL 或者使用标准输入作为 Dockerfile

### 3\. Docker pull

要从 Docker 仓库中 **拉取现有的镜像**，可以使用以下命令：

```bash
  docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

- `docker pull`：拉取镜像的命令
- `[OPTIONS]`：可选参数，用于配置拉取过程，如认证信息等
- `NAME[:TAG|@DIGEST]`：要拉取的镜像名称、标签或摘要  

### 4\. Docker push

要将本地的镜像 **推送到 Docker 仓库**，可以使用以下命令：

```bash
  docker push [OPTIONS] NAME[:TAG]
```

- `docker push`：推送镜像的命令
- `[OPTIONS]`：可选参数，用于配置推送过程，如认证信息等  
- `NAME[:TAG]`：要推送的镜像名称和标签  

### 5\. Docker images

要 **列出本地所有的镜像**，可以使用以下命令：

```bash
  docker images [OPTIONS] [REPOSITORY[:TAG]]
```

- `docker images`：列出镜像的命令
- `[OPTIONS]`：可选参数，用于配置输出结果的格式等
- `[REPOSITORY[:TAG]]`：可选的镜像名称和标签，用于过滤输出结果

### 6\. Docker ps

要 **列出正在运行的容器**，可以使用以下命令：

```bash
  docker ps [OPTIONS]
```

- `docker ps`：列出容器的命令
- `[OPTIONS]`：可选参数，用于配置输出结果的格式和过滤条件

### 7\. Docker stop

要 **停止正在运行的容器**，可以使用以下命令：

```bash
  docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

- `docker stop`：停止容器的命令
- `[OPTIONS]`：可选参数，用于配置停止过程，如超时时间等
- `CONTAINER [CONTAINER...]`：要停止的容器名称或 ID

### 8\. Docker start

要 **启动已停止的容器**，可以使用以下命令：

```bash
  docker start [OPTIONS] CONTAINER [CONTAINER...]
```

- `docker start`：启动容器的命令
- `[OPTIONS]`：可选参数，用于配置启动过程，如守护模式等  
- `CONTAINER [CONTAINER...]`：要启动的容器名称或 ID

### 9\. Docker restart

要 **重启正在运行的容器**，可以使用以下命令：

```bash
  docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

- `docker restart`：重启容器的命令
- `[OPTIONS]`：可选参数，用于配置重启过程，如超时时间等
- `CONTAINER [CONTAINER...]`：要重启的容器名称或 ID

### 10\. Docker kill

要 **强制终止** 正在运行的容器，可以使用以下命令：

```bash
  docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

- `docker kill`：终止容器的命令
- `[OPTIONS]`：可选参数，用于配置终止过程，如信号等
- `CONTAINER [CONTAINER...]`：要终止的容器名称或 ID

### 11\. Docker rm/docker rmi

要 **删除已停止的容器或镜像**，可以使用以下命令：

```bash
  docker rm [OPTIONS] CONTAINER [CONTAINER...]   docker rmi [OPTIONS] IMAGE [IMAGE...]
```

- `docker rm`：删除容器的命令
- `docker rmi`：删除镜像的命令
- `[OPTIONS]`：可选参数，用于配置删除过程，如强制删除等
- `CONTAINER [CONTAINER...]`：要删除的容器名称或 ID
- `IMAGE [IMAGE...]`：要删除的镜像名称或 ID 

### 12\. Docker exec

要在运行中的 **容器内执行命令**，可以使用以下命令：

```bash
  docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

- `docker exec`：在容器内执行命令的命令
- `[OPTIONS]`：可选参数，用于配置执行过程，如进入交互模式等
- `CONTAINER`：要执行命令的容器名称或 ID
- `COMMAND [ARG...]`：要在容器内执行的命令及其参数

### 13\. Docker logs

要 **查看容器的日志** 输出，可以使用以下命令：

```bash
  docker logs [OPTIONS] CONTAINER
```

- `docker logs`：查看容器日志的命令  
- `[OPTIONS]`：可选参数，用于配置输出结果，如时间戳等
- `CONTAINER`：要查看日志的容器名称或 ID

### 14\. Docker inspect

要获取容器或镜像的 **详细信息**，可以使用以下命令：

```bash
  docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

- `docker inspect`：获取详细信息的命令
- `[OPTIONS]`：可选参数，用于配置输出结果的格式等
- `NAME|ID [NAME|ID...]`：要获取信息的容器或镜像的名称或 ID

### 15\. Docker cp

要在容器和主机之间 **复制文件或目录**，可以使用以下命令：

```bash
  docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH   docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

- `docker cp`：复制文件或目录的命令
- `[OPTIONS]`：可选参数，用于配置复制过程，如权限等
- `CONTAINER:SRC_PATH`：源路径，其中`CONTAINER`是容器名称或 ID 
- `DEST_PATH`：目标路径，其中`DEST_PATH`是主机路径
- `SRC_PATH|-`：源路径，其中`-`表示从标准输入读取

### 16\. Docker system prune

要 **清理** 不再使用的镜像、容器和其他资源，可以使用以下命令：

```bash
  docker system prune [OPTIONS]
```

- `docker system prune`：清理资源的命令
- `[OPTIONS]`：可选参数，用于配置清理过程，如强制删除等

### 17\. Docker network

 **Docker 网络** 允许容器之间进行通信和连接到外部网络。以下是一些与 Docker 网络相关的常用命令：

- `docker network ls`：列出所有的 Docker 网络
- `docker network create`：创建一个新的 Docker 网络
- `docker network connect`：将容器连接到指定的 Docker 网络
- `docker network disconnect`：将容器从指定的 Docker 网络断开连接

### 18\. Docker volume

 **Docker 卷** 用于在容器和主机之间持久化存储数据。以下是一些与 Docker 卷相关的常用命令：

- `docker volume ls`：列出所有的 Docker 卷
- `docker volume create`：创建一个新的 Docker 卷
- `docker volume inspect`：获取 Docker 卷的详细信息
- `docker volume rm`：删除指定的 Docker 卷

### 19\. Docker-compose

 **Docker-compose 是一个用于定义和运行多个容器应用程序的工具**。它使用 YAML 文件来配置应用程序的服务、网络和卷等。以下是一些与 Docker-compose 相关的常用命令：

- `docker-compose up`：构建并启动 Docker-compose 定义的所有服务
- `docker-compose down`：停止并删除 Docker-compose 定义的所有服务
- `docker-compose build`：构建 Docker-compose 定义的所有服务的镜像
- `docker-compose logs`：查看 Docker-compose 定义的所有服务的日志

### 20\. Docker swarm

 **Docker swarm 是 Docker 的原生集群管理和编排工具**。用于在多个 Docker 主机上运行和管理应用程序。以下是一些与 Docker swarm 相关的常用命令：

- `docker swarm init`：初始化一个新的 Docker swarm 集群
- `docker swarm join`：将节点加入到 Docker swarm 集群
- `docker node ls`：列出 Docker swarm 集群中的所有节点
- `docker service`：管理在 Docker swarm 集群中运行的服务

### 21\. Dockerfile

 **Dockerfile 是用于定义 Docker 镜像构建过程的文本文件**。它包含一系列的指令和配置，用于指导 Docker 引擎在构建过程中执行特定的操作。以下是一些与 Dockerfile 相关的常用命令：

- `FROM`：指定基础镜像
- `RUN`：在容器内执行命令
- `COPY`：将文件或目录从主机复制到容器内
- `ADD`：将文件或目录从主机复制到容器内，并支持 URL 和解压缩操作
- `WORKDIR`：设置工作目录
- `EXPOSE`：声明容器运行时监听的端口
- `CMD`：指定容器启动时要执行的命令

这些命令可以在 Dockerfile 中按照特定的顺序组合使用，以定义和构建自定义的 Docker 镜像。

### 22\. Docker 登录和认证

要 **登录到 Docker 仓库或私有镜像仓库**，可以使用以下命令：

- `docker login`：登录到 Docker 仓库
- `docker logout`：退出登录

登录后，您可以使用`docker pull`和`docker push`命令来拉取和推送镜像。

### 23\. Docker 容器日志管理

除了使用`docker logs`命令查看容器日志外，还可以使用以下命令 **对容器日志进行管理**：

- `docker logs --tail`：只显示最后几行的日志
- `docker logs --follow`：实时跟踪容器的日志输出
- `docker logs --since`：只显示特定时间之后的日志
- `docker logs --until`：只显示特定时间之前的日志

# 😣 Docker 进阶

## Docker 系统架构



## 什么是镜像



## 容器：万物互联



## 利用数据卷和数据容器管理数据


