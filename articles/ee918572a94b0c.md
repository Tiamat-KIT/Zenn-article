---
title: "vanilla-extract少しわかる"
emoji: "🌈"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [typescript,css,vanillaextract,jsx]
published: true
---

vanilla-extract少しわかるようになるための記事

## まずは基礎から。

- vanilla-extractにおけるスタイリングのAPIは入力としてスタイルのオブジェクトをとる。

という仕様になっているため、スタイリングを行うCSSプロパティの集まりが、
オブジェクトとして扱われる。

### CSSプロパティ
スタイルオブジェクトのトップレベルでは、通常のCSSクラスを記述するのと同様に、CSSプロパティを設定できる。しかし、プロパティ名はキャメルケースで指定しなければならない。
感覚としては`class`→`className`の感覚で考えたらよい。

だから、普通にCSSプロパティだけを利用するときは、このようになる。
```typescript
import {style} from '@vanilla-extract'

export const firstStyle = style({
    display: 'flex',
    padding: 10
})
```

この時、見てわかるように、特定の文字を指定するときは、文字列型(string型)で指定する
しかし、paddingのように、数値を指定する場合、数値だけの入力でよいことがある。
その際、自動的にpx単位の数値指定として補完される。
また、指定する数に単位を持たないプロパティもあるため、その場合も同様である。

## ちょっとレベル上げてみる
### CSS変数
もちろんCSS変数も使える。しかしCSS変数の変数宣言は2つある。
- `style`メソッド内で`vars`キーを用いて初期化する
- `createVar()`メソッドの戻り値でCSS変数を宣言し、`style`メソッド内の`vars`キーで値を指定する

実際にやってみるとこう。
firstとついているのが上の方法、secondとついているのが下の方法。

```typescript
import {style} from '@vanilla-extract'

export const First = style({
    vars:{
        '--my-first-var':'blue'
    }
});

const secondvar = createVar();

export const Second = style({
    vars:{
        [secondvar]: 'purple'
    }

})
```

### メディアクエリ
CSS変数を`vars`キーで指定したように、メディアクエリは`@media`で指定できる。
これによって、メディアクエリをスタイルの定義内におけるので、
それぞれのスタイルごとにメディアクエリを設定したい場合は便利。
**細かく分けない場合は手間になる**ので、別のCSS-in-js(ts)を使うことをおすすめする。

```typescript
import {style} from '@vanilla-extract'
const responsiveStyle = style({
    '@media':{
        'screen and (min-width: 768px)':{
            padding: 10
        }
    }
})
```

ちなみに、このライブラリの仕様上、メディアクエリは出力されるCSSの末尾に来るようになっているらしい
それはCSS規則順序の優先順位によって、メディアクエリとなる`@media`キー内のスタイルより
高い優先度を持っているからである。
しかし、特に悪い影響が発生しない場合は、CSSの出力を小さくするため、
メディアクエリの条件ブロックが取り除かれて出力される。

### セレクタ
※後述する`globalStyle`では全セレクタ使用不可となっている。
理由はドキュメントを見てください。

セレクタの指定方法は2つ
- 他の全てのCSSプロパティと一緒に使える単純な疑似セレクタ
    これらは他のCSSプロパティと並んでトップレベルで使用可能で
    CSSプロパティとCSS変数のみ中で使える。

- 複雑なルール構築が可能なセレクタオプション
    `selectors`キーを使って複雑なキーを指定できる。
    各スタイルブロックは1要素のみを対象とすることしかできない。
    これを強制するため、全セレクタは**現在の要素への参照である&文字を**
    **対象にしなければならない**

実際にやってみる

```typescript
import {style} from '@vanilla-extract'

const FirstStyle = style({
    'hover':{
        color: 'red'
    },
    selectors:{
        '&:hovers:not:(:active)':{
            border: 'medium'
        },
        'nav li > &':{
            textDecoration: 'underline'
        }
    }
})
```

また、セレクタは他のクラス名を参照することもできるため、
このような指定もできる。

```typescript
import {style} from '@vanilla-extract'
export const parent = style({});

export const child = style({
    selectors:{
        [`${parent}:focus &`]:{
            backgroud: 'lightbule'
        }
    }
})
```

**※セレクタで現在のクラス以外の要素を対象にしてしまっていると無効になる**

現在の要素の子のノードとなっているものをグローバルに対象にしたい場合、
代替として、`globalStyle`を使用する必要がある。

```typescript
import {style} from '@vanilla-extract'
export const parent = style({});

globalStyle(`${parent} a[href]`,{
    color:'green'
});
```

## globalStyle…？
**`globalStyle`**というのは、その対象とするHTMLタグ全体にかかるCSSプロパティに指定するためのもの
例えば、
```typescript
import {globalStyle} from '@vanilla-extract'
globalStyle('p',{
    color:'blue'
})
```
と指定したら`p`タグの文字色が全部青に変更されるという仕様。要はCSSの
```css
p {
    color: blue
}
```
ということ。