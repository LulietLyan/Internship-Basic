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

# 🎼 Docker Compose 详解

Docker Compose是一个用于定义和运行多容器Docker应用程序的工具。它使用YAML文件来配置应用程序的服务、网络和卷，使得多容器应用的部署变得非常简单。

## 为什么需要Docker Compose？

在单个容器的情况下，使用`docker run`命令已经足够了。但是，当你的应用需要多个容器（例如Web服务器、数据库、缓存等）时，手动管理这些容器会变得非常繁琐：

- 需要记住每个容器的启动参数
- 需要手动处理容器之间的依赖关系
- 需要分别管理网络和数据卷
- 难以重现相同的环境

Docker Compose解决了这些问题，它允许你用一个YAML文件定义所有服务，然后通过简单的命令来启动和管理整个应用。

## 安装Docker Compose

Docker Compose通常已经包含在Docker Desktop中。如果没有，可以通过以下方式安装：

### Linux系统

```bash
# 下载最新版本的Docker Compose
$ sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
$ sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
$ docker-compose --version
```

## Docker Compose文件结构

Docker Compose文件通常命名为`docker-compose.yml`，基本结构如下：

```yaml
version: '3.8'

services:
  service1:
    # 服务1的配置
  service2:
    # 服务2的配置

volumes:
  # 数据卷定义

networks:
  # 网络定义
```

### 完整的示例

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
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

volumes:
  postgres-data:
  redis-data:
```

## 常用配置选项详解

### build - 构建镜像

使用本地Dockerfile构建镜像：

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_VERSION=1.0
```

### image - 使用已有镜像

直接使用Docker Hub或其他仓库的镜像：

```yaml
services:
  web:
    image: nginx:latest
```

### ports - 端口映射

将容器端口映射到主机：

```yaml
services:
  web:
    ports:
      - "8080:80"        # 主机:容器
      - "443:443"
      - "5000:5000"      # TCP（默认）
      - "127.0.0.1:8081:80"  # 绑定特定主机IP
```

### volumes - 数据卷

挂载数据卷或目录：

```yaml
services:
  web:
    volumes:
      # 挂载主机目录
      - ./app:/app
      # 使用命名卷
      - db-data:/var/lib/db
      # 只读挂载
      - ./config:/etc/config:ro
```

### environment - 环境变量

设置容器环境变量：

```yaml
services:
  web:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://localhost/db
    # 或者使用env_file
    env_file:
      - .env
```

### depends_on - 依赖关系

定义服务启动顺序：

```yaml
services:
  web:
    depends_on:
      - db
      - redis
  db:
    image: postgres
  redis:
    image: redis
```

!!! note "注意"
    `depends_on`只控制启动顺序，不等待服务完全就绪。如果需要等待服务可用，可以使用健康检查。

### networks - 网络配置

自定义网络：

```yaml
services:
  web:
    networks:
      - frontend
  db:
    networks:
      - backend

networks:
  frontend:
  backend:
```

### restart - 重启策略

定义容器重启策略：

```yaml
services:
  web:
    restart: always    # 总是重启
    # restart: unless-stopped  # 除非手动停止
    # restart: on-failure      # 失败时重启
    # restart: no              # 不重启
```

## 常用命令

### 启动服务

```bash
# 启动所有服务（前台运行）
$ docker-compose up

# 后台启动所有服务
$ docker-compose up -d

# 只启动特定服务
$ docker-compose up web db
```

### 停止服务

```bash
# 停止所有服务
$ docker-compose stop

# 停止并删除容器
$ docker-compose down

# 停止并删除容器、网络、数据卷
$ docker-compose down -v
```

### 构建镜像

```bash
# 构建所有服务的镜像
$ docker-compose build

# 强制重新构建（不使用缓存）
$ docker-compose build --no-cache

# 构建特定服务
$ docker-compose build web
```

### 查看日志

```bash
# 查看所有服务的日志
$ docker-compose logs

# 实时跟踪日志
$ docker-compose logs -f

# 查看特定服务的日志
$ docker-compose logs web

# 查看最后100行
$ docker-compose logs --tail=100
```

### 执行命令

```bash
# 在运行中的容器执行命令
$ docker-compose exec web ls

# 进入容器的交互式shell
$ docker-compose exec web /bin/bash
```

### 查看服务状态

```bash
# 列出所有服务
$ docker-compose ps

# 查看配置
$ docker-compose config
```

## 实战案例：LAMP Stack

让我们创建一个完整的LAMP（Linux + Apache + MySQL + PHP）堆栈：

```yaml
version: '3.8'

services:
  web:
    image: php:8.1-apache
    ports:
      - "8080:80"
    volumes:
      - ./www:/var/www/html
    depends_on:
      - db
    environment:
      - MYSQL_HOST=db
      - MYSQL_DATABASE=testdb
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=testdb
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - "8081:80"
    environment:
      - PMA_HOST=db
      - PMA_USER=root
      - PMA_PASSWORD=rootpassword
    depends_on:
      - db

volumes:
  mysql-data:
```

启动整个栈：

```bash
$ docker-compose up -d
```

现在你可以：
- 访问 `http://localhost:8080` 查看你的PHP应用
- 访问 `http://localhost:8081` 使用phpMyAdmin管理数据库
- 通过端口3306连接MySQL数据库

## 健康检查

为服务添加健康检查：

```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 扩展服务

使用`docker-compose scale`可以扩展服务实例数量：

```bash
# 运行3个web服务实例
$ docker-compose up -d --scale web=3
```

## 环境变量文件

创建`.env`文件来管理环境变量：

```bash
# .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydb
```

在`docker-compose.yml`中使用：

```yaml
services:
  db:
    image: postgres
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

## 多环境配置

可以为不同环境创建不同的配置文件：

```bash
# docker-compose.dev.yml
version: '3.8'
services:
  web:
    build: .
    volumes:
      - .:/app  # 开发时挂载代码目录
```

```bash
# docker-compose.prod.yml
version: '3.8'
services:
  web:
    image: myapp:latest
    # 生产环境不挂载代码目录
```

使用不同的配置文件：

```bash
# 开发环境
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 生产环境
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 最佳实践

1. **使用版本控制**：将`docker-compose.yml`文件纳入Git版本控制
2. **使用`.env`文件**：不要将敏感信息硬编码在YAML文件中
3. **使用命名卷**：对于需要持久化的数据，使用命名卷而不是绑定挂载
4. **设置资源限制**：在生产环境中设置CPU和内存限制
5. **使用健康检查**：确保服务正常启动后再依赖它
6. **清理未使用的资源**：定期运行`docker-compose down -v`清理资源

## 总结

Docker Compose让多容器应用的部署变得简单直观。通过一个YAML文件，你可以：

- ✅ 定义所有服务和它们的配置
- ✅ 管理服务之间的依赖关系
- ✅ 统一管理网络和数据卷
- ✅ 轻松扩展和维护应用

掌握Docker Compose后，部署复杂的多容器应用将变得轻而易举！
