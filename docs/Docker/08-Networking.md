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

# 🌐 Docker 网络详解

Docker网络允许容器之间进行通信，以及容器与外部世界的通信。理解Docker网络对于构建复杂的多容器应用至关重要。

## Docker网络基础

### 查看网络列表

```bash
$ docker network ls
```

默认情况下，Docker会创建三种网络：

- `bridge`：默认的桥接网络
- `host`：使用主机的网络栈
- `none`：禁用网络

### 查看网络详细信息

```bash
$ docker network inspect bridge
```

## 网络类型

### 1. Bridge网络（桥接网络）

这是Docker的默认网络模式。当你创建一个容器且未指定网络时，它会连接到默认的`bridge`网络。

**特点** ：

- 容器之间可以相互通信
- 容器与主机网络隔离
- 需要通过端口映射才能从主机访问容器

**示例** ：

```bash
# 运行容器（自动连接到bridge网络）
$ docker run -d --name web1 nginx
$ docker run -d --name web2 nginx

# 两个容器可以在同一个网络中通信
$ docker exec web1 ping web2
```

### 2. Host网络

容器直接使用主机的网络栈，没有网络隔离。

**特点** ：

- 容器直接使用主机的IP地址
- 不需要端口映射
- 性能最好，但安全性较低

**示例** ：

```bash
$ docker run --network host nginx
# 容器中的80端口直接映射到主机的80端口
```

!!! warning "使用场景"
    只有在需要最大性能且可以接受较低隔离性的情况下才使用host网络。

### 3. None网络

容器没有网络连接，完全隔离。

**使用场景** ：

- 需要完全网络隔离的容器
- 仅需要本地文件系统访问的应用

**示例** ：

```bash
$ docker run --network none alpine
# 容器无法访问网络
```

## 创建自定义网络

### 创建bridge网络

```bash
$ docker network create mynetwork
```

### 创建带子网的网络

```bash
$ docker network create --subnet=172.20.0.0/16 mynetwork
```

### 使用自定义网络运行容器

```bash
# 创建网络
$ docker network create myapp-network

# 运行容器并连接到网络
$ docker run -d --name web --network myapp-network nginx
$ docker run -d --name db --network myapp-network postgres
```

### 在Docker Compose中使用网络

```yaml
version: '3.8'

services:
  web:
    image: nginx
    networks:
      - frontend
      - backend

  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

## 容器互联

### 使用--link连接容器（已弃用）

```bash
# 旧方法（不推荐）
$ docker run -d --name db postgres
$ docker run -d --name web --link db:database nginx
```

!!! note "注意"
    `--link`功能已被弃用，推荐使用自定义网络。

### 使用自定义网络连接容器（推荐）

```bash
# 创建网络
$ docker network create mynetwork

# 启动数据库
$ docker run -d --name db --network mynetwork postgres

# 启动Web应用，连接到同一网络
$ docker run -d --name web --network mynetwork nginx
```

在同一网络中的容器可以通过容器名称互相访问：

```bash
# 在web容器中连接db容器
$ docker exec web ping db
```

## 端口映射

### 基本端口映射

```bash
# 将容器的80端口映射到主机的8080端口
$ docker run -d -p 8080:80 nginx

# 访问 http://localhost:8080
```

### 指定绑定IP

```bash
# 只绑定到127.0.0.1
$ docker run -d -p 127.0.0.1:8080:80 nginx

# 绑定到特定IP
$ docker run -d -p 192.168.1.100:8080:80 nginx
```

### 随机端口映射

```bash
# Docker自动选择主机端口
$ docker run -d -P nginx

# 查看分配的端口
$ docker port <container_id>
```

### 映射多个端口

```bash
$ docker run -d -p 8080:80 -p 443:443 nginx
```

## 网络别名

为容器指定网络别名，方便其他容器访问：

```bash
# 创建网络
$ docker network create mynetwork

# 启动容器并指定别名
$ docker run -d --name db --network mynetwork --network-alias database postgres
$ docker run -d --name db2 --network mynetwork --network-alias database postgres

# 通过别名访问（可以使用负载均衡）
$ docker run -it --network mynetwork alpine ping database
```

## 网络隔离

不同网络中的容器默认无法通信：

```bash
# 创建两个网络
$ docker network create network1
$ docker network create network2

# 在不同网络中运行容器
$ docker run -d --name web1 --network network1 nginx
$ docker run -d --name web2 --network network2 nginx

# web1和web2无法直接通信
```

### 连接容器到多个网络

```bash
# 创建网络
$ docker network create network1
$ docker network create network2

# 启动容器
$ docker run -d --name web nginx

# 连接到多个网络
$ docker network connect network1 web
$ docker network connect network2 web
```

## 常见网络场景

### 场景1：Web应用 + 数据库

```bash
# 创建应用网络
$ docker network create app-network

# 启动数据库
$ docker run -d --name db \
  --network app-network \
  -e POSTGRES_PASSWORD=mypassword \
  postgres

# 启动Web应用
$ docker run -d --name web \
  --network app-network \
  -p 8080:80 \
  -e DATABASE_HOST=db \
  nginx
```

### 场景2：微服务架构

```bash
# 创建后端网络
$ docker network create backend

# 启动各个服务
$ docker run -d --name service1 --network backend myapp:service1
$ docker run -d --name service2 --network backend myapp:service2
$ docker run -d --name service3 --network backend myapp:service3

# 创建前端网络
$ docker network create frontend

# 启动前端服务（连接到后端网络）
$ docker run -d --name frontend \
  --network frontend \
  --network-alias backend backend \
  -p 80:80 \
  myapp:frontend
```

## 网络故障排查

### 查看容器网络配置

```bash
$ docker inspect <container_id> | grep -A 20 "NetworkSettings"
```

### 测试容器间的连通性

```bash
# 从一个容器ping另一个容器
$ docker exec container1 ping container2

# 检查DNS解析
$ docker exec container1 nslookup container2
```

### 查看网络流量

```bash
# 使用tcpdump捕获网络流量
$ docker exec container tcpdump -i eth0
```

## 最佳实践

1. **使用自定义网络** ：为不同的应用创建不同的网络，实现网络隔离
2. **避免使用--link** ：使用自定义网络代替已弃用的--link功能
3. **明确端口映射** ：在生产环境中明确指定端口映射，避免随机端口
4. **网络命名规范** ：使用有意义的网络名称，如`app-frontend`、`app-backend`
5. **最小权限原则** ：只给容器提供必要的网络访问权限

## 总结

Docker网络功能强大且灵活，通过合理使用网络功能，你可以：

- ✅ 实现容器间的安全通信
- ✅ 隔离不同应用的网络
- ✅ 灵活配置端口映射
- ✅ 构建复杂的微服务架构

掌握Docker网络后，构建和部署分布式应用将变得更加容易！
