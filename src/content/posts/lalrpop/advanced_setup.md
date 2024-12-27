---
title: LALRPOP 高级设置 文档/教程-中文翻译 | LALRPOP Advanced setup
category: LALRPOP文档翻译
tags:
  - LALRPOP
  - Rust
  - 翻译
  - 教程
slug: "21239"
published: 2023-01-24 22:50:00
index_img:
hidden: true
---
:::warning
内容更新于`2023年1月`, 部分内容可能已经过时, 请注意甄别
:::
---
✏️ 铅笔开头的内容为译者添加
✏️ 翻译自 [LALRPOP 教程 | 高级设置 | Advanced setup](http://lalrpop.github.io/lalrpop/advanced_setup.html) 
✏️ 导航: **[<<[上篇-正式教程]](https://yuhanawa.github.io/posts/2023/17808/) - [[目录]](https://yuhanawa.github.io/posts/2023/11467/) - [[下篇-这是最后一篇]>>](https://yuhanawa.github.io/posts/2023/11467/)**
✏️ [完整的中文文档(共9篇19k字):](<https://yuhanawa.github.io/posts/2023/57877/>) <https://yuhanawa.github.io/posts/2023/57877>


## 高级设置|Advanced setup

当你设置 LALRPOP 时, 你创建了一个 `build.rs` 文件, 看起来像这样:

```rust
extern crate lalrpop;

fn main() {
    lalrpop::process_root().unwrap();
}
```

这个 `process_root()` 调用只是使用了默认的配置. 所以它会在*当前路径(in-place)*（在你的`src`目录下）下把`.lalrpop`文件转化为`.rs`文件. 而且只有在 `.lalrpop` 文件发生改变时才会进行. 但是你也可以使用[`Configuration`][config] 结构来获得更精确(detailed)的控制. 

[config]: https://docs.rs/lalrpop/*/lalrpop/struct.Configuration.html



比如, 想要**强制**在输出中使用颜色（忽略TTY设置）, 你这样修改你的`build.rs`. 

```rust
extern crate lalrpop;

fn main() {
    lalrpop::Configuration::new()
        .always_use_colors()  // ✏️ 添加这行
        .process_current_dir();
}
```
  

<md id="generate_in_source"/>  

### 在源代码树中生成|Generate in source tree
✏️ [原文](http://lalrpop.github.io/lalrpop/generate_in_source.html)为单独一页 现在将其整合为一页

在0.15版本以前, LALRPOP 是在输入文件的同一目录下生成文件. 从0.16开始, 文件生成在Cargo的**输出目录**. 

如果你想保持以前的习惯, 你可以调用`generate_in_source_tree`. 
在你的配置中:

```rust
extern crate lalrpop;

fn main() {
    lalrpop::Configuration::new()
        .generate_in_source_tree() //✏️ 添加这行
        .process();
}
```

对于每一个 `foo.lalrpop` 文件, 你可以简单地在你的源代码树中设置`mod foo;`. `lalrpop_mod`宏在这种模式下不是很有用. 
