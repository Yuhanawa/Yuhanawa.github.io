---
title: LALRPOP 目录&介绍 文档/教程-中文翻译 | LALRPOP Readme Summary
categories: LALRPOP文档翻译
tags:
  - LALRPOP
  - Rust
  - 翻译
  - 教程
slug: "11467"
published: 2023-01-24 19:00:00
index_img:
hidden: true
---
:::warning
内容更新于`2023年1月`, 部分内容可能已经过时, 请注意甄别
:::
---
✏️ 铅笔开头的内容为译者添加
✏️ 翻译自 [LALRPOP 教程 | 目录&介绍 | Readme Summary](http://lalrpop.github.io/lalrpop/index.html) 
✏️ 这篇是介绍&目录部分,  目录为双语目录,  链接为译文链接
✏️ [完整的中文文档(共9篇19k字):](<https://yuhanawa.github.io/posts/2023/57877/>) <https://yuhanawa.github.io/posts/2023/57877>
✏️ 施工中... 英文目录为未翻译


## 目录 Summary

- [LALRPOP介绍&目录(本文)](https://yuhanawa.github.io/posts/2023/11467/)
- [解析器基础速成|Crash course on parsers](https://yuhanawa.github.io/posts/2023/51562/)
- [快速开始|Quick start guide](https://yuhanawa.github.io/posts/2023/17808/)
- [手册|Tutorial](https://yuhanawa.github.io/posts/2023/57877/)
  - [添加 LALRPOP 到你的项目|Adding LALRPOP to your project](https://yuhanawa.github.io/posts/2023/57877/#01)
  - [解析(括号内的)数字|Parsing parenthesized numbers](https://yuhanawa.github.io/posts/2023/57877/#02)
  - [类型推断|Type inference](https://yuhanawa.github.io/posts/2023/57877/#03)
  - [处理完整的表达式|Handling full expressions](https://yuhanawa.github.io/posts/2023/57877/#04)
  - [构建AST抽象语法树|Building ASTs](https://yuhanawa.github.io/posts/2023/57877/#05)
  - [宏|Macros](https://yuhanawa.github.io/posts/2023/57877/#06)
  - [从动作代码中返回错误|Fallible actions](https://yuhanawa.github.io/posts/2023/57877/#07)
  - [错误恢复|Error recovery](https://yuhanawa.github.io/posts/2023/57877/#08)
  - [传递状态参数|Passing state parameter](https://yuhanawa.github.io/posts/2023/57877/#09)
- [未翻译|Controlling the lexer](http://lalrpop.github.io/lalrpop/lexer_tutorial/index.html)
  - [未翻译|LALRPOP's lexer generator](http://lalrpop.github.io/lalrpop/lexer_tutorial/index.html)
  - [未翻译|Writing a custom lexer](http://lalrpop.github.io/lalrpop/lexer_tutorial/index.html)
  - [未翻译|Using tokens with references](http://lalrpop.github.io/lalrpop/lexer_tutorial/index.html)
- [高级设置|Advanced setup](https://yuhanawa.github.io/posts/2023/21239/)
  - [在源代码树中生成|Generate in source tree](https://yuhanawa.github.io/posts/2023/21239/#generate_in_source)

-----------


## LALRPOP

LALRPOP 是一个解析器生成器(parser generator), 原理上类似于 [YACC] (✏️ 404 Not Found),  [ANTLR],  [Menhir] , 以及其他此类程序. 
总的来说, 它的宏伟目标是成为有史以来最有用的解析器生成器. 这个目标肯定没有完全实现：现在, 它是比较普通(fairly standard)的, 甚至在某些方面有点不合格. 但是, 它还很年轻.   

这份文件大部分内容在描述 LALRPOP 当前的状况,  部分内容包括了对未来计划中的变化的说明.   


## ✏️ 介绍(AI生成)
### LALRPOP 是一个用于 Rust 语言的 LR(1) 解析器生成器。它可以从用户定义的语法规则生成一个解析器。
LALRPOP 的主要功能有:
1. 从用户定义的上下文无关文法(CFG)生成 LR(1) 解析表和 GOTO 表,构造一个 LR(1) 解析器。
2. 支持自动 error recovery,可以在解析错误时自动进行错误恢复。
3. 生成的解析器以 Rust 代码形式输出,方便与 Rust 项目集成。
4. 支持参数化规则,可以定义泛型解析器。
5. 支持空 Productions,以实现可选符号。
6. 可视化的解析过程,可以更直观地理解表驱动解析。
使用 LALRPOP 的典型步骤是:
1. 定义语法规则:使用类 EBNF 记法定义上下文无关文法。
2. 运行 LALRPOP:使用 cargo-lalrpop 运行 LALRPOP 生成 Rust 代码。
3. 使用解析器:在项目中引入解析器代码,调用解析器解析输入字符串。
4. 处理语义动作:在解析过程中,使用自定义代码处理语义动作。
LALRPOP 是实现编译器等语言处理工具的有力工具,通过它可以更简单地构造一个强大的解析器。
总之,LALRPOP 是一个非常实用的工具,值得学习和使用。


[YACC]: http://dinosaur.compilertools.net/yacc/
[ANTLR]: http://www.antlr.org/
[Menhir]: http://gallium.inria.fr/~fpottier/menhir/




---
<md id="conditional-compilation"/>

## conditional-compilation.md  
✏️ 该内容独暂一页, 但没有任何链接指向该页面, 推测该内容还在编写中, 但已经4年没有更新了, 所以暂时将此内容放置在此


LALRPOP 支持通过 `#[cfg(feature = "FEATUERE")]` 属性对 公共非终结符声明 进行条件性编译. 
如果在构建脚本中运行, LALRPOP 将自动从 `cargo` 中获取特性并使用这些特性. 
另外, 也可以使用 `Configuration` 类型来设置明确的特征集(features set). 
```rust
#[cfg(feature = "FEATURE")]
pub MyRule : () = {
    ...
};
```
