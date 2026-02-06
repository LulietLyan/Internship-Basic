#!/usr/bin/env bash
# 结束 tmux 会话 mkdocs：存在则结束，不存在则忽略
set -e

SESSION="mkdocs"
if tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux kill-session -t "$SESSION"
  echo "已结束 tmux 会话: $SESSION"
else
  echo "未发现 tmux 会话 \"$SESSION\"，无需操作。"
fi
