---
title: "Next.js 13.2での動的メタデータとOGPの作成"
emoji: "✨"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["nextjs","metadata","ogp"]
published: true
---
こんにちは、最近ずっとNext.jsでコーディングしてる人です。
Next.js 13.2の更新内容について、
日々実力を高めている方々なら既に承知のことだとは思いますが、
メタデータを定義する新しい型、`Metadata`なる型が実装されました。

そこで、動的なメタデータを扱うにあたって、
```typescript
export default function generateMetadata({params,serchParams}){
    const product = await getProduct(params.id)
    return {title: product.title}
}
```
このような関数を定義します。
さて、私は動的メタデータに関する関数コンポーネントを以下のように定義しました。

## 動的にメタデータを作成するコンポーネントの実装
```typescript
import type { Metadata } from 'next';

export type SEOProps = Record<"title" | "description" | "url" | "imageUrl",string>

export default function SeoComponent(Info:SEOProps):Metadata {
    const { title,description,url,imageUrl } = Info
    const metadata:Metadata = {
        title: title,
        description: description,
        icons: "/favicon.ico",
        keywords: ["UtakataKyosui","泡沫京水","Portfolio","ポートフォリオ"],
        viewport: {
            width: "device-width",
            initialScale: 1,
            maximumScale: 1,
        },
        twitter: {
            card: "summary_large_image",
            images: [imageUrl]
        },
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: title,
            images: {
                url:imageUrl,
                width: 1200,
                height: 600,
            },
        }
        
    }
    return metadata
}
```

このコードの本質はここです。
```typescript
const metadata:Metadata = {
    title: title,
    description: description,
    icons: "/favicon.ico",
    keywords: ["UtakataKyosui","泡沫京水","Portfolio","ポートフォリオ"],
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
    twitter: {
        card: "summary_large_image",
        images: [imageUrl]
    },
    openGraph: {
        title: title,
        description: description,
        url: url,
        siteName: title,
        images: {
            url:imageUrl,
            width: 1200,
            height: 600,
        },
    }
}
```
これはメタデータをJavaScriptオブジェクトの形式で記述していると考えれば
頭にすっと入ってくると思います。

## OGP画像の作成
さて、OGP画像を作成していきましょう。
`@vercel/og`を利用してOGP画像を作成します
```typescript
import { ImageResponse,unstable_createNodejsStream } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: 'edge',
};

export default function (req:NextRequest){
    try{
      const { searchParams } = new URL(req.url)

      // ?title=<title>
      const hasTitle = searchParams.has("title")
      const title = hasTitle 
        ? searchParams.get("title")?.slice(0,100)
        : "My default title"
      
        return new ImageResponse(
          (
            <div
              style={{
                fontSize: 128,
                width: '100%',
                height: '100%',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: "30px"
              }}
              tw="flex bg-indigo-300"
            >
              <div tw="bg-indigo-100 flex justify-center" style={{width: "95%",height:"95%"}} >
                <p tw="text-justify flex">{title}</p>
              </div>
            </div>
          ),
          {
            width: 1200,
            height: 600,
          },
        );
    }catch(e:any){
      console.log(`${e.massage}`)
      return new Response(`Failed to generate the image`, {
        status: 500,
    });
  }
}
```

上記のコードでOGP画像を作成して、

```page.tsx``などのページを形成するファイル内では
それらを以下のように活用します

```typescript 
export async function generateMetadata(): Promise<Metadata>{
    const title = "UtakataPortfolio"
    return SeoComponent({
      title: title,
      description: title,
      url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`,
      imageUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og?title=${title}`
    }
  )
}
```

こうすることで、動的なメタデータと動的なOGP画像が実装できました。
皆さん参考にしてください。