---
title: "Next.js v13でNextAuth v4を動かせた話"
emoji: "🙌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [nextjs,nextauth,google]
published: true
---
# Googleログインを簡単に実装したい！！
と思って、色々探していたら[NextAuth](https://next-auth.js.org/)という便利なものを見つけたので、早速使ってみることに...。

## 出くわした問題
1. Next.js v13での使い方がドキュメントらしきページに記載されてなかった。
2. 一応[GitHubのIssue](https://github.com/nextauthjs/next-auth/issues/5647)で議論はされているっぽいけど、「**クライアントコンポーネントでしか動かない**よ～？」的な会話が繰り広げられていた。
3. しかもIssueがめちゃくちゃ枝分かれしてた

上記のことからほぼ利用を諦めかけてました。

## 一筋の光明
なんかそれっぽい動画をみつけました。
https://www.youtube.com/watch?v=6lCXM11Tgyg

### この動画では結局何をしているのか
1. Next.js v13プロジェクトを作成した
2. NextAuthでのProvider設定をした
3. クライアントコンポーネントとして、SessionProviderでchildren(ReactNode)を挟むコンポーネントを作成
4. そしたら3で作ったコンポーネントでlayout.tsxの{children}を挟む
5. そのあとはログイン部分のコンポーネント（サーバコンポーネント）を別ファイルで作成
6. そのログイン部分の表示部分を作成して、page.tsxにおいておしまい！！

といった感じになります

### とりあえず伝えたいこと
1. 英語は読めるようになっといた方がいいです。
2. ドキュメントでわからなかったらYouTubeに動画あげてる海外の方を頼ってみましょう。

## もう一つ見つけてました
https://www.youtube.com/watch?v=DfIDr2jCkHo

この方の動画は、先ほどの動画とは違って、実際に動作させるというより、「どうすれば良いのか」という説明をしてくれている...のだと思います
まだ僕も詳しくは見てないので、また見たら追記するかもしれません！！

ということで、この記事を役立てて、Next.js v13での開発、頑張っていただければなと思います！それではまた！！