---
statistics: true
comments: true
---

<style>
body {
  position: relative;
}

body::before {
  --size: 35px;
  --line: color-mix(in hsl, canvasText, transparent 60%);
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute;
  background: linear-gradient(
        90deg,
        var(--line) 1px,
        transparent 1px var(--size)
      )
      50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
      var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
          mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

@media (max-width: 768px) {
  body::before {
    display: none;
  }
}
</style>

# defer 原理

## defer 是什么

`defer` 用于将 **函数调用** 推迟到 **当前函数返回** （或发生未恢复 `panic`、即将沿栈展开）时再执行。一个函数里可以有多条 `defer`，执行顺序为 **后进先出（LIFO）** 。

## 使用形式

```go
defer func() { /* ... */ }()
defer someFunc(a, b) // 注意：参数在 defer 注册时就会求值，而非在 defer 真正执行时
```

**要点** ：`defer` 后面的 **参数表达式** 会在遇到 `defer` 语句时立即求值，只有 **被调用的函数体** 延后到返回阶段执行。

## 底层结构：`_defer`

每次 `defer` 会在当前 goroutine 上挂接一个 `_defer` 节点；多个 `_defer` 组成 **链表** ，新节点插在表头，因此执行时从表头依次弹出，表现为 LIFO。

结构体（字段随版本可能微调，见 `runtime/runtime2.go`）核心含义：

- `sp` / `pc` / `fn`：记录调用点与要执行的函数。
- `link`：指向同一 goroutine 上 **更早** 注册的 `_defer`，形成链表。
- `heap`：是否为堆上分配的 `_defer`（影响回收方式）。
- `openDefer`：是否采用 **开放编码** （见下文）。

函数返回路径上，运行时会调用 `deferreturn`，按当前栈帧匹配 `_defer` 并执行。

## 编译与分配策略

编译器在 SSA 阶段处理 `defer`，大致三类实现（由编译器择优）：

1. **开放编码（open-coded，约 Go 1.14+）**  
   在满足条件时，把 defer 逻辑展开在函数出口附近，减少 `deferproc` 调用开销。常见限制包括：`defer` 个数不宜过多、与返回值/`defer` 数量组合不能过大、不在循环中动态增加难以静态分析的 `defer` 等。

2. **栈上分配：`deferprocStack`**  
   未逃逸、可静态分析时，在栈上放置 `_defer` 记录，再链入 goroutine 的 defer 链表。

3. **堆上分配：`deferproc` / `newdefer`**  
   早期版本或无法满足栈/开放编码条件时使用；`newdefer` 会尽量从 **P 本地 defer 池** 与 **全局 defer 池** 取复用对象，减少频繁堆分配。

**经验** ：在 **循环里** 反复 `defer` 会导致大量 `_defer` 分配或无法开放编码，容易带来性能问题；应改为在循环外 `defer` 一次，或显式使用函数封装缩小 defer 次数。

## 执行：`deferreturn`

返回阶段，`deferreturn` 会遍历当前 goroutine 的 defer 链表，只处理 **仍属于当前栈帧** 的节点（通过 `sp` 等判断），依次执行 `fn` 并释放 `_defer`。若使用开放编码，则走 `runOpenDeferFrame` 等分支。

## 小结

1. `defer` 注册顺序与执行顺序相反（LIFO）。
2. **参数在 defer 语句处求值** ，勿误以为在函数最后一刻才计算。
3. 实现上分堆分配、栈分配与开放编码，目标是在保证语义的前提下降低开销。
4. 避免在热路径循环内无节制使用 `defer`。
