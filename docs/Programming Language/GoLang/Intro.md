# Go 语言基础

## 1. 与其他语言相比，使用 Go 有什么好处?

* 与其他语言不同，Go 代码的设计是务实的，Go的语法更简洁。每个功能和语法决策都旨在让程序员的开发效率更高

* Golang 针对并发进行了优化，支持协程，并且实现了高效的GMP调度模型。

* 由于单一的标准代码格式，Golang 通常被认为比其他语言更具可读性。

* 有高效的垃圾回收机制，支持并行垃圾回收，垃圾回收效率比比 Java 或 Python 更高

### 为什么选择 Golang？

**0、高性能-协程**  
golang 源码级别支持协程，实现简单；对比进程和线程，协程占用资源少，能够简洁高效地处理高并发问题。

**1、学习曲线容易-代码极简**  
Go语言语法简单，包含了类C语法。因为Go语言容易学习，所以一个普通的大学生花几个星期就能写出来可以上手的、高性能的应用。Go 语言的语法特性简直是太简单了，简单到你几乎玩不出什么花招，直来直去的，学习曲线很低，上手非常快。

**2、效率：快速的编译时间，开发效率和运行效率高**  
开发过程中相较于 Java 和 C++呆滞的编译速度，Go 的快速编译时间是一个主要的效率优势。Go拥有接近C的运行效率和接近PHP的开发效率。

**3、出身名门、血统纯正**  
Go语言出自Google公司，Google在业界的知名度和实力自然不用多说。Google公司聚集了一批牛人，在各种编程语言称雄争霸的局面下推出新的编程语言，自然有它的战略考虑。

**4、自由高效：组合的思想、无侵入式的接口**  
Go语言可以说是开发效率和运行效率二者的完美融合，天生的并发编程支持。Go语言支持当前所有的编程范式，包括过程式编程、面向对象编程、面向接口编程、函数式编程。

**5、强大的标准库-生态**  
背靠谷歌，生态丰富，轻松 go get 获取各种高质量轮子。用户可以专注于业务逻辑，避免重复造轮子。

**6、部署方便：二进制文件，Copy部署**  
部署简单，源码编译成执行文件后，可以直接运行，减少了对其它插件依赖。

**7、简单的并发**  
并行和异步编程几乎无痛点。Go 语言的 Goroutine 和 Channel 这两个神器简直就是并发和异步编程的巨大福音。

**8、稳定性**  
Go拥有强大的编译检查、严格的编码规范和完整的软件生命周期工具，具有很强的稳定性。

**9、跨平台**  
很多语言都支持跨平台，结合上述优点，它的综合能力就非常强了。

### Golang 缺点

**①右大括号不允许换行，否则编译报错**  
**②不允许有未使用的包或变量**  
**③错误处理原始**，虽然引入了defer、panic、recover处理出错后的逻辑，函数可以返回多个值，但基本依靠返回错误是否为空来判断函数是否执行成功，if err != nil语句较多，比较繁琐，程序没有java美观。  
**④[]interface{}不支持下标操作**  
**⑤struct没有构造和析构**，一些资源申请和释放动作不太方便  
**⑥仍然保留C/C++的指针操作**，取地址&，取值*

## 2. 什么是协程？

协程是用户态轻量级线程，它是线程调度的基本单位。通常在函数前加上go关键字就能实现并发。一个Goroutine会以一个很小的栈启动2KB或4KB，当遇到栈空间不足时，栈会自动伸缩， 因此可以轻易实现成千上万个goroutine同时启动。

## 3. 协程和线程和进程的区别？

* 进程:进程是具有一定独立功能的程序，进程是系统资源分配和调度的最小单位。 每个进程都有自己的独立内存空间，不同进程通过进程间通信来通信。由于进程比较重量，占据独立的内存，所以上下文进程间的切换开销（栈、寄存器、虚拟内存、文件句柄等）比较大，但相对比较稳定安全。

* 线程:线程是进程的一个实体,线程是内核态,而且是 CPU 调度和分派的基本单位,它是比进程更小的能独立运行的基本单位。线程间通信主要通过共享内存，上下文切换很快，资源开销较少，但相比进程不够稳定容易丢失数据。

* 协程:协程是一种用户态的轻量级线程，协程的调度完全是由用户来控制的。协程拥有自己的寄存器上下文和栈。 协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈，直接操作栈则基本没有内核切换的开销，可以不加锁的访问全局变量，所以上下文的切换非常快。

## 4. Golang 中 make 和 new 的区别？

`make` 和 `new` 都是用于内存分配的内建函数，但它们的使用场景和功能有所不同：

1. **`make`**：

   * 用于初始化并分配内存，只能用于创建 `slice`、`map` 和 `channel` 三种类型。

   * 返回的是初始化后的数据结构，而不是指针。

2. **`new`**：

   * 用于分配内存，但不初始化，返回的是指向该内存的指针。

   * 可以用于任何类型的内存分配。

**分析：**

```go
// 使用 make 创建 slice
s := make([]int, 5) // 创建一个长度为 5 的 slice
fmt.Println(s)      // 输出: [0 0 0 0 0]
// 使用 new 创建 int 指针
p := new(int)       // 分配内存给 int 类型
fmt.Println(*p)     // 输出: 0 (初始值)
```

`make` 函数创建的是数据结构（`slice`、`map`、`channel`）本身，且返回初始化后的值。而`new` 函数创建的是可以指向任意类型的指针，返回指向未初始化零值的内存地址。

## 5. Golang 中数组和切片的区别？

**数组:**

数组固定长度。数组长度是数组类型的一部分，所以[3]int 和[4]int 是两种不同的数组类型数组需要指定大小，不指定也会根据初始化，自动推算出大小， 大小不可改变。数组是通过值传递的

**切片:**

切片可以改变长度。切片是轻量级的数据结构，三个属性，指针，长度，容量 不需要指定大小切片是地址传递(引用传递)可以通过数组来初始化，也可以通过内置函数 make()来初始化，初始化的时候 len=cap，然后进行扩容

**分析：**

slice 的底层数据其实也是数组，slice 是对数组的封装，它描述一个数组的片段。slice 实际上是一个结构体，包含三个字段：长度、容量、底层数组。

```go
// runtime/slice.go
type slice struct {
        array unsafe.Pointer // 元素指针
        len   int // 长度 
        cap   int // 容量
}
```

## 6. 使用for range 的时候，它的地址会发生变化吗？

在Go1.22之前，对于 `for range` 循环中的迭代变量，其内存地址是不会发生变化的。但是，Go1.22之后的地址是临时的，是变化的，不一样的，不再是共享内存了

**分析：**

Go1.22之前：

```go
for index, value := range collection {
    // ...
}
```

这里 `value` 是一个**副本**。在每次迭代中，`collection` 中的当前元素值会被**复制**到 `value` 这个变量中。Go 编译器通常会为 `value` 分配一块固定的内存地址，然后在每次迭代时，将当前元素的值覆盖到这块内存中。所以，当你打印 `&value` 时，你会发现它的内存地址在整个循环过程中都是保持不变的。

但是在Go1.23及以后，使用 `for range` 遍历一个集合时，**迭代变量的地址会发生变化**。这是因为 `for range` 每次迭代时都会重新生成迭代变量（如 `value`），这些变量在内存中是不同的地址

## 7. 如何高效地拼接字符串？

拼接字符串的方式有：`+` , `fmt.Sprintf` , `strings.Builder`, `bytes.Buffer`, `strings.Join`

1. "+"

使用`+`操作符进行拼接时，会对字符串进行遍历，计算并开辟一个新的空间来存储原来的两个字符串。

2. fmt.Sprintf

由于采用了接口参数，必须要用反射获取值，因此有性能损耗。

3. strings.Builder：

用WriteString()进行拼接，内部实现是指针+切片，同时String()返回拼接后的字符串，它是直接把[]byte转换为string，从而避免变量拷贝。

4. bytes.Buffer

`bytes.Buffer`是一个一个缓冲`byte`类型的缓冲器，这个缓冲器里存放着都是`byte`，`bytes.buffer`底层也是一个`[]byte`切片。

5. strings.join

`strings.join`也是基于`strings.builder`来实现的,并且可以自定义分隔符，在join方法内调用了b.Grow(n)方法，这个是进行初步的容量分配，而前面计算的n的长度就是我们要拼接的slice的长度，因为我们传入切片长度固定，所以提前进行容量分配可以减少内存分配，很高效。

**性能比较：**

strings.Join ≈ strings.Builder > bytes.Buffer > "+" > fmt.Sprintf

```go
func main(){
        a := []string{"a", "b", "c"}
        //方式1：+
        ret := a[0] + a[1] + a[2]
        //方式2：fmt.Sprintf
        ret := fmt.Sprintf("%s%s%s", a[0],a[1],a[2])
        //方式3：strings.Builder
        var sb strings.Builder
        sb.WriteString(a[0])
        sb.WriteString(a[1])
        sb.WriteString(a[2])
        ret := sb.String()
        //方式4：bytes.Buffer
        buf := new(bytes.Buffer)
        buf.Write(a[0])
        buf.Write(a[1])
        buf.Write(a[2])
        ret := buf.String()
        //方式5：strings.Join
        ret := strings.Join(a,"")
}
```

## 8. defer 的执行顺序是怎样的？defer 的作用或者使用场景是什么?

defer执行顺序和调用顺序相反，类似于栈后进先出(LIFO)

defer 的作用是：当 defer 语句被执行时，跟在 defer 后面的函数会被延迟执行。直到 包含该 defer 语句的函数执行完毕时，defer 后的函数才会被执行，不论包含 defer 语句的函数是通过 return 正常结束，还是由于 panic 导致的异常结束。 你可以在一个函数中执行多条 defer 语句，它们的执行顺序与声明顺序相反。

defer 的常用场景:

* defer语句经常被用于处理成对的操作，如打开、关闭、连接、断开连接、 加锁、释放锁。

* 通过defer机制，不论函数逻辑多复杂，都能保证在任何执行路径下，资 源被释放。

* 释放资源的defer应该直接跟在请求资源的语句后。

**分析：**

```go
func test() int {
        i := 0
        defer func() {
                fmt.Println("defer1")
        }()
        defer func() {
                i += 1
                fmt.Println("defer2")
        }()
        return i
}

func main() {
        fmt.Println("return", test())
}

// 输出：
// defer2
// defer1
// return 0
```

上面这个例子中，test返回值并没有修改，这是由于Go的返回机制决定的，执行Return语句后，Go会创建一个临时变量保存返回值。如果是有名返回（也就是指明返回值`func test() (i int)`）

```go
func test() (i int) {
        i = 0
        defer func() {
                i += 1
                fmt.Println("defer2")
        }()
        return i
}

func main() {
        fmt.Println("return", test())
}
// 输出：
// defer2
// return 1
```

这个例子中，返回值被修改了。对于有名返回值的函数，执行 return 语句时，并不会再创建临时变量保存，因此，defer 语句修改了 i，即对返回值产生了影响。

## 9. 什么是 rune 类型？

Go 语言的字符有以下两种：

* uint8 类型，或者叫 byte 型，代表了 ASCII 码的一个字符。

* rune 类型，代表一个 UTF-8 字符，当需要处理中文、日文或者其他复合字符时，则需要用到 rune 类型。rune 类型等价于 int32 类型。

```go
package main
import "fmt"

func main() {
    var str = "hello 你好" //思考下 len(str) 的长度是多少？
    
    //golang中string底层是通过byte数组实现的，直接求len 实际是在按字节长度计算  
    //所以一个汉字占3个字节算了3个长度
    fmt.Println("len(str):", len(str))  // len(str): 12

    //通过rune类型处理unicode字符
    fmt.Println("rune:", len([]rune(str))) //rune: 8
}
```

## 10. Go 语言 tag 有什么用？

tag可以为结构体成员提供属性。常见的：

1. json序列化或反序列化时字段的名称

2. db: sqlx模块中对应的数据库字段名

3. form: gin框架中对应的前端的数据字段名

4. binding: 搭配 form 使用, 默认如果没查找到结构体中的某个字段则不报错值为空, binding为 required 代表没找到返回错误给前端

## 11. go 打印时 %v %+v %#v 的区别？

* %v 只输出所有的值；

* %+v 先输出字段名字，再输出该字段的值；

* %#v 先输出结构体名字值，再输出结构体（字段名字+字段的值）；

```go
package main
import "fmt"
 
type student struct {
  id   int32
  name string
}
 
func main() {
  a := &student{id: 1, name: "微客鸟窝"}

  fmt.Printf("a=%v  \n", a) // a=&{1 微客鸟窝}  
  fmt.Printf("a=%+v  \n", a) // a=&{id:1 name:微客鸟窝}  
  fmt.Printf("a=%#v  \n", a) // a=&main.student{id:1, name:微客鸟窝}
}
```

## 12. Go语言中空 struct{} 占用空间么？

可以使用 unsafe.Sizeof 计算出一个数据类型实例需要占用的字节数，空struct{}不占用任何空间

```go
package main

import (
  "fmt"
  "unsafe"
)

func main() {
  fmt.Println(unsafe.Sizeof(struct{}{}))  //0
}
```

## 13. Go语言中，空 struct{} 有什么用？

* 用map模拟一个set，那么就要把值置为struct{}，struct{}本身不占任何空间，可以避免任何多余的内存分配。

```go
type Set map[string]struct{}

func main() {
        set := make(Set)

        for _, item := range []string{"A", "A", "B", "C"} {
                set[item] = struct{}{}
        }
        fmt.Println(len(set)) // 3
        if _, ok := set["A"]; ok {
                fmt.Println("A exists") // A exists
        }
}
```

* 有时候给通道发送一个空结构体,channel<-struct{}{}，可以节省空间

```go
func main() {
        ch := make(chan struct{}, 1)
        go func() {
                <-ch
                // do something
        }()
        ch <- struct{}{}
        // ...
}
```

* 表示仅有方法的结构体

```go
type Lamp struct{}
```

## 14. init() 函数是什么时候执行的？

**简答：** 在main函数之前执行。

**详细：**init()函数是go初始化的一部分，由runtime初始化每个导入的包，初始化不是按照从上到下的导入顺序，而是按照解析的依赖关系，没有依赖的包最先初始化。

每个包首先初始化包作用域的常量和变量（常量优先于变量），然后执行包的`init()`函数。同一个包，甚至是同一个源文件可以有多个`init()`函数。`init()`函数没有入参和返回值，不能被其他函数调用，同一个包内多个`init()`函数的执行顺序不作保证。

执行顺序：import –> const –> var –>`init()`–>`main()`

一个文件可以有多个`init()`函数！

**init() 函数的特征：**

1. **多个 init 函数**：一个包下可以有多个 init 函数，每个文件也可以有多个 init 函数。多个 init 函数按照它们的文件名顺序逐个初始化。

2. **初始化顺序**：应用初始化时初始化工作的顺序是，从被导入的最深层包开始进行初始化，层层递出最后到 main 包。

3. **只执行一次**：不管包被导入多少次，包内的 init 函数只会执行一次。

4. **变量初始化优先**：包级别变量的初始化先于包内 init 函数的执行。

## 15. 2 个 interface 可以比较吗 ？

Go 语言中，interface 的内部实现包含了 2 个字段，类型 `T` 和 值 `V`，interface 可以使用 `==` 或 `!=` 比较。2 个 interface 相等有以下 2 种情况

1. 两个 interface 均等于 nil（此时 V 和 T 都处于 unset 状态）

2. 类型 T 相同，且对应的值 V 相等。

```go
type Stu struct {
     Name string
}

type StuInt interface{}

func main() {
     var stu1, stu2 StuInt = &Stu{"Tom"}, &Stu{"Tom"}
     var stu3, stu4 StuInt = Stu{"Tom"}, Stu{"Tom"}
     fmt.Println(stu1 == stu2) // false
     fmt.Println(stu3 == stu4) // true
}
```

`stu1` 和 `stu2` 对应的类型是 `*Stu`，值是 Stu 结构体的地址，两个地址不同，因此结果为 false。
`stu3` 和 `stu4` 对应的类型是 `Stu`，值是 Stu 结构体，且各字段相等，因此结果为 true。

## 16. 2 个 nil 可能不相等吗？

可能不等。interface在运行时绑定值，只有值为nil接口值才为nil，但是与指针的nil不相等。举个例子：

```go
var p *int = nil
var i interface{} = nil
if(p == i){
        fmt.Println("Equal")
}
```

两者并不相同。总结：两个nil只有在类型相同时才相等。

## 17. Go 语言函数传参是值类型还是引用类型？

* 在 Go 语言中只存在值传递，要么是值的副本，要么是指针的副本。无论是值类型的变量还是引用类型的变量亦或是指针类型的变量作为参数传递都会发生值拷贝，开辟新的内存空间。

* 另外值传递、引用传递和值类型、引用类型是两个不同的概念，不要混淆了。引用类型作为变量传递可以影响到函数外部是因为发生值拷贝后新旧变量指向了相同的内存地址。

## 18. 如何知道一个对象是分配在栈上还是堆上？

Go和C++不同，Go局部变量会进行逃逸分析。如果变量离开作用域后没有被引用，则优先分配到栈上，否则分配到堆上。那么如何判断是否发生了逃逸呢？

`go build -gcflags '-m -m -l' xxx.go`.

关于逃逸的可能情况：变量大小不确定，变量类型不确定，变量分配的内存超过用户栈最大值，暴露给了外部指针。

## 19. Go语言的多返回值是如何实现的？

Go 语言的多返回值是通过在函数调用栈帧上预留空间并进行**值复制**来实现的。在函数调用发生时，Go 编译器会计算出函数所有返回值的总大小。在为该函数创建**栈帧**时，就会在调用方（caller）的栈帧上，为这些返回值预留出连续的内存空间。

当函数执行到 `return` 语句时，它会将其要返回的各个值**复制**到这些预留好的栈空间中。函数执行完毕后，控制权返回给调用方。此时，调用方可以直接从它自己的栈帧上（即之前为返回值预留的空间）获取这些返回的值。

## 20. Go语言中"_"的作用

1. 忽略多返回值：在 Go 语言中，函数可以返回多个值。如果你只关心其中的一部分返回值，而不需要使用其余的，就可以用 `_` 来忽略它们，从而避免编译器报错

2. 当你导入一个包时，通常会使用它的某个功能。但有时你可能只想执行包的 `init()` 函数（例如，注册驱动、初始化全局变量等），而不需要直接使用包中的任何导出成员。这时，你就可以使用 `_` 来进行**匿名导入**

示例：

```go
package main

import (
        "fmt"
        _ "net/http/pprof" // 导入 pprof 包，只为了执行其 init 函数注册 profiling 接口
)

func main() {
        fmt.Println("Application started. Profiling tools are likely registered.")
        // 实际应用中，你可能还会启动一个 HTTP 服务器来暴露 pprof 接口
        // go func() {
        //         log.Println(http.ListenAndServe("localhost:6060", nil))
        // }()
}
```

## 21. Go语言普通指针和unsafe.Pointer有什么区别？

普通指针比如`*int`、`*string`，它们有明确的类型信息，编译器会进行类型检查和垃圾回收跟踪。不同类型的指针之间不能直接转换，这是Go类型安全的体现。

而**unsafe.Pointer**是Go的通用指针类型，可以理解为C语言中的`void*`，它绕过了Go的类型系统。unsafe.Pointer可以与任意类型的指针相互转换，也可以与uintptr进行转换来做指针运算。

另外，通指针受GC管理和类型约束，unsafe.Pointer不受类型约束但仍受GC跟踪

## 22. unsafe.Pointer与uintptr有什么区别和联系

unsafe.Pointer和uintptr可以相互转换，这是Go提供的唯一合法的指针运算方式。典型用法是先将unsafe.Pointer转为uintptr做算术运算，然后再转回unsafe.Pointer使用。

最关键的区别在于**GC跟踪**。unsafe.Pointer会被垃圾回收器跟踪，它指向的内存不会被错误回收；而uintptr只是一个普通整数，GC完全不知道它指向什么，如果没有其他引用，对应内存可能随时被回收。

所以记住：unsafe.Pointer有GC保护，uintptr没有，这是它们最本质的区别。

## 23. Go 语言与其他语言的比较

### Go 语言和 Java 有什么区别?

1. Go上不允许函数重载，必须具有方法和函数的唯一名称，而Java允许函数重载。
2. 在速度方面，Go的速度要比Java快。
3. Java默认允许多态，而Go没有。
4. Go语言使用HTTP协议进行路由配置，而Java使用Akka.routing.ConsistentHashingRouter和Akka.routing.ScatterGatherFirstCompletedRouter进行路由配置。
5. Go代码可以自动扩展到多个核心，而Java并不总是具有足够的可扩展性。
6. Go语言的继承通过匿名组合完成，基类以Struct的方式定义，子类只需要把基类作为成员放在子类的定义中，支持多继承；而Java的继承通过extends关键字完成，不支持多继承。

### go语言和python的区别

1. **范例**  
Python是一种基于面向对象编程的多范式，命令式和函数式编程语言。Go是一种基于并发编程范式的过程编程语言，它与C具有表面相似性。
2. **类型化**  
Python是动态类型语言，而Go是一种静态类型语言，它实际上有助于在编译时捕获错误，这可以进一步减少生产后期的严重错误。
3. **并发**  
Python没有提供内置的并发机制，而Go有内置的并发机制。
4. **安全性**  
Python是一种强类型语言，它是经过编译的，因此增加了一层安全性。Go具有分配给每个变量的类型，因此，它提供了安全性。
5. **管理内存**  
Go允许程序员在很大程度上管理内存。而Python中的内存管理完全自动化并由Python VM管理；它不允许程序员对内存管理负责。
6. **库**  
与Go相比，Python提供的库数量要大得多。
7. **语法**  
Python的语法使用缩进来指示代码块。Go的语法基于打开和关闭括号。
8. **详细程度**  
为了获得相同的功能，Golang代码通常需要编写比Python代码更多的字符。

### Go 是面向对象的语言吗？

是的，也不是。原因是：

1. Go 有类型和方法，并且允许面向对象的编程风格，但没有类型层次。
2. Go 中的 "接口 "概念提供了一种不同的方法，我们认为这种方法易于使用，而且在某些方面更加通用。还有一些方法可以将类型嵌入到其他类型中，以提供类似的东西，但不等同于子类。
3. Go 中的方法比 C++ 或 Java 中的方法更通用：它们可以为任何类型的数据定义，甚至是内置类型，如普通的、"未装箱的 "整数。它们并不局限于结构（类）。
4. Go 由于缺乏类型层次，Go 中的 "对象 "比 C++ 或 Java 等语言更轻巧。

### Go 实现面向对象编程

#### 封装

面向对象中的 "封装" 指的是可以隐藏对象的内部属性和实现细节，仅对外提供公开接口调用。

**在 Go 语言中的属性访问权限，通过首字母大小写来控制：**

- 首字母大写，代表是公共的、可被外部访问的。
- 首字母小写，代表是私有的，不可以被外部访问。

#### 继承

面向对象中的 "继承" 指的是子类继承父类的特征和行为。

**在 Go 语言中，是没有类似 extends 关键字的这种继承的方式，在语言设计上采取的是组合的方式：**

```go
type Animal struct {
    Name string
}

type Cat struct {
    Animal
    FeatureA string
}

type Dog struct {
    Animal
    FeatureB string
}
```

在上述例子中，我们声明了 Cat 和 Dog 结构体，其在内部匿名组合了 Animal 结构体。因此 Cat 和 Dog 的实例都可以调用 Animal 结构体的方法。

#### 多态

面向对象中的 "多态" 指的同一个行为具有多种不同表现形式或形态的能力。

**在 Go 语言中，多态是通过接口来实现的：**

```go
type AnimalSounder interface {
    MakeDNA()
}

func MakeSomeDNA(animalSounder AnimalSounder) {
    animalSounder.MakeDNA()
}
```

当 Cat 和 Dog 的实例实现了 AnimalSounder 接口类型的约束后，就意味着满足了条件，他们就可以作为入参传入 MakeSomeDNA 方法中，再根据不同的实例实现多态行为。

#### 接口嵌套实现复用

在 Go 语言中，可以通过接口嵌套来实现接口方法的复用。接口嵌套允许一个接口包含另一个接口的所有方法，这样实现外层接口的类型也必须实现内层接口的所有方法。

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// 通过嵌套接口实现复用
type ReadWriter interface {
    Reader
    Writer
}

// 实现 ReadWriter 的类型必须同时实现 Reader 和 Writer 的所有方法
type File struct {
    // ...
}

func (f *File) Read(p []byte) (n int, err error) {
    // 实现读取逻辑
    return 0, nil
}

func (f *File) Write(p []byte) (n int, err error) {
    // 实现写入逻辑
    return 0, nil
}

// File 自动实现了 ReadWriter 接口
```

接口嵌套的优势：
- **代码复用**：避免重复定义相同的接口方法
- **组合优于继承**：通过组合小接口来构建大接口，符合 Go 的设计哲学
- **灵活性**：可以按需组合不同的接口，实现更灵活的设计

## 24. 值拷贝与引用拷贝，深拷贝与浅拷贝

map，slice，chan 是引用拷贝；引用拷贝 是 浅拷贝  
其余的，都是 值拷贝；值拷贝 是 深拷贝

### 深浅拷贝的本质区别：

是否真正获取对象实体，而不是引用

**深拷贝：**  
拷贝的是数据本身，创造一个新的对象，并在内存中开辟一个新的内存地址，与原对象是完全独立的，不共享内存，修改新对象时不会影响原对象的值。释放内存时，也没有任何关联。

**值拷贝：**  
接收的是 整个array的值拷贝，所以方法对array中元素的重新赋值不起作用。

```go
package main

import "fmt"

func modify(a [3]int) {
    a[0] = 4
    fmt.Println("modify",a) // modify [4 2 3]
}

func main() {
    a := [3]int{1, 2, 3}
    modify(a)
    fmt.Println("main",a) // main [1 2 3]
}
```

**浅拷贝：**  
拷贝的是数据地址，只复制指向的对象的指针，新旧对象的内存地址是一样的，修改一个另一个也会变。释放内存时，同时释放。

**引用拷贝：**  
函数的引用拷贝与原始的引用指向同一个数组，所以对数组中元素的修改，是有效的

```go
package main

import "fmt"

func modify(s []int) {
    s[0] = 4
    fmt.Println("modify",s) // modify [4 2 3]
}

func main() {
    s := []int{1, 2, 3}
    modify(s)
    fmt.Println("main",s) // main [4 2 3]
}
```

## 25. Go出现panic的场景

+ 数组/切片越界
+ 空指针调用。比如访问一个 nil 结构体指针的成员
+ 过早关闭 HTTP 响应体
+ 除以 0
+ 向已经关闭的 channel 发送消息
+ 重复关闭 channel
+ 关闭未初始化的 channel
+ 未初始化 map。注意访问 map 不存在的 key 不会 panic，而是返回 map 类型对应的零值，但是不能直接赋值
+ 跨协程的 panic 处理
+ sync 计数为负数
+ 类型断言不匹配。`var a interface{} = 1; fmt.Println(a.(string))` 会 panic，建议用 `s,ok := a.(string)`

## 26. Go语言中如何实现while循环、set、继承等

### go是否支持while循环，如何实现这种机制

Go语言中没有while关键字，但可以通过for循环实现while循环的功能：

```go
// 方式1：类似while(true)
for {
    // 循环体
    if condition {
        break
    }
}

// 方式2：类似while(condition)
for condition {
    // 循环体
}
```

### go里面如何实现set？

Go中是不提供Set类型的，Set是一个集合，其本质就是一个List，只是List里的元素不能重复。

Go提供了map类型，但是我们知道，map类型的key是不能重复的，因此，我们可以利用这一点，来实现一个set。那value呢？value我们可以用一个常量来代替，比如一个空结构体，实际上空结构体不占任何内存，使用空结构体，能够帮我们节省内存空间，提高性能。

```go
type Set map[string]struct{}

func main() {
    set := make(Set)
    
    for _, item := range []string{"A", "A", "B", "C"} {
        set[item] = struct{}{}
    }
    fmt.Println(len(set)) // 3
    if _, ok := set["A"]; ok {
        fmt.Println("A exists") // A exists
    }
}
```

### go如何实现类似于java当中的继承机制？

Go中没有extends关键字，也就意味着Go并没有原生级别的继承支持。Go是使用组合来实现的继承，说的更精确一点，是使用组合来代替的继承。

**通过组合实现了继承：**

```go
type Animal struct {
    Name string
}

func (a *Animal) Eat() {
    fmt.Printf("%v is eating", a.Name)
    fmt.Println()
}

type Cat struct {
    *Animal
}

cat := &Cat{
    Animal: &Animal{
        Name: "cat",
    },
}
cat.Eat() // cat is eating
```

总结：
- 如果一个 struct 嵌套了另一个匿名结构体，那么这个结构可以直接访问匿名结构体的属性和方法，从而实现继承。
- 如果一个 struct 嵌套了另一个有名的结构体，那么这个模式叫做组合。
- 如果一个 struct 嵌套了多个匿名结构体，那么这个结构可以直接访问多个匿名结构体的属性和方法，从而实现多重继承。

## 27. IO多路复用

IO多路复用是一种同步IO模型，它允许单个进程/线程同时监视多个文件描述符，当有文件描述符就绪（可读或可写）时，通知程序进行相应的读写操作。

在Go语言中，网络轮询器（NetPoller）使用了IO多路复用机制来处理网络请求和IO操作，其后台通过 kqueue（MacOS），epoll（Linux）或 iocp（Windows）来实现 IO 多路复用。

## 28. uint 类型溢出问题

超过最大存储值如uint8最大是255

```go
var a uint8 = 255
var b uint8 = 1
a+b = 0
```

总之类型溢出会出现难以意料的事，需要注意类型边界。

## 29. 单引号，双引号，反引号的区别？

单引号，表示byte类型或rune类型，对应 uint8和int32类型，默认是 rune 类型。byte用来强调数据是raw data，而不是数字；而rune用来表示Unicode的code point。

双引号，才是字符串，实际上是字符数组。可以用索引号访问某字节，也可以用len()函数来获取字符串所占的字节长度。

反引号，表示字符串字面量，但不支持任何转义序列。字面量 raw literal string 的意思是，你定义时写的啥样，它就啥样，你有换行，它就换行。你写转义字符，它也就展示转义字符。

## 30. nil map 和空 map 有何不同？

在Go语言中，nil map和空map之间存在一些关键的不同点：

### 初始状态与内存占用

+ **nil map**：未初始化的map的零值是nil。nil map不占用实际的内存空间来存储键值对，因为它没有底层的哈希表结构。
+ **空map**：空map是通过`make`函数或其他方式初始化但没有添加任何键值对的map。空map已经分配了底层的哈希表结构，但表中没有存储任何键值对。因此，空map占用了一定的内存空间，尽管这个空间相对较小。

### 对增删查操作的影响

+ **nil map**：
    - **添加操作**：向nil map中添加键值对将导致运行时panic，因为nil map没有底层的哈希表来存储数据。
    - **删除操作**：在早期的Go版本中，尝试从nil map中删除键值对也可能导致panic，但在最新的Go版本中，这一行为可能已经被改变，但通常不建议对nil map执行删除操作。
    - **查找操作**：从nil map中查找键值对不会引发panic，但会返回对应类型的零值，表示未找到键值对。

+ **空map**：
    - **添加操作**：向空map中添加键值对是安全的，键值对会被添加到map中。
    - **删除操作**：从空map中删除键值对是一个空操作，不会引发panic，因为map中原本就没有该键值对。
    - **查找操作**：从空map中查找不存在的键值对也会返回对应类型的零值，表示未找到键值对。

### 总结

nil map和空map的主要区别在于它们的初始状态和对增删查操作的影响。nil map未初始化且不能用于存储键值对，而空map已初始化且可以安全地用于增删查操作。

## 31. GoRoot 和 GoPath 有什么用？

### GOROOT

GOROOT 是 Go 的安装路径。在 mac 或 unix 系统中，通常位于 `/usr/local/go` 路径。GOROOT 目录下包含：

- **bin 目录**：存放 Go 的可执行文件，如 `go`、`gofmt` 等工具
- **pkg 目录**：存放 Go 标准库的编译后的库文件（`.a` 文件）
- **src 目录**：存放 Go 标准库的源代码
- **工具目录**：包含编译器 `compile`、链接器 `link` 等重要工具

GOROOT 主要用于：
- 指定 Go 语言的安装位置
- 编译器查找标准库的位置
- Go 工具链查找自身的位置

### GOPATH

GOPATH 是一个工作空间的概念，用于指定 Go 项目的根目录。它可以设置多个目录，但通常只需要一个。

GOPATH 目录下需要包含三个文件夹：

```
GOPATH/
├── src/    # 存放源文件
├── pkg/    # 存放源文件编译后的库文件，后缀为 .a
└── bin/    # 存放可执行文件
```

- **src 目录**：存放 Go 源代码文件，包括你自己的项目和第三方库的源代码
- **pkg 目录**：存放编译后的库文件（`.a` 文件），供其他项目链接使用
- **bin 目录**：存放编译后的可执行文件

**注意**：从 Go 1.11 开始，引入了 Go modules，不再强制要求使用 GOPATH。使用 Go modules 的项目可以在任意目录下工作，不再需要将代码放在 GOPATH/src 下。但 GOPATH 仍然用于：
- 存放通过 `go get` 下载的依赖包（如果使用 Go modules，则依赖在模块缓存中）
- 存放 `go install` 安装的可执行文件
- 作为向后兼容的机制

### Go Modules vs GOPATH

- **Go Modules（Go 1.11+）**：推荐使用，项目可以在任意目录，使用 `go.mod` 文件管理依赖
- **GOPATH 模式**：传统方式，项目必须放在 `GOPATH/src` 下，通过 `go get` 管理依赖

