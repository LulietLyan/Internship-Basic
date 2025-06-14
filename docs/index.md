---
hide:
    - date
    - navigation
    - toc
home: true
statistics: true
comments: true
---


<style>
    .custom-font {
    font-size: 58px; /* 默认字体大小为8px */
    color:rgb(4, 73, 47);
}
@media (max-width: 768px) { /* 假设768px及以下为移动端 */
    .custom-font {
        font-size: 32px; /* 移动端字体大小为6px */
    }
}
</style>

# ✨ SYSU-CS-Basic

<center><font class="custom-font ml3">「博学 审问 慎思 明辨 笃行」</font></center>
<script src="https://cdn.statically.io/libs/animejs/2.0.2/anime.min.js"></script>

<div class="grid cards" markdown>

-  :material-notebook-edit-outline:{ .lg .middle } __SYSU-CS-Basic__

    ---
    ⚡ 还能再「快」一点

    求职重担，如临高山🏔

    资料繁冗、琐碎，令人却步💢

    我们沉迷过琐碎日常💭

    也都被迫快速上手，快速掌握，快速出发🤗

    我们致力于搭建一座精炼高效的知识库🏫

    愿它成为后来者的明灯💡

    <span style="text-align: right; display: block;">Concat me: :material-email: lulietlyan@gmail.com </span>  
        

</div>
<style>
    @media only screen and (max-width: 768px) {
        .responsive-image {
            display: none;
        }
    }
</style>

***

<div class="grid cards" markdown>

-  :octicons-graph-16:{ .lg .middle } __Statistics__

    ---

    - :material-file-document-outline: 页面数：  **{{pages}}**  
    - :material-alphabetical: 总字数： **{{words}}**   
    - :material-code-tags: 代码行数： **{{codes}}**   
    - :material-image-multiple: 图片数量： **{{images}}** 
    - :material-calendar: 网站创建日期：2025 年 5 月 31 日
    <script defer src="https://events.vercount.one/js"></script>
    - :material-timer-outline: 网站运行时间： <span id="web-time"></span> 
    - :material-chart-line: 本站总访问量：<span id="vercount_value_site_pv"></span>次  
    - :material-account: 本站访客数：<span id="vercount_value_site_uv"></span>人次  
    
-  :material-link:{ .lg .middle } __Link__

    ---
    - :material-star-outline:{ .lg .middle } 本站样式特别鸣谢:
        - [dearrongerr](https://dearrongerr.github.io/Rongerr.github.io/)
    - :material-link-variant:{ .lg .middle } [友链](./logs/4_flink.md)
    - :material-update:{ .lg .middle } [最近更新](./logs/2_updatelog.md)
    - :material-comment-text-multiple:{ .lg .middle } [留言板](./logs/6_waline.md)
</div>

<style>
.md-grid {
  max-width: 1220px;
}
</style>

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