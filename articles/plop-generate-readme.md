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
```js
const lowerCaseAndRemoveDot = (str) => str.toLowerCase().replace(/\./g, '');

module.exports = (plop) => {
    plop.setGenerator("README", {
        description: "README.md File For project.",
        prompts: [
            {
                type: "input",
                name: "title",
                message: "What's your project title?"
            },
            {
                type: "confirm",
                name: "isFullStack",
                message: "Is this a Full Stack project?",
                default: false
            },
            {
                type: "list",
                name: "FrontendLang",
                message: "What's your project Frontend Development Language?",
                choices: ["TypeScript", "JavaScript", "Python", "Java", "Ruby", "Go", "PHP", "Rust"],
                when: (answers) => !answers.isFullStack
            },
            {
                type: "checkbox",
                name: "FrontendFrameworks",
                message: "What's Frontend Framework do you use?",
                choices: ["React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Express.js", "Solid.js", "Playwright", "storybook"],
                when: (answers) => !answers.isFullStack
            },
            {
                type: "list",
                name: "BackendLang",
                message: "What's your project Backend Development Language?",
                choices: ["Node.js", "Python", "Java", "Ruby", "Go", "PHP", "Rust"],
                when: (answers) => !answers.isFullStack
            },
            {
                type: "checkbox",
                name: "BackendFrameworks",
                message: "What's Backend Framework do you use?",
                choices: ["Express.js", "Django", "Spring", "Ruby on Rails", "Laravel", "ASP.NET", "Flask", "FastAPI", "NestJS"],
                when: (answers) => !answers.isFullStack
            },
            {
                type: "list",
                name: "Lang",
                message: "What's your project Development Language?",
                choices: ["TypeScript", "JavaScript", "Python", "Java", "Ruby", "Go", "PHP", "Rust"],
                when: (answers) => answers.isFullStack
            },
            {
                type: "checkbox",
                name: "Frameworks",
                message: "What's Framework do you use?",
                choices: ["React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Express.js", "Solid.js", "Playwright", "storybook"],
                when: (answers) => answers.isFullStack
            },
            {
                type: "input",
                name: "description",
                message: "Description:"
            }
        ],
        actions: (data) => {
            const generateSkillIcon = (name) => {
                if(name === "TypeScript" || name === "JavaScript"){
                    return `<img src="https://api.iconify.design/skill-icons:${lowerCaseAndRemoveDot(name)}.svg" alt="${name}" width="32" height="32" />`;
                }
                return `<img src="https://api.iconify.design/skill-icons:${lowerCaseAndRemoveDot(name)}-dark.svg" alt="${name}" width="32" height="32" />`;
            };

            const frontendLang = data.isFullStack ? data.Lang : data.FrontendLang;
            const frontendFrameworks = data.isFullStack ? data.Frameworks : data.FrontendFrameworks;
            const backendLang = data.isFullStack ? null : data.BackendLang;
            const backendFrameworks = data.isFullStack ? null : data.BackendFrameworks;

            const langIcon = generateSkillIcon(frontendLang);
            const frameworkIcons = frontendFrameworks.map(generateSkillIcon).join('');

            if (!data.isFullStack) {
                const backendLangIcon = generateSkillIcon(backendLang);
                const backendFrameworkIcons = backendFrameworks.map(generateSkillIcon).join('');
                return [
                    {
                        type: "add",
                        path: "./Ex-README.md",
                        template: `# ${data.title}\n\n## Frontend\n\n### Language: \n${langIcon}\n\n### Frameworks: \n${frameworkIcons}\n\n## Backend\n\n### Language: \n${backendLangIcon}\n\n### Frameworks: \n${backendFrameworkIcons}\n\n## 説明\n${data.description}`
                    }
                ];
            } else {
                return [
                    {
                        type: "add",
                        path: "./Ex-README.md",
                        template: `# ${data.title}\n\n## Full Stack\n\n### Language:\n ${langIcon}\n\n### Frameworks:\n ${frameworkIcons}\n\n## 説明\n${data.description}`
                    }
                ];
            }
        }
    });
};
```
### 参考情報
https://plopjs.com/documentation/
https://www.phind.com/search?cache=l10gia8f5m7arr2rex2t6wkw
