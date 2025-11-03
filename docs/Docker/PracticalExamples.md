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

# 🎯 Docker 实战案例

本章将通过实际案例，帮助你更好地理解和使用Docker。我们将从简单的应用开始，逐步构建一个完整的Web应用。

## 案例1：运行一个简单的Web服务器

### 使用Nginx官方镜像

Nginx是一个非常流行的Web服务器。我们可以使用Docker Hub上的官方Nginx镜像来快速启动一个Web服务器：

```bash
# 拉取nginx镜像
$ docker pull nginx

# 运行nginx容器，将容器的80端口映射到主机的8080端口
$ docker run -d -p 8080:80 --name mynginx nginx
```

**命令说明：**
- `-d`：让容器在后台运行（detached mode）
- `-p 8080:80`：将主机的8080端口映射到容器的80端口
- `--name mynginx`：为容器指定一个名称，方便后续管理
- `nginx`：使用的镜像名称

现在你可以打开浏览器访问 `http://localhost:8080`，应该能看到Nginx的欢迎页面。

### 挂载本地文件到容器

如果你想使用自己的HTML文件，可以将本地目录挂载到容器的网站根目录：

```bash
# 创建一个简单的HTML文件
$ mkdir ~/mywebsite
$ echo "<h1>Hello Docker!</h1>" > ~/mywebsite/index.html

# 运行容器并挂载目录
$ docker run -d -p 8080:80 \
  -v ~/mywebsite:/usr/share/nginx/html \
  --name mywebsite nginx
```

**命令说明：**
- `-v ~/mywebsite:/usr/share/nginx/html`：将主机的`~/mywebsite`目录挂载到容器的`/usr/share/nginx/html`目录

现在访问 `http://localhost:8080`，你应该能看到"Hello Docker!"的内容。

!!! tip "数据卷挂载格式"
    数据卷挂载的格式是：`-v 主机路径:容器路径`
    
    - 主机路径必须是绝对路径
    - 如果容器路径不存在，Docker会自动创建
    - 如果容器路径已存在，挂载会覆盖原有内容

## 案例2：运行Redis数据库

Redis是一个流行的内存数据库。让我们看看如何使用Docker运行Redis：

```bash
# 启动Redis容器
$ docker run -d --name myredis -p 6379:6379 redis

# 进入Redis容器并执行redis-cli
$ docker exec -it myredis redis-cli
```

在redis-cli中，你可以执行Redis命令：

```redis
127.0.0.1:6379> SET mykey "Hello Docker"
OK
127.0.0.1:6379> GET mykey
"Hello Docker"
127.0.0.1:6379> exit
```

### 持久化Redis数据

默认情况下，Redis容器停止后数据会丢失。为了持久化数据，我们需要挂载数据卷：

```bash
# 创建一个数据卷
$ docker volume create redis-data

# 使用数据卷运行Redis
$ docker run -d --name myredis \
  -v redis-data:/data \
  -p 6379:6379 redis redis-server --appendonly yes
```

**命令说明：**
- `-v redis-data:/data`：将名为`redis-data`的数据卷挂载到容器的`/data`目录
- `--appendonly yes`：启用Redis的AOF持久化

## 案例3：创建一个Python Flask应用

让我们创建一个简单的Flask Web应用：

### 1. 创建项目结构

```bash
$ mkdir flask-app
$ cd flask-app
```

创建`app.py`文件：

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Hello from Docker!</h1><p>This is a Flask app running in a container.</p>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

创建`requirements.txt`：

```txt
Flask==2.3.0
```

创建`Dockerfile`：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY app.py .

# 暴露端口
EXPOSE 5000

# 运行应用
CMD ["python", "app.py"]
```

### 2. 构建镜像

```bash
$ docker build -t my-flask-app .
```

### 3. 运行容器

```bash
$ docker run -d -p 5000:5000 --name flask-app my-flask-app
```

现在访问 `http://localhost:5000`，你应该能看到Flask应用的输出。

### 4. 开发模式：挂载代码目录

在开发过程中，你可能希望修改代码后立即看到效果，而不需要重新构建镜像。可以使用数据卷挂载：

```bash
$ docker run -d -p 5000:5000 \
  -v $(pwd):/app \
  --name flask-app-dev my-flask-app
```

!!! warning "注意"
    在挂载代码目录时，确保容器内的Flask应用以debug模式运行，这样才能自动重载代码。

## 案例4：容器互联

在实际应用中，不同的服务需要相互通信。让我们创建一个包含Web应用和数据库的完整系统。

### 使用Docker网络连接容器

```bash
# 创建一个网络
$ docker network create mynetwork

# 启动Redis容器并连接到网络
$ docker run -d --name redis \
  --network mynetwork \
  redis

# 启动Python应用并连接到网络
$ docker run -d -p 5000:5000 \
  --name flask-app \
  --network mynetwork \
  -e REDIS_HOST=redis \
  my-flask-app
```

在应用代码中，你可以通过`redis`这个主机名连接到Redis容器：

```python
import redis
redis_client = redis.Redis(host='redis', port=6379, db=0)
```

!!! tip "容器互联的优势"
    - 容器可以通过名称互相访问，无需知道IP地址
    - 网络隔离，只有同一网络中的容器可以通信
    - 更安全，更易管理

## 案例5：使用Docker Compose

对于多容器应用，使用Docker Compose会更加方便。创建`docker-compose.yml`文件：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/app
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis

  redis:
    image: redis:latest
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

volumes:
  redis-data:
```

运行应用：

```bash
# 启动所有服务
$ docker-compose up -d

# 查看日志
$ docker-compose logs

# 停止所有服务
$ docker-compose down
```

!!! note "Docker Compose的优势"
    - 一个文件定义所有服务
    - 自动处理容器间的依赖关系
    - 统一管理网络和数据卷
    - 更易于版本控制和分享

## 案例6：查看和管理容器

### 查看运行中的容器

```bash
$ docker ps
```

### 查看所有容器（包括已停止的）

```bash
$ docker ps -a
```

### 查看容器日志

```bash
# 查看日志
$ docker logs mycontainer

# 实时跟踪日志
$ docker logs -f mycontainer

# 查看最后100行日志
$ docker logs --tail 100 mycontainer
```

### 进入运行中的容器

```bash
$ docker exec -it mycontainer /bin/bash
```

### 停止和删除容器

```bash
# 停止容器
$ docker stop mycontainer

# 删除容器
$ docker rm mycontainer

# 强制删除运行中的容器
$ docker rm -f mycontainer

# 删除所有已停止的容器
$ docker container prune
```

### 清理未使用的资源

```bash
# 清理未使用的镜像、容器、网络和数据卷
$ docker system prune -a --volumes
```

!!! warning "谨慎使用"
    `docker system prune -a`会删除所有未使用的镜像和容器，请确保你不再需要它们。

## 案例7：多阶段构建

对于需要编译的应用，可以使用多阶段构建来减小最终镜像的大小。

### 示例：构建Go应用

```dockerfile
# 构建阶段
FROM golang:1.21 AS builder

WORKDIR /app
COPY . .

RUN go build -o myapp

# 运行阶段
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制编译好的二进制文件
COPY --from=builder /app/myapp .

CMD ["./myapp"]
```

**多阶段构建的优势：**
- 最终镜像只包含运行时需要的文件
- 大大减小镜像大小
- 提高安全性（构建工具不包含在最终镜像中）

## 总结

通过这些实战案例，你应该已经掌握了：

1. ✅ 如何运行现有的官方镜像
2. ✅ 如何挂载本地文件和数据卷
3. ✅ 如何创建自己的镜像
4. ✅ 如何连接多个容器
5. ✅ 如何使用Docker Compose管理多容器应用
6. ✅ 如何查看和管理容器
7. ✅ 如何使用多阶段构建优化镜像

接下来，你可以尝试将这些技术应用到自己的项目中！
