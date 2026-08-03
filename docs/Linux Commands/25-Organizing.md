---
statistics: true
comments: true
---

<style>
body { position: relative; }
body::before {
  --size: 35px;
  --line: color-mix(in hsl, canvasText, transparent 60%);
  content: '';
  height: 100vh; width: 100%; position: absolute;
  background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
  mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0; pointer-events: none; z-index: -1;
}
@media (max-width: 768px) { body::before { display: none; } }
</style>

# 第 25 章 井井有条

> 用 Git 管理脚本版本，保持可维护与可协作。

## 25.1 Git 核心概念

| 区域 | 说明 |
|------|------|
| **工作目录** | 直接编辑的文件 |
| **暂存区** | `git add` 后待提交快照 |
| **本地仓库** | `.git` 中的提交历史 |
| **远程仓库** | GitHub/GitLab 等 |

## 25.2 常用命令

```bash
git init
git clone url
git status
git add file / git add .
git commit -m "msg"
git log --oneline
git diff
git branch / git switch branch
git merge branch
git pull / git push
```

## 25.3 脚本项目实践

**`.gitignore` 示例** ：

```gitignore
*.log
.env
.venv/
__pycache__/
*.bak
```

- 一功能一分支；合并前 **`shellcheck`** + **`bash -n`**
- 用 **tag** 标记发布：`git tag -a v1.0 -m "release"`
- 敏感配置用 **环境变量** 或密钥管理，勿入库

## 25.4 常用工作流

```bash
git checkout -b feat/deploy-script
git add scripts/
git commit -m "add backup cron script"
git push -u origin feat/deploy-script
# PR → review → merge main
git pull --rebase origin main
```
