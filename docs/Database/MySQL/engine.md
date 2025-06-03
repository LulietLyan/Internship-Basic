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
  --line: color-mix(in hsl, canvasText, transparent 80%); /* 调整线条透明度 */
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
  -webkit-mask: linear-gradient(-20deg, transparent 50%, white);
          mask: linear-gradient(-20deg, transparent 50%, white);
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

# 🟣 存储引擎

## MySQL 的执行引擎有哪些？

主要有  **MyISAM、InnoDB、Memery**  等引擎：

- InnoDB 引擎提供了对事务 ACID 的支持，还提供了行级锁和外键的约束
- MyISAM 引擎不支持事务，也不支持行级锁和外键约束
- Memery 就是将数据放在内存中，数据处理速度很快，但是安全性不高

## MyISAM 和 InnoDB 存储引擎的区别？

- **锁的细粒度不同**：InnoDB 比 MyISAM 更好的支持并发，因为 InnoDB 的支持行锁，而 MyISAM 支持表锁，行锁对每一条记录上锁，所以开销更大，但是可以解决脏读和不可重复读的问题，相对来说也更容易发生死锁
- **可恢复性**：InnoDB 有事务日志，数据库崩溃后可以通过日志进行恢复，MyISAM 没有日志支持
- **查询性能**：MyISAM 要好于 InnoDB，因为 InnoDB 在查询过程中是在维护数据缓存。并且先要定位到所在数据块，然后从数据块定位到数据内存地址来查找数据
- **表结构文件**：MyISAM 的表结构文件包括 .frm(表结构定义)、.MYI(索引)、.MYD(数据)；而 InnoDB 的表数据文件为 .ibd(数据和索引集中存储)和 .frm(表结构定义)
- **记录存储顺序**：MyISAM 按照记录插入顺序，InnoDB 按照主键大小顺序有序插入
- **外键和事务**：MyISAM 均不支持，InnoDB 支持。对于 InnoDB 每一条 SQL 语言都默认封装成事务，自动提交，这样会影响速度，所以最好把多条 SQL 语言放在 begin 和 commit 之间，组成一个事务。对一个包含外键的 InnoDB 表转为 MYISAM 会失败
- **操作速度**：对于 SELECT 前者更优，INSERT、UPDATE、DELETE 后者更优。select count(*)使用 MyISAM 更快，因为内部维护了一个计数器，可以直接调度
- **存储空间**：MyISAM 可被压缩，存储空间较小，InnoDB 的表需要更多的内存和存储，会在主内存中建立专用的缓冲池用于高速缓存数据和索引
- **索引方式**：二者都是 B+ 树索引，前者是堆表，后者是索引组织表

>  **为什么 InnoDB 没有计数器变量？** 
> - 因为 InnoDB 的事务特性，同一时刻表中的行数对于不同事务而言是不同的，因此计数器统计的是当前事务对应的行数，而不是总行数

## 存储引擎如何选择？

- **如果没有特别的需求**：使用默认的 InnoDB 即可
- **要支持事务选择 InnoDB**：如果不需要可以考虑 MyISAM；如果表中绝大多数都只是读查询考虑 MyISAM；如果既有读也有写使用 InnoDB 存储引擎
- **系统崩溃后 MyISAM 恢复起来更困难，考虑业务能否接受系统崩溃的程度**：MySQL5.5 版本开始 Innodb 已经成为 MySQL 的默认引擎(之前是 MyISAM)，说明其优势是有目共睹的

## MyISAM 索引与 InnoDB 索引的区别？

- InnoDB 是聚簇索引，MyISAM 是非聚簇索引
- InnoDB 的主键索引的叶子节点存储着行数据，因此主键索引非常高效。MyISAM 索引的叶子节点存储的是行数据地址，需要再寻址一次才能得到数据
- InnoDB 非主键索引的叶子节点存储的是主键和其他带索引的列数据，因此查询时做到覆盖索引会非常高效

