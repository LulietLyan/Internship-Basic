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

# 第 18 章 图形化环境脚本编程

> 文本菜单、dialog/zenity/kdialog 做简单 GUI。

## 18.1 文本菜单

```bash
clear
cat << EOF
1. Option A
2. Option B
Q. Quit
EOF
read -p "Choice: " choice
case $choice in 1) ... ;; esac
```

**select**（bash 内置）：

```bash
select item in A B Quit; do
  [ "$item" = Quit ] && break
  echo "Picked $item"
done
```

## 18.2 dialog

```bash
dialog --msgbox "text" 10 30
dialog --yesno "Confirm?" 7 40
dialog --inputbox "Name:" 8 40 2>out
dialog --menu "Pick:" 15 40 4 1 A 2 B 3 C
dialog --textbox file 20 60
```

## 18.3 zenity（GNOME）/ kdialog（KDE）

```bash
zenity --info --text="Done"
zenity --question --text="Sure?"
zenity --entry --text="Name:"
zenity --file-selection

kdialog --msgbox "text"
kdialog --inputbox "Name:" "default"
```

适合在桌面 cron 或脚本结束时弹窗通知。
