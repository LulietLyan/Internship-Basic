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

# 🚀 Docker 从这里开始

## Hello World

我们尝试执行下面的命令：

```bash
$ docker run debian echo "Hello World"
```

这个命令的作用：

- 输出结果的第一行告诉我们**本地没有Debian镜像**
- Docker会在Docker Hub进行**在线搜索**并下载Debian最新版本的镜像
- 镜像下载后Docker将它**转成容器并运行**
- 然后在容器中执行我们指定的命令——`echo "Hello World"`。命令的结果则显示在输出内容的**最后一行**

## Docker 的基本命令

### 1. Docker 运行

要在Docker中**运行容器**，可以使用以下命令：

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

- `docker run`：运行容器的命令
- `[OPTIONS]`：可选参数，用于配置容器的各种选项，如端口映射、容器名称等
- `IMAGE`：要运行的镜像名称或ID
- `[COMMAND] [ARG...]`：可选的命令和参数，用于在容器内执行特定的命令

常用选项：

- `-d, --detach`：使容器在"分离"模式下运行（后台运行）
- `-i, --interactive`：保持stdin打开
- `-t, --tty`：分配一个伪终端
- `-p, --publish`：发布容器的端口到主机
- `--name`：为容器指定一个名称
- `-v, --volume`：挂载数据卷
- `--rm`：容器退出时自动删除

### 2. Docker 构建

要**构建自己的Docker镜像**，可以使用以下命令：

```bash
docker build [OPTIONS] PATH | URL | -
```

- `docker build`：构建镜像的命令
- `[OPTIONS]`：可选参数，用于配置构建过程，如镜像标签、构建上下文路径等
- `PATH | URL | -`：Dockerfile所在的路径、URL或者使用标准输入作为Dockerfile

```bash
$ docker build -t myimage:1.0 .
```

### 3. Docker pull

要从Docker仓库中**拉取现有的镜像**，可以使用以下命令：

```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

```bash
$ docker pull ubuntu:20.04
```

### 4. Docker push

要将本地的镜像**推送到Docker仓库**，可以使用以下命令：

```bash
docker push [OPTIONS] NAME[:TAG]
```

### 5. Docker images

要**列出本地所有的镜像**，可以使用以下命令：

```bash
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

### 6. Docker ps

要**列出正在运行的容器**，可以使用以下命令：

```bash
docker ps [OPTIONS]
```

- `docker ps`：列出正在运行的容器
- `docker ps -a`：列出所有容器（包括已停止的）

### 7. Docker stop

要**停止正在运行的容器**，可以使用以下命令：

```bash
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

### 8. Docker start

要**启动已停止的容器**，可以使用以下命令：

```bash
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

### 9. Docker restart

要**重启正在运行的容器**，可以使用以下命令：

```bash
docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

### 10. Docker kill

要**强制终止**正在运行的容器，可以使用以下命令：

```bash
docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

### 11. Docker rm/docker rmi

要**删除已停止的容器或镜像**，可以使用以下命令：

```bash
docker rm [OPTIONS] CONTAINER [CONTAINER...]
docker rmi [OPTIONS] IMAGE [IMAGE...]
```

### 12. Docker exec

要在运行中的**容器内执行命令**，可以使用以下命令：

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

例如，进入容器的交互式shell：

```bash
$ docker exec -it mycontainer /bin/bash
```

### 13. Docker logs

要**查看容器的日志**输出，可以使用以下命令：

```bash
docker logs [OPTIONS] CONTAINER
```

常用选项：

- `--follow, -f`：实时跟踪容器的日志输出
- `--tail`：只显示最后几行的日志
- `--since`：只显示特定时间之后的日志

### 14. Docker inspect

要获取容器或镜像的**详细信息**，可以使用以下命令：

```bash
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

### 15. Docker cp

要在容器和主机之间**复制文件或目录**，可以使用以下命令：

```bash
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
docker cp [OPTIONS] SRC_PATH CONTAINER:DEST_PATH
```

### 16. Docker system prune

要**清理**不再使用的镜像、容器和其他资源，可以使用以下命令：

```bash
docker system prune [OPTIONS]
```

### 17. Docker network

**Docker网络**允许容器之间进行通信和连接到外部网络。以下是一些与Docker网络相关的常用命令：

- `docker network ls`：列出所有的Docker网络
- `docker network create`：创建一个新的Docker网络
- `docker network connect`：将容器连接到指定的Docker网络
- `docker network disconnect`：将容器从指定的Docker网络断开连接

### 18. Docker volume

**Docker卷**用于在容器和主机之间持久化存储数据。以下是一些与Docker卷相关的常用命令：

- `docker volume ls`：列出所有的Docker卷
- `docker volume create`：创建一个新的Docker卷
- `docker volume inspect`：获取Docker卷的详细信息
- `docker volume rm`：删除指定的Docker卷

### 19. Docker-compose

**Docker-compose是一个用于定义和运行多个容器应用程序的工具**。它使用YAML文件来配置应用程序的服务、网络和卷等。以下是一些与Docker-compose相关的常用命令：

- `docker-compose up`：构建并启动Docker-compose定义的所有服务
- `docker-compose down`：停止并删除Docker-compose定义的所有服务
- `docker-compose build`：构建Docker-compose定义的所有服务的镜像
- `docker-compose logs`：查看Docker-compose定义的所有服务的日志

### 20. Docker swarm

**Docker swarm是Docker的原生集群管理和编排工具**。用于在多个Docker主机上运行和管理应用程序。以下是一些与Docker swarm相关的常用命令：

- `docker swarm init`：初始化一个新的Docker swarm集群
- `docker swarm join`：将节点加入到Docker swarm集群
- `docker node ls`：列出Docker swarm集群中的所有节点
- `docker service`：管理在Docker swarm集群中运行的服务

### 21. Dockerfile

**Dockerfile是用于定义Docker镜像构建过程的文本文件**。它包含一系列的指令和配置，用于指导Docker引擎在构建过程中执行特定的操作。以下是一些与Dockerfile相关的常用指令：

- `FROM`：指定基础镜像
- `RUN`：在容器内执行命令
- `COPY`：将文件或目录从主机复制到容器内
- `ADD`：将文件或目录从主机复制到容器内，并支持URL和解压缩操作
- `WORKDIR`：设置工作目录
- `EXPOSE`：声明容器运行时监听的端口
- `CMD`：指定容器启动时要执行的命令
- `ENTRYPOINT`：设置容器启动时运行的可执行文件

这些指令可以在Dockerfile中按照特定的顺序组合使用，以定义和构建自定义的Docker镜像。

### 22. Docker 登录和认证

要**登录到Docker仓库或私有镜像仓库**，可以使用以下命令：

```bash
docker login
docker logout
```

登录后，您可以使用`docker pull`和`docker push`命令来拉取和推送镜像。

### 23. Docker 容器日志管理

除了使用`docker logs`命令查看容器日志外，还可以使用以下命令**对容器日志进行管理**：

- `docker logs --tail`：只显示最后几行的日志
- `docker logs --follow`：实时跟踪容器的日志输出
- `docker logs --since`：只显示特定时间之后的日志
- `docker logs --until`：只显示特定时间之前的日志
