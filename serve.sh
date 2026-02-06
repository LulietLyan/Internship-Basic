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

# 创建 conda 环境（若不存在）
ENV_NAME="mkdocs"
if ! conda env list | grep -q "^${ENV_NAME} "; then
  echo "[2/4] 正在创建 conda 环境: ${ENV_NAME} (Python 3.11)..."
  if ! conda create -n "$ENV_NAME" python=3.11 -y; then
    echo ""
    echo "  ⚠ 自动创建 conda 环境失败。若为权限问题，请在本机终端中先执行："
    echo "     conda create -n mkdocs python=3.11 -y"
    echo "  然后重新运行: ./serve.sh"
    echo ""
    exit 1
  fi
else
  echo "[2/4] 使用已有 conda 环境: ${ENV_NAME}"
fi

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
echo "  请在浏览器打开: http://127.0.0.1:8000"
echo "  按 Ctrl+C 停止服务"
echo ""

exec conda run -n "$ENV_NAME" mkdocs serve
