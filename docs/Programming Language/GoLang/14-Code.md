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

# 代码面试题

## 1. 开启100个协程，顺序打印1-1000，且保证协程号1的，打印尾数为1的数字

```go
//  同时开启100个协程(分别为1号协程 2号协程 ... 100号协程，
//  1号协程只打印尾数为1的数字，2号协程只打印尾数为2的数，
//   以此类推)，请顺序打印1-1000整数以及对应的协程号；

func main() {
    s := make(chan struct{})
    //通过map的key来保证协程的顺序
    m := make(map[int]chan int, 100)
    //填充map,初始化channel
    for i := 1; i <= 100; i++ {
        m[i] = make(chan int)
    }
    //开启100个协程，死循环打印
    for i := 1; i <= 100; i++ {
        go func(id int) {
            for {
                num := <-m[id]
                fmt.Println(num)
                s <- struct{}{}
            }
        }(i)
    }
    //循环1-1000，并把值传递给匹配的map
    //然后通过s限制循序打印
    for i := 1; i <= 1000; i++ {
        id := i % 100
        if id == 0 {
            id = 100
        }
        m[id] <- i
        //通过s这个来控制打印顺序。每次遍历一次i
        //都通过s阻塞协程的打印，最后打印完毕
        <-s
    }

    time.Sleep(10 * time.Second)
}
```

## 2. 三个goroutinue交替打印abc 10次

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    // 定义3个channel
    ch1 := make(chan struct{})
    ch2 := make(chan struct{})
    ch3 := make(chan struct{})
    var wg sync.WaitGroup
    wg.Add(3)
    // 打印a
    go func() {
       defer wg.Done()
       for i := 0; i < 10; i++ {
          <-ch1
          fmt.Println("a")
          ch2 <- struct{}{}
       }
       // 第10次的时候，打印c的goroutine写入了ch1
       // 为了防止阻塞，要消费以下ch1
       <-ch1
    }()
    // 打印b
    go func() {
       defer wg.Done()
       for i := 0; i < 10; i++ {
          <-ch2
          fmt.Println("b")
          ch3 <- struct{}{}
       }
    }()
    // 打印c
    go func() {
       defer wg.Done()
       for i := 0; i < 10; i++ {
          <-ch3
          fmt.Println("c")
          ch1 <- struct{}{}
       }
    }()
    // 启动
    ch1 <- struct{}{}
    wg.Wait()
    close(ch1)
    close(ch2)
    close(ch3)
    fmt.Println("end")
}
```

## 3. 用不超过10个goroutine不重复的打印slice中的100个元素

```go
package main

import (
    "fmt"
    "sync"
)

// 用不超过10个goroutine不重复的打印slice中的100个元素
// 容量为10的有缓冲channel实现
// 每次启动10个，累计启动100个goroutine,且无序打印
func main() {
    var wg sync.WaitGroup
    // 创建切片
    ss := make([]int, 100)
    for i := 0; i < 100; i++ {
       ss[i] = i
    }
    ch := make(chan struct{}, 10)
    for i := 0; i < 100; i++ {
       wg.Add(1)
       ch <- struct{}{}
       // 写10个就阻塞了，此时goroutine中打印
       go func(idx int) {
          defer wg.Done()
          fmt.Printf("val: %d \n", ss[idx])
          // 打印结束，从缓冲channel中删除一个
          <-ch
       }(i)

    }
    wg.Wait()
    // 关闭channel
    close(ch)
    fmt.Println("end")
}

// 用不超过10个goroutine不重复的打印slice中的100个元素
// 创建10个无缓冲channel和10个goroutine
// 固定10个goroutine,且顺序打印
func test9() {
    var wg sync.WaitGroup
    // 创建切片
    ss := make([]int, 100)
    for i := 0; i < 100; i++ {
       ss[i] = i
    }
    // 创建channel和goroutine
    hashMap := make(map[int]chan int)
    sort := make(chan struct{})
    for i := 0; i < 10; i++ {
       hashMap[i] = make(chan int)
       wg.Add(1)
       go func(idx int) {
          defer wg.Done()
          for val := range hashMap[idx] {
             fmt.Printf("go id: %d, val: %d \n", idx, val)
             sort <- struct{}{}
          }
       }(i)
    }
    // 循环切片，对10取模，找到对应channel的key，写入值
    for _, v := range ss {
       id := v % 10
       hashMap[id] <- v
       // 有序
       <-sort
    }
    // 循环结束关闭channel,删除map的key
    for k, _ := range hashMap {
       close(hashMap[k])
       delete(hashMap, k)
    }
    wg.Wait()
    close(sort)
    fmt.Println("end")
}
```

## 4. 两个协程交替打印奇偶数

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    //golang交替打印奇偶数
    //交替打印，可以通过channel来实现
    chan1 := make(chan struct{})
    //偶数
    go func() {
       for i := 0; i < 10; i++ {
          chan1 <- struct{}{}
          if i%2 == 0 {
             fmt.Println("打印偶数:", i)
          }
       }
    }()
    //奇数
    go func() {
       for i := 0; i < 10; i++ {
          <-chan1
          if i%2 == 1 {
             fmt.Println("打印奇数数:", i)
          }
       }
    }()
    //阻塞
    select {
    case <-time.After(time.Second * 10):
    }
}
```

## 5. 用单个channel实现0,1的交替打印

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    msg := make(chan struct{})
    go func() {
       for {
          <-msg
          fmt.Println("0")
          msg <- struct{}{}
       }
    }()
    go func() {
       for {
          <-msg
          fmt.Println("1")
          msg <- struct{}{}
       }
    }()
    msg <- struct{}{}
    time.Sleep(3 * time.Minute)

}
```

## 6. sync.Cond实现多生产者多消费者

```go
package main

import (
    "context"
    "fmt"
    "math/rand"
    "sync"
    "time"
)

func main() {
    var wg sync.WaitGroup
    var cond sync.Cond
    cond.L = new(sync.Mutex)
    msgCh := make(chan int, 5)
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    rand.Seed(time.Now().UnixNano())

    // 生产者
    producer := func(ctx context.Context, out chan<- int, idx int) {
       defer wg.Done()
       for {
          select {
          case <-ctx.Done():
             // 每次生产者退出，都唤醒一个消费者处理，防止最后有消费者线程死锁
             // 生产者比消费者多，所以cond.Signal()就可以。不然的话建议Broadcast()
             cond.Broadcast()
             fmt.Println("producer finished")
             return
          default:
             cond.L.Lock()
             for len(msgCh) == 5 {
                cond.Wait()
             }
             num := rand.Intn(500)
             out <- num
             fmt.Printf("producer: %d, msg: %d\n", idx, num)
             cond.Signal()
             cond.L.Unlock()
          }
       }
    }

    // 消费者
    consumer := func(ctx context.Context, in <-chan int, idx int) {
       defer wg.Done()
       for {
          select {
          case <-ctx.Done():
             // 消费者可以选择继续消费直到channel为空
             for len(msgCh) > 0 {
                select {
                case num := <-in:
                   fmt.Printf("consumer %d, msg: %d\n", idx, num)
                default:
                   // 如果channel已经空了，跳出循环
                   break
                }
             }
             fmt.Println("consumer finished")
             return
          default:
             cond.L.Lock()
             for len(msgCh) == 0 {
                cond.Wait()
             }
             num := <-in
             fmt.Printf("consumer %d, msg: %d\n", idx, num)
             cond.Signal()
             cond.L.Unlock()
          }
       }
    }

    // 启动生产者和消费者
    for i := 0; i < 5; i++ {
       wg.Add(1)
       go producer(ctx, msgCh, i+1)
    }
    for i := 0; i < 3; i++ {
       wg.Add(1)
       go consumer(ctx, msgCh, i+1)
    }

    // 模拟程序运行一段时间
    wg.Wait()
    close(msgCh)
    fmt.Println("all finished")
}
```

## 7. 使用go实现1000个并发控制并设置执行超时时间1秒

```go
package main

import (
    "context"
    "fmt"
    "sync"
    "time"
)

func main() {
    // 创建 1000 个协程，并且进行打印
    // 总共超时时间 1s，1s 没执行完就超时，使用 ctx 进行控制

    // 定义任务 channel
    tasks := make(chan int, 1000)
    // 定义 ctx
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()
    var wg sync.WaitGroup

    // 启动 1000 个协程
    for i := 0; i < 1000; i++ {
       wg.Add(1)
       tasks <- i
       go func(id int) {
          defer wg.Done()
          select {
          case <-ctx.Done():
             return
          default:
             fmt.Printf("goroutine id: %d\n", id)
          }
       }(i)
    }

    <-ctx.Done()
    fmt.Println("exec done")
    close(tasks)
    wg.Wait()
    fmt.Println("finish")
}
```

## 8. 使用两个Goroutine，向标准输出中按顺序按顺序交替打出字母与数字，输出是a1b2c3

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    // 定义两个channel，一个打印数字，一个打印字母
    numCh := make(chan struct{})
    strCh := make(chan struct{})
    var wg sync.WaitGroup
    wg.Add(2)
    // 打印字符
    go func() {
       defer wg.Done()
       for i := 'a'; i <= 'z'; i++ {
          fmt.Println(string(i))
          // 通知打印数字
          numCh <- struct{}{}
          // 阻塞等待打印字母
          <-strCh
       }
    }()
    // 打印字母
    go func() {
       defer wg.Done()
       for i := 1; i <= 26; i++ {
          <-numCh
          fmt.Println(i)
          // 通知打印字母
          strCh <- struct{}{}
       }
    }()
    wg.Wait()
    fmt.Println("finished")
}
```

## 9. 编写一个程序限制10个goroutine执行，每执行完一个goroutine就放一个新的goroutine进来

```go
package main

import (
    "fmt"
    "sync"
)

// 编写一个程序限制10个goroutine执行，每执行完一个goroutine就放一个新的goroutine进来
func main() {
    var wg sync.WaitGroup
    ch := make(chan struct{}, 10)
    for i := 0; i < 20; i++ {
       wg.Add(1)
       ch <- struct{}{}
       go func(id int) {
          defer wg.Done()
          fmt.Println("id: %d", id)
          <-ch
       }(i)
    }
    wg.Wait()

}
```

## 10. 写go单元测试的规范？

### 单元测试文件命名规则

单元测试需要创建单独的测试文件，不能在原有文件中书写，名字规则为 xxx_test.go。

### 单元测试包命令规则

单元测试文件的包名为原文件的包名添加下划线接test，举例如下：

```go
// 原文件包名：
package xxx

// 单元测试文件包名：
package xxx_test
```

### 单元测试方法命名规则

单元测试文件中的测试方法和原文件中的待测试的方法名相对应，以Test开头，举例如下：

```go
// 原文件方法：
func Xxx(name string) error 

// 单元测试文件方法：
func TestXxx()
```

### 单元测试方法参数

单元测试方法的参数必须是t *testing.T，举例如下：

```go
func TestZipFiles(t *testing.T) {
    // ...
}
```

## 11. Go语言单步调试

Go语言可以使用delve工具进行单步调试。delve是Go语言的调试器，支持断点、变量查看、单步执行等功能。

安装方式：
```bash
go install github.com/go-delve/delve/cmd/dlv@latest
```

使用方式：
```bash
dlv debug main.go
```

## 12. Go语言依赖管理

Go语言使用Go modules进行依赖管理。Go modules是Go 1.11版本引入的官方依赖管理工具。

### 主要命令

- `go mod init`：初始化一个新的模块
- `go mod tidy`：整理依赖，添加缺失的依赖，移除未使用的依赖
- `go mod download`：下载依赖到本地缓存
- `go mod vendor`：将依赖复制到vendor目录
- `go get`：添加或更新依赖
- `go mod graph`：打印模块依赖图

### go.mod文件

go.mod文件记录了模块的依赖信息，包括模块路径、Go版本、依赖模块及其版本等。

## 13. 如何控制并发数？

### 方式一：有缓冲通道

根据通道中没有数据时读取操作陷入阻塞和通道已满时继续写入操作陷入阻塞的特性，正好实现控制并发数量。

```go
func main() {
    count := 10                     // 最大支持并发
    sum := 100                      // 任务总数
    wg := sync.WaitGroup{}          //控制主协程等待所有子协程执行完之后再退出。
    c := make(chan struct{}, count) // 控制任务并发的chan
    defer close(c)
    for i := 0; i < sum; i++ {
       wg.Add(1)
       c <- struct{}{} // 作用类似于waitgroup.Add(1)
       go func(j int) {
          defer wg.Done()
          fmt.Println(j)
          <-c // 执行完毕，释放资源
       }(i)
    }
    wg.Wait()
}
```

### 方式二：第三方库实现的协程池

可以使用第三方库如ants、tunny等来实现协程池。

## 14. 如何优雅的实现一个 goroutine 池

协程池是保证高并发系统稳定性、高可用的核心部分之一。主要实现思路：

1. 创建一个固定大小的goroutine池
2. 使用channel来传递任务
3. 使用WaitGroup来等待所有任务完成
4. 支持超时控制

可以参考开源库如ants的实现，它提供了完整的goroutine池功能。

## 15. Go中主协程如何等待其余协程退出?

Go 的 sync.WaitGroup 是等待一组协程结束，sync.WaitGroup 只有 3 个方法，Add()是添加计数，Done()减去一个计数，Wait()阻塞直到所有的任务完成。

Go 里面还能通过有缓冲的 channel 实现其阻塞等待一组协程结束，这个不能保证一组 goroutine 按照顺序执行，可以并发执行协程。

Go 里面能通过无缓冲的 channel 实现其阻塞等待一组协程结束，这个能保证一组 goroutine 按照顺序执行，但是不能并发执行。

## 16. 多个 goroutine 对同一个 map 写会 panic，异常是否可以用 defer 捕获？

可以捕获异常，但是只能捕获一次。Go语言，可以使用多值返回来返回错误。不要用异常代替错误，更不要用来控制流程。在极个别的情况下，才使用Go中引入的Exception处理：defer, panic, recover。

Go中，对异常处理的原则是：多用error包，少用panic。

```go
defer func() {
    if err := recover(); err != nil {
        // 打印异常，关闭资源，退出此函数
        fmt.Println(err)
    }
}()
```

## 17. sync.Pool

`sync.Pool` 是 Go 语言标准库 `sync` 包中的一个类型，它主要用于存储和复用临时对象，以减少内存分配的开销，提高性能。

### 基本概念

`sync.Pool` 是一个可以存储任意类型的临时对象的集合。当你需要一个新的对象时，可以先从 `sync.Pool` 中尝试获取；如果 `sync.Pool` 中有可用的对象，则直接返回该对象；如果没有，则需要自行创建。使用完对象后，可以将其放回 `sync.Pool` 中，以供后续再次使用。

### 主要特点

1. **减少内存分配和垃圾回收（GC）压力**：通过复用已经分配的对象，`sync.Pool` 可以显著减少内存分配的次数，从而减轻 GC 的压力，提高程序的性能。
2. **并发安全**：`sync.Pool` 是 Goroutine 并发安全的，多个 Goroutine 可以同时从 `sync.Pool` 中获取和放回对象，而无需额外的同步措施。
3. **自动清理**：Go 的垃圾回收器在每次垃圾回收时，都会清除 `sync.Pool` 中的所有对象。因此，你不能假设一个对象被放入 `sync.Pool` 后就会一直存在。

### 使用场景

`sync.Pool` 适用于以下场景：

+ 对象实例创建开销较大的场景，如数据库连接、大型数据结构等。
+ 需要频繁创建和销毁临时对象的场景，如 HTTP 处理函数中频繁创建和销毁的请求上下文对象。

### 使用方法

1. **创建 Pool 实例**：首先，你需要创建一个 `sync.Pool` 的实例，并配置 `New` 方法。

```go
var pool = &sync.Pool{
    New: func() interface{} {
        return new(YourType) // 替换 YourType 为你的类型
    },
}
```

2. **获取对象**：使用 `Get` 方法从 `sync.Pool` 中获取对象。

```go
obj := pool.Get().(*YourType) // 替换 YourType 为你的类型，并进行类型断言
```

3. **使用对象**：获取到对象后，你可以像使用普通对象一样使用它。

4. **放回对象**：使用完对象后，使用 `Put` 方法将对象放回 `sync.Pool` 中，以供后续再次使用。

```go
pool.Put(obj)
```

### 注意事项

1. **对象状态未知**：从 `sync.Pool` 中获取的对象的状态是未知的。因此，在使用对象之前，你应该将其重置到适当的初始状态。
2. **自动清理**：由于 Go 的垃圾回收器会清理 `sync.Pool` 中的对象，因此你不能依赖 `sync.Pool` 来长期存储对象。
3. **不适合所有场景**：`sync.Pool` 并不适合所有需要对象池的场景。特别是对于那些需要精确控制对象生命周期的场景，你可能需要实现自定义的对象池。

总的来说，`sync.Pool` 是 Go 语言提供的一个非常有用的工具，它可以帮助你减少内存分配和垃圾回收的开销，提高程序的性能。然而，在使用时需要注意其特性和局限，以免发生不可预见的问题。

