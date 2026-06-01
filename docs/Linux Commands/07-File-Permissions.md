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

# 第 7 章 Linux 文件权限

> 用户/组/权限三元组；/etc/passwd 与 /etc/shadow 管理账户。

## 7.1 用户管理

**`/etc/passwd`**（7 字段，冒号分隔）：

`用户名:密码占位:UID:GID:描述:主目录:Shell`

**`/etc/shadow`**：加密密码、过期策略（仅 root 可读）。

```bash
useradd -m user          # -m 创建主目录
useradd -D                # 查看/改默认（-s 改默认 Shell）
userdel -r user           # -r 删主目录
usermod -L user           # 锁定
passwd user
chpasswd < users.txt      # 批量改密
chsh -s /bin/zsh user     # 改 Shell
chfn user                 # 改全名/办公室等
finger user               # 查看用户信息
```

## 7.2 组

**`/etc/group`**：`组名:密码占位:GID:成员列表`

```bash
groupadd shared
groupmod -n newname oldname
usermod -G shared user    # 附加组（-aG 追加不覆盖）
gpasswd -d user group     # 从组移除
```

## 7.3 权限符号

`ls -l` 输出 10 位：

```
-rwxr-xr--  1 owner group  size date name
│└u─┘└g─┘└o┘
│ 421 421 420（r=4,w=2,x=1）
```

| 类型 | 含义 |
|------|------|
| `-` | 文件 |
| `d` | 目录 |
| `l` | 链接 |

**默认权限**：`umask` 掩码与 666/777 相与；`umask 022` → 文件 644、目录 755。

**特殊权限位（八进制前缀）**：

| 位 | 文件 | 目录 |
|----|------|------|
| **setuid (4)** | 执行时以属主身份 | — |
| **setgid (2)** | 执行时以属组身份 | 新建文件继承组 |
| **sticky (1)** | — | 仅属主可删自己的文件（如 `/tmp`） |

示例：`chmod 4755 bin`、`chmod 1777 /tmp`。

**开发者常见权限**：

| 场景 | 建议 |
|------|------|
| Shell 脚本 | `755`（可执行） |
| 私钥 `~/.ssh/id_rsa` | `600` |
| `.env` 配置 | `600`，勿提交 Git |
| 共享项目目录 | 组 + `2775`（setgid 目录） |

## 7.4 修改权限与属主

```bash
chmod u+x file            # 用户加执行
chmod g-w,o-r file
chmod 754 file            # 八进制
chmod -R 755 dir/         # 递归

chown user file
chown user:group file
chown :group file
chgrp group file
```

## 7.5 共享与 ACL

**SGID 目录**：新建文件继承目录组（`chmod g+s dir`）。

**ACL**（细粒度权限）：

```bash
getfacl file
setfacl -m u:user:rwx file
setfacl -m g:group:rx file
setfacl -x u:user file     # 删除 ACL 项
```

## 7.6 sudo 与当前用户

```bash
sudo cmd                  # 以 root 执行
sudo -u www-data cmd      # 指定用户
sudo -i                   # root 登录 Shell
groups                    # 当前用户所属组
id                        # uid/gid/组列表
```
