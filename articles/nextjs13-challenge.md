---
title: "Next.js 13についての情報まとめ"
emoji: "👌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nextjs","typescript","react"]
published: false
---

## Next.js 13...まだ触ってない？
Next.js 13が出てから、はや一か月となりました。
皆さん、一度はNext.js 13で何かしらのサイトとか作ったり...しましたよね？
**えっ！？まだ作ったことがない！？**

### 怖がらず触ってみよう！
Next.js 13になって色々出てきて何がなんだかわからない？**この記事があればだいたいわかる！**
これからしっかり読みながら手を動かしていただいて、Next.js 13をモノにしていきましょう！

## 環境構築
``` bash
mkdir next13
npx create-next-app . --ts 
```
そうしたら、新機能の```app Directory```機能を利用するために、
```next.config.js```を以下に書き換える。
``` javascript 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
```

そうして、作成されたディレクトリ名、ファイル名を変更する
- ```pages```フォルダを、```app```に名前を変更
- ```index.tsx```ファイルを、```page.tsx```に名前を変更
- ```_app.tsx```ファイルを、```layout.tsx```に名前を変更


## ```app.tsx```を```layout.tsx```として生まれ変わらせる
名前を変更した```app.tsx```、つまり、```layout.tsx```は以下に変更する

```typescript
import * as React from "react"
export default function RootLayout({
    children
}:{
    children:React.ReactNode
}) {
    return (
        <html lang="ja">
            <body>{children}</body>
        </html>
    )
}
```

### ここまでのNext.js 13での利点
ここまでやると何ができるかというと
- 固定レイアウトを```layout.tsx```を使って定義することで、そのファイルだけでレイアウト設定が済み、そのレイアウトが自動的に全ページに適用される。

## headの設定をまとめる```head.tsx```の設定
Next.js 13では、headの設定も一つのファイル、```head.tsx```にまとめることができる。

```typescript 
export default function Head(){
    return (
        <>
            <title>○○○○○</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <link rel="icon" href="/favicon.ico" />
        </>
    )
}
```

