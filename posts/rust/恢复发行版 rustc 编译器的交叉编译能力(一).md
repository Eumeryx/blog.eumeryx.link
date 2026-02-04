---
title: '[Rust]恢复发行版 rustc 编译器的交叉编译能力(一)'
toc: false
comment: waline
date: 2023-09-05 09:14:15
updated: 2023-09-05 09:14:15
tags:
- Rust
---

目前，大多数发行版自带的 rustc 编译器都仅能编译到本机目标，而不像使用 rustup 安装的那样可以交叉编译到其它目标。这是因为发行版自带的 rustc 编译器缺少对应目标的 std 标准库，只需补上对应的标准库即可交叉编译到相应目标。

<!--more-->

## 缺失的标准库

如上所述，发行版自带的 rustc 编译器因为缺少对应目标的 std 标准库无法交叉编译，我们通过一个简单的例子来复现这一问题：

```bash 
$ cargo new hello && cd hello
$ cargo run
   Compiling hello v0.1.0 (/tmp/hello)
    Finished dev [unoptimized + debuginfo] target(s) in 3.52s
     Running `target/debug/hello`
Hello, world!
```

可以看到 rustc 在本机目标上工作的很好，正确生成了程序。但当交叉编译到 android 目标时就报错找不到 `std` 库（需要提前安装 android-ndk 和 cargo-ndk）：

```bash
$ cargo ndk -t x86 build
    Building x86 (i686-linux-android)
   Compiling hello v0.1.0 (/tmp/hello)                                            
error[E0463]: can't find crate for `std`
  |
  = note: the `i686-linux-android` target may not be installed
  = help: consider downloading the target with `rustup target add i686-linux-android`

error: cannot find macro `println` in this scope
 --> src/main.rs:2:5
  |
2 |     println!("Hello, world!");
  |     ^^^^^^^

error: requires `sized` lang_item

For more information about this error, try `rustc --explain E0463`.
error: could not compile `hello` (bin "hello") due to 3 previous errors
note: If the build failed due to a missing target, you can run this command:
note:
note:     rustup target install i686-linux-android
```

报错提示我们使用 `rustup` 去安装 `i686-linux-android` 工具链，但我们使用的是发行版自带的 rustc 无法这么做。
注意到系统的 `LLVM` 支持 `x86` 架构，那么只要补全了 `std` 库应该就可以正确的交叉编译了。

```bash
$ llc --version
LLVM (http://llvm.org/):
  LLVM version 16.0.6
  Optimized build.
  Default target: x86_64-pc-linux-gnu
  Host CPU: westmere

  Registered Targets:
    aarch64     - AArch64 (little endian)
    aarch64_32  - AArch64 (little endian ILP32)
    aarch64_be  - AArch64 (big endian)
    amdgcn      - AMD GCN GPUs
    arm         - ARM
    arm64       - ARM64 (little endian)
    arm64_32    - ARM64 (little endian ILP32)
    armeb       - ARM (big endian)
    avr         - Atmel AVR Microcontroller
    bpf         - BPF (host endian)
    bpfeb       - BPF (big endian)
    bpfel       - BPF (little endian)
    hexagon     - Hexagon
    lanai       - Lanai
    loongarch32 - 32-bit LoongArch
    loongarch64 - 64-bit LoongArch
    mips        - MIPS (32-bit big endian)
    mips64      - MIPS (64-bit big endian)
    mips64el    - MIPS (64-bit little endian)
    mipsel      - MIPS (32-bit little endian)
    msp430      - MSP430 [experimental]
    nvptx       - NVIDIA PTX 32-bit
    nvptx64     - NVIDIA PTX 64-bit
    ppc32       - PowerPC 32
    ppc32le     - PowerPC 32 LE
    ppc64       - PowerPC 64
    ppc64le     - PowerPC 64 LE
    r600        - AMD GPUs HD2XXX-HD6XXX
    riscv32     - 32-bit RISC-V
    riscv64     - 64-bit RISC-V
    sparc       - Sparc
    sparcel     - Sparc LE
    sparcv9     - Sparc V9
    systemz     - SystemZ
    thumb       - Thumb
    thumbeb     - Thumb (big endian)
    ve          - VE
    wasm32      - WebAssembly 32-bit
    wasm64      - WebAssembly 64-bit
    x86         - 32-bit X86: Pentium-Pro and above
    x86-64      - 64-bit X86: EM64T and AMD64
    xcore       - XCore
```

## 不兼容的官方标准库

要补全 `std` 标准库，首先想到的是从 rustup 里获取，那么要如何获得下载地址呢?
注意到，每次执行 `rustup update` 的时候，rustup 都会去获取一个 toml 文件 `channel-rust-stable.toml`，它应该就是记录了各种工具信息的配置文件，考虑到 tuna 有镜像，我们前往以下地址获取[该文件](https://mirrors.tuna.tsinghua.edu.cn/rustup/dist/channel-rust-stable.toml)。
查看该文件，发现了我们需要的内容：

```toml
[pkg.rust-std.target.i686-linux-android]
available = true
hash = "1fc7bacf7db39b670d503631ab19c5ea84892fe95f90d4a4f9be173c067620f0"
url = "https://mirrors.tuna.tsinghua.edu.cn/rustup/dist/2023-08-24/rust-std-1.72.0-i686-linux-android.tar.gz"
```

下载该文件，解压并安装到 `/usr/lib/rustlib/` 目录下，再次尝试交叉编译：

```bash
$ cargo ndk -t x86 build
    Building x86 (i686-linux-android)
   Compiling hello v0.1.0 (/tmp/hello)
error[E0514]: found crate `std` compiled by an incompatible version of rustc
  |
  = note: the following crate versions were found:
          crate `std` compiled by rustc 1.72.0 (5680fa18f 2023-08-23): /tmp/rust-std-1.72.0-i686-linux-android/rust-std-i686-linux-android/lib/rustlib/i686-linux-android/lib/libstd_detect-2706d607639b65ab.rlib
          crate `std` compiled by rustc 1.72.0 (5680fa18f 2023-08-23): /tmp/rust-std-1.72.0-i686-linux-android/rust-std-i686-linux-android/lib/rustlib/i686-linux-android/lib/libstd-49e021b2411c1917.rlib
          crate `std` compiled by rustc 1.72.0 (5680fa18f 2023-08-23): /tmp/rust-std-1.72.0-i686-linux-android/rust-std-i686-linux-android/lib/rustlib/i686-linux-android/lib/libstd-49e021b2411c1917.so
  = help: please recompile that crate using this compiler (rustc 1.72.0 (5680fa18f 2023-08-23) (Arch Linux rust 1:1.72.0-1.1)) (consider running `cargo clean` first)

error: cannot find macro `println` in this scope
 --> src/main.rs:2:5
  |
2 |     println!("Hello, world!");
  |     ^^^^^^^

error: requires `sized` lang_item

For more information about this error, try `rustc --explain E0514`.
error: could not compile `hello` (bin "hello") due to 3 previous errors
note: If the build failed due to a missing target, you can run this command:
note:  
note:     rustup target install i686-linux-android
```

可以看到，官方提供的 `std` 库并不兼容系统的 rustc 编译器，提示我们需要重新编译该库。

## 从源码编译标准库

注意到 [Gentoo 软件仓库](http://gpo.zugaina.org/sys-devel/rust-std) 里有一个 `rust-std` 软件包，经过对打包文件的分析发现可以从 rustc 源码编译出所需的 std 库，具体步骤如下：

1. 获取 rustc 源码并解包

```bash
$ cd /tmp && curl https://static.rust-lang.org/dist/rustc-1.72.0-src.tar.xz | tar -xvpJ
$ cd rustc-1.72.0-src
```

2. 编写配置文件

```bash
# 获取 android-ndk 工具链目录，请确保 `ndk-which` 在你的 PATH 里
$ NDKTOOLCHAIN="$(dirname $(ndk-which ar))"
$ cat >config.toml <<EOF
changelog-seen = 2

[build]
target = [ "i686-linux-android" ]
cargo = "/usr/bin/cargo"
rustc = "/usr/bin/rustc"
rustfmt = "/usr/bin/rustfmt"
submodules = false
locked-deps = true
vendor = true
sanitizers = true
profiler = true
docs = false

[install]
prefix = "/usr"
libdir = "lib"

[rust]
codegen-units-std = 1
debuginfo-level-std = 2
channel = "stable"
rpath = false
backtrace-on-ice = true
remap-debuginfo = true
jemalloc = true

[dist]
compression-formats = ["gz"]

[target.i686-linux-android]
cc = "${NDKTOOLCHAIN}/i686-linux-android19-clang"
cxx = "${NDKTOOLCHAIN}/i686-linux-android19-clang++"
ar = "${NDKTOOLCHAIN}/llvm-ar"
ranlib = "${NDKTOOLCHAIN}/llvm-ranlib"

EOF
```

3. 编译

```bash
$ RUST_BACKTRACE=1 python ./x.py build library/std --stage 0 -j "$(nproc)"
```

4. 将编译好的 std 库安装到合适的路径

```bash
$ sudo cp -a build/host/stage0-sysroot/lib64/rustlib/i686-linux-android /usr/lib/rustlib/
```

回到我们一开始的例子，可以看到已经编译成功了：

```bash
$ cargo ndk -t x86 build
    Building x86 (i686-linux-android)
   Compiling hello v0.1.0 (/tmp/hello)
    Finished dev [unoptimized + debuginfo] target(s) in 0.40s
```

## 总结

经过一番努力，我们成功的恢复了发行版自带的 rustc 编译器对 `i686-linux-android` 目标的交叉编译能力，相信对于其它目标我们可以通过类似的方法恢复，特别是借助于 `zig` 提供的方便的交叉编译环境，我们可以很方便的指定链接的 glibc 版本。

另外，archlinux 下用于交叉编译到 Android 平台的 [rust-std-android](https://aur.archlinux.org/pkgbase/rust-std-android) 包已上传至 AUR 仓库.