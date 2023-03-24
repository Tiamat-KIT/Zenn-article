---
title: "TypeScriptで色んな型を作ろう"
emoji: "⚙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript"]
published: false
---

## 皆さん、型定義、してますか？
私は、最近、Next.jsを利用してコーディングを行って、ポートフォリオサイトを作成しました。
ここ最近、しっかり型定義をしていくということを考えながらコーディングしています。
そこで、色々調べながら、個人的な備忘録のついでですが、この記事で、
特に自分が活用している型定義の方法をまとめていきたいと思います。

### [```Record<Keys, Type>```](https://typescriptbook.jp/reference/type-reuse/utility-types/record)を使用した型定義
[ユーティリティ型](https://typescriptbook.jp/reference/type-reuse/utility-types)の一つです。
個人的には、「オブジェクトの型を作るとき、同じ型のプロパティを多く宣言するとき」によく利用しています。
例えば、以下のような型定義を行いたいとします。

```typescript
type ParamData = {
    title: string,
    body: string,
    id: string
}
```

でもこの型定義方法、ちょっとこれが長々と続くと面倒くさくないですか？
これを```Record<Keys, Type>```を使うと

```typescript
type ParamData = Record<"title" | "body" | "id",string>
```
で簡単に宣言できます...が、この方法は下手すると可読性を犠牲にする可能性があるので、
使いすぎには気を付けてください。

### [```typeof```](https://typescriptbook.jp/reference/type-reuse/typeof-type-operator)を使用してオブジェクトを作成してから型を作る
例えば、オブジェクトの型を決定したいとき、最初に型を作成してからオブジェクトを記述する
というのがだいたいの型定義の流れだと思いますが、
「このオブジェクトの型定義ってどうやってするんだっけ、わかんねえや...。」ってなることもありますよね
そんなとき、```typeof```が便利です。

```typescript
const ExampleUser = {
    Name: "Tiamat",
    Age: 20,
    id: ["TiamatFill" , 123456789]
}
```

というオブジェクトを作成したあと、

```typescript
type UserType = typeof ExampleUser
```

とすると、```ExampleUser```というオブジェクトの値の型の定義を得ることができる。

### [インターセクション型（&）](https://typescriptbook.jp/reference/values-types-variables/intersection)を利用した型の合成
このインターセクション型、実はとあるサービスを利用したブログを作成するときに使うことがあります。
とあるサービスというのは、**microCMS**です。

https://blog.microcms.io/nextjs13-microcms-rsc/

上記サイトで型定義をする際に、```&```を使用しているのがわかります。
これは**型定義と型定義を合成して新しい型を作成する**ための記号です。

例えば、ある程度、ライブラリで定義されている型と、自身で定義した型を接続したいときにおすすめです、
上記サイトでも、以下のような構成（型名、プロパティ名はここでは別のものを使用します）で型定義がされていました。

```typescript
type Contents = {
    contentid: string,
    fetchPropertyOne: string,
    fetchPropertyTwo: string
} & LibraryType
```




