---
title: Next.js AppRouterのAPI Routesについてまとめた
emoji: 📖
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [typescript,nextjs]
published: false
---

## はじめに
Next.jsのAPI Route、活用していますか？
私は今までまともに触ってこなかったので、正直全然わかっていませんでした。
と、いうことで、勉強したことをこの記事にまとめておこうと思います

-----
### 参考サイト
https://reffect.co.jp/react/next-js-13#Route_Handlers

#### わかったこと

##### 静的なAPI

データ送信側
```ts: api/route.ts
import {NextResponse} from "next/server";
export default GET(){
    return NextResponse.json({name: "John Doe"})
}
```

データ受信側
```ts:app/page.tsx
export default async function Page(){
    const response = await fetch("http://localhost:300/api")
    const result = await response.json().name
    return (
        <>
            <h1>{result}</h1>
        </>
    )
}
```

#### 動的API
```ts:api/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return NextResponse.json(id);
}
```

-----