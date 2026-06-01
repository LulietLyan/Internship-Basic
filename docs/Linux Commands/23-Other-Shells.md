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

# 第 23 章 使用其他 Shell

> dash 轻量兼容 sh；zsh 功能丰富。

## 23.1 dash

- Debian/Ubuntu 中 **`/bin/sh` → dash**（POSIX，比 bash 快）
- 脚本首行 `#!/bin/sh` 应避免 bash 专有语法

## 23.2 zsh

- 关联数组、浮点运算、主题提示符
- **Oh My Zsh** 插件生态
- 兼容 bash 模式：`emulate bash`

```bash
chsh -s $(which zsh)
```

## 23.3 选型建议

| Shell | 场景 |
|-------|------|
| bash | 默认、脚本通用 |
| sh/dash | 最小依赖、启动脚本 |
| zsh | 交互体验、复杂补全 |

## 23.4 zsh 实用配置（Oh My Zsh）

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 插件：git docker kubectl zsh-autosuggestions zsh-syntax-highlighting
```

**bash 脚本兼容**：Shebang 仍用 `#!/usr/bin/env bash`；交互 Shell 可换 zsh。
