---
title: "Next.jsのRouteHandlersを理解する"
emoji: "👏"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nextjs"]
published: false
---

Next.js 13.2を扱っているときに、とある記事でNext.jsをフロント、Flaskをバックエンドで利用していたので、自分でもそれをやってみようとしたのですが、どうやらAppディレクトリを利用した方法ではなかったようなので、Appディレクトリで動作するように変更したいと思い、RouteHandlerを利用しようとしたら全く分からなかったので、勉強してみることにしました。

## Route Handlersって何？
`Web Request API` & `Web Response API`を使用して、指定ルートのカスタムリクエストハンドラが作成可能！NextRequestやNextResponseもこれまで通り利用可能！

:::message alert
Route Handlersは、appディレクトリ内でのみ利用可能
:::

### 定義方法
Appディレクトリ内のroute.tsファイルで定義する

#### 実装例
```typescript:app/api/route.ts
export async function GET(request: Request) {...}
```

:::message alert
Route Handlersは、```page.js```や```layout.js```と同様に、
Appディレクトリ内に入れ子にできる。しかし、```page.js```と同じルートセグメントレベル
（つまり同じディレクトリ...?）に```route.js```ファイルは存在できない。
:::

## HTTPメソッドのサポート
:::details 対応HTTPメソッド
- GET
- POST
- PUT
- PATCH
- DELETE
- HEAD 
- OPTIONS
:::
HTTPメソッドをサポートしているらしいです。

