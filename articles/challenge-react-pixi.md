---
title: "ReactPIXIでゲームを作る！"
emoji: "👌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react","pixijs","typescript"]
published: false
---

# 環境構築
1. `npx create-react-app [任意ディレクトリ] --template typescript`を実行する
2. `cd [任意ディレクトリ]`にいどうする
3. `npm i --save react@17.0.2 react-dom@17.0.2 @testing-library/react@12.1.5`を実行してReactをダウングレード
4. index.tsxを以下に書き換える
```typescript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```
5. `npm install pixi.js @inlet/react-pixi`を実行してPIXI.jsとReactPixiを導入する。

## 基礎
