---
title: "Next.js v13でNextAuth v4でGoogle認証しながらFirebaseにデータを保存する"
emoji: "🙌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nextjs","nextauth","firebaseauth","daisyui"]
published: false
---

# 開発環境について
| Next.js | NextAuth | Firebase |
| ---- | ---- | ---- |
| 13.1.5 | 4.19.0 | 9.16.0 |

これらのパッケージが入れられる環境であることが条件です

## 実際にやったこと
- Next.js v13でログイン機能を実現するために、**NextAuth**を利用した
- UIを整えるために、**daisyUI**を活用した

## なぜこの2つを利用したのか
### NextAuth
ログイン機能の実装、ログイン情報を利用した機能を容易に作成することが可能になるため

### daisyUI
Chaka UIをはじめとしたコンポーネントベースで利用するタイプのライブラリは、
```"use client"```と指定した**クライアントサイドコンポーネント内部でないと利用不可能**だった。
しかし、daisyUIはサーバサイドコンポーネントでも問題なく利用できる。

### GitHubリポジトリはこれです
現在未掲載、後々載せます

### 前準備
### Next.js(v13)環境構築
```bash
npx create-next-app . --src-dir --experimental-app
```
これを実行したあとに、以下のメッセージが出てきますので、
```bash
√ Would you like to use TypeScript with this project? ... No / Yes
√ Would you like to use ESLint with this project? ... No / Yes
√ What import alias would you like configured? ... @/*
```
No/Yesの選択肢は全てYesを選択し、
import aliasについてはデフォルト値をそのまま利用してください。

### Firebaseプロジェクト作成

#### Firebaseを導入して書くコード
```ts: src/libs/firebase.ts
import {FirebaseApp, initializeApp,FirebaseOptions, getApp, getApps} from "firebase/app"
import {Auth, getAuth} from "firebase/auth"
import {Firestore,getFirestore} from "firebase/firestore"
import {FirebaseStorage,getStorage} from "firebase/storage"

const FB_Options:FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId:  process.env.FIREBASE_PJ_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSEND_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

const firebase : FirebaseApp = !getApps().length ? initializeApp(FB_Options) : getApp()
const auth: Auth = getAuth(firebase)
auth.languageCode = "ja"
const firestore : Firestore = getFirestore()
const storage : FirebaseStorage = getStorage()

export {FB_Options,auth,firebase,firestore,storage}
```

#### NextAuthを導入して書くコード
```ts: src/pages/api/auth/[...nextauth].ts
import { FB_Options } from "@/libs/firebase";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"

const GoogleID = process.env.GOOGLE_ID 
const GoogleSecret = process.env.GOOGLE_SECRET
const NextAuth_Secret = process.env.NEXTAUTH_SECRET 

const NextAuthConfig = NextAuth({
    providers: [
        GoogleProvider({
            clientId: GoogleID as string,
            clientSecret: GoogleSecret as string
        })
    ],
    secret: NextAuth_Secret as string,
    adapter :FirestoreAdapter(FB_Options)
    
})
export default NextAuthConfig
```

この設定自体は、今までと特に変わったりはしないのですが、ここから、Next.js v13で運用する上で必要な話になってきます。
まず、```next.config.js```の設定を以下のように設定してください。
```js: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    transpilePackages :[
      "@next-auth/firebase-adapter"
    ]
  },
}

module.exports = nextConfig
```
これが、NextAuth自体をしっかり利用するための基盤となります。
こうしなければ、クライアントサイドであろうとサーバサイドであろうと利用不可能です。
ここから、クライアントサイドで利用するための工程です

```tsx: src/Component/ProviderWrapper.tsx
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ProviderWrapper({
    children
}:{
    children : ReactNode
}){
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
```

このコンポーネントは、```layout.tsx```で利用されます。
```tsx: src/app/layout.tsx
"use client"
import SessionWrapper from "@/Component/ProviderWrapper"
import '../css/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}

```

先ほど作成したコンポーネントを、このように設定することでNextAuthの認証が正常に動作するようになります

#### daisyUIを導入して書くコード
daisyUIを使うには、前提として、tailwindcssが入っていなければならないので、
```bash
yarn add tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
を実行し、続いて、

```js : tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
}
```
```css: src/css/global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
を設定することによってtailwind cssが使用できるようになります。
ここから、daisyUIが動作するようにしていきます。

```dash
yarn add daisyui 
```

```js : tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [require("daisyui")],
}
```
この設定でdaisyUIが利用できるようになります

-----
### 参考文献
- [Create Next App | Next.js](https://nextjs.org/docs/api-reference/create-next-app)
- [Support Next.js 13 `app` directory  · Issue #5647 · nextauthjs/next-auth](https://github.com/nextauthjs/next-auth/issues/5647)
