---
title: Leptos開発環境をDevDockerで作成した話
emoji: 💻
type: tech # tech: 技術記事 / idea: アイデア
topics: [rust,webassembly,docker,devdocker]
published: false
---

## はじめに

この記事を読むにあたり、**Docker**に関する知識や技術の説明は行わないため、
それに関しては他の記事を参照してください。
また、リポジトリに関しては、**卒研での詳細な研究内容を漏らさない**ため、
今回の記事内に添付している画像内のディレクトリを含むリポジトリは公開しません。
ご了承ください。

### やったこと

研究で扱う開発環境をDevContainerで整えた。

### 経緯

開発を行うにあたって、家で開発する際はデスクトップPC、大学内の自習室や研究室で行う場合はノートPCで開発を行うため、開発環境をそれぞれに行うことが手間であることや、研究で行う開発の中で導入するパッケージなどが、別の開発を行う際に、他のパッケージと衝突を起こす可能性をなくしたかった。

### 何を実現したか

DevDockerによる、研究用開発環境を作成した。

### 実際のコード

#### ディレクトリ構成（ホスト側）

```Dockerfile

```

### 参考情報
https://github.com/Harurow/docker-playground-rust/blob/main/.devcontainer/Dockerfile
https://c-a-p-engineer.github.io/tech/2022/09/29/docker-rust-install/