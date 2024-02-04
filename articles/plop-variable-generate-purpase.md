---
title: PlopでREADME生成
emoji: 📖
type:  "idea" # tech: 技術記事 / idea: アイデア
topics: [javascript,plop,readme]
published: true
---

## はじめに
みなさんは、**plop**というnpmパッケージをご存じでしょうか。
これは、`plopfile.js`というファイルに対して、`plop`コマンド実行後の
入力動作や入力値の扱いを関数で処理したり、テンプレートファイルを参照することによって、
コマンドを入力し、設定した入力処理を行うことで、あとはそれに応じたファイルを生成してくれるパッケージとなっています。
私はこれを活用し、めんどうくさいファイルの作成をやってもらっていました。

### やったこと
READMEの内容をある程度出力してくれるplopの設定を書きました
https://github.com/Tiamat-KIT/Plop-Generate-README-Test

### 経緯
Plopを扱っているうちに、ふと「こうなってくるとREADME作成も勝手にやってくれんのか」と。
いい感じのREADMEを勝手に生成してもらえんのか、と。
そう思ったのでやってみました

### 何を実現したか
- 以下の入力を与えてREADMEのマークダウンファイルを生成させられるコードを書いた。
- 入力値は以下の4つ
  - 開発言語 (複数から一つを選択)※今のところは一つを選択することのみ
  - 使っているCSSライブラリ（複数選択）
  - 使っているCSS関連以外のライブラリ・フレームワーク（複数選択）
  - 作ったものの概要文

### 実際のコード
```js:plopfile.js
module.exports = (
    /** @type {import("plop").NodePlopAPI} */
    plop
) => {
    plop.setGenerator("README",{
        description: "README.md File For project.",
        prompts: [
            {
                type: "list",
                name: "LangName",
                message: "What's your project Development Language?",
                choices: ["TypeScript","JavaScript","Python","Java","Ruby","Go","PHP","Rust"]
            },{
                type: "checkbox",
                name: "Style",
                message: "What's Style Library do you use?",
                choices: ["Sass","Less","Stylus","PostCSS","CSS","SCSS","TailwindCSS","daisyui"]   
            },{
                type: "checkbox",
                name: "MultipleChoice",
                message: "package in this project. Input use package names.",
                choices: ["React","Next.js","Vue.js","Nuxt.js","Angular","Svelte","Express.js","Solid.js","Playwright","storybook"]
            },{
                type: "input",
                name: "description",
                message: "It's a description of this project."
        }],
        actions: (
            data
        ) => {
            // const InputImg = `<img src="https://img.shields.io/badge/-${item}-000000.svg?logo=React&style=popout">`;
            // const selected = data.MultipleChoice.map(item => `## ${item}`).join("\n");
            const DisplayInline = (imgs) => {
                return `<div style="display: inline">\n${imgs}\n</div>`
            }
            const CurrentDirectoryh1 = "# " + __dirname.split("\\").pop();
            const RepositoryDescription = "### 概要\n" + data.description;
            const DevLang = `## 開発言語\n<img src="https://img.shields.io/badge/-${data.LangName}-000000.svg?logo=${data.LangName.toLowerCase()}&style=popout">`;
            const StyleLibrary = `## Style Library\n${DisplayInline(data.Style.map(item => `<img src="https://img.shields.io/badge/-${item}-000000.svg?logo=${item.toLowerCase()}&style=popout">`))}`;
            const selected = "## ライブラリ・フレームワーク\n" + data.MultipleChoice.map(item => `<img src="https://img.shields.io/badge/-${item}-000000.svg?logo=${item.toLowerCase()}&style=popout">`).join("\n");
            return [
                {
                    type: "add",
                    path: "./Example-README.md",
                    template: `${CurrentDirectoryh1}\n\n${RepositoryDescription}\n\n${DevLang}\n\n${StyleLibrary}\n\n${selected}`
                }
            ]
        }
    })
}
```
### 参考情報
https://plopjs.com/documentation/