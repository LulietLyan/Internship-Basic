#!/usr/bin/env bash
# 一键启动 MkDocs 本地调试：自动切 main、创建环境、安装依赖，在 tmux 会话 mkdocs 中启动服务
# 若不存在 mkdocs 会话则创建；若已存在则提示附加或先执行结束脚本
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "========== 一键启动 MkDocs 本地调试（tmux 会话 mkdocs）=========="

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

# 在 tmux 会话 mkdocs 中启动服务
SESSION="mkdocs"
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "[4/4] tmux 会话 \"$SESSION\" 已存在，不重复启动。"
  echo "  附加查看: tmux attach -t $SESSION"
  echo "  结束会话请运行: ./stop-mkdocs.sh"
  exit 0
fi

echo "[4/4] 创建 tmux 会话 \"$SESSION\" 并启动 MkDocs..."
tmux new-session -d -s "$SESSION" -c "$ROOT"
# 在会话中执行：激活 conda 并启动 mkdocs（单条命令避免交互）
tmux send-keys -t "$SESSION" "conda run -n $ENV_NAME mkdocs serve -a 0.0.0.0:8000" Enter

echo ""
echo "  请在浏览器打开: http://0.0.0.0:8000"
echo "  附加到会话: tmux attach -t $SESSION"
echo "  结束会话: ./stop-mkdocs.sh"
echo ""
