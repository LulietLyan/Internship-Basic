# interface 底层原理

Go 的 `interface` 描述一组方法约定；**空接口** `interface{}`（Go 1.18+ 亦可用 `any`）可承载任意类型。赋值给接口变量时，运行时会建立**动态类型**与**动态值**的表示。

## 空接口：`eface`

未定义任何方法的接口在运行时对应 `eface`（`runtime2.go`）：

```go
type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

- `_type`：动态类型的元数据（大小、对齐、hash、`kind` 等）。
- `data`：指向动态值的指针；若值可原样放在接口词里，可能直接内联存储，依类型与版本而定。

## 非空接口：`iface` 与 `itab`

带方法的接口使用 `iface`：

```go
type iface struct {
    tab  *itab
    data unsafe.Pointer
}
```

- `data`：动态值，含义与空接口类似。
- `tab`：指向 `itab`，描述**接口类型**与**具体类型**的绑定及可调用的方法地址。

```go
type itab struct {
    inter *interfacetype
    _type *_type
    hash  uint32 // 与 _type.hash 一致，用于类型断言等快速比较
    _     [4]byte
    fun   [1]uintptr // 变长：接口方法在实现类型上的入口地址；fun[0]==0 表示未实现接口
}
```

`interfacetype` 描述接口自身（包路径、方法列表 `mhdr` 等）。构建 `itab` 时，运行时会检查具体类型是否实现接口全部方法，并将所需方法地址填入 `fun`。

## `itab` 缓存

同一**接口类型 + 具体类型**对会复用同一个 `itab`，避免每次赋值都重新计算。运行时使用 `itabTable` 等结构做查找与缓存；查找时用类型哈希等做索引，冲突时用开放寻址等方式处理（实现细节以当前 `runtime` 为准）。

## 使用注意

1. **接口值与 `nil`**：接口值为 `nil` 需要**动态类型与动态值均为 nil**。若将 `(*T)(nil)` 赋给接口，动态类型为 `*T`，则接口值**不等于** `nil`。
2. **可比较性**：两接口相等要求动态类型相同且动态值按类型的 `==` 可比较；若动态类型不可比较（如切片），比较会 **panic**。
3. **性能**：频繁接口调用会经过 `itab` 间接寻址；热路径可尽量减少不必要的接口抽象。
