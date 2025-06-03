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

# 🟡 优化

## 慢查询的原因？

- **索引不足**：如果查询的表没有合适的索引，MySQL 需要遍历整个表才能找到匹配的记录，这会导致查询变慢。可以通过添加索引来优化查询性能
- **数据库设计问题**：如果数据库设计不合理，例如表过于庞大、列过多等，查询时可能需要耗费大量时间。这时可以通过优化数据库设计来解决问题
- **数据库服务器负载过高**：如果 MySQL 服务器上同时运行了太多的查询，会导致服务器负载过高，从而导致查询变慢。可以通过增加服务器硬件配置或分散查询负载来解决问题
- **查询语句复杂**：复杂的查询语句可能需要耗费更多的时间才能完成。可以尝试简化查询语句或将查询分解成多个较简单的查询语句来提高性能
- **数据库统计信息不准确**：如果数据库统计信息不准确，MySQL 可能会选择不合适的查询计划，从而导致查询变慢。可以通过更新数据库统计信息来解决问题
- **MySQL 版本过低**：较老版本的 MySQL 可能性能较差，升级到较新版本的 MySQL 可能会提高查询性能

## MySQL 硬盘 I/O 很高有什么优化的方

- **设置组提交的两个参数**： binlog_group_commit_sync_delay 和 binlog_group_commit_sync_no_delay_count 参数，延迟 binlog 刷盘的时机，从而减少 binlog 的刷盘次数
- **将 sync_binlog 设置为大于 1 的值(比较常见是 100~1000)**：表示每次提交事务都 write，但累积 N 个事务后才 fsync，相当于延迟了 binlog 刷盘的时机。但是这样做的风险是，主机掉电时会丢 N 个事务的 binlog 日志
- **将 innodb_flush_log_at_trx_commit 设置为 2**：表示每次事务提交时，都只是缓存在 redo log buffer 里的 redo log 写到 redo log 文件，注意写入到 redo log 文件并不意味着写入到了硬盘，因为操作系统的文件系统中有个 Page Cache，专门用来缓存文件数据的，所以写入 redo log 文件意味着写入到了操作系统的文件缓存，然后交由操作系统控制持久化到硬盘的时机。但是这样做的风险是，主机掉电的时候会丢数据