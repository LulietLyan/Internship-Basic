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

# 🟤 事务

## MySQL 之事务的四大特性(ACID)？

- **原子性(atomicity)**：一个事务必须视为一个不可分割的最小工作单元，整个事务中的所有操作要么全部提交成功，要么全部失败回滚，对于一个事务来说，不可能只执行其中的一部分操作，这就是事务的原子性
- **一致性(consistency)**：数据库总是从一个一致性的状态转换到另一个一致性的状态
- **隔离性(isolation)**：一个事务所做的修改在最终提交以前，对其他事务是不可见的
- **持久性(durability)**：一旦事务提交，则其所做的修改就会永久保存到数据库中。此时即使系统崩溃，修改的数据也不会丢失

>  **实现** 
> 
> - **原子性**：通过 undo log 来保证
> - **一致性**：通过持久性 + 原子性 + 隔离性来保证
> - **隔离性**：通过 MVCC 或锁机制来保证
> - **持久性**：通过 redo log 来保证

## 并发事务会出现什么问题？

- **脏读**： **读到了其他事务未提交的数据**。未提交意味着这些数据可能会回滚，也就是可能最终不会存到数据库中，也就是不存在的数据。读到了不一定最终存在的数据，这就是脏读
- **不可重复读**： **不可重复读指的是在同一事务内，不同的时刻读到的同一批数据可能是不一样的**，可能会受到其他事务的影响。比如其他事务改了这批数据并提交了。通常针对数据更新操作
- **幻读**：幻读是针对数据插入操作来说的。假设事务 A 对某些行的内容作了更改，但是还未提交，此时事务 B 插入了与事务 A 更改前的记录相同的记录行，并且在事务 A 提交之前先提交了，而这时在事务 A 中查询会发现好像刚刚的更改对于某些数据未起作用，让用户感觉出现了幻觉，这就叫幻读。简而言之， **当一个事务前后两次查询的结果集不相同时，就认为发生幻读** 

## MySQL 的事务隔离级别？

- **读未提交(read uncommitted)**：指一个事务还没提交时，它做的变更就能被其他事务看到
- **读提交(read committed)**：指一个事务提交之后，它做的变更才能被其他事务看到
- **可重复读(repeatable read)**：指一个事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的， **MySQL InnoDB 引擎的默认隔离级别** 
- **串行化(serializable)**：会 **对记录加上读写锁**，在多个事务对这条记录进行读写操作时，如果发生了读写冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行

## 在不同事务隔离级别下会发生什么现象？

- **读未提交**： **可能发生脏读、不可重复读和幻读现象** 
- **读提交**： **可能发生不可重复读和幻读现象**，但是不可能发生脏读现象
- **可重复读**： **可能发生幻读现象**，但是不可能脏读和不可重复读现象
- **串行化**：脏读、不可重复读和幻读现象 **都不可能发生** 

>  **💡 提示** 
> - **解决脏读现象**：升级到读提交以上的隔离级别
> - **解决不可重复读**：升级到可重复读的隔离级别
> - **解决幻读**： **不建议** 将隔离级别升级到串行化，因为这样会导致数据库在 **并发事务时性能很差** 

## MVCC 实现原理？

 **Read View**  有四个重要的字段：

- **m_ids** ：指的是在创建 Read View 时，当前数据库中活跃事务的事务 id 列表，活跃事务指的就是，启动了但还没提交的事务
- **min_trx_id** ：指的是在创建 Read View 时，当前数据库中活跃事务中事务 id 最小的事务，也就是 m_ids 的最小值
- **max_trx_id** ：创建 Read View 时当前数据库中应该给下一个事务的 id 值，也就是全局事务中最大的事务 id 值 + 1
- **creator_trx_id** ：指的是创建该 Read View 的事务的事务 id

对于使用 InnoDB 存储引擎的数据库表，它的聚簇索引记录中都包含下面两个隐藏列：

- **trx_id**：当一个事务对某条聚簇索引记录进行改动时，就会把该事务的事务 id 记录在 trx_id 隐藏列里。
- **roll_pointer**：每次对某条聚簇索引记录进行改动时，都会把旧版本的记录写入到 undo 日志中，然后这个隐藏列是个指针，指向每一个旧版本记录，于是就可以通过它找到修改前的记录

一个事务去访问记录的时候，除了自己的更新记录总是可见之外，还有这几种情况：

- **如果记录的 trx_id 值小于 Read View 中的 min_trx_id 值**：表示这个版本的记录是在创建 Read View 前已经提交的事务生成的，所以该版本的记录 **对当前事务可见** 
- **如果记录的 trx_id 值大于等于 Read View 中的 max_trx_id 值**：表示这个版本的记录是在创建 Read View 后才启动的事务生成的，所以该版本的记录 **对当前事务不可见** 
- **如果记录的 trx_id 值在 Read View 的 min _trx_ id 和 max _trx_ id 之间**，需要判断 trx_id 是否在 m_ids 列表中：
  - **如果记录的 trx_id 在 m_ids 列表中**：表示生成该版本记录的活跃事务依然活跃着(还没提交事务)，所以该版本的记录对当前事务不可见
  - **如果记录的 trx_id 不在 m_ids 列表中**：表示生成该版本记录的活跃事务已经被提交，所以该版本的记录对当前事务可见

## 幻读是如何解决的？

- **快照读(普通 select 语句)**：是 **通过 MVCC 方式** 解决了幻读，可重复读隔离级别下，事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的，即使中途有其他事务插入了一条数据，查询不出来这条数据的
- **当前读(select ... for update 等语句)**：是 **通过 next-key lock(记录锁 + 间隙锁)方式** 解决了幻读，因为当执行 select ... for update 语句的时候会加上 next-key lock，如果有其他事务在 next-key lock 锁范围内插入了一条记录，那么这个插入语句就会被阻塞，无法成功插入

>  **失败的情况** 
> 
> - **对于快照读**：MVCC 并不能完全避免幻读现象。当事务 A 更新了一条事务 B 插入的记录，那么事务 A 前后两次查询的记录条目就不一样了，所以就发生幻读
> - **对于当前读**：如果事务开启后，并没有执行当前读，而是先快照读，然后这期间如果其他事务插入了一条记录，那么事务后续使用当前读进行查询的时候，就会发现两次查询的记录条目就不一样了，所以就发生幻读
> - **MySQL 可重复读隔离级别并没有彻底解决幻读，只是很大程度上避免了幻读现象的发生** 
> - **尽量在开启事务之后，马上执行 select ... for update 这类当前读的语句**，因为它会对记录加 next-key lock，从而避免其他事务插入一条新记录

## 读提交是怎么实现的？

读提交隔离级别是在 **每次读取数据时，都会生成一个新的 Read View**。事务期间的多次读取同一条数据，前后两次读的数据可能会出现不一致，因为可能这期间 **另外一个事务修改了该记录，并提交了事务**。

## 可重复读是怎么实现的？

可重复读隔离级别是在 **启动事务时生成一个 Read View，然后整个事务期间都在用这个 Read View**。事务期间多次读取同一条数据，前后两次读的数据若被修改过，则会因为记录中的  **trx_id**  仍然在  **m_ids**  范围内，导致程序通过  **roll_pointer**  获取所指向的前一个版本对应的记录，以此类推，最终找到不在 m_ids 队列中的事务对应的记录。不会导致正在执行事务在同一位置读到不同的记录。
