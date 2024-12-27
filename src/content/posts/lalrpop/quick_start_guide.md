---
title: LALRPOP 快速开始 文档/教程-中文翻译 | LALRPOP Quick start guide
category: LALRPOP文档翻译
tags:
  - LALRPOP
  - Rust
  - 翻译
  - 教程
slug: "17808"
published: 2023-01-24 22:50:00
index_img:
hidden: true
---
:::warning
内容更新于`2023年1月`, 部分内容可能已经过时, 请注意甄别
:::
---
✏️ 铅笔开头的内容为译者添加
✏️ 翻译自 [LALRPOP 教程 | 快速开始 | Quick start guide](http://lalrpop.github.io/lalrpop/quick_start_guide.html) 
✏️ 导航: **[<<[上篇-基础速成]](https://yuhanawa.github.io/posts/2023/51562/) - [[目录]](https://yuhanawa.github.io/posts/2023/11467/) - [[下篇-正式教程]>>](https://yuhanawa.github.io/posts/2023/57877/)**
✏️ [完整的中文文档(共9篇19k字):](<https://yuhanawa.github.io/posts/2023/57877/>) <https://yuhanawa.github.io/posts/2023/57877>

## 快速开始 | Quick start 

要开始使用 LALRPOP, 最好是阅读[教程](https://yuhanawa.github.io/posts/2023/57877/), 它将向你介绍 LALRPOP 文件的语法, 等等.  
但是如果你以前做过这个, 或者你是那种*没有耐心*的人.这里有一个快速的 "小抄", 用于设置你的项目. 首先, 添加以下几行到你的 `Cargo.toml`:

```toml
[package]
...
build = "build.rs" # LALRPOP preprocessing

# 生成的代码依赖于 lalrpop-util.
# 
# 生成的标志器依赖于 regex crate.
# 
# (如果你写了自己的标记器,或者已经有了 regex crate，你可以跳过这个依赖)
[dependencies]
lalrpop-util = "0.19.8"
regex = "1"

# 添加构建时的 lalrpop 依赖:
[build-dependencies]
lalrpop = "0.19.8"

# 如果你提供你自己的外部 lexer，你可以通过禁用 default-features 来使其不包括内置 lexer 功能。
# lalrpop = { version = "0.19.1", default-features = false }
```

接下来创建一个 [`build.rs`](https://doc.rust-lang.org/cargo/reference/build-scripts.html) 文件, 看起来像这样:

```rust
extern crate lalrpop;

fn main() {
    lalrpop::process_root().unwrap();
}
```



(如果你已经有一个`build.rs`文件了, 无论该文件在做什么, 你可以直接调用`process_root`)

这就行了, 注意`process_root`只是使用默认设置.
如果你想配置 LALRPOP 的执行方式, 请看 [高级设置|Advanced setup](/posts/2023/21239/).  



### 手动运行

如果你愿意, 你也可以将 `lalrpop` crate作为一个可执行文件.只需运行`cargo install lalrpop`, 然后你就会得到一个可执行的二进制文件, 像这样:

```APPLESCRIPT
lalrpop file.lalrpop
```

这将为你生成`file.rs`.注意, 它只在`file.lalrpop`比`file.rs`新的情况下执行
如果你想无条件地执行, 请传递参数`-f`（也可以尝试`--help`以获得其他选项）.

