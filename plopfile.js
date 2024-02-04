module.exports = (
    /** @type {import('plop').NodePlopAPI} */
    plop
) => {
    plop.setGenerator("article",{
        prompts: [{
            type: "input",
            name: "Title",
            message: "Article Title: ",
        },{
            type: "input",
            name: "Id",
            message: "Article Id:"
        },{
            type: "list",
            name: "Emoji",
            message: "Select Emoji",
            choices: ["🐡","📖","📰","🙌","✨","💻"]
        },{
            type: "list",
            name: "Type",
            message: "ArticleType",
            choices: ["tech","idea"]
        },{
            type: "checkbox",
            name: "Topics",
            message: "Check Topics",
            choices: ["react","typescript","nextjs","storybook","plop","rust","webassembly"]
        }],
        actions: (data) => {
            const tags = data.Topics.map(item => item)
            return [{
                type: "add",
                path: `./articles/${data.Id.replace(" ","-").toLowerCase()}.md`,
                templateFile: "./article.md.hbs"
            },{
                type: "append",
                path: `./articles/${data.Id.replace(" ","-").toLowerCase()}.md`,
                template: `topics: [${tags}]\npublished: false\n---\n`
            },{
                type: "append",
                path: `./articles/${data.Id.replace(" ","-").toLowerCase()}.md`,
                template: "## はじめに\n\n### やったこと\n\n### 経緯\n\n### 何を実現したか\n\n### 実際のコード\n\n### 参考情報"
            }]
        }
    })
}