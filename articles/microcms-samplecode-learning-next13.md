---
title: "microCMSのサンプルコードから理解するServer Component"
emoji: "🕌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["microcms","javascript","typescript","nextjs"]
published: false
---

## この記事のテーマ
同じ処理のコードのNext.js v13版とNext.js v12版を比較しながら、Next.js v12のコードをNext.js v13にどう書き換えればいいのか学ぼう。

## この記事が生まれるまでの経緯
僕は、とある課外活動でNext.jsを扱っているのですが、動的ルーティングぐらいしかまともに扱えている自信がなく、インターネットで付け焼刃の程度の知識でこれまでコーディングしていましたが、「そろそろしっかり理解しなければならない」と、実際にモノを作りながら学んでいくことにしました。そこで、「Next.js v12のコードとNext.js v13のコードってどういう違いになっているんだろう」と疑問に思いました。そこで、同じ処理のコードのNext.js v13版とNext.js v12版を比較しながらコードを理解していくことにしました。

### 今回取り扱うコード
ヘッドレスCMSとして有名な**microCMS**のサンプルコードを取り扱わせていただきます。
https://blog.microcms.io/microcms-next-jamstack-blog/
https://blog.microcms.io/nextjs13-microcms-rsc/

#### Next.js v13版のコーディングを行う上での注意
Next.js v13版は、TypeScriptで記述されているので、当然型定義を要します。
```ts: libs/microcms.ts
import { createClient } from "microcms-js-sdk";
import type {
 MicroCMSQueries,
 MicroCMSImage,
 MicroCMSDate,
} from "microcms-js-sdk";

//ブログの型定義
export type Blog = {
 id: string;
 title: string;
 content: string;
 eyecatch?: MicroCMSImage;
} & MicroCMSDate;

export type BlogResponse = {
 totalCount: number;
 offset: number;
 limit: number;
 contents: Blog[];
};

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
 throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
 throw new Error("MICROCMS_API_KEY is required");
}

// API取得用のクライアントを作成
export const client = createClient({
 serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
 apiKey: process.env.MICROCMS_API_KEY,
});

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
 const listData = await client.get<BlogResponse>({
  endpoint: "blogs",
  queries,
 });

 // データの取得が目視しやすいよう明示的に遅延効果を追加
 await new Promise((resolve) => setTimeout(resolve, 3000));

 return listData;
};

// ブログの詳細を取得
export const getDetail = async (
 contentId: string,
 queries?: MicroCMSQueries
) => {
 const detailData = await client.get<Blog>({
  endpoint: "blogs",
  contentId,
  queries,
 });

 // データの取得が目視しやすいよう明示的に遅延効果を追加
 await new Promise((resolve) => setTimeout(resolve, 3000));

 return detailData;
};
```
:::message
遅延効果については、必要なければ削除することをおすすめします。
:::


### 記事一覧ページのコード比較
Next.js v12版
```js: pages/index.js
import Link from "next/link";
import { client } from "../libs/client";

export default function Home({ blog }) {
  return (
    <div>
      <ul>
        {blog.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blog" });

  return {
    props: {
      blog: data.contents,
    },
  };
};
```

上記はコードをそのまま引用したものとなります。
Next.js v13版のコードから、内容の本筋から外れるコード
（コンテンツの存在確認処理やページ生成時間の取得処理コード）を除外すると...

```ts: app/static/page.tsx
import Link from "next/link";
import { getList } from "../../libs/microcms";

export default async function StaticPage() {
 const { contents } = await getList();

 return (
  <>
   <ul>
    {contents.map((post) => {
     return (
      <li key={post.id}>
       <Link href={`/static/${post.id}`}>{post.title}</Link>
      </li>
     );
    })}
   </ul>
  </>
 );
}
```

**ん？一見ほぼ変わって無くね？** って思いませんか？
上記のコードの相違点となるのは

```js
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blog" });

  return {
    props: {
      blog: data.contents,
    },
  };
};
```
```ts
import { getList } from "../../libs/microcms";
・・・
const { contents } = await getList();
```

この2つですね。あとのコードの構造は同一ですね。
ここで```getList()```の定義部分（なお遅延効果部分は除く）を見返してみましょう。
```ts:getList
export const getList = async (queries?: MicroCMSQueries) => {
 const listData = await client.get<BlogResponse>({
  endpoint: "blogs",
  queries,
 });
 return listData;
};
```

#### ほぼ変わってないやんけ!!!
はい、実際**ほぼ**変わりません。Next.js v13版では、以下のような変更がされています
- ```getStaticProps```を使わない処理記述であること
- ```client```の```get```メソッドの引数指定の内容が増えたこと
- 処理記述を別ファイルで定義し、それをインポートして利用していること
- （JS→TSと言語を変更しているので）型定義がされていること

### 記事詳細ページのコード比較
Next.js v12版
```js: pages/blog/[id].js
import { client } from "../../libs/client";

export default function BlogId({ blog }) {
  return (
    <main>
      <h1>{blog.title}</h1>
      <p>{blog.publishedAt}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
      />
    </main>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};
```

Next.js v13版
```ts: static/[postId]/page.tsx
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getDetail, getList } from "../../../libs/microcms";

export async function generateStaticParams() {
 const { contents } = await getList();

 const paths = contents.map((post) => {
  return {
   postId: post.id,
  };
 });

 return [...paths];
}

export default async function StaticDetailPage({
 params: { postId },
}: {
 params: { postId: string };
}) {
 const post = await getDetail(postId);

 // ページの生成された時間を取得
 const time = new Date().toLocaleString();

 if (!post) {
  notFound();
 }

 return (
  <div>
   <h1>{post.title}</h1>
   <h2>{time}</h2>
   <div>{parse(post.content)}</div>
  </div>
 );
}
```

ここは色々と解説していかなければならなさそうなので、少しずつ比べていきましょう
まず、処理の本筋とは関係ないコード、コメント、表示する部分のreturn文もしくは
関数を削除しますそうして、上記のコードの相違点となるのは
```js: nextjs_v12
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};
```
```ts: nextjs_v13
import { getDetail, getList } from "../../../libs/microcms";

export async function generateStaticParams() {
 const { contents } = await getList();

 const paths = contents.map((post) => {
  return {
   postId: post.id,
  };
 });

 return [...paths];
}

export default async function StaticDetailPage({
 params: { postId },
}: {
 params: { postId: string };
}) {
 const post = await getDetail(postId);
}
```

この2つですね。
ここで```getDetail()```はの定義部分を見返してみましょう。
```ts:getDetail
export const getDetail = async (
 contentId: string,
 queries?: MicroCMSQueries
) => {
 const detailData = await client.get<Blog>({
  endpoint: "blogs",
  contentId,
  queries,
 });
};
```

結構大きいので、ここから細分化します

```js:nextjs_v12_path
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};
```

```ts:nextjs_v13_path
export async function generateStaticParams() {
 const { contents } = await getList();

 const paths = contents.map((post) => {
  return {
   postId: post.id,
  };
 });

 return [...paths];
}
```
Next.js v13版では、以下のような変更がされています
- ```getStaticPaths```を使わない処理記述であること
    - それに伴って、```fallback```の記述がなくなったこと
- ```client```の```get```メソッドの引数指定の内容が増えたこと
    - それに伴って、```map```メソッド利用の際の記述が若干減っていること
- ```map```メソッドで指定した処理内容が変わっていること
    - 「複数のパス生成して格納」から、「複数の投稿IDの格納」へ変化していること
- 処理記述を別ファイルで定義し、それをインポートして利用していること
- （JS→TSと言語を変更しているので）型定義がされていること


```js:nextjs_v12_id
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};
```

```ts:nextjs_v13_id
export default async function StaticDetailPage({
 params: { postId },
}: {
 params: { postId: string };
}) {
 const post = await getDetail(postId);
}
```

つまり、Next.js v13版では、以下のような変更がされています。

- ```getStaticProps```を使わない処理記述であること
-  idをオブジェクトから取り出すのではなく、関数の引数で直に受け取っていること。
- 処理記述を別ファイルで定義し、それをインポートして利用していること
- （JS→TSと言語を変更しているので）型定義がされていること

## つまりどう書き換えたらいいのか
以上のことから、以下のことがわかります。
- サーバサイドコンポーネントとしての原則を守ること
- ```getStaticProps```,```getStaticPaths```を使わない処理記述であること
- それらの処理を他の関数として実装すること。
    - また、それらの関数は```async/await```を利用した非同期関数であること

## 実際にやってみよう
じゃあ、これ以外のコードを書き換えてみましょう。


## 余談
https://zenn.dev/tfutada/articles/36ad71ab598019
https://beta.nextjs.org/docs/rendering/server-and-client-components

microCMSでブログコンテンツをガッツリ作りたい方は、これらの記事やドキュメントを
参考にサーバサイドコンポーネントより深く理解し、ブログのデザインを考えたり、
コメント欄を実装したりしてみてください！
この記事が皆様のコーディング活動がより充実したものになる助けになれば幸いです！
プログラミング楽しんでください！
