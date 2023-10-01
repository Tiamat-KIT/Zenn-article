---
title: "Tauri-Mobileの開発環境をDockerで整える"
emoji: "📱"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["tauri","docker","bun","rust","nextjs"]
published: false
---
こんばんは。
Next.jsでWebアプリ作ろうとしている一般大学生です。
私は最近、Tauriという、**Webアプリをデスクトップアプリとしてビルド**（認識が間違っているならご指摘よろしくお願いします。）
できるフレームワークに興味を持ちました。
少し調べていくうちに、また安定した機能ではないものの、AndroidやiOSのアプリとしてもビルドできる機能があることも知りました。

個人的には非常に魅力的な機能であると感じ、ぜひとも試してみたいと感じた上、
これが安定した機能となったときには、
1. Next.jsなどを含めたTauriに対応したライブラリやフレームワークを用いて、Webアプリケーションを開発する
2. Tauriを導入する
3. TauriでAndroidやiOSなどのスマートフォンOSで動作するアプリケーションをビルドする
という手段で、3プラットフォームで活用できるアプリケーションをより短期間で開発できる、という手法が普及するかもしれません。

時代の先駆けができるかも！！という安直な考えで、とりあえず触ってみることにしました。
また、Tauri以外に注目したのがDockerです。
https://zenn.dev/hiddy0329/articles/822aa3f0903f3f
の記事を見て、非常に魅力を感じたため、Tauriと一緒に触れてみることにしました。

## 利用環境
|名称|バージョン|
|----|----|
|Windows(OS)|11|
|WSL(Ubuntu)|Ubuntu-22.02 |
|Next.js|13.5|
|Tauri|2.0.0-alpha.4|
|Bun|xxx|
|Rust|xxx|

## 参考にした記事
- Tauriを利用した開発環境をDockerで整える方法

https://www.tunamaguro.dev/articles/tauri-docker/

https://qiita.com/Ritz/items/ecb4bc2d55a0d6967e6e

- Bunのインストール

https://bun.sh/docs/installation

- Tauri2.0.0-alpha.4を動作する上で必要になるパッケージの情報

https://beta.tauri.app/guides/prerequisites/

https://beta.tauri.app/blog/tauri-2-0-0-alpha-3/

https://beta.tauri.app/blog/tauri-2-0-0-alpha-4/

- Tauri-MobileでAndroidアプリをビルドするために必要な環境について

https://hackmd.io/@lucasfernog/BkHI4e18j

## Dockerfileを書く。
さっそくDockerfileを書いていきます。
1. Rustの導入
```Dockerfile
FROM rust:latest
```
この時点で既に入れておくことにする

2. 開発用ユーザの作成
```Dockerfile
RUN apt-get update -y && apt-get install -y sudo && \
    groupadd -g $GID $GROUPNAME && \
    useradd -m -s /bin/bash -u $UID -g $GID -G sudo $USERNAME && \
    echo $USERNAME:$PASSWORD | chpasswd && \
    echo "$USERNAME   ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
```


3. Tauriを動かすためのパッケージインストール
```Dockerfile
RUN apt install -y libdbus-1-dev
RUN pkg-config --libs --cflags dbus-1
RUN apt install -y software-properties-common
RUN apt update
RUN apt install -y libgtk-3-dev \
    build-essential \
    libssl-dev \
    libwebkit2gtk-4.1-dev
    curl \
    wget \
    file \
    zip \
    unzip \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

4. Bunの導入
```Dockerfile
RUN curl https://bun.sh/install | bash && \
    echo "source ~/.bashrc" >> ~/.bashrc
```

5. Android SDKの導入
```Dockerfile
RUN mkdir -p /opt/android-sdk && \
    curl -o /tmp/sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip /tmp/sdk-tools.zip -d /opt/android-sdk && \
    rm /tmp/sdk-tools.zip
```

6. Android NDKの導入
```Dockerfile
RUN mkdir -p /opt/android-sdk && \
    curl -o /tmp/sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip /tmp/sdk-tools.zip -d /opt/android-sdk && \
    rm /tmp/sdk-tools.zip
```

7. 環境変数などの設定
```Dockerfile
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV NDK_HOME=/opt/android-ndk/android-ndk-r23
ENV RUSTUP_HOME=/root/.rustup
ENV CARGO_HOME=/root/.cargo
ENV PATH=$PATH:$JAVA_HOME/bin:$RUSTUP_HOME/bin:$CARGO_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$NDK_HOME
RUN export JAVA_HOME=${JAVA_HOME}
RUN export ANDROID_HOME=${ANDROID_HOME}
RUN export NDK_HOME=${NDK_HOME}
```

8. Androidアプリのビルドに必要なもの？
```Dockerfile
RUN rustup update stable
RUN rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

9. ユーザ指定
```Dockerfile
USER $USERNAME
```

この流れを使っていく

## docker-compose.ymlを書く。
```yml
services:
  app:
    container_name: "tauri-app"
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - /path/to/your/app:/app
    environment:
        - DISPLAY=$DISPLAY
        - WAYLAND_DISPLAY=$WAYLAND_DISPLAY
        - XDG_RUNTIME_DIR=/tmp
        - PULSE_SERVER=$PULSE_SERVER
        - ANDROID_HOME=/path/to/android/sdk
        - NDK_HOME=/path/to/android/ndk
        - JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
        - PATH=$PATH:$HOME/.cargo/bin
    ports:
      - "3000:3000"
```

### Dockerのコマンド

- ビルド
```bash
docker-compose build
```

- キャッシュなしビルド
```bash
docker-compose build --no-cache
```

- コンテナ起動
```bash
docker-compose up -d
```

- キャッシュ削除
```bash
docker builder prune
```

## Dockerコンテナを起動してから打つコマンド
#### 参照元

https://beta.tauri.app/guides/frontend/nextjs/

```bash
cd app-code/
bun create next-app .
# bun add -d @tauri-apps/cli@next @tauri-apps/api@next
bun add -d internal-ip
cargo install tauri-cli --version "^2.0.0-alpha"
# cargo tauri migrate
cargo tauri init
cd src-tauri/
cargo add tauri@2.0.0-alpha.4 && cargo add tauri-build@2.0.0-alpha.2 --build
cargo install cargo-update
cargo install-update -a
cargo tauri dev
cargo build
cd ..
# bun tauri dev
# bun add @tauri-apps/cli@next @tauri-apps/api@next
bun add @tauri-apps/api@next
```

### その後行うこと
1. tauriの`config.json`をいじる
```json
{
	"build": {
		"beforeDevCommand": "npm run dev",
		"beforeBuildCommand": "npm run build",
		"devPath": "http://localhost:3000",
		"distDir": "../dist"
	}
}
```
2. nextjsの`config.ts`をいじる
```ts
const isProd = process.env.NODE_ENV === 'production';
module.exports = async (phase, { defaultConfig }) => {
	let internalHost = null;
	// In dev mode we use the internal-ip to serve the assets
	if (!isProd) {
		const { internalIpV4 } = await import('internal-ip');
		internalHost = await internalIpV4();
	}
	const nextConfig = {
		// Ensure Next.js uses SSG instead of SSR
		// https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
		output: 'export',
		// Note: This experimental feature is required to use NextJS Image in SSG mode.
		// See https://nextjs.org/docs/messages/export-image-api for different workarounds.
		images: {
			unoptimized: true,
		},
		// Configure assetPrefix or else the server won't properly resolve your assets.
		assetPrefix: isProd ? null : `http://${internalHost}:3000`,
	};
	return nextConfig;
};
```
