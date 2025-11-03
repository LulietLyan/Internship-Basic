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

# 📦 Docker 镜像仓库

Docker镜像仓库（Registry）是存储和分发Docker镜像的地方。理解镜像仓库的使用对于高效管理Docker镜像至关重要。

## Docker Hub

Docker Hub是Docker官方的公共镜像仓库，提供了大量的公共镜像。

### 注册账户

1. 访问 [https://hub.docker.com](https://hub.docker.com)
2. 注册一个免费账户
3. 验证邮箱

### 登录Docker Hub

```bash
$ docker login
Username: yourusername
Password: yourpassword
```

### 搜索镜像

```bash
# 在命令行搜索镜像
$ docker search nginx

# 或访问Docker Hub网站搜索
# https://hub.docker.com
```

### 拉取镜像

```bash
# 拉取官方镜像
$ docker pull nginx

# 拉取特定标签
$ docker pull nginx:1.21

# 拉取用户镜像
$ docker pull username/myimage:tag
```

### 推送镜像

```bash
# 1. 为镜像打标签（格式：用户名/镜像名:标签）
$ docker tag myimage:latest username/myimage:1.0

# 2. 推送镜像
$ docker push username/myimage:1.0
```

!!! tip "镜像命名规则"
    - 官方镜像：`nginx`、`redis`、`postgres`等
    - 用户镜像：`username/imagename:tag`
    - 私有仓库：`registry.example.com/imagename:tag`

### 镜像命名空间

Docker镜像属于三种命名空间之一：

1. **根命名空间（官方镜像）**
   - 例如：`nginx`、`redis`、`postgres`
   - 由Docker公司控制
   - 通常由软件供应商维护

2. **用户命名空间**
   - 例如：`username/myimage`
   - 任何用户都可以上传
   - 需要指定用户名

3. **第三方仓库**
   - 例如：`registry.example.com/myimage`
   - 自定义私有或公共仓库

## 镜像标签管理

### 什么是标签？

标签是镜像的版本标识符。如果不指定标签，Docker默认使用`latest`标签。

```bash
# latest标签（默认）
$ docker pull nginx
$ docker pull nginx:latest

# 特定版本标签
$ docker pull nginx:1.21
$ docker pull nginx:1.21-alpine
```

### 创建标签

```bash
# 为镜像创建新标签
$ docker tag myimage:latest myimage:1.0
$ docker tag myimage:latest username/myimage:1.0
```

### 删除标签

```bash
# 删除本地标签（镜像仍在）
$ docker rmi myimage:1.0

# 删除镜像（如果只有一个标签）
$ docker rmi myimage
```

!!! warning "latest标签的陷阱"
    不要过分依赖`latest`标签：
    - `latest`标签不保证是最新版本
    - 不同时间拉取的`latest`可能不同
    - 生产环境应使用具体的版本标签

## 镜像分发

### 方法1：通过Docker Hub分发

```bash
# 1. 登录
$ docker login

# 2. 打标签
$ docker tag myapp:latest username/myapp:1.0

# 3. 推送
$ docker push username/myapp:1.0

# 其他人可以拉取
$ docker pull username/myapp:1.0
```

### 方法2：导出和导入镜像

```bash
# 导出镜像为tar文件
$ docker save -o myimage.tar myimage:1.0

# 导入镜像
$ docker load -i myimage.tar
```

### 方法3：使用私有仓库

#### 运行本地仓库

```bash
# 启动Docker Registry
$ docker run -d -p 5000:5000 --name registry registry:2

# 标记镜像
$ docker tag myimage:latest localhost:5000/myimage:1.0

# 推送到本地仓库
$ docker push localhost:5000/myimage:1.0

# 从本地仓库拉取
$ docker pull localhost:5000/myimage:1.0
```

#### 配置Docker使用私有仓库

如果私有仓库使用HTTPS，需要配置Docker信任证书：

```bash
# 在 /etc/docker/daemon.json 中添加
{
  "insecure-registries": ["registry.example.com:5000"]
}

# 重启Docker服务
$ sudo systemctl restart docker
```

!!! warning "安全提示"
    使用`insecure-registries`只适合内网环境。生产环境应使用有效的TLS证书。

## 镜像管理命令

### 查看本地镜像

```bash
# 列出所有镜像
$ docker images

# 列出特定仓库的镜像
$ docker images nginx

# 显示镜像详细信息
$ docker inspect myimage:1.0
```

### 删除镜像

```bash
# 删除单个镜像
$ docker rmi myimage:1.0

# 强制删除（即使有容器在使用）
$ docker rmi -f myimage:1.0

# 删除所有未使用的镜像
$ docker image prune -a
```

### 镜像历史

```bash
# 查看镜像的构建历史
$ docker history myimage:1.0
```

### 镜像大小优化

```bash
# 查看镜像大小
$ docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# 使用dive工具分析镜像层
# https://github.com/wagoodman/dive
$ dive myimage:1.0
```

## Docker Hub自动构建

Docker Hub可以与GitHub或Bitbucket集成，实现自动构建。

### 配置自动构建

1. 在Docker Hub创建自动构建
2. 连接到GitHub/Bitbucket仓库
3. 配置构建规则
4. 推送到Git仓库时自动触发构建

**优势：**
- 自动化构建流程
- 每次代码更新自动构建新镜像
- 版本管理更清晰

## 私有仓库

### 为什么需要私有仓库？

- 存储商业机密镜像
- 符合企业安全要求
- 加快内网镜像拉取速度
- 更好地控制镜像访问

### 运行私有仓库

#### 使用Docker Registry官方镜像

```bash
# 运行私有仓库
$ docker run -d -p 5000:5000 \
  --name registry \
  -v registry-data:/var/lib/registry \
  registry:2

# 使用私有仓库
$ docker tag myimage:latest localhost:5000/myimage:1.0
$ docker push localhost:5000/myimage:1.0
```

#### 配置认证

私有仓库通常需要身份验证。可以使用nginx作为反向代理实现认证：

```bash
# 创建认证文件
$ htpasswd -Bbn username password > auth/htpasswd

# 运行带认证的仓库
$ docker run -d -p 5000:5000 \
  -v $(pwd)/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  registry:2
```

## 镜像清理

### 清理未使用的镜像

```bash
# 删除未使用的镜像
$ docker image prune

# 删除所有未使用的镜像（包括有标签的）
$ docker image prune -a

# 删除未使用的容器、网络、镜像和数据卷
$ docker system prune -a --volumes
```

!!! warning "谨慎操作"
    `docker system prune -a`会删除所有未使用的资源，确保你不再需要它们。

## 镜像版本管理

### 语义化版本

使用语义化版本控制（Semantic Versioning）：

- `1.0.0`：主版本号.次版本号.修订号
- `1.0.0-alpha`：预发布版本
- `1.0.0-beta`：测试版本
- `latest`：最新稳定版

### 版本标签策略

```bash
# 主要版本
$ docker tag myapp:latest myapp:1

# 次要版本
$ docker tag myapp:latest myapp:1.0

# 修订版本
$ docker tag myapp:latest myapp:1.0.0

# Git commit hash
$ docker tag myapp:latest myapp:$(git rev-parse --short HEAD)
```

## 镜像安全

### 扫描镜像漏洞

```bash
# 使用Docker Scan（需要登录Docker Hub）
$ docker scan myimage:1.0

# 使用其他工具
# - Trivy
# - Clair
# - Anchore
```

### 使用官方镜像

优先使用官方维护的镜像，它们：
- 定期更新安全补丁
- 经过安全扫描
- 有明确的安全策略

### 验证镜像完整性

```bash
# 使用镜像摘要拉取
$ docker pull nginx@sha256:abc123...
```

## 最佳实践

1. **使用特定版本标签**：避免在生产环境使用`latest`
2. **定期更新镜像**：及时应用安全补丁
3. **扫描镜像漏洞**：使用工具检测已知漏洞
4. **使用私有仓库**：存储敏感镜像
5. **版本管理**：使用语义化版本控制
6. **清理未使用镜像**：定期清理节省存储空间

## 总结

掌握镜像仓库的使用可以帮助你：

- ✅ 高效管理Docker镜像
- ✅ 安全地分发和共享镜像
- ✅ 建立自动化构建流程
- ✅ 优化镜像存储和管理

合理使用镜像仓库，可以让Docker应用的开发和部署更加顺畅！
