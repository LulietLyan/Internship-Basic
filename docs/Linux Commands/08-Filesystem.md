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

# 第 8 章 管理文件系统

> 分区、格式化、挂载与 LVM 逻辑卷。

## 8.1 文件系统类型

| 类型 | 特点 |
|------|------|
| ext2 | 无日志 |
| ext3/ext4 | 日志，ext4 默认广泛 |
| xfs | 高性能 64 位日志 |
| btrfs | 快照、压缩、子卷 |
| swap | 交换分区/文件 |

## 8.2 分区与格式化

```bash
sudo fdisk /dev/sda       # MBR 分区（≤2TB）
sudo gdisk /dev/sda       # GPT 分区
sudo parted /dev/sda      # 支持 GPT，脚本友好

sudo mkfs.ext4 /dev/sdb1  # 创建 ext4
sudo mkfs.xfs /dev/sdb1
sudo mkswap /dev/sdb2
sudo swapon /dev/sdb2     # 启用 swap
```

## 8.3 检查与修复

```bash
sudo fsck /dev/sdb1       # 卸载后检查
sudo fsck -a /dev/sdb1    # 自动修复
sudo tune2fs -l /dev/sdb1 # ext 超级块信息
```

## 8.4 LVM 逻辑卷

层次： **PV（物理卷）→ VG（卷组）→ LV（逻辑卷）**

```bash
# 创建
sudo pvcreate /dev/sdb1 /dev/sdc1
sudo vgcreate myvg /dev/sdb1 /dev/sdc1
sudo lvcreate -L 10G -n mylv myvg
sudo mkfs.ext4 /dev/myvg/mylv
sudo mount /dev/myvg/mylv /mnt

# 扩展
sudo lvextend -L +5G /dev/myvg/mylv
sudo resize2fs /dev/myvg/mylv    # ext4 扩文件系统
# xfs: xfs_growfs /mount/point

# 查看
pvs / vgs / lvs
```

## 8.5 /proc 与块设备（开发排查）

```bash
lsblk                     # 树形块设备
blkid                     # UUID / 文件系统类型
cat /proc/cpuinfo
cat /proc/meminfo
cat /proc/loadavg
echo 3 | sudo tee /proc/sys/vm/drop_caches   # 清 page cache（慎用，仅测试）
```

**bind 挂载** ：同一目录挂到另一路径

```bash
sudo mount --bind /source /target
```
