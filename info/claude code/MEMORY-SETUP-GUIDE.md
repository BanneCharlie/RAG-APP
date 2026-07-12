# Junction + Watchdog 记忆统一方案 · 执行文档

## 目录

1. [方案概述](#1-方案概述)
2. [目录结构总览](#2-目录结构总览)
3. [文件功能参考](#3-文件功能参考)
4. [执行步骤](#4-执行步骤)
5. [核心概念详解](#5-核心概念详解)
6. [Watchdog 自动化部署](#6-watchdog-自动化部署)
7. [验证与排错](#7-验证与排错)
8. [常见问题 FAQ](#8-常见问题-faq)

---

## 1. 方案概述

### 1.1 解决了什么问题

Claude 按 `projects/<项目名>/memory/` 自动为每个项目生成独立的记忆目录。同时打开多个项目时，记忆彼此隔离：

```
projects\ProjectA\memory\   ← 存 A 的记忆（不知道你在 B 的偏好）
projects\ProjectB\memory\   ← 存 B 的记忆（不知道你在 A 的反馈）
```

你在项目 A 告诉 Claude "我喜欢构造器注入"，到项目 B 还要再说一遍。

### 1.2 方案目标

通过 **Junction（NTFS 目录链接）**，将所有项目的 `memory/shared/` 透明地重定向到一个中央知识库，同时保留 `memory/project/` 存放该项目独有的记忆：

```
memory\
├── shared\   ← Junction，指向中央知识库（跨项目共享）
├── project\  ← 真实目录，仅本项目可见
└── MEMORY.md ← 索引，分公共区 + 项目区两段
```

### 1.3 分层记忆策略

| 记忆类型 | 存放位置 | 示例 | 共享范围 |
|---------|---------|------|---------|
| **个人偏好** | `shared/` | 代码风格、协作习惯、技术栈偏好 | 所有项目共享 |
| **通用反馈** | `shared/` | "不要用 @Autowired"、"Javadoc 要有" | 所有项目共享 |
| **项目架构** | `project/` | 模块结构、业务规则、实体关系 | 仅本项目 |
| **项目约定** | `project/` | 分支策略、部署流程、API 规范 | 仅本项目 |

---

## 2. 目录结构总览

```
C:\Users\banne\.claude\                                ← Claude 根目录
│
├── banne-claude-brain\                               ← 中央知识库（大脑）
│   └── memory\
│       └── shared\                                    ← 共享记忆目录
│           ├── user.md                                ← 用户档案
│           └── feedback.md                            ← 工作偏好
│
├── projects\                                          ← 各项目记忆（自动生成）
│   └── e--AI-Project\                                 ← 某一项目
│       └── memory\
│           ├── shared\  [JUNCTION]                    ← 链接→ banne-claude-brain\memory\shared\
│           ├── project\  [REAL DIR]                   ← 本项目特有记忆
│           │   ├── architecture.md
│           │   └── ...
│           └── MEMORY.md                              ← 分层索引文件
│
├── scripts\                                           ← 管理脚本
│   ├── setup-junction.ps1                             ← 一键创建链接
│   ├── watchdog.ps1                                   ← 自动监视器
│   ├── watchdog.bat                                   ← 崩溃重启层
│   └── watchdog.vbs                                   ← 隐藏窗口启动层
└── scheduled_tasks.json                               ← Claude 定时任务
```

---

## 3. 文件功能参考

### 3.1 中央记忆文件（`banne-claude-brain\memory\shared\`）

| 文件 | 功能 | 维护方式 |
|------|------|---------|
| `user.md` | 用户角色、技术栈偏好、资历 | 创建后按需更新 |
| `feedback.md` | 通用工作偏好、代码风格约定 | 随反馈积累追加 |

### 3.2 项目记忆文件（`memory\project\`）

| 文件 | 功能 | 维护方式 |
|------|------|---------|
| `architecture.md` | 本项目架构约束、技术选型 | 项目初始化时创建 |

### 3.3 管理脚本（`scripts\`）

| 文件 | 功能 | 运行方式 |
|------|------|---------|
| `setup-junction.ps1` | 为指定项目创建 `shared/` Junction | 手动，管理员权限 |
| `watchdog.ps1` | 监听 `projects\` 新目录，自动建 Junction | 后台服务 |
| `watchdog.bat` | 包裹 watchdog.ps1，崩溃时自动重启 | 由 VBS 启动 |
| `watchdog.vbs` | 隐藏窗口启动 BAT，避免黑窗口闪烁 | 计划任务触发 |

### 3.4 索引文件

| 文件 | 功能 |
|------|------|
| `MEMORY.md` | 记忆索引，每次 Claude 启动时载入上下文。分两段：公共区和项目区 |

---

## 4. 执行步骤

### 4.1 前提条件

- Windows 10/11（NTFS 文件系统）
- 管理员权限（创建 Junction 需要）
- Claude Code 已安装且使用过（`memory/` 目录已自动生成）

### 4.2 创建中央知识库

```powershell
# 以管理员身份打开 PowerShell

# 创建中央知识库目录
mkdir "C:\Users\banne\.claude\banne-claude-brain\memory\shared" -Force
```

### 4.3 创建项目记忆目录

```powershell
# 进入项目记忆目录
cd "C:\Users\banne\.claude\projects\e--AI-Project\memory"

# 创建项目特有记忆目录
mkdir project -Force
```

### 4.4 创建 Junction（关键步骤）

```powershell
# 如果 shared 已存在，先删除（确认无重要内容后）
# 注意：如果是真实目录，需要加 -Recurse
if (Test-Path "shared") {
    Remove-Item "shared" -Recurse -Force
}

# 创建 Junction 链接
New-Item -Path "shared" -ItemType Junction -Target "C:\Users\banne\.claude\banne-claude-brain\memory\shared" -Force
```

### 4.5 验证链接是否成功

```powershell
# 查看目录列表，确认 shared 显示为 Junction
Get-ChildItem "C:\Users\banne\.claude\projects\e--AI-Project\memory\" | Select-Object Name, @{
    N="Type";E={
        if ($_.LinkType) { "Junction→$($_.Target)" }
        else { "Directory" }
    }
}
```

**期望输出：**
```
Name     Type
----     ----
project  Directory
shared   Junction→C:\Users\banne\.claude\banne-claude-brain\memory\shared
```

### 4.6 写入测试文件验证

```powershell
# 从项目侧写文件
"test" | Out-File -FilePath "C:\Users\banne\.claude\projects\e--AI-Project\memory\shared\test.txt"

# 从中央侧验证文件存在
Test-Path "C:\Users\banne\.claude\banne-claude-brain\memory\shared\test.txt"
# 应返回 True

# 清理测试文件
Remove-Item "C:\Users\banne\.claude\banne-claude-brain\memory\shared\test.txt"
```

### 4.7 创建 MEMORY.md 索引

在 `memory\MEMORY.md` 中写入以下内容：

```markdown
# Shared Knowledge — 公共区（跨项目共享）
- [用户档案](shared/user.md) — 角色、技术栈偏好
- [工作偏好](shared/feedback.md) — 代码风格、协作约定

# Project Knowledge — 项目区（本项目特有）
- [项目架构](project/architecture.md) — 本项目架构约束与技术栈
```

### 4.8 为新项目创建记忆链接（重复步骤 4.2–4.7）

> 新增项目后，只需重复 4.3、4.4、4.7 三步即可。

---

## 5. 核心概念详解

### 5.1 什么是 Junction？

**Junction**（目录链接）是 Windows NTFS 文件系统的一种**重解析点（Reparse Point）**。

```
┌─ 应用程序 ─┐        ┌─ 文件系统 ─┐        ┌─ 磁盘 ─┐
│ 读写 shared\ │ ───→ │ Junction 截获 │ ───→ │ 重定向到 │
│              │      │ 并透明转发      │      │ 中央目录  │
└──────────────┘      └──────────────┘      └──────────┘
```

**关键特性：**

| 特性 | 说明 |
|------|------|
| **透明性** | 应用程序完全感知不到重定向，Claude 以为在读写本地 `shared/` |
| **零占用** | Junction 本身不占磁盘空间（小于 1 KB） |
| **实时性** | 写文件到 A 路径，读 B 路径立即可见 |
| **持久性** | 重启、关机后仍然存在 |
| **单向** | 删掉 Junction 原文件不受影响 |

**Junction vs 符号链接 vs 硬链接：**

| 类型 | 支持跨卷 | 支持网络路径 | 可指向文件 | 与 Junction 的区别 |
|------|:-------:|:----------:|:---------:|------------------|
| **Junction** | ❌（同卷） | ❌ | ❌（仅目录） | 基准方案 |
| **符号链接（Symlink）** | ✅ | ❌ | ✅ | 更灵活但需要更高权限，部分应用不兼容 |
| **目录链接（Dir Link）** | ❌ | ❌ | ❌ | 同 Junction 的旧称呼 |
| **硬链接（Hard Link）** | ❌ | ❌ | ✅（仅文件） | 文件级别，非目录 |

> 本项目选择 Junction 而非符号链接，是因为 Junction 兼容性最好——VS Code、Git、Node.js 等工具都能正常处理 Junction，而符号链接在某些场景下会被跳过或报错。

### 5.2 Junction 的创建条件

```
mklink /J <链接路径> <目标路径>

# 示例：
mklink /J "C:\Users\banne\.claude\projects\X\memory\shared" "C:\Users\banne\.claude\banne-claude-brain\memory\shared"
```

| 条件 | 说明 |
|------|------|
| **管理员权限** | 创建 Junction 需要「以管理员身份运行」 |
| **NTFS 卷** | 仅 NTFS 支持，FAT32/exFAT 不支持 |
| **同卷限制** | 链接和目标必须在同一磁盘分区（均为 C:） |
| **目标必须存在** | `目标路径` 必须先创建好 |
| **链接路径不存在** | 创建时链接路径不能已存在（或先用 `Remove-Item` 删除） |

### 5.3 什么是 FileSystemWatcher（Watchdog 核心）？

```powershell
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\banne\.claude\projects"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent $watcher "CreatedEvent" -Action {
    # 新目录出现时自动创建 Junction
}
```

**工作方式：**

```
操作系统检测到 projects\ 有新目录创建
          │
          ▼
FileSystemWatcher 触发 Created 事件
          │
          ▼
PowerShell 脚本检查是否已有 memory\shared\
          │
          ▼
没有 → 自动执行 New-Item -ItemType Junction
          │
          ▼
完成，零人工干预
```

**为什么不用定时轮询？**

| 方式 | CPU 占用 | 延迟 | 代码复杂度 |
|------|:-------:|:----:|:---------:|
| 轮询（每 10 秒检查一次） | 持续占用 | ≤10s | 低 |
| FileSystemWatcher（事件驱动） | 零（有变化才触发） | 实时 | 中 |

### 5.4 启动链为什么要三层？

```
计划任务（开机触发）
    │
    ▼
watchdog.vbs           ← 层 3：隐藏窗口。CreateObject("WScript.Shell").Run … , 0
    │
    ▼
watchdog.bat            ← 层 2：崩溃重启。用 :loop 标签实现 while(true)
    │
    ▼
watchdog.ps1            ← 层 1：核心监听器。FileSystemWatcher + Register-ObjectEvent
```

| 层 | 文件 | 职责 |
|:--:|------|------|
| **3** | `.vbs` | 隐藏 PowerShell 窗口，避免黑框闪烁 |
| **2** | `.bat` | 捕获 PowerShell 崩溃，自动重新启动 |
| **1** | `.ps1` | 业务逻辑：监听目录 → 创建 Junction |

> 💡 实际上只需层 1（`.ps1`）就够了。层 2 和层 3 是「防呆设计」：PowerShell 脚本可能因不明原因退出（罕见但存在），BAT 确保它立即重启；VBS 确保用户不会看到一个持续打开的黑窗口。

### 5.5 MEMORY.md 索引的作用

```
每次 Claude 初始化
      │
      ▼
读取 memory\MEMORY.md     ← 你在这里（索引文件，几十行）
      │
      ▼
按需读取具体的 .md 文件    ← 实际记忆内容
```

`MEMORY.md` 被加载到 Claude 的上下文中，是记忆系统的入口点。结构化的索引让 Claude 能快速定位当前项目需要关注的内容。

改良版索引将记忆分为两段：

```
# Shared Knowledge — 公共区（跨项目共享）   ← 个人偏好，所有项目通用
- [用户档案](shared/user.md)
- [工作偏好](shared/feedback.md)

# Project Knowledge — 项目区（本项目特有）   ← 项目特定，仅本项目关心
- [项目架构](project/architecture.md)
```

---

## 6. Watchdog 自动化部署

### 6.1 创建 Watchdog 脚本

**watchdog.ps1 （核心监听器）**

```powershell
# watchdog.ps1
# 监听 projects\ 目录，新项目自动创建 Junction

param(
    [string]$WatchPath = "$env:USERPROFILE\.claude\projects",
    [string]$BrainPath = "$env:USERPROFILE\.claude\banne-claude-brain\memory\shared"
)

# 日志记录
$LogFile = "$env:USERPROFILE\.claude\scripts\watchdog.log"
function Write-Log {
    param([string]$Message)
    $Time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$Time $Message" | Out-File $LogFile -Append
}

Write-Log "[START] Watchdog 启动，监视路径: $WatchPath"

# 确保脑中转目录存在
if (-not (Test-Path $BrainPath)) {
    New-Item -Path $BrainPath -ItemType Directory -Force | Out-Null
    Write-Log "[INIT] 中央知识库已创建: $BrainPath"
}

# 给已有项目补建 Junction（初次启动时执行一次）
Get-ChildItem $WatchPath -Directory | ForEach-Object {
    $ProjectDir = $_.FullName
    $SharedPath = Join-Path $ProjectDir "memory\shared"

    if ((Test-Path $SharedPath) -and ((Get-Item $SharedPath).LinkType -eq "Junction")) {
        return  # 已有 Junction，跳过
    }

    if (Test-Path $SharedPath) {
        Remove-Item $SharedPath -Recurse -Force
        Write-Log "[CLEAN] 移除项目 $($_.Name) 的现有 shared"
    }

    # 确保 memory 目录存在
    $MemoryDir = Join-Path $ProjectDir "memory"
    if (-not (Test-Path $MemoryDir)) { return }  # 没有 memory 目录，忽略

    try {
        New-Item -Path $SharedPath -ItemType Junction -Target $BrainPath -Force | Out-Null
        Write-Log "[JUNCTION] 已创建: $($_.Name) → $BrainPath"
    } catch {
        Write-Log "[ERROR] 创建 Junction 失败: $_"
    }
}

# 设置文件监视器
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WatchPath
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# 注册新目录创建事件
$action = {
    $FullPath = $Event.SourceEventArgs.FullPath
    $Name = $Event.SourceEventArgs.Name

    # 只处理目录（非文件）
    if (-not (Test-Path $FullPath -PathType Container)) { return }

    Start-Sleep -Seconds 2  # 等目录创建完成
    $MemoryDir = Join-Path $FullPath "memory"
    $SharedPath = Join-Path $MemoryDir "shared"

    if (-not (Test-Path $MemoryDir)) { return }

    try {
        New-Item -Path $SharedPath -ItemType Junction -Target $Event.MessageData -Force | Out-Null
        Write-Log "[AUTO] 自动为新项目创建 Junction: $Name"
    } catch {
        Write-Log "[ERROR] 自动创建失败: $_"
    }
}

Register-ObjectEvent $watcher "Created" -Action $action -MessageData $BrainPath | Out-Null
Write-Log "[READY] 监听中..."

# 保持脚本运行
while ($true) {
    Start-Sleep -Seconds 10
    # 保持事件处理程序活跃
    Get-EventSubscriber | Out-Null
}
```

**watchdog.bat （崩溃重启层）**

```batch
@echo off
title Claude Memory Watchdog

:loop
powershell -ExecutionPolicy Bypass -File "%~dp0watchdog.ps1"
echo [%date% %time%] Watchdog crashed, restarting... >> "%~dp0watchdog-error.log"
timeout /t 3 /nobreak >nul
goto loop
```

**watchdog.vbs （隐藏窗口启动层）**

```vbscript
' watchdog.vbs - 无窗口启动 BAT
CreateObject("WScript.Shell").Run "cmd /c """ & _
    Replace(WScript.ScriptFullName, ".vbs", ".bat") & """", _
    0, False
```

### 6.2 配置计划任务开机自启

```powershell
# 以管理员身份运行
$Action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "C:\Users\banne\.claude\scripts\watchdog.vbs"
$Trigger = New-ScheduledTaskTrigger -AtStartup
$Principal = New-ScheduledTaskPrincipal -UserId "banne" -RunLevel Highest

Register-ScheduledTask -TaskName "ClaudeMemoryWatchdog" `
    -Action $Action `
    -Trigger $Trigger `
    -Principal $Principal `
    -Description "监视 Claude projects 目录，自动创建记忆 Junction"
```

### 6.3 验证 Watchdog 是否运行

```powershell
# 检查计划任务是否已注册
Get-ScheduledTask -TaskName "ClaudeMemoryWatchdog" | Format-List State,TaskName

# 检查 Watchdog 日志
Get-Content "C:\Users\banne\.claude\scripts\watchdog.log" -Tail 10

# 检查进程（VBS 隐藏运行，不会显示窗口）
Get-Process -Name "wscript" -ErrorAction SilentlyContinue
```

---

## 7. 验证与排错

### 7.1 如何确认 Junction 工作正常

```powershell
# 方法一：查看目录属性
Get-ChildItem "C:\Users\banne\.claude\projects\e--AI-Project\memory" | Select-Object Name, LinkType, Target

# 方法二：用 fsutil 检查
fsutil reparsepoint query "C:\Users\banne\.claude\projects\e--AI-Project\memory\shared"

# 方法三：从项目侧写入，从中央侧读取
echo "hello" | Out-File "C:\Users\banne\.claude\projects\e--AI-Project\memory\shared\test.txt"
Get-Content "C:\Users\banne\.claude\banne-claude-brain\memory\shared\test.txt"   # 应输出 hello
Remove-Item "C:\Users\banne\.claude\banne-claude-brain\memory\shared\test.txt"
```

### 7.2 常见错误

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `请求的操作需要提升` | 没有管理员权限 | 右键 PowerShell → 以管理员身份运行 |
| `当文件已存在时，无法创建该文件` | shared 路径已存在 | 先运行 `Remove-Item shared -Recurse -Force` |
| `找不到指定的路径` | 中央目录不存在 | 先 `mkdir` 目标路径 |
| `参数不正确` | 路径包含空格没加引号 | 确保路径用双引号包裹 |
| `拒绝访问` | 文件被占用 | 关闭占用文件的程序（如 VS Code） |

### 7.3 如何完全撤销

```powershell
# 1. 删除 Junction（只是断开链接，原文件不受影响）
Remove-Item "C:\Users\banne\.claude\projects\e--AI-Project\memory\shared" -Force

# 2. 恢复为真实目录（如果需要）
mkdir "C:\Users\banne\.claude\projects\e--AI-Project\memory\shared"

# 3. 停止 Watchdog
Unregister-ScheduledTask -TaskName "ClaudeMemoryWatchdog" -Confirm:$false
```

---

## 8. 常见问题 FAQ

### Q: Junction 和快捷方式有什么区别？

**A:** Junction 是操作系统内核级别的重定向，**应用程序完全感知不到**。快捷方式是应用层的 `.lnk` 文件，双击它才会跳转，但程序读写文件时不会自动跟随快捷方式。Claude 读写 `shared/` 时不会理会同名的 `.lnk` 快捷方式，但 Junction 透明工作。

### Q: 如果删除了中央知识库的某个文件，项目侧的链接文件会怎样？

**A:** 同样消失。Junction 是实时重定向，不是复制。中央删了，项目那边也读不到。

### Q: 同时打开两个项目，会不会写冲突？

**A:** 这是本方案的主要风险。当前实现不包含写入锁机制。如果两个 Claude 实例同时写同一个 `.md` 文件，后写的会覆盖先写的。解决方案：
- 将「个人偏好」和「反馈」写入 `shared/`，这些是追加修改，不频繁
- 高频写入保留在 `project/`（本地，不共享）

### Q: VS Code 升级后 Junction 会消失吗？

**A:** 不会。Junction 是文件系统属性，存储在 NTFS MFT 中，不依赖任何应用程序。VS Code 或 Claude 升级都不影响。

### Q: 如何在 PowerShell 中判断一个路径是否是 Junction？

```powershell
$item = Get-Item "C:\path\to\shared"
$item.LinkType -eq "Junction"   # 返回 True/False
$item.Target                    # 返回目标路径
```

### Q: 可以指向其他盘吗（如 D 盘）？

**A:** Junction 不支持跨卷。如果需要指向 D 盘，改用符号链接（Symlink）：
```powershell
# 需要管理员权限
New-Item -Path "shared" -ItemType SymbolicLink -Target "D:\central-memory\shared"
```
但需要注意：符号链接在某些工具（如 git）中行为与 Junction 不同。

---

> **文档版本:** v2.0（改良版 — 分层记忆策略）  
> **适用场景:** Windows 10/11 + NTFS + Claude Code  
> **维护者:** BanneCharlie
