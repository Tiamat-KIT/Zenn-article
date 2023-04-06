---
title: "UnityでAR開発始めるための記事"
emoji: "💻"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["unity","ar","tech"]
published: false
---

## UnityでARコンテンツを作成したい！
この記事は、Unityを利用してARコンテンツを作成したい！
と思った人が「ふ～んとりあえず動かしてみるか…」
くらいの感覚で技術に触れてみる、といったレベルの
内容です！気軽に読んで試していってください！

## 環境構築を始めよう！
:::message
既にUnityがPCにインストールされている前提で
説明をしていきます。Unityのインストールは
ご自分で済ませておいてください。
:::

ではまず、ARコンテンツを作成する上で必要なもの、
ARコンテンツ開発用のフレームワーク、
**ARFoundation**を導入していきましょう！
::::details AR Foundationのバッサリとした説明
例えば、iOSとAndroid向けに作成する際、
それぞれの環境に合わせた実装をする必要があっても
これによって、別々に実装する必要性がなくなる優れモノ
:::message alert
これを利用するために、**ARCore**と**ARKit**といった
各環境に合わせたARコンテンツ開発用のSDKを
導入しないといけません
:::
::::
それでは概要説明を終えたところで、実際に導入して
いきましょう！

1. Unityの3Dのテンプレートプロジェクトを起動
2. ウィンドウ上部のWindowを選択
3. WindowメニューのPackage Managerを選択
4. Package Managerウィンドウで必要なSDKをインストール
   - 開発したいデバイスにあったSDKをインストールする
5. Package ManagerウィンドウでAR Foundationを
   インストール

ここまでできたら必要なもののインストールは終わりです！
次は本格的にAR開発を行うためのセットアップを
行っていきます！

1. Main Cameraの削除(あとから新しいモノを追加するのでOK)
2.  Hierarchy上で右クリックし、XRを選択
3.  AR SessionとAR Session Originをクリックして追加

**「ちょっと待って！その2つ何！？」**
ってなったら参照ページを確認してください。
**ここでは説明を省きます！(元記事読んで☆)**

## 平面検知やってみよう！
1. ARSessionOriginを選択
2. ARSessionOriginのメニュー内のAdd Componentを選択
3. ARで検索かけて、ARPlane Manager, AR Raycast Managerを選択
4. Hierarchy上で右クリック、XRの項目を選択
5. AR Default Planeを選択して追加
6. AR Default PlaneをARPlane ManagerのARPlane Prefabの位置までドラッグしてプレハブ化

これで平面検知ができました！

### さて、癒されましょう
ここまで設定してきて、少し疲れていませんか？
正直いったん癒しが欲しいな、と考えたあなたに、
ここで最後に癒しコンテンツを置きましょう

平面検知を行った平面に、
ユニティちゃんを歩かせてみましょう！
ユニティちゃんはかわいい。これは真理。



この記事は、以下のWebページを参考に作成した記事です。
この記事でわからなかったこと、より詳しく知りたい方は
以下のページを参照してください。

---


[【Unity】
ARFoundation入門～機能解説から平面検知の実装まで～
– 株式会社ライトコード](https://rightcode.co.jp/blog/information-technology/unity-ar-foundation-introduction)
::: message
ほんとはカード表示にしたかったのですが、
404を返されてしまったためにこの表示にしています
:::

---

#### おまけ

動くリアルなネコちゃんと触れ合うコンテンツでも作ってみますか！！
アセットストアから、いい感じのアセット、例えば
Fully Animated Catsなどを...**約$70弱**
お、おたかい...（ちなみにﾒｯｯｯｯｯﾁｬリアルでした。）
[【Unity-Asset】
Fully Animated Cats の紹介 | くものす](https://kingmo.jp/kumonos/unity-asset-anvanced-cats/)

---
