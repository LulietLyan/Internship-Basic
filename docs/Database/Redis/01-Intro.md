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


# 🔴 概述

## 什么是 Redis？

Redis 是一种 **基于内存的数据库**，对数据的读写都在内存中完成，因此读写速度非常快，常用于 **缓存、消息队列、分布式锁** 等场景。

Redis 提供多种数据类型（String、Hash、List、Set、Zset、BitMap、HyperLogLog、GEO、Stream），对数据类型的操作都是 **原子性** 的（命令由单线程串行执行，无并发竞争）。此外还支持 **事务、持久化、Lua 脚本、主从/哨兵/切片集群、发布订阅、过期删除与内存淘汰** 等。

## Redis 为什么快？

- **基于内存操作**：Redis 的绝大部分操作在内存里就可以实现，数据也存在内存中，与传统的硬盘文件操作相比减少了 I/O，提高了操作的速度
- **高效的数据结构**：Redis 有专门设计了 STRING、LIST、HASH 等高效的数据结构，依赖各种数据结构提升了读写的效率
- **采用单线程**：单线程操作省去了上P下文切换带来的开销和 CPU 的消耗，同时不存在资源竞争，避免了死锁现象的发生
- **I/O 多路复用**：采用 I/O 多路复用机制同时监听多个 Socket，根据 Socket 上的事件来选择对应的事件处理器进行处理

## 为什么 Redis 是单线程？

**单线程指的是**：**接收客户端请求 → 解析请求 → 数据读写 → 把结果发回客户端** 这条链路由一个主线程完成；其他模块（如持久化、关闭文件、释放内存）仍会使用后台线程。

官方说明：**CPU 不是 Redis 的瓶颈**，瓶颈更可能是内存或网络带宽；单线程实现简单，且避免了多线程的上下文切换、加锁与死锁问题，因此采用单线程。

!!! note "redis 采用多线程的模块和原因"
    Redis 在启动的时候，会启动后台线程(BIO)：

    - Redis 的早期版本会启动 2 个后台线程，来处理关闭文件、AOF 刷盘这两个任务
    - Redis 的后续版本，新增了一个新的后台线程，用来异步释放 Redis 内存。执行 unlink key / flushdb async / flushall async 等命令，会把这些删除操作交给后台线程来执行

    之所以 Redis 为关闭文件、AOF 刷盘、释放内存这些任务创建单独的线程来处理，是因为这些任务的操作都很耗时，把这些任务都放在主线程来处理会导致主线程阻塞，导致无法处理后续的请求。后台线程相当于一个消费者，生产者把耗时任务丢到任务队列中，消费者不停轮询这个队列，拿出任务去执行对应的方法即可。

## Redis 为什么要引入多线程？

随着网络硬件性能提升，**瓶颈有时会出现在网络 I/O 上**。Redis 6.0 引入多线程用于 **网络 I/O**（读请求、写响应），**命令执行仍由单线程完成**，因此不会出现多线程同时执行命令的情况。

- 配置项 **io-threads N**：启用 N-1 个 I/O 线程（主线程也算 1 个），例如 `io-threads 4` 表示 3 个 I/O 工作线程
- **io-threads-do-reads yes**：开启后，客户端读请求也由 I/O 多线程处理（默认只多线程写响应）
- 建议：4 核 CPU 可设 2～3，8 核可设 6；线程数小于 CPU 核数即可，并非越大越好

官方表示，多线程 I/O 对性能提升至少在一倍以上。

## 为什么用 Redis 作为 MySQL 的缓存？

主要有两点：**高性能** 和 **高并发**。

- **高性能**：用户首次访问从 MySQL 读数据较慢（走磁盘），把热点数据缓存在 Redis 后，再次访问可直接从内存读取；MySQL 数据变更时同步更新或失效 Redis 缓存即可（需考虑双写一致性）。
- **高并发**：单机 Redis 的 QPS 可达 10w+，而 MySQL 单机往往难以破 1w；把部分读压力转移到 Redis，可提高系统整体 QPS。

## Redis 和 Memcached 的联系和区别？

### 共同点

- 都是内存数据库
- 性能都非常高
- 都有过期策略

### 区别

- **线程模型**：Memcached 采用多线程模型，并且基于 I/O 多路复用技术，主线程接收到请求后分发给子线程处理，这样做好的好处是：当某个请求处理比较耗时，不会影响到其他请求的处理。缺点是 CPU 的多线程切换存在性能损耗，同时，多线程在访问共享资源时要加锁，也会在一定程度上降低性能；Redis 也采用 I/O 多路复用技术，但它处理请求采用是单线程模型，从接收请求到处理数据都在一个线程中完成。这意味着使用 Redis 一旦某个请求处理耗时比较长，那么整个 Redis 就会阻塞住，直到这个请求处理完成后返回，才能处理下一个请求，使用 Redis 时一定要避免复杂的耗时操作，单线程的好处是，少了 CPU 的上下文切换损耗，没有了多线程访问资源的锁竞争，但缺点是无法利用 CPU 多核的性能
- **数据结构**：Memcached 支持的数据结构很单一，仅支持 string 类型的操作。并且对于 value 的大小限制必须在 1MB 以下，过期时间不能超过 30 天；而 Redis 支持的数据结构非常丰富，除了常用的数据类型 string、list、hash、set、zset 之外，还可以使用 geo、hyperLogLog 数据类型；使用 Memcached 时，我们只能把数据序列化后写入到 Memcached 中。然后再从 Memcached 中读取数据，再反序列化为我们需要的格式，只能"整存整取"；Redis 提供的数据结构提升了操作的便利性
- **淘汰策略**：Memcached 必须设置整个实例的内存上限，数据达到上限后触发 LRU 淘汰机制，优先淘汰不常用使用的数据。它的数据淘汰机制存在一些问题：刚写入的数据可能会被优先淘汰掉，这个问题主要是它本身内存管理设计机制导致的；Redis 没有限制必须设置内存上限，如果内存足够使用，Redis 可以使用足够大的内存，同时 Redis 提供了多种内存淘汰策略
- **持久化**：Memcached 不支持数据的持久化，如果 Memcached 服务宕机，那么这个节点的数据将全部丢失。Redis 支持 AOF 和 RDB 两种持久化方式
- **集群**：Memcached 没有主从复制架构，只能单节点部署，如果节点宕机，那么该节点数据全部丢失，业务需要对这种情况做兼容处理，当某个节点不可用时，把数据写入到其他节点以降低对业务的影响；Redis 拥有主从复制架构，主节点从可以实时同步主的数据，提高整个 Redis 服务的可用性

## 如何理解 Redis 原子性操作原理？

- **API**：Redis 提供的 API 都是单线程串行处理的
- **网络模型**：采用单线程的 epoll 的网络模型，用来处理多个 Socket 请求
- **请求处理**：Redis 会 fork 子进程来处理类似于 RDB 和 AOF 的操作，不影响主进程工作

