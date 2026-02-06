#!/usr/bin/env bash
# 一键启动 MkDocs 本地调试：自动切 main、创建环境、安装依赖、启动服务
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "========== 一键启动 MkDocs 本地调试 =========="

# 若当前在 gh-pages，切换到 main（源码在 main 分支）
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)
if [ "$BRANCH" = "gh-pages" ]; then
  echo "[1/4] 当前在 gh-pages 分支，正在切换到 main 分支..."
  git checkout main
else
  echo "[1/4] 当前分支: $BRANCH"
fi

# 检查 mkdocs 源码
if [ ! -f mkdocs.yml ]; then
  echo "错误：未找到 mkdocs.yml，请确保在项目根目录且 main 分支已拉取。"
  exit 1
fi

# 使用 base conda 环境
ENV_NAME="base"
echo "[2/4] 使用 conda 环境: ${ENV_NAME}"

# 安装依赖
if [ ! -f requirements-mkdocs.txt ]; then
  echo "错误：未找到 requirements-mkdocs.txt。"
  exit 1
fi
echo "[3/4] 正在安装 MkDocs 依赖..."
conda run -n "$ENV_NAME" pip install -q -r requirements-mkdocs.txt

# 启动服务
echo "[4/4] 启动 MkDocs 本地服务..."
echo ""
echo "  请在浏览器打开: http://0.0.0.0:8000"
echo "  按 Ctrl+C 停止服务"
echo ""

# 监听 0.0.0.0 以便同一路由器下其他设备可访问
exec conda run -n "$ENV_NAME" mkdocs serve -a 0.0.0.0:8000
