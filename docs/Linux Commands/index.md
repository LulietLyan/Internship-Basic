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

# 🐧 Linux 命令行与 Shell 脚本

> 基于《Linux 命令行与 Shell 脚本编程大全（第 4 版）》提炼的 **速查复习笔记**，非逐字翻译。

## 四部分结构

| 部分 | 章节 | 主题 |
|------|------|------|
| 一 | 1–10 | Linux 命令行 |
| 二 | 11–16 | Shell 脚本基础 |
| 三 | 17–23 | 高级脚本 |
| 四 | 24–25 | 实用工具与 Git |

## 章节索引

- [第 1 章 初识 Linux Shell](./01-Intro.md)
- [第 2 章 走进 Shell](./02-Shell-Access.md)
- [第 3 章 Bash 基础命令](./03-Basic-Commands.md)
- [第 4 章 更多 Bash 命令与监控](./04-More-Commands.md)
- [第 5 章 理解 Shell](./05-Understanding-Shell.md)
- [第 6 章 Linux 环境变量](./06-Environment-Variables.md)
- [第 7 章 Linux 文件权限](./07-File-Permissions.md)
- [第 8 章 管理文件系统](./08-Filesystem.md)
- [第 9 章 安装软件](./09-Software-Install.md)
- [第 10 章 文本编辑器](./10-Text-Editors.md)
- [第 11 章 构建基础脚本](./11-Basic-Scripts.md)
- [第 12 章 结构化命令](./12-Structured-Commands.md)
- [第 13 章 更多结构化命令](./13-More-Structured-Commands.md)
- [第 14 章 处理用户输入](./14-User-Input.md)
- [第 15 章 呈现数据](./15-Present-Data.md)
- [第 16 章 脚本控制](./16-Script-Control.md)
- [第 17 章 创建函数](./17-Functions.md)
- [第 18 章 图形化环境脚本编程](./18-GUI-Scripting.md)
- [第 19 章 初识 sed 和 gawk](./19-Sed-Gawk.md)
- [第 20 章 正则表达式](./20-Regex.md)
- [第 21 章 sed 进阶](./21-Sed-Advanced.md)
- [第 22 章 gawk 进阶](./22-Gawk-Advanced.md)
- [第 23 章 使用其他 Shell](./23-Other-Shells.md)
- [第 24 章 编写脚本实用工具](./24-Script-Utilities.md)
- [第 25 章 井井有条](./25-Organizing.md)
