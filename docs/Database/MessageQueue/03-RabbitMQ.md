---
statistics: true
comments: true
---

# 🐇 RabbitMQ

## RabbitMQ publisher confirm 和 consumer ack 有什么区别？

publisher confirm 是 Broker 告诉生产者“消息已经被 Broker 接收并处理到相应阶段”；consumer ack 是消费者告诉 Broker“这条消息我已经处理成功，可以删除或确认进度”。

两者解决的是不同链路。前者防止生产端发送后丢失，后者防止消费者拿到消息后处理失败却被误认为成功。

## RabbitMQ 持久化配置为什么还不能完全保证不丢消息？

要尽量避免 Broker 重启后丢消息，需要队列 durable、消息 persistent，并开启 publisher confirm。但即使如此，如果消息还没刷盘或没有完成确认就宕机，也可能丢失。

生产端必须等待 confirm 再认为发送成功；消费者必须业务处理成功后再 ack。只设置 durable 队列，却发送非持久化消息，或者生产者不处理 confirm，都不是完整可靠方案。

## ack、nack、reject 和 requeue 如何理解？

消费者处理成功后发送 ack，Broker 才能移除消息。处理失败时可以 nack 或 reject，并决定是否 requeue。

如果 requeue 为 true，消息会重新入队，可能马上又被同一个消费者拿到，造成失败循环；如果 requeue 为 false，消息会被丢弃或进入死信交换机，取决于队列是否配置 DLX。

生产上通常会限制重试次数，超过阈值后进入死信队列，避免毒丸消息拖垮正常消费。

## prefetch 解决什么问题？

prefetch 用来限制 Broker 一次推给消费者但尚未 ack 的消息数量。没有限制时，慢消费者可能积压大量 unacked 消息，导致其他消费者拿不到任务，负载不均衡。

合理设置 prefetch 可以提升公平性和稳定性。CPU 密集任务可以设置较小值；轻量任务可以适当增大以提高吞吐。

## RabbitMQ 如何实现延迟消息？

常见方案有两类。

- 使用 TTL 加死信交换机：消息先进入延迟队列，过期后转发到真正消费队列。
- 使用 delayed message exchange 插件：按消息延迟时间投递，使用更直观。

TTL 加 DLX 的坑点是同一个队列中消息按队头过期处理，可能出现后面的短延迟消息被前面的长延迟消息阻塞。复杂延迟场景更适合插件或专门的延迟队列设计。

## RabbitMQ 能保证严格顺序吗？

单队列、单消费者、手动 ack 且不并发处理时，顺序性最强。但一旦多个消费者并发消费、失败重试、重新入队、死信转发，就可能破坏业务观察到的顺序。

如果业务要求同一订单有序，可以按订单 ID 分片到固定队列，队列内单消费者处理。这样能换取局部顺序，但吞吐和容错复杂度会受影响。
