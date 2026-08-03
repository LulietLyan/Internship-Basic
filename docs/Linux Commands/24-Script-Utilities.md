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

# 第 24 章 编写脚本实用工具

> 备份、用户管理、系统审计三类典型运维脚本模式。

## 24.1 备份归档

```bash
# 按日期命名 tar 归档
backup_dir=/backup
source_dir=/home/user/data
date=$(date +%Y%m%d)
tar -zcf "$backup_dir/data-$date.tar.gz" "$source_dir"

# find 删旧备份（>7 天）
find $backup_dir -name "*.tar.gz" -mtime +7 -delete
```

**要点** ：`mktemp` 安全临时目录；`tar -zcf` 一条命令归档；cron 定时。

## 24.2 批量用户

```bash
while IFS=',' read -r user pass; do
  useradd -m "$user"
  echo "$user:$pass" | chpasswd
done < users.csv
```

或 `newusers batchfile`（格式：`user:pass:uid:gid:gecos:home:shell`）。

## 24.3 系统审计

**登录 Shell 审计** （/etc/passwd 第 7 字段）：

```bash
awk -F: '$7 !~ /(bash|false|nologin)$/ {print $1, $7}' /etc/passwd
```

**SUID/SGID 文件** ：

```bash
sudo find / -perm /6000 -type f 2>/dev/null
```

**报告对比** ：按时间戳保存报告，`diff old new` 或 `comm` 比较差异。

## 24.4 健康检查与部署片段

```bash
#!/usr/bin/env bash
set -euo pipefail
URL=${1:-http://127.0.0.1:8080/health}
curl -sf "$URL" || { echo "health fail"; exit 1; }

# 零停机思路：新版本起在不同端口 → 健康检查 → 切 nginx upstream
pgrep -f 'myapp.jar' && kill -HUP $(pgrep -f 'myapp.jar')   # 示例：发 HUP 重载
```

## 24.5 脚本质量

```bash
shellcheck deploy.sh              # 静态检查
bash -n script.sh                 # 语法检查不执行
```
