---
title: LALRPOP Tutorial 教程/文档-中文翻译 | LALRPOP Tutorial Chinese Book | LALRPOP是Rust写的解析器生成器
category: LALRPOP文档翻译
tags:
  - LALRPOP
  - Rust
  - 翻译
  - 教程
slug: "57877"
published: 2023-01-25 19:00:00
index_img:
hidden: true
---
:::warning
内容更新于`2023年1月`, 部分内容可能已经过时, 请注意甄别
:::
---
✏️ 铅笔开头的内容为译者添加
✏️ 翻译自 [LALRPOP 教程 | 学习手册/教程/文档 | Tutorial](http://lalrpop.github.io/lalrpop/tutorial/index.html)
✏️ 导航: **[<<[上篇-快速开始]](https://yuhanawa.github.io/posts/2023/17808/) - [[目录]](https://yuhanawa.github.io/posts/2023/11467/) - [[下篇-高级设置]>>](https://yuhanawa.github.io/posts/2023/21239/)**
✏️ 原文共 9 节,译文合为一页,本章目录在右侧

<md id="00"/>

## 序言 | Index

这是一个关于如何使用 LALRPOP 编写一个简单的计算器的完整的解析器的教程.

如果你不熟悉什么是解析器生成器(parser generator), 你应该先阅读[解析器基础速成 | Crash course on parsers].

本教程仍然不完整. 如果有时间会再写以下内容:

- 关于解决 shift-reduce 和 reduce-reduce 冲突的建议
- 向 Action Code 传递 状态和类型/生命周期 参数 (see e.g. [this test](https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/expr_arena.lalrpop) invoked [from here]).
- 使用 `@L` 和` @R` 进行位置跟踪 (see e.g. [this test](https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/intern_tok.lalrpop)).
- 与外部标记器(tokenizers)集成 (see e.g. [this test](https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/expr.lalrpop) invoked [from here]).
- 有条件的宏 (目前还没有好的测试, sorry)
- 返回 `Result` 的代码容易发生的错误 (see e.g. [this test](https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/error.lalrpop) invoked [from here]).
- 转换为使用 `LALR(1)` 替代 `LR(1)` (see e.g. [this test](https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/expr_lalr.lalrpop) invoked [from here]).
- 未来一些功能的计划

✏️ 但这篇教程已经 13 个月没有更新了 (ノ｀ Д)ノ

[解析器基础速成 | Crash course on parsers]: https://yuhanawa.github.io/posts/2023/51562/
[from here]: https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/lib.rs

<md id="01"/>

## [1]添加 LALRPOP 到 `Cargo.toml`|Adding LALRPOP to your `Cargo.toml` file

✏️ 这篇大致上是[快速开始](https://yuhanawa.github.io/posts/2023/17808/)的详细版本
✏️ 可以快速浏览或[跳到 02](#02)

LALRPOP 作为一个预处理器, 可以与 Cargo 在一起工作. 当 LALRPOP 被调用时, 它会在源代码目录中搜索扩展名为 `lalrpop` 的文件并创建相应的 `rs` 文件. 例如, 如果我们有一个 `calculator.lalrpop` 的文件, 预处理程序会创建一个 Rust 文件 `calculator.rs`.
顺便说一下, LALRPOP 的语法有意接近于 Rust, 所以应该可以使用 Rust 的扩展插件来编辑 lalrpop 文件. 只要它不太挑剔(emacs 的 rust-mode 就可以很好地工作).

首先, 让我们使用 `cargo new` 来建立一个新的项目. 我们把它叫做
`calculator` (计算器):

```shell
> cargo new --bin calculator
```

我们现在需要编辑生成的 [`calculator/Cargo.toml`][calculator-Cargo.toml] 文件来调用 LALRPOP 预处理程序. 生成的文件应该长这样:

[calculator-Cargo.toml]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/Cargo.toml

```toml
[package]
name = "calculator"
version = "0.1.0"
authors = ["Niko Matsakis <niko@alum.mit.edu>"]

[build-dependencies] # <-- 我们添加了这行和后面的内容!
lalrpop = "0.19.8"

[dependencies]
lalrpop-util = "0.19.8"
regex = "1"
```

```lalrpop
use std::str::FromStr;

grammar;

pub Term: i32 = {
    <n:Num> => n,
    "(" <t:Term> ")" => t,
};

Num: i32 = <s:r"[0-9]+"> => i32::from_str(s).unwrap();
```

Cargo 可以运行 [build scripts] 作为预处理步骤. 默认名为 "build.rs". `[build-dependencies]` 部分指定了构建脚本的依赖项 -- 在本例中, 只有 LALRPOP .

[build scripts]: https://doc.rust-lang.org/cargo/reference/build-scripts.html

`[dependencies]` 部分描述了 LALRPOP 在运行时需要的依赖项. 所有的 LALRPOP 项目必须添加 `lalrpop-util` crate. 此外, 如果你不想手动编写词法分析器(lexer), 你需要添加 `regex` crate 作为依赖. (如果你不知道什么是词法器, 不要担心, 这并不重要. 因为我们将在[下一节-解析数字]中介绍它. 如果你*知道*什么是词法分析器, 并且你想知道如何用手写一个词法分析器并在 LALRPOP 中使用它, 那么请查看[词法分析器教程 | lexer tutorial](链接为原文档, 未翻译)).

[下一节-解析数字]: #02
[词法分析器教程 | lexer tutorial]: (http://lalrpop.github.io/lalrpop/lexer_tutorial/index.html)

接下来我们要添加 `build.rs` 文件. 对于那些不熟悉[该功能](✏️ 指[build scripts])的人, `build.rs` 文件应该放在你的 `Cargo.toml` 文件旁边, 而不是与你的 Rust 代码放在 `src` 文件夹下, `build.rs` 应该是下面的样子:

[该功能]: https://doc.rust-lang.org/cargo/reference/build-scripts.html

```rust
extern crate lalrpop;

fn main() {
    lalrpop::process_root().unwrap();
}
```

函数 `process_root` 会处理你的 `src` 目录, 将所有 `lalrpop` 文件转换为 `rs` 文件. 它非常聪明, 可以检查时间戳, 如果 `rs` 文件比 `lalrpop` 文件新, 则不进行任何操作并将生成的 `rs` 文件标记为只读. 它返回一个 `io::Result<()>` , 所以 `unwrap()` 调用只是断言没有发生文件系统错误发生.

**NOTE:** 在 Windows 上, 必要的 API 还不稳定, 所以时间戳检查被禁用.

<md id="02"/>

## [2]解析(括号内的)数字|Parsing parenthesized numbers

OK, 现在我们已经准备好开始编写一个 LALRPOP 语法了. 在我们处理完整的表达式之前, 让我们从简单的东西开始 -- 真的超级简单. 让我们从括号内的整数开始, 比如 `123` 或 `(123)` , 甚至是 `(((123))`. Wow.

为了处理这个问题, 我们需要添加一个[`calculator1.lalrpop`][calculator1], 如下所示. 注意:为了解释起来更容易, 这个是最完整的代码. 下一节将通过采用 LALRPOP 提供的一些简便方法(shorthands)使其更简洁.

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
use std::str::FromStr;

grammar;

pub Term: i32 = {
    <n:Num> => n,
    "(" <t:Term> ")" => t,
};

Num: i32 = <s:r"[0-9]+"> => i32::from_str(s).unwrap();
```

让我们一点一点地看一下. 文件的第一部分是 `use` 语句和 `grammar` 语句. 你会在每个 LALRPOP 语法的顶部找到它们. 就像在 Rust 中一样, `use` 语句只是用来导入文件 事实上, 这些 `use` 语句只是根据需要复制到生成的 Rust 代码中.

_关于下划线和衍生文件的说明:_ LALRPOP 生成的自己的名字至少有两个前导下划线. 为了避免冲突, 如果它看到你使用的标识符也有两个下划线, 它将添加更多的下划线. 但是如果你使用全局导入以`__`开头的文件, 你可能会发现存在冲突. 为了避免这种情况, 不要使用全局导入(或者在其他地方定义一些带有两个下划线的名字).

**非终结符声明**在 `grammar` 声明完后是一堆的*非终结符声明*. 这个语法有两个非终结符, `Term` 和 `Num`. 非终结符只是我们给可以被解析的东西起的一个名字, 然后根据其他内容定义每个非终结符.

让我们从文件末尾的 `Num` 开始, 它的声明如下.

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Num: i32 =
    <s:r"[0-9]+"> => i32::from_str(s).unwrap();
```

此声明表示 `Num` 的类型为 `i32` . 这意味着当我们从输入文本中解析一个 `Num` 时, 我们将生成一个类型为`i32`的值. `Num`的定义是 `<s:r"[0-9]+">` . 让我们从内到外看仔细一下. 符号 ` r"[0-9]+"` 是一个正则表达式 —— 这与 Rust 原始字符串相同. (而且, 跟在 Rust 中一样, 如果需要嵌入引号, 可以使用 hashes, 例如 `r#"..."..."#`)它将与符合正则表达式的字符串相匹配: 在本例中是一些数字. 这个匹配的结果是我们正在解析的输入文本中的一个切片(slice) `&'input str`(引用,不作复制).

此正则表达式用尖括号括起来并标记为: `<s:r"[0-9]+">`. 通常, 在 LALRPOP 中使用尖括号来表示将在*动作代码(Action Code)*(指解析`Num`时执行的代码)使用的值, 在本例中, 与正则表达式匹配的字符串绑定到变量` s`, `i32::from_str(s).unwrap()` 会解析该字符串创建并返回一个 `i32`.

OK, 现在我们来看看非终结符 `Term`.

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
pub Term: i32 = {
    <n:Num> => n,
    "(" <t:Term> ")" => t,
};
```

首先, 此非终结符声明为 `pub`. 这意味着 LALRPOP 将生成一个公共结构(正如我们将看到的, 命名为 `TermParser`), 您可以使用它将字符串解析为 `Term` . 私有非终结符(如`Num`)只能在语法本身内部使用, 不能从外部使用. `Term` 非终结符有两个可供选择的定义, 可以用 `{ alternative1, alternative2 }` 来表示. 在这个例子中, 第一个选项是 `<n:Num>`, 这表示 `Term` 可以是一个数字. 所以`22`是一个 `Term` . 第二个选择是 `"(" <t:Term> ")"`, 表示 `Term` 也可以是带括号的 `Term`, 所以 `(22)` 是 `Term`, `((22))`, `((((((22))))))` 等也是`Term`

**调用解析器** OK, 我们编写了解析器, 该如何使用它呢? 对于每个声明为 `pub` 的非终结符 `Foo`, LALRPOP 将通过 `parse` 方法导出 `FooParser` 结构, 您可以调用该方法将字符串解析为该非终结符. 下面是我们通过添加到[`main.rs`][main]文件中的一个简单测试来使用此结构来测试我们的 `Term` 非终结符:

```rust
#[macro_use] extern crate lalrpop_util;

lalrpop_mod!(pub calculator1); // synthesized by LALRPOP

#[test]
fn calculator1() {
    assert!(calculator1::TermParser::new().parse("22").is_ok());
    assert!(calculator1::TermParser::new().parse("(22)").is_ok());
    assert!(calculator1::TermParser::new().parse("((((22))))").is_ok());
    assert!(calculator1::TermParser::new().parse("((22)").is_err());
}
```

parse 方法的完整签名如下所示:

```rust
fn parse<'input>(&self, input: &'input str)
                     -> Result<i32, ParseError<usize,(usize, &'input str),()>>
                     //        ~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     //         |                       |
                     // Result upon success             |
                     //                                 |
                     //             Error enum defined in the lalrpop_util crate
{
    ...
}
```

<md id="03"/>

## [3]类型推断|Type inference

OK, 现在我们理解了[the calculator1 example][calculator1], 让我们通过 LALRPOP 提供的一些简便方法来使代码更加简洁, 这段代码可以在[the calculator2 demo][calculator2]中找到.

首先, 让我们看看我们之前 `Term` 的定义:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
pub Term: i32 = {
    <n:Num> => n,
    "(" <t:Term> ")" => t,
};
```

这里的动作代码(ActionCode)有点儿意思. 在这两种情况下, 它都没有做任何新的工作, 只是选择一个由另一个非终结符产生的值. 事实上, 这很常见. 所以 LALRPOP 为其提供了一些简便方法, 这是[the calculator2 demo][calculator2]中 `Term` 的定义:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
pub Term = { Num, "(" <Term> ")" };
```

在这里根本就没有动作代码(ActionCode). 如果没有动作代码, LALRPOP 就会自动生成动作代码, 取被匹配事物的值. 在第一个选项 `Num` 的情况下, 只有一个匹配项被匹配, 所以这表明无论 `Term` 的值是什么, 都与我们解析的 `Num` 的值相同.

在第二个选项中, `"(" <Term> ")"`, 有三个字符(串)被匹配. 在这里, 我们用角括号来选择我们要取的值 --- 我们只选择了一个值, 所以我们取了我们解析的 `Term` 的值. 如果我们选择了一个以上的值, 那么结果将是所有选择的值的一个元组. 如果我们没有选择任何值(即 `"(" Term ")"` ), 结果将是所有值的一个元组, 所以返回类型是 `(&'input str, i32, &'input str)`.

说到类型, 你可能已经注意到 `Term` 没有类型注释. 由于我们没有编写动作代码, 我们可以省略类型注释, 让 LALRPOP 为我们推断. 在此例中, LALRPOP 会推测 `Term` 与 `Num` 必须具有相同的类型, 因此类型必须是`i32`.

OK, 让我们看看之前在[calculator1]中看到的 `Num` 的定义.

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Num: i32 = <s:r"[0-9]+"> => i32::from_str(s).unwrap();
```

这个定义也可以做得更短一些. 在[calculator2],你会发现:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Num: i32 = r"[0-9]+" => i32::from_str(<>).unwrap();
```

在这里, 我们没有将`s`赋值为正则表达式的匹配结果, 而是修改了动作代码(ActionCode), 使用了简短的表达式 `<>` . 这是一个简便方法, 表示 "synthesize names for the matched values and insert a comma-separated list here" 在此例中, 只有一个匹配值, `r"[0-9]+"`, 它返回一个`&'input str'`, 所以 LALRPOP 将为该值插入一个生成的变量. 注意, 我们仍然有自定义的动作代码, 所有仍然需要类型注释.

要控制在动作代码中使用` <>` 表达式时选择的值, 可以使用前面看到的尖括号. 以下是一些示例可供参考, 以便利于用你自己的想法去拓展它们:

| Alternative               | Equivalent to                   |
| ------------------------- | ------------------------------- |
| `A => bar(<>)`            | `<a:A> => bar(a)`               |
| `A B => bar(<>)`          | `<a:A> <b:B> => bar(a, b)`      |
| `A B => (<>)`             | `<a:A> <b:B> => (a, b)`         |
| `<A> B => bar(<>)`        | `<a:A> B => bar(a)`             |
| `<p:A> B => bar(<>)`      | `<p:A> B => bar(p)`             |
| `<A> <B> => bar(<>)`      | `<a:A> <b:B> => bar(a, b)`      |
| `<p:A> <q:B> => bar(<>)`  | `<p:A> <q:B> => bar(p, q)`      |
| `<p:A> B => Foo {<>}`     | `<p:A> B => Foo {p:p}`          |
| `<p:A> <q:B> => Foo {<>}` | `<p:A> <q:B> => Foo {p:p, q:q}` |

表达式也适用于结构构造函数(如上面例子中的`Foo {...}`). 如果解析值的名称与结构字段的名称相匹配时效果会很好.

<md id="04"/>

## [4]处理完整的表达式|Handling full expressions

现在我们准备扩展我们的计算器来处理完整的算术表达式(至少涵盖了你小学学习的表达式). 下面是 [下一节的计算器示例,calculator3][calculator3]:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
use std::str::FromStr;

grammar;

pub Expr: i32 = {
    <l:Expr> "+" <r:Factor> => l + r,
    <l:Expr> "-" <r:Factor> => l - r,
    Factor,
};

Factor: i32 = {
    <l:Factor> "*" <r:Term> => l * r,
    <l:Factor> "/" <r:Term> => l / r,
    Term,
};

Term: i32 = {
    Num,
    "(" <Expr> ")",
};

Num: i32 = {
    r"[0-9]+" => i32::from_str(<>).unwrap(),
};
```

这个示例最有趣的地方在于它如何编码优先级. 优先级的概念当然是在像`2+3*4`这样的表达式中,我们需要先乘除后加减. 但 LALRPOP 没有内置的功能来给运算符赋予优先级,主要是因为我认为这些功能有些可怕(creepy),不过在语法中通过分层结构来实现优先级还是相当简单的 —— 例如,非终结符`Expr`涵盖所有的表达式. 它由一系列相互加减的`Factor`(因子)组成. 一个`Factor`就是一系列被乘或除的项. 最终,`Term`是一个单独的数字或一个用括号包裹的完整的表达式.

从这个例子出发, 编码优先级的典型模式是有每个优先级对于一个非终端符,从最低优先级的运算符 (`+`, `-`) 开始,然后加入下一个优先级 (`*`, `/`) , 最后加入像 `Num` 这样的 "atomic(原子)" 表达式. 最后,在 atomic 表达式中加入括号包裹起来的顶级非终结符(top-level),这样可以让人们重复这段操作来设置下一个优先级(which lets people reset.)

要知道为什么这样做, 请考虑像 `2+3*4` 有两种可能的解析树:

```
2 + 3   *    4          2   +  3   *    4
| | |   |    |          |   |  |   |    |
| | +-Factor-+    OR    +-Expr-+   |    |
| |     |                   |      |    |
+-Expr -+                   +----Factor-+
```

在第一种中,我们给乘法更高的优先级,在第二个种,我们(错误地)给加法更高的优先级. 如果你现在看一下语法, 你会发现第二种是不可能的: `Factor` 不能包含 `Expr` 作为其组成成分. 这就是分层结构的目的:迫使解析器采取你想要的优先级.

最后,请注意我们只在我们需要解析的的非终结符(`Expr`)之前写`pub`,而不是所有. 标记为`pub`的非终结符会生成额外的代码, 比如可以从其他模块访问解析器调用的`new()`方法. 如果你`pub`了不需要`pub`的非终结符, 你得到一个关于`FooParser`的未使用`new()`方法的警告,请从非终结符`Foo`中删除`pub`.

<md id="05"/>

## [5]构建 AST 抽象语法树|Building ASTs

大多数时候,当你进行解析时,你并不希望计算一个值,你是想构建某种数据结构. 下面是一个简单的例子来说明在 LALRPOP 中是如何做到这一点的. 首先, 我们需要*定义*我们将要构建的数据结构. 我们将构建一个非常简单的 `enum`:

```rust
pub enum Expr {
    Number(i32),
    Op(Box<Expr>, Opcode, Box<Expr>),
}

pub enum Opcode {
    Mul,
    Div,
    Add,
    Sub,
}
```

我们将此代码放入项目中的[`ast.rs`模块][astrs]中,并为它添加 `Debug`impl 以便更好地打印输出. 现在我们将创建[calculator4]示例,它将用来构建这个语法树. 首先,让我们只看`Expr`非终结符,它将向你展示它是如何完成的大部分内容(最有趣的几行已经用注释标出):

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
use std::str::FromStr;
use ast::{Expr, Opcode}; // (0)

grammar;

pub Expr: Box<Expr> = { // (1)
    Expr ExprOp Factor => Box::new(Expr::Op(<>)), // (2)
    Factor,
};

ExprOp: Opcode = { // (3)
    "+" => Opcode::Add,
    "-" => Opcode::Sub,
};
```

首先,我们必须通过添加 `use` 语句将这些新名称导入文件(0). 接下来,我们想生成`Box<Expr>` 值,所以我们将`Expr`(以及`Factor`和`Term`)的类型更改为`Box<Expr>`(1). 相应的动作代码在(2)中更改;这里我们使用`<>`扩展来为`Expr::Op`提供三个参数. 最后,为了简洁,我们引入了一个`ExprOp`非终结符(3)来覆盖两个动作代码,现在它们触发相同的动作代码(之前它们触发不同的动作代码).

`Factor`的定义以类似的方式进行了转换:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Factor: Box<Expr> = {
    Factor FactorOp Term => Box::new(Expr::Op(<>)),
    Term,
};

FactorOp: Opcode = {
    "*" => Opcode::Mul,
    "/" => Opcode::Div,
};
```

最后,我们调整`Term`和`Num`的定义. 在`Num`转化到`Term`时,我们将原始的`i32`转换为`Box < Expr >`(4):

```rust
Term: Box<Expr> = {
    Num => Box::new(Expr::Number(<>)), // (4)
    "(" <Expr> ")"
};

Num: i32 = {
    r"[0-9]+" => i32::from_str(<>).unwrap()
};
```

现在我们可以通过向我们的[main.rs][main]文件添加一些代码来测试它,该代码会解析一个表达式并使用 `Debug` impl 格式化打印输出:

```rust
lalrpop_mod!(pub calculator4);
pub mod ast;

#[test]
fn calculator4() {
    let expr = calculator4::ExprParser::new()
        .parse("22 * 44 + 66")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "((22 * 44) + 66)");
}
```

<md id="06"/>

## [6]宏|Macros

在写语法时, 我们经常会遇到一些重复的结构,这时我们会进行复制粘贴. 一个常见的例子是定义类似 "逗号分隔的列表" 的东西. 假设我们想解析逗号分隔的表达式列表(当然,还有可选的尾随逗号). 如果我们要完整地写出来,它会看起来像:

```
Exprs: Vec<Box<Expr>> = {
    Exprs "," Expr => ...,
    Expr => vec![],
}
```

当然,这并没有处理尾随逗号,而且我省略了动作代码. 如果我们加上这些, 它会变得更复杂. 到目前为止, 这很好, 但是之后我们还想要逗号分隔的术语列表怎么办?我们只能靠复制粘贴吗?

LALRPOP 提供了一个更好的选择. 你可以定义宏. 实际上,LALRPOP 内置了四个宏: `*`, `?`, `+`, `(...)`. 例如, 你可以使用`Expr?`表示 "一个可选的`Expr`". 这将使类型变为`Option<Box<Expr>>`(因为`Expr`本身的类型就是`Box<Expr>`). 类似的, 你可以通过写`Expr*`或`Expr+`来得到一个`Vec<Expr>`(最小长度分别为 0 和 1). 最后一个宏是括号, 它是创建一个新的非终端符的简写. 这让你可以写出像`(<Expr> ",")?`这样的东西来表示"可选地解析一个后面带有一个逗号的`Expr`". 请注意`Expr`周围的角括号: 这些确保`(<Expr> ",")`的值是表达式的值, 而不是表达式和逗号的元组. 这意味着`(<Expr> ",")?`的类型是`Option<Box<Expr>>` (而不是 `Option<(Box<Expr>, &'input str)>`).

使用这些操作,我们可以使用宏`Comma<T>`定义`Exprs`来创建`T`的逗号分隔列表,不管`T`是什么类型(此定义出现在[calculator5]中):

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
pub Exprs = Comma<Expr>; // (0)

Comma<T>: Vec<T> = { // (1)
    <mut v:(<T> ",")*> <e:T?> => match e { // (2)
        None => v,
        Some(e) => {
            v.push(e);
            v
        }
    }
};
```

第(0)行的`Exprs`定义相当明显, 它只使用了 `Comma<Expr>`宏. 让我们看看第(1)行的`Comma<T>`的定义. 这有点紧凑, 所以让我们把它先拆开. 首先, `T`是某个终结符或非终结符. 但请注意我们也可以将其用作类型: 当宏展开时, 类型中的`T`将被替换成"不管`T`是什么类型".

接下来,在(2)中,我们解析 `<mut v:(<T> ",")*> <e:T?>` .

这里有很多符号, 所以我们先去掉所有的尖括号, 这些角括号只是用来告诉 LALRPOP 你想传递哪些值, 哪些值要丢弃. 去除一些符号后变成了`(T ",")* T?`.
希望您可以看出这是匹配一个带有可选尾随逗号的逗号分隔列表. 现在让我们把这些尖括号加回来. 在包裹在小括号中,我们得到 `(<T> ",")*` -- 这只意味着我们保留`T`的值, 但在构建我们的向量时丢弃逗号的值. 然后我们捕获该向量并将其称为 `v`: `<mut v:(<T> ",")*>`,`mut`使`v`在动作代码中是可变的. 最后, 我们捕获了可选的尾部元素`e`: `<e:T?>`. 这意味着 Rust 代码有两个可用的变量, `v: Vec<T>` 和 `e: Option<T>`. 在动作代码本身应该是相当清楚的 -- 如果`e`是`Some`, 它就把它追加到 Vec 中并返回结果.

作为使用宏的另一个例子, 你可能记得我们在[calculator4]中看到的优先级层(`Expr`, `Factor`, 等等), 它有一种重复的结构. 你可以用一个宏将其分解. 在这种情况下, 它是一个递归宏:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Tier<Op,NextTier>: Box<Expr> = {
    Tier<Op,NextTier> Op NextTier => Box::new(Expr::Op(<>)),
    NextTier
};

Expr = Tier<ExprOp, Factor>;
Factor = Tier<FactorOp, Term>;

ExprOp: Opcode = { // (3)
    "+" => Opcode::Add,
    "-" => Opcode::Sub,
};

FactorOp: Opcode = {
    "*" => Opcode::Mul,
    "/" => Opcode::Div,
};
```

当然, 我们需要向 [main.rs 文件][main]中添加一些测试:

```rust
#[macro_use] extern crate lalrpop_util;

lalrpop_mod!(pub calculator5);

#[test]
fn calculator5() {
    let expr = calculator5::ExprsParser::new().parse("").unwrap();
    assert_eq!(&format!("{:?}", expr), "[]");

    let expr = calculator5::ExprsParser::new()
        .parse("22 * 44 + 66")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * 44) + 66)]");

    let expr = calculator5::ExprsParser::new()
        .parse("22 * 44 + 66,")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * 44) + 66)]");

    let expr = calculator5::ExprsParser::new()
        .parse("22 * 44 + 66, 13*3")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * 44) + 66), (13 * 3)]");

    let expr = calculator5::ExprsParser::new()
        .parse("22 * 44 + 66, 13*3,")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * 44) + 66), (13 * 3)]");
}
```

<md id="07"/>

## [7]从动作代码中返回错误|Returning errors from actions

有时候,如果动作代码(ActionCode)能够返回错误而不是直接返回`T`类型的值,这会很实用. 这是因为我们通常不能仅通过语法规则拒绝所有无效输入,工作量太大.

即使是在我们的计算器示例中,您也可以看到我们正在"欺骗"系统:我们的语法接受无限位数,但它实际上会被解析为`i32`. 这是一个问题,因为`i32`可以表示的最大数字是 2147483647. 如果给它一个更大的数字,它会触发 Panic,因为它只会考虑到`i32`转换成功的情况.

如果您熟悉 Rust 的错误处理机制,您可能会认为我们可以让`Num`返回`Option<i32>`甚至`Result<i32, ...>`,您说的对. 但是我们并不需要这样子,因为如果我们可以看看 `ExprParser::parse()`的返回类型, 它已经返回了`Result<i32,ParseError>`.所以我们需要的是将其"挂钩"到这个现有的错误机制,并创建可以返回错误的动作代码.

LALRPOP 可以非常容易的通过定义带有 `=>?` 而不是`=>`的动作代码来实现这一点. 返回的值然后被假定为`Result<T, ParseError>`而不是简单的`T`.

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Num: i32 = {
    r"[0-9]+" =>? i32::from_str(<>)
        .map_err(|_| ParseError::User {
            error: "number is too big"
        })
};
```

此外,我们必须在文件的顶部添加`use lalrpop_util::ParseError;`,以便我们可以访问 `ParseError`类型. 您可以在[calculator6.lalrpop][calculator6]中找到完整的代码. 这可以让你很好地处理错误:

```rust
#[macro_use] extern crate lalrpop_util;

lalrpop_mod!(pub calculator6);

#[test]
fn calculator6() {
    // Number is one bigger than std::i32::MAX
    let expr = calculator6::ExprsParser::new().parse("2147483648");
    assert!(expr.is_err());
}
```

No panics!

您甚至可以更进一步,定义您自己的错误类型,例如包含所有可能错误的枚举. 这使您可以更轻松地区分不同的错误,而不是依靠字符串.

为此,假设我们想定义两种错误:

- 输入数字太大
- 输入号码不是偶数 —— 现在我们将计算器修改为仅接受偶数

我们首先在 `main.rs` 中定义我们的错误枚举:

```rust
#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub enum Calculator6Error {
    InputTooBig,
    OddNumber,
}
```

然后我们将其导入我们的语法,并告诉 LALRPOP 将其用作用户错误类型,所以我们需要将文件的顶部更改为:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
use std::str::FromStr;
use ast::{Expr, Opcode};

use super::Calculator6Error;

use lalrpop_util::ParseError;

grammar;

extern {
    type Error = Calculator6Error;
}
```

我们可以通过更改 `Num` 的定义来使用我们的新错误:

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Num: i32 = {
    r"[0-9]+" =>? i32::from_str(<>)
        .map_err(|_| ParseError::User {
            error: Calculator6Error::InputTooBig
        })
        .and_then(|i| if i % 2 == 0 {
            Ok(i)
        } else {
            Err(ParseError::User {
                error: Calculator6Error::OddNumber
            })
        })
};
```

最后,让我们看看效果如何:

```rust
#[macro_use] extern crate lalrpop_util;

lalrpop_mod!(pub calculator6b);

#[test]
fn calculator6b() {
    use lalrpop_util::ParseError;

    let expr = calculator6b::ExprsParser::new().parse("2147483648");
    assert!(expr.is_err());
    assert_eq!(expr.unwrap_err(), ParseError::User { error: Calculator6Error::InputTooBig });

    let expr = calculator6b::ExprsParser::new().parse("3");
    assert!(expr.is_err());
    assert_eq!(expr.unwrap_err(), ParseError::User { error: Calculator6Error::OddNumber });
}
```

太酷啦!(There we go!) 你可以在 [`calculator6b.lalrpop`][calculator6b] 中找到完整代码.

<md id="08"/>

## [8]错误恢复|Error recovery

默认情况下,解析器遇到错误时会立即停止. 但有时我们想要尝试恢复并继续. LALRPOP 可以做到这一点,但您必须通过在语法中定义各种"错误恢复"点来实现它. 这是通过使用特殊的`!` 符号(token)完成的:这个符号只在解析器遇到输入中的错误时出现. 当出现错误时,解析器会尝试恢复并继续; 它通过将`!`符号进入 stream 中,执行它可以执行的任何操作,然后丢弃输入的 tokens,直到找到可以让它继续的 tokens.

让我们看看如何使用错误恢复来恢复在解析时遇到的多个错误. 首先,我们需要一种方式来返回多个错误,因为这不是 LALRPOP 自身做的事情,所以我们添加一个存储在解析时遇到的错误的`Vec`. 由于`!`的结果包含一个 token,但错误恢复要求 token 可以被克隆(cloned). 我们需要用这个替换 LALRPOP 文件中的 "grammar" 行:

```
grammar<'err>(errors: &'err mut Vec<ErrorRecovery<usize, Token<'input>, &'static str>>);
```

Since an alternative containing `!` is expected to return the same type of
value as the other alternatives in the production we add an extra variant to
`Expr` to indicate that an error was found.

```rust
pub enum Expr {
    Number(i32),
    Op(Box<Expr>, Opcode, Box<Expr>),
    Error,
}
```

最后,我们修改语法,添加包含`!`的第三个替代方案,它简单地将从`!`接收的`ErrorRecovery`值存储在`errors`中,并返回`Expr::Error`. 错误 token 的值将是一个[`ParseError`值](https://docs.rs/lalrpop-util/0.12.1/lalrpop_util/enum.ParseError.html).

✏️ 这是一段 lalrpop 代码 为了使其高亮以便拥有更高的可读性故标记为 Rust

```rust
Term: Box<Expr> = {
    Num => Box::new(Expr::Number(<>)),
    "(" <Expr> ")",
    ! => { errors.push(<>); Box::new(Expr::Error) },
};
```

现在我们可以添加包含各种错误(例如,缺少操作对象)的测试. 注意,现在`parse`方法有两个参数而不是一个,这是因为我们重写了 LALRPOP 文件中的 "grammer" 行. 您可以看到解析器通过在必要的地方插入`!`token 来从缺少操作对象中恢复.

```rust
#[test]
fn calculator7() {
    let mut errors = Vec::new();

    let expr = calculator7::ExprsParser::new()
        .parse(&mut errors, "22 * + 3")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * error) + 3)]");

    let expr = calculator7::ExprsParser::new()
        .parse(&mut errors, "22 * 44 + 66, *3")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[((22 * 44) + 66), (error * 3)]");

    let expr = calculator7::ExprsParser::new()
        .parse(&mut errors, "*")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "[(error * error)]");

    assert_eq!(errors.len(), 4);
}
```

<md id="09"/>

## [9]传递状态参数|Passing state parameter

默认情况下, 分析器不接受除输入以外的任何参数. 在构建 AST 时, 可能存在需要向分析器传递参数的特殊需求.

回到`calculator4`的例子中, 我们可以向解析器传递一个参数:

```rust
grammar(scale: i32);
```

```rust
Num: i32 = {
    r"[0-9]+" => i32::from_str(<>).unwrap()*scale,
};
```

这里解析器将接受一个`scale`参数, 该参数将对遇到的每个数字进行缩放.

然后我们可以调用解析器传递`scale`参数 :

```rust
#[test]
fn calculator8() {
    let scale = 2;
    let expr = calculator8::ExprParser::new()
        .parse(scale,"11 * 22 + 33")
        .unwrap();
    assert_eq!(&format!("{:?}", expr), "((22 * 44) + 66)");
}
```

对于使用[此结构][expr_arena_ast]来构建 AST 的更实用的示例,请查看[此解析器][expr_arena].

---

<a href="https://glass.funprompts.top/" title="Glassmorphism Effect UI CSS Generator"  target="_blank" rel="noopener">Glassmorphism Effect UI CSS Generator - Generate and customize iframe easily with our intuitive generator. Configure settings like dimensions, security features, styling and more.</a>

[main]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/main.rs
[calculator1]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator1.lalrpop
[calculator2]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator2.lalrpop
[calculator3]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator3.lalrpop
[calculator4]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator4.lalrpop
[calculator5]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator5.lalrpop
[calculator6]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator6.lalrpop
[calculator6b]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/calculator6b.lalrpop
[astrs]: https://github.com/lalrpop/lalrpop/blob/master/doc/calculator/src/ast.rs
[expr_arena]: https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/expr_arena.lalrpop
[expr_arena_ast]: https://github.com/lalrpop/lalrpop/blob/master/lalrpop-test/src/expr_arena_ast.rs
