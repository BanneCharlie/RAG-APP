VsCode   快捷键ctrl + , 进入设置   字体大小 16px  字体样式  'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace

# Output-Styles

**输出约束**  全局约束

Claude Code 添加全局约束  在 C:\Users\banne\.claude\目录下创建 output-styles 文件夹下,设置输出格式 创建 global constraints.md文件 然后在setting.json文件中设置 属性 **"outputStyle": "global constraints"** 每次启动都会遵循此规范, 感觉类似于 系统提示词(全局约束) ?

#         Mode Checkout	

**模式切换**

通过快捷键 shift + tab 实现切换

1. Manual  手动模式, 所有操作都会进行提问是否进行, 批准后才会执行
2. Plan  计划模式, 在执行操作前会先给出详细的markdown文档, 批准后执行
3. Edit Automatically 自动执行模式, 所有操作都是直接进行执行

**精准明中文件**

输入 @符号召唤出文件树, 选择具体的文件明,以及具体行数 

```cmd
@src/main/java/com/ai/project/service/impl/AiChatLogServiceImpl.java   #24-33行
```

**核心命令**

通过 / 来唤出核心的命令, 包含对于skill的调用

1. /memory  claude code 的外脑,排除全局约束, claude 具备自动记忆的功能, 它会在跨会话中自动累积这个项目中的坑点通过这个命令可以查他背地里记住了当前工程的哪些规矩
2. /compact  压缩上下文, 当处理负责bug时, 上下文记录了很多报错 导致反应变慢 token消耗巨大, 可以通过压缩上下文的方式来记录核心的内容,节省token的使用但是也会造成一定上下文的丢失
3. /statusline 专属的地步状态栏, 可以外挂一个shell脚本, 比如 /statusline show model name and context percentage with a progress bar 会在终端下生产一个动态UI来实时显示消耗了多长上下文token
4. /model 切换模型引擎
5. 快捷键   Escape实现终止操作   Escape Escape 可以撤销刚刚更改的代码  

# Memory

动态经验库,对话过程中的持续学习, 在使用过程中按需触发, 会根据当前正在处理的Bug或者任务, 自动检索相关的记忆片段;

/memory 可以查看到目前claude code 记录了哪些偏好设置, 可以根据需求来进行清楚;  然后将一些常用的偏好设置到output-style下的 global constraints.md文件中来实现强制性约束;



# Summary

1. 创建 C:\Users\banne\.claude\output-styles\global constraints.md文件,设置全局约束  以及配置到setting.json文件下 "outputStyle": "Global-Constraints"
   - 在根目录下创建 document文件夹
   - 目前已经将  Global-Constraints.md文件创建完成，分为以下7个方案
     - 苍穹开发知识检索与 API 调用逻辑
     - 命名与基础开发规范  变量定义与代码重构策略
     - 注释规范  代码变更与追溯安全 苍穹开发安全性补充  文档自动生成
2. 常用@指令 + 行号, 精确命中文件 进行修改    *ESC + ESC可以实现回退代码*
3. memory文件为 claude code 自己错题本, 实现对memory文件调整, 以及将常出现问题 加入到全局约束中; 实现 Junction + Watchdog 实现claude的 memory.md文件统一方案 , MEMORY-SETUP-GUIDE.md为操作文档
