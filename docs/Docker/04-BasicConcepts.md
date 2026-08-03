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

# 💡 Docker 基本概念

## Docker 系统架构

Docker平台拥有两个不同部分：

1. **Docker引擎** ：负责创建与运行容器的引擎
2. **Docker Hub** ：用来发布容器的云服务

### 底层技术

Docker使用以下核心技术：

- **Linux容器（LXC）** ：把CGroups、内核命名空间以及chroot等技术融合，提供了一套完整的容器方案
- **联合文件系统（Union File System）** ：允许多个文件系统叠加，并表现为一个单一的文件系统
- **CGroups** ：Linux内核功能，用于限制、记录和隔离进程组的资源使用
- **命名空间（Namespaces）** ：Linux内核功能，用于隔离进程的可见资源

## 什么是镜像

Docker镜像是一个只读的模板，用于创建Docker容器。镜像由多个层（layers）组成，每一层代表Dockerfile中的一条指令。这种分层结构使得镜像可以复用，减少存储空间。

### 镜像层

Docker的镜像由多个不同的"层"（layer）组成，每一个层都是一个只读的文件系统。Dockerfile里的每个指令都会创建一个新的层，而这个层将位于前一个层之上。当一个镜像被转化成一个容器时，Docker引擎会在镜像之上添加一个处于最上层的可读写文件系统。

### 缓存

Docker为了加快镜像构建的速度，也会将每一个镜像层缓存下来。Docker的缓存特性能大大提高工作效率。你的指令必须满足以下条件，Docker才会使用缓存：

- 上一个指令能够在缓存中找得到
- 缓存中存在一个镜像层，而它的指令与你的指令一模一样，父层也完全相同

如果你需要使缓存失效，可以在执行`docker build`的时候加上`--no-cache`参数。

### 基础镜像

当你创建自己的镜像时，你需要决定从哪个基础镜像（base image）开始。最理想的情况是完全不用创建镜像，只需直接使用某个现有的镜像，然后把配置文件和/或数据挂载上去即可。

常用的基础镜像：

- **alpine** ：极小的镜像，大小仅仅5MB多一点，但仍提供了一个包管理器
- **debian/ubuntu** ：更完整的镜像，提供了完整的Linux发行版
- **scratch** ：完全空白的文件系统，只适合放入静态编译的二进制文件

## 容器：万物互联

容器可以处于以下几种状态之一：

- **已创建（created）** ：容器已通过`docker create`命令初始化，但未曾启动
- **重启中（restarting）** ：容器正在重启
- **运行中（running）** ：容器正在运行
- **已暂停（paused）** ：容器已被暂停
- **已退出（exited）** ：容器中没有正在运行的进程

容器的主进程退出时，容器也会退出。"已退出"的容器可以用`docker start`重启。

### 使容器与世界相连

假设你正在一个容器中运行Web服务器。你如何使外界能访问它呢？答案是通过`-p`或`-P`选项来"发布"端口。这个命令能够将主机的端口转发到容器上。

例如：

```bash
$ docker run -d -p 8000:80 nginx
```

其中的`-p 8000:80`参数告诉Docker将主机的8000端口转发至容器的80端口。

或者，可以使用`-P`选项来告诉Docker自动选择一个主机上未使用的端口：

```bash
$ ID=$(docker run -d -P nginx)
$ docker port $ID 80
0.0.0.0:32771
```

### 容器互联

Docker的连接（link）是允许同一主机上的容器互相通信的最简单方法。当使用Docker默认的联网模型时，容器之间的通信将通过Docker的内部网络，这意味着主机网络无法看见这些通信。

连接的初始化是通过执行`docker run`命令时传入`--link CONTAINER:ALIAS`参数，其中`CONTAINER`是目标容器的名称，而`ALIAS`（别名）是主容器用来称呼目标容器的一个本地名称。

使用Docker的连接也会把目标容器的别名和ID添加到主容器中的`/etc/hosts`，允许主容器通过名称找到目标容器。

## 利用数据卷和数据容器管理数据

数据卷是容器中的一个目录，它不属于容器UFS的一部分，它只是在主机上被绑定挂载（bind mount）到容器的一个普通目录。

### 三种数据卷初始化方法

#### 1. 通过 -v 选项

可以在执行Docker时，通过`-v`选项来宣告一个数据卷：

```bash
$ docker run -it --name container-test -v /data debian /bin/bash
```

这样，容器中的`/data`目录便成为了一个数据卷。

#### 2. 通过 Dockerfile 中的 VOLUME 指令

```dockerfile
FROM debian:wheezy
VOLUME /data
```

这个做法与执行`docker run`时提供`-v /data`参数的效果是相同的。

#### 3. 绑定挂载主机目录

第三种方法将`docker run`命令的`-v`选项用法进行扩展，使到能够具体指明数据卷要绑定的主机目录：

```bash
$ docker run -v /home/user/data:/data debian ls /data
```

这个例子把主机的`/home/user/data`目录挂载到容器的`/data`目录。

### 共享数据

如果需要在主机和一个或多个容器之间共享文件，`-v HOST_DIR:CONTAINER_DIR`语法是非常有用的。

另一种容器间共享数据的方法是，在运行`docker run`命令时，传入`--volumes-from CONTAINER`参数：

```bash
$ docker run -it --volumes-from container-test debian /bin/bash
```

### 数据容器

一个常用的做法是创建数据容器，这种容器的唯一目的就是与其他容器分享数据。这种方法的主要优点在于，它提供了一个方便的命名空间，使数据卷可以很容易通过`--volumes-from`命令进行加载。

例如，我们可以用以下命令，为PostgreSQL数据库创建一个数据容器：

```bash
$ docker run --name dbdata postgres echo "Data-only container for postgres"
```

现在便可以通过`--volumes-from`参数，使其他容器也能够使用这个数据卷：

```bash
$ docker run -d --volumes-from dbdata --name db1 postgres
```

### 删除数据卷

数据卷只会在满足以下条件的时候被删除：

- 容器被`docker rm -v`命令删除，或`docker run`命令执行时带有`--rm`选项
- 目前没有容器与该数据卷关联
- 该数据卷没有被指定使用主机目录（即没有使用`-v HOST_DIR:CONTAINER_DIR`语法）

## 联合文件系统

Docker使用联合文件系统（有时也称为"联合挂载"）。联合文件系统允许多个文件系统叠加，并表现为一个单一的文件系统。文件夹中的文件可以来自多个文件系统，但如果有两个文件的路径完全相同，最后挂载的文件则会覆盖较早前挂载的文件。

Docker支持多种不同的联合文件系统实现，包括：

- **AUFS** ：Another Union File System
- **Overlay** ：Overlay文件系统
- **devicemapper** ：设备映射
- **BTRFS** ：B-tree文件系统
- **ZFS** ：Z文件系统

具体使用哪种实现取决于你所用的系统，可以通过`docker info`命令，查看输出结果中"Storage Driver"的值得知。
