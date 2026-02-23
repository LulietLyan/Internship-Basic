---
statistics: true
comments: true
---

<style>
body {
  position: relative; /* 确保 body 元素的 position 属性为非静态值 */
}

body::before {
  --size: 35px; /* 调整网格单元大小 */
  --line: color-mix(in hsl, canvasText, transparent 60%); /* 调整线条透明度 */
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute; /* 修改为 absolute 以使其随页面滚动 */
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
    display: none; /* 在手机端隐藏网格效果 */
  }
}
</style>

# 🟠 日志

## MySQL 三种日志？

### UNDO LOG(回滚日志)

undo log 是 Innodb 存储引擎层生成的日志，实现了事务中的原子性，主要用于事务回滚和 MVCC。

在事务没提交之前，Innodb 会先记录更新前的数据到 undo log 中，回滚时利用 undo log 来进行回滚。每当进行一条记录进行操作(修改、删除、新增)时，要把回滚时需要的信息都记录到 undo log 里：原理是执行一条相反的操作。undo log 有两个参数：roll_pointer 指针和一个 trx_id 事务 id，通过 trx_id 可以知道该记录是被哪个事务修改的；通过 roll_pointer 指针可以将这些 undo log 串成一个链表，形成版本链。

Innodb 存储引擎也通过 ReadView + undo log 实现 MVCC(多版本并发控制)。

!!! note "UNDO LOG 的作用"
    - **实现事务回滚，保障事务的原子性**：如果出现了错误或者用户执行了 ROLLBACK 语句，可以利用 undo log 中的历史数据将数据恢复到事务开始之前的状态
    - **实现 MVCC 关键因素之一**：MVCC 是通过 ReadView + undo log 实现的。undo log 为每条记录保存多份历史数据，在执行快照读的时候，会根据事务的 Read View 里的信息，顺着 undo log 的版本链找到满足其可见性的记录

### REDO LOG(重做日志)

redo log 是物理日志，记录了某个数据页做了什么修改，每当执行一个事务就会产生一条或者多条物理日志。在事务提交时，先将 redo log 持久化到硬盘即可，不需要等到将缓存在 Buffer Pool 里的脏页数据持久化到硬盘。当系统崩溃时，虽然脏页数据没有持久化但是 redo log 已经持久化，可以根据 redo log 的内容，将所有数据恢复到最新的状态。

redo log 实现了事务中的持久性，主要用于掉电等故障恢复。发生更新的时候，InnoDB 会先更新内存，同时标记为脏页，然后将本次对这个页的修改以 redo log 的形式记录下来。InnoDB 引擎会在适当的时候，由后台线程将缓存在 Buffer Pool 的脏页刷新到硬盘里，实现 WAL 技术。

!!! note "什么是 WAL 技术？"
    WAL 技术指的是 MySQL 的写操作并不是立刻写到硬盘上，而是先写日志，然后在合适的时间再写到硬盘上

!!! note "什么是 crash-safe？"
    redo log + WAL 技术，InnoDB 就可以保证即使数据库发生异常重启，之前已提交的记录都不会丢失

### BINLOG(归档日志)

Server 层生成的日志，主要用于数据备份和主从复制。

在完成一条更新操作后，Server 层会生成一条 binlog，等之后事务提交的时候，会将该事物执行过程中产生的所有 binlog 统一写入 binlog 文件。binlog 文件是记录了所有数据库表结构变更和表数据修改的日志，不会记录查询类的操作。

## redo log 与 bin log 的区别？

- **适用对象不同**：binlog 是 MySQL 的 Server 层实现的，所有存储引擎都可以使用；redo log 是 Innodb 存储引擎实现的日志
- **文件格式不同**：binlog 是逻辑日志，有三种格式：**statement** 记录原始 SQL 语句，**row** 记录每行数据的实际变更内容，**mixed** 是两者的混合，由 MySQL 自动判断使用哪种格式；redo log 是物理日志，记录的是在某个数据页做了什么修改，比如对 XXX 表空间中的 YYY 数据页 ZZZ 偏移量的地方做了 AAA 更新
- **写入方式不同**：binlog 是追加写，写满一个文件，就创建一个新的文件继续写，不会覆盖以前的日志，保存的是全量的日志。redo  log 是循环写，日志空间大小是固定，全部写满就从头开始，保存未被刷入硬盘的脏页日志
- **用途不同**：binlog 用于备份恢复、主从复制；redo log 用于掉电等故障恢复

## redo log 和 undo log 区别？

redo log 记录了此次事务完成后的数据状态，undo log 记录了此次事务开始前的数据状态。

## undo log 是如何实现 MVCC 的？

对于读提交和可重复读隔离级别，快照读是通过 Read View + undo log 来实现的，区别在于创建 Read View 的时机不同：

- 读提交在每个 select 都会生成一个新的 Read View，事务期间的多次读取同一条数据，前后两次读的数据可能会出现不一致，因为可能这期间另外一个事务修改了该记录，并提交了事务
- 可重复读隔离级别是启动事务时生成一个 Read View，然后整个事务期间都在用这个 Read View，这样就保证了在事务期间读到的数据都是事务启动前的记录

通过 **事务的 Read View 里的字段和记录中的两个隐藏列(trx_id 和 roll_pointer)**  的比对，如果不满足可见性，就会顺着 undo log 版本链里找到满足其可见性的记录，从而控制并发事务访问同一个记录时的行为。

## 为什么有了 binlog，还要有 redo log？

早期版本 MySQL 里没有 InnoDB 引擎，MySQL 自带的  MyISAM 引擎没有 crash-safe 的能力，binlog 日志只能用于归档。InnoDB 是另一个公司以插件形式引入 MySQL 的，所以 InnoDB 使用 redo log 来实现 crash-safe 能力。

## 被修改 Undo 页面，需要记录对应 redo log 吗？

需要。开启事务后，InnoDB 更新记录前，首先要记录相应的 undo log，如果是更新操作，也就是要生成一条 undo log，undo log 会写入 Buffer Pool 中的 Undo 页面。在内存修改该 Undo 页面后，需要记录对应的 redo log。

## binlog 的三种格式？

STATEMENT(默认格式)、ROW、 MIXED：

- **STATEMENT**：每一条修改数据的 SQL 都会被记录到 binlog 中，主从复制中 slave 端再根据 SQL 语句重现
- **ROW**：记录行数据最终被修改成什么样了，不会出现 STATEMENT 下动态函数的问题
- **MIXED**：包含了 STATEMENT 和 ROW 模式，它会根据不同的情况自动使用 ROW 模式和 STATEMENT 模式

## redo log 容灾恢复过程？

- 如果 redo log 是完整(commit 状态)的，直接用 redo log 恢复
- 如果 redo log 是预提交 prepare 但不是 commit 状态，此时要去判断 binlog 是否完整，如果完整那就提交 redo log，再用 redo log 恢复，不完整就回滚事务

## redo log 是直接写入硬盘的吗？

不是。直接写入硬盘会产生大量的 I/O 操作，redo log 会写入 redo log buffer。每当产生一条 redo log 时会先写入到 redo log buffer，后续再持久化到硬盘。

## redo log 比直接落盘的优点？

redo log 的写方式使用了追加，日志操作是顺序写，硬盘操作是随机写，MySQL 的写操作从硬盘的 **随机写变成了顺序写**，提升语句的执行性能。

- **实现事务的持久性**，让 MySQL 有 crash-safe 的能力，能够保证 MySQL 在任何时间段突然崩溃，重启后之前已提交的记录都不会丢失
- **将写操作从随机写变成了顺序写**，提升 MySQL 写入硬盘的性能

## redo log buffer 什么时候刷盘？

- MySQL 正常关闭时，会触发落盘
- 当 redo log buffer 中记录的写入量大于 redo log buffer 内存空间的一半时，会触发落盘
- InnoDB 的后台线程每隔 1 秒，将 redo log buffer 持久化到硬盘
- 每次事务提交时都将缓存在 redo log buffer 里的 redo log 直接持久化到硬盘

## redo log 文件格式和写入过程？

### 文件结构

- InnoDB 有 1 个 redo log 组，由 2 个固定大小的文件组成：`ib_logfile0` 和 `ib_logfile1`
- 两个文件大小相同，以 **循环写** 方式工作：按顺序写入，写满 `ib_logfile0` 后切换至 `ib_logfile1`，写满后再从 `ib_logfile0` 开头继续

### 关键指针：write pos 与 checkpoint

- **write pos**：当前写入 redo log 的位置
- **checkpoint**：当前可以擦除（覆盖）的位置，表示该位置之前的 redo 对应的脏页已刷盘

从 checkpoint 到 write pos 之间是尚未刷盘的 redo 记录。随着脏页陆续刷盘，checkpoint 会前移，腾出空间供新日志写入。

### 写满时的处理

当 **write pos 追上 checkpoint** 时，表示 redo log 空间已满，MySQL 会暂停新的更新操作，执行以下步骤：

1. 将 Buffer Pool 中的脏页刷盘
2. 标记已刷盘部分对应的 redo log 记录可被擦除，checkpoint 前移
3. 腾出空间后，write pos 可继续写入，MySQL 恢复正常运行

## binlog 什么时候刷盘？

事务执行过程中，先把日志写到 binlog cache(Server 层的 cache)，事务提交的时候，再把 binlog cache 写到 binlog 文件中。

## binlog 刷盘频率如何控制？

 MySQL 提供一个 sync_binlog 参数来控制数据库的 binlog 刷到硬盘上的频率：

- **sync_binlog = 0 时**：表示每次提交事务都只 write，不 fsync，后续交由操作系统决定何时将数据持久化到硬盘
- **sync_binlog = 1 时**：表示每次提交事务都会 write，然后马上执行 fsync
- **sync_binlog = N(N > 1) 时**：表示每次提交事务都 write，但累积 N 个事务后才 fsync

系统默认的设置是 sync_binlog = 0，也就是不做任何强制性的硬盘刷新指令，这时候的性能是最好的，但是风险也是最大的，因为一旦主机发生异常重启，还没持久化到硬盘的数据就会丢失。

当 sync_binlog 设置为 1 的时候，是最安全但是性能损耗最大的设置。因为当设置为 1 的时候，即使主机发生异常重启，最多丢失一个事务的 binlog，而已经持久化到硬盘的数据就不会有影响，不过就是对写入性能影响太大。

 **如果能容少量事务的 binlog 日志丢失的风险，为了提高写入的性能，一般会 sync_binlog 设置为 100~1000 中的某个数值**。

## 主从复制是怎么实现？

 binlog 记录 MySQL 上的所有变化并以二进制形式保存在硬盘上。复制的过程就是将 binlog 中的数据从主库传输到从库上。

- 主库在收到提交事务的请求之后会先写入 binlog，再提交事务，更新存储引擎中的数据，事务提交完成后，返回“操作成功”的响应
- 从库会创建一个专门的 I/O 线程，连接主库的 log dump 线程，来接收主库的 binlog 日志，再把 binlog 信息写入 relay log 的中继日志里，再返回给主库“复制成功”的响应
- 从库会创建一个用于回放 binlog 的线程，去读 relay log 中继日志，然后回放 binlog 更新存储引擎中的数据，最终实现主从的数据一致性

## MySQL 主从复制模型？

- **同步复制**：MySQL 主库提交事务的线程要等待所有从库的复制成功响应，才返回客户端结果。这种方式在实际项目中，基本上没法用，原因有两个：一是性能很差，因为要复制到所有节点才返回响应；二是可用性也很差，主库和所有从库任何一个数据库出问题，都会影响业务。
- **异步复制(默认)**：MySQL 主库提交事务的线程并不会等待 binlog 同步到各从库，就返回客户端结果。这种模式一旦主库宕机，数据就会发生丢失。
- **半同步复制**：介于两者之间，事务线程不用等待所有的从库复制成功响应，只要一部分复制成功响应回来就行，比如一主二从的集群，只要数据成功复制到任意一个从库上，主库的事务线程就可以返回给客户端。这种半同步复制的方式，兼顾了异步复制和同步复制的优点，即使出现主库宕机，至少还有一个从库有最新的数据，不存在数据丢失的风险

## 为什么需要两阶段提交？

事务提交后，redo log 和 binlog 都要持久化到硬盘，但是这两个是独立的逻辑，可能出现半成功的状态，造成两份日志之间的逻辑不一致。

- **如果在将 redo log 刷入到硬盘之后， MySQL 突然宕机了，而 binlog 还没有来得及写入**：MySQL 重启后，通过 redo log 能将 Buffer Pool 恢复到新值，但是 binlog 里面没有记录这条更新语句，在主从架构中，binlog 会被复制到从库，由于 binlog 丢失了这条更新语句，从库的这一行是旧值，主从不一致。
- **如果在将 binlog 刷入到硬盘之后， MySQL 突然宕机了，而 redo log 还没有来得及写入**：由于 redo log 还没写，崩溃恢复以后这个事务无效，数据是旧值，而 binlog 里面记录了这条更新语句，在主从架构中，binlog 会被复制到从库，从库执行了这条更新语句，这一行字段是新值，与主库的值不一致性。

所以会造成主从环境的数据不一致性。因为 redo log 影响主库的数据，binlog 影响从库的数据，redo log 和 binlog 必须保持一致。

 **两阶段提交把单个事务的提交拆分成了 2 个阶段，分别是准备(Prepare)阶段和提交(Commit)阶段**。每个阶段都由协调者(Coordinator)和参与者(Participant)共同完成。

## 两阶段提交的过程是怎样的？

在 MySQL 的 InnoDB 存储引擎中，开启 binlog 的情况下，MySQL 会同时维护 binlog 日志与 InnoDB 的 redo log，为了保证这两个日志的一致性，MySQL 使用了内部 XA 事务，内部 XA 事务由 binlog 作为协调者，存储引擎是参与者。

当客户端执行 commit 语句或者在自动提交的情况下，MySQL 内部开启一个 XA 事务，分两阶段来完成 XA 事务的提交。

事务的提交过程有两个阶段，将 redo log 的写入拆成了两个步骤：prepare 和 commit，中间再穿插写入 binlog：

- **prepare 阶段**：将 内部 XA 事务的  ID 写入到 redo log，同时将 redo log 对应的事务状态设置为 prepare，然后将 redo log 持久化到硬盘。
- **commit 阶段**：把 内部 XA 事务的  ID 写入到 binlog，然后将 binlog 持久化到硬盘，接着调用引擎的提交事务接口，将 redo log 状态设置为 commit，此时该状态并不需要持久化到硬盘，只需要 write 到文件系统的 page cache 成功，只要 binlog 写硬盘成功，redo log 的状态还是 prepare 也没有关系，一样会被认为事务已经执行成功

## 异常重启会出现什么现象？

在 MySQL 重启后会按顺序扫描 redo log 文件，碰到处于 prepare 状态的 redo log，就拿着 redo log 中的 XID 去 binlog 查看是否存在此 XID：

- **如果 binlog 中没有当前内部 XA 事务的 XID，说明 redolog 完成刷盘，但是 binlog 还没有刷盘，则回滚事务**。对应时刻 A 崩溃恢复的情况
- **如果 binlog 中有当前内部 XA 事务的 XID，说明 redolog 和 binlog 都已经完成了刷盘，则提交事务**。对应时刻 B 崩溃恢复的情况

对于处于 prepare 阶段的 redo log，即可以提交事务，也可以回滚事务，这取决于是否能在 binlog 中查找到与 redo log 相同的 XID，如果有就提交事务，如果没有就回滚事务。这样就可以保证 redo log 和 binlog 这两份日志的一致性了。

## 事务没提交 redo log 会被持久化到硬盘吗？

会。事务执行中间过程的 redo log 也是直接写在 redo log buffer 中的，这些缓存在 redo log buffer 里的 redo log 也会被后台线程每隔一秒一起持久化到硬盘。

## 两阶段提交有什么问题？

- **硬盘 I/O 次数高**：每个事务提交都会进行两次 fsync(刷盘)，一次是 redo log 刷盘，另一次是 binlog 刷盘
- **锁竞争激烈**：两阶段提交虽然能够保证单事务两个日志的内容一致，但在多事务的情况下，却不能保证两者的提交顺序一致。在两阶段提交的流程基础上，还需要加一个锁来保证提交的原子性，从而保证多事务的情况下，两个日志的提交顺序一致

## 组提交是什么意思？

有多个事务提交的时候，会将多个 binlog 刷盘操作合并成一个，从而减少硬盘 I/O 的次数。组提交机制后，prepare 阶段不变， **将 commit 阶段拆分为三个过程**：

- **flush 阶段**：多个事务按进入的顺序将 binlog 从 cache 写入文件(不刷盘)；
- **sync 阶段**：对 binlog 文件做 fsync 操作(多个事务的 binlog 合并一次刷盘)；
- **commit 阶段**：各个事务按顺序做 InnoDB commit 操作；

上面的每个阶段都有一个队列，每个阶段有锁进行保护，因此保证了事务写入的顺序，第一个进入队列的事务会成为 leader，leader 领导所在队列的所有事务，全权负责整队的操作，完成后通知队内其他事务操作结束。对每个阶段引入了队列后，锁就只针对每个队列进行保护，不再锁住提交事务的整个过程，锁粒度减小了，这样就使得多个阶段可以并发执行，从而提升效率

## Buffer Pool 有什么作用？

**为什么要有 Buffer Pool？** 虽然说 MySQL 的数据是存储在磁盘里的，但是也不能每次都从磁盘里面读取数据，这样性能是极差的。要想提升查询性能，加个缓存就行了。所以，当数据从磁盘中取出后，缓存内存中，下次查询同样的数据的时候，直接从内存中读取。为此，Innodb 存储引擎设计了一个**缓冲池（Buffer Pool）**，来提高数据库的读写性能。

主要的作用是实现缓存：

- **当读取数据时**：如果数据存在于 Buffer Pool 中，会直接读取 Buffer Pool 中的数据，否则再去磁盘中读取
- **当修改数据时**：如果数据存在于 Buffer Pool 中，那直接修改 Buffer Pool 中数据所在的页，然后将其页设置为脏页(该页的内存数据和硬盘上的数据已经不一致)；不会立即将脏页写入硬盘，后续由后台线程选择一个合适的时机将脏页写入到硬盘

**Buffer Pool 有多大？** Buffer Pool 是在 MySQL 启动的时候，向操作系统申请的一片连续的内存空间，默认配置下 Buffer Pool 只有 `128MB`。可以通过调整 `innodb_buffer_pool_size` 参数来设置 Buffer Pool 的大小，一般建议设置成可用物理内存的 60%~80%。

## Buffer Pool 缓存内容？

InnoDB 会为 Buffer Pool 申请一片连续的内存空间，然后按照默认的大小划分出一个个的页， Buffer Pool 中的页就叫做缓存页。InnoDB 会把存储的数据划分为若干个「页」，以页作为磁盘和内存交互的基本单位，一个页的默认大小为 16KB。因此，Buffer Pool 同样需要按「页」来划分。此时这些缓存页都是空闲的，之后随着程序的运行，才会有硬盘上的页被缓存到 Buffer Pool 中。

Buffer Pool 除了缓存索引页和数据页，还包括了 Undo 页，插入缓存、自适应哈希索引、锁信息等等。

为了更好的管理这些在 Buffer Pool 中的缓存页，InnoDB 为每一个缓存页都创建了一个**控制块**，控制块信息包括「缓存页的表空间、页号、缓存页地址、链表节点」等等。控制块也是占有内存空间的，它是放在 Buffer Pool 的最前面，接着才是缓存页。

**查询一条记录，就只需要缓冲一条记录吗？** 不是的。当我们查询一条记录时，InnoDB 是会把整个页的数据加载到 Buffer Pool 中，因为，通过索引只能定位到磁盘中的页，而不能定位到页中的一条记录。将页加载到 Buffer Pool 后，再通过页里的页目录去定位到某条具体的记录。

## 如何管理 Buffer Pool？

**如何管理空闲页？** 为了能够快速找到空闲的缓存页，可以使用链表结构，将空闲缓存页的「控制块」作为链表的节点，这个链表称为 **Free 链表**（空闲链表）。Free 链表上除了有控制块，还有一个头节点，该头节点包含链表的头节点地址，尾节点地址，以及当前链表中节点的数量等信息。Free 链表节点是一个一个的控制块，而每个控制块包含着对应缓存页的地址，所以相当于 Free 链表节点都对应一个空闲的缓存页。有了 Free 链表后，每当需要从磁盘中加载一个页到 Buffer Pool 中时，就从 Free 链表中取一个空闲的缓存页，并且把该缓存页对应的控制块的信息填上，然后把该缓存页对应的控制块从 Free 链表中移除。

**如何管理脏页？** 设计 Buffer Pool 除了能提高读性能，还能提高写性能，也就是更新数据的时候，不需要每次都要写入磁盘，而是将 Buffer Pool 对应的缓存页标记为**脏页**，然后再由后台线程将脏页写入到磁盘。那为了能快速知道哪些缓存页是脏的，于是就设计出 **Flush 链表**，它跟 Free 链表类似的，链表的节点也是控制块，区别在于 Flush 链表的元素都是脏页。有了 Flush 链表后，后台线程就可以遍历 Flush 链表，将脏页写入到磁盘。

**如何提高缓存命中率？** Buffer Pool 的大小是有限的，对于一些频繁访问的数据我们希望可以一直留在 Buffer Pool 中，而一些很少访问的数据希望可以在某些时机可以淘汰掉，从而保证 Buffer Pool 不会因为满了而导致无法再缓存新的数据，同时还能保证常用数据留在 Buffer Pool 中。要实现这个，最容易想到的就是 LRU（Least recently used）算法。

**简单的 LRU 算法**：链表头部的节点是最近使用的，而链表末尾的节点是最久没被使用的。那么，当空间不够了，就淘汰最久没被使用的节点，从而腾出空间。但是简单的 LRU 算法并没有被 MySQL 使用，因为简单的 LRU 算法无法避免下面这两个问题：
- **预读失效**：MySQL 在加载数据页时，会提前把它相邻的数据页一并加载进来，目的是为了减少磁盘 IO。但是可能这些被提前加载进来的数据页，并没有被访问，相当于这个预读是白做了，这个就是预读失效。如果使用简单的 LRU 算法，就会把预读页放到 LRU 链表头部，而当 Buffer Pool 空间不够的时候，还需要把末尾的页淘汰掉。如果这些预读页如果一直不会被访问到，就会出现一个很奇怪的问题，不会被访问的预读页却占用了 LRU 链表前排的位置，而末尾淘汰的页，可能是频繁访问的页，这样就大大降低了缓存命中率
- **Buffer Pool 污染**：当某一个 SQL 语句，要批量扫描大量数据时，可能把 Buffer Pool 里的所有页都替换出去，导致大量热数据被淘汰了，等这些热数据又被再次访问的时候，由于缓存未命中，就会产生大量的磁盘 IO，MySQL 性能就会急剧下降，这种情况叫 Buffer Pool 污染

**MySQL 的 LRU 优化**：MySQL 改进了 LRU 算法，将 LRU 划分了 2 个区域：**old 区域 和 young 区域**。young 区域在 LRU 链表的前半部分，old 区域则是在后半部分。加入缓冲池的页，优先插入 old 区域；页被访问时，才进入 young 区域。当「页被访问」且「old 区域停留时间超过 `innodb_old_blocks_time` 阈值（默认为 1 秒）」时，才会将页插入到 young 区域，否则还是插入到 old 区域。这样可以解决预读失效和 Buffer Pool 污染的问题。

开启事务后，InnoDB 层更新记录前，首先要记录相应的 undo log，undo log 会写入 Buffer Pool 中的 Undo 页面。

