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

# 📝 Dockerfile 详解

Dockerfile是用于定义Docker镜像构建过程的文本文件。它包含一系列的指令和配置，用于指导Docker引擎在构建过程中执行特定的操作。

## 通过 Dockerfile 创建镜像

Dockerfile是一个描述如何创建Docker镜像所需步骤的文本文件。例如：

```dockerfile
FROM debian:wheezy
RUN apt-get update && apt-get install -y cowsay fortune
```

然后使用`docker build`命令构建镜像：

```bash
$ docker build -t test/cowsay-dockerfile .
```

`FROM`指令指定初始镜像（这里使用debian，并且指定使用"wheezy"版本）。所有Dockerfile一定要有`FROM`指令作为第一个非注释指令。`RUN`指令指定的shell命令，是将要在镜像里执行的。

## Dockerfile 指令详解

### FROM

设置Dockerfile使用的基础镜像；随后的指令皆执行于这个镜像之上。基础镜像以"镜像：标签"（IMAGE:TAG）的格式表示（例如`debian:wheezy`）。如果省略标签，那么就被视为最新（latest），但我强烈建议你一定要给标签设置为某个特定版本，以免出现任何意想不到的事情。`FROM`必须为Dockerfile的第一条指令。

```dockerfile
FROM ubuntu:20.04
FROM python:3.9
FROM node:16-alpine
```

### RUN

在容器内执行指定的指令，并把结果保存下来。

```dockerfile
RUN apt-get update && apt-get install -y nginx
RUN pip install flask
```

!!! tip "优化技巧"
    由于不必要的层会使镜像变得臃肿，你会发现很多Dockerfile都把多个UNIX命令放在同一个RUN指令中，以减少层的数量。

### COPY

用于从构建环境的上下文复制文件至镜像。

```dockerfile
COPY app.py /app/
COPY requirements.txt /app/
COPY . /app/
```

`COPY`指令有两种形式：

- `COPY src dest`
- `COPY ["src", "dest"]`

如果路径中有空格的话，那么必须使用JSON数组的格式。通配符可以用来指定多个文件或目录。

!!! warning "注意"
    你不能指定上下文以外的src路径（例如`../another_dir/myfile`是不管用的）。

### ADD

从构建环境的上下文或远程URL复制文件至镜像。如果是从一个本地路径添加一个归档文件，那么它会被自动解压。

```dockerfile
ADD https://example.com/file.tar.gz /tmp/
ADD app.tar.gz /app/
```

!!! tip "最佳实践"
    一般最好还是使用相对简单的`COPY`指令来复制构建环境上下文的文件和目录，并用`RUN`指令配合curl或wget来下载远程资源。

### WORKDIR

对任何后续的`RUN`、`CMD`、`ENTRYPOINT`、`ADD`或`COPY`指令设置工作目录。

```dockerfile
WORKDIR /app
RUN python app.py
```

这个指令可多次使用。支持使用相对路径，按上次定义的`WORKDIR`解析。

### ENV

设置镜像内的环境变量。这些变量可以被随后的指令引用。

```dockerfile
ENV MY_VERSION 1.3
ENV PATH=/usr/local/bin:$PATH
RUN apt-get install -y mypackage=$MY_VERSION
```

在镜像中这些变量仍然可用。

### EXPOSE

向Docker表示该容器将会有一个进程监听所指定的端口。

```dockerfile
EXPOSE 80
EXPOSE 8080 9090
```

!!! note "注意"
    `EXPOSE`指令本身并不会对网络有实质性的改变，它只是声明容器的端口。提供这个信息的目的是用于连接容器或在执行`docker run`命令时通过`-P`参数把端口发布开来。

### CMD

当容器启动时执行指定的指令。

```dockerfile
CMD ["python", "app.py"]
CMD python app.py
CMD echo "Hello World"
```

!!! important "重要"
    - 如果还定义了`ENTRYPOINT`，该指令将被解释为`ENTRYPOINT`的参数（在这种情况下，请确保使用的是exec格式）
    - `CMD`指令也会被`docker run`命令中镜像名称后面的所有参数覆盖
    - 假如定义了多个`CMD`指令，那么只有最后一个生效

### ENTRYPOINT

设置一个于容器启动时运行的可执行文件（以及默认参数）。

```dockerfile
ENTRYPOINT ["/usr/games/cowsay"]
ENTRYPOINT ["/entrypoint.sh"]
```

任何`CMD`指令或`docker run`命令中镜像名称之后的参数，将作为参数传给这个可执行文件。`ENTRYPOINT`指令通常用于提供"启动"脚本，目的是在解析参数之前，对变量和服务进行初始化。

### USER

设置任何后续的`RUN`、`CMD`或`ENTRYPOINT`指令执行时所用的用户（用户名或UID）。

```dockerfile
RUN groupadd -r uwsgi && useradd -r -g uwsgi uwsgi
USER uwsgi
```

!!! warning "注意"
    UID在主机和容器中是相同的，但用户名则可能被分配到不同的UID，导致设置权限时变得复杂。

### VOLUME

指定为数据卷的文件或目录。

```dockerfile
VOLUME /data
VOLUME ["/data", "/config"]
```

!!! warning "重要"
    - 如果该文件或目录已经在镜像中存在，那么当容器启动时，它就会被复制至这个卷
    - 出于对可移植性和安全性的考虑，你不能在Dockerfile中指定数据卷将会使用的主机目录
    - 在Dockerfile中`VOLUME`指令之后的所有指令不可以对该数据卷有任何修改

### MAINTAINER

把镜像中的"作者"元数据设定为指定的字符串。

```dockerfile
MAINTAINER John Smith <john@smith.com>
```

可以通过`docker inspect -f {{.Author}} IMAGE`这个命令来查看该信息。

### ONBUILD

指定当镜像被用作另一个镜像的基础镜像时将会执行的指令。

```dockerfile
ONBUILD COPY . /app
ONBUILD RUN npm install
```

对于处理一些将要添加到子镜像的数据，这个指令将会非常有用（例如，把代码从一个已选定的目录中复制出来，并在执行构建脚本时使用它）。

## Exec 与 Shell 格式的对比

一些指令（`RUN`、`CMD`以及`ENTRYPOINT`）能够接受shell和exec这两种格式。

**Exec格式**： 使用JSON数组（例如，`["executable","param1","param2"]`），其中第一个元素是一个可执行文件，其他元素是它执行时所使用的参数。

```dockerfile
CMD ["python", "app.py"]
RUN ["/bin/bash", "-c", "echo hello"]
```

**Shell格式**： 使用自由形式的字符串，字符串会传给`/bin/sh -c`执行。

```dockerfile
CMD python app.py
RUN echo hello
```

!!! tip "建议"
    exec格式适用于需要规避shell对字符串作出错误解析的情况，或者当镜像里没有包含`/bin/sh`时。

## 构建镜像的最佳实践

1. **使用特定的标签**：避免使用`latest`标签，使用具体的版本号
2. **合并RUN指令**：减少镜像层数，降低镜像大小
3. **使用.dockerignore**：排除不需要的文件，加快构建速度
4. **最小化镜像层数**：每个指令都会创建一个新层，尽量合并指令
5. **使用多阶段构建**：对于需要编译的应用，使用多阶段构建可以减小最终镜像大小
6. **避免安装不必要的包**：只安装应用运行时需要的包
7. **使用官方镜像**：优先使用官方维护的基础镜像

## 示例 Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非root用户
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 5000

# 设置环境变量
ENV PYTHONUNBUFFERED=1

# 启动应用
CMD ["python", "app.py"]
```
