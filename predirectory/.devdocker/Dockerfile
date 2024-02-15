# 使いやすそうなので、ubuntu:22.04をベースにする
FROM ubuntu:22.04

# 以下のコマンドは、
# 1. apt-get updateでパッケージリストを更新
# 2. apt-get installで必要なパッケージをインストール
# 3. apt-get cleanでキャッシュを削除
# 4. rm -rf /var/lib/apt/lists/*で不要なファイルを削除
# という流れで、Dockerイメージのサイズを小さくするためのもの
# また、curlとgitをインストールしている
RUN apt-get update && apt-get install -y \
    curl git\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 以下のコマンドは、
# 1. /usr/local/lib/rustというディレクトリを作成
# 2. そのディレクトリに対して、0755のパーミッションを与える
# 3. curlでrustupをダウンロード
# 4. そのファイルに対して、実行権限を与える
# 5. rustup.shを実行して、rustupをインストール
# 6. 環境変数を設定
# という流れで、Rustをインストールしている

ENV RUST_HOME /usr/local/lib/rust
ENV RUSTUP_HOME ${RUST_HOME}/rustup 
ENV CARGO_HOME ${RUST_HOME}/cargo 
RUN mkdir /usr/local/lib/rust && \
    chmod 0755 ${RUST_HOME}
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > ${RUST_HOME}/rustup.sh \
    && chmod +x ${RUST_HOME}/rustup.sh \
    && ${RUST_HOME}/rustup.sh --default-toolchain nightly -y --no-modify-path 

ENV PATH ${PATH}:${CARGO_HOME}/bin


# 以下のコマンドで、ユーザーを作成している
# 1. ARGで変数を定義
# 2. apt-get updateでパッケージリストを更新
# 3. groupaddでグループを作成
# 4. useraddでユーザーを作成
# 5. sudoをインストール
# 6. sudoers.dにユーザーを追加
# 7. パーミッションを変更
# という流れで、ユーザーを作成している

ARG USER=dev
ARG UID=1000
ARG GID=${UID}

RUN apt-get update && groupadd -gid ${GID} ${USER} && \
    useradd -s  /bin/bash --uid ${UID} -gid {GID} -m ${NAME} && \
    apt-get install -y sudo && \ 
    echo "${USER} ALL=\(root\) NOPASSWD:ALL" > /etc/sudoers.d/${USER} && \ 
    chmod 0440 /etc/sudoers.d/${USER} 

# 本来ここにこういうコピー文を書くと思うが、
# 今回はdocker-compose.ymlでvolumesを使っているので、
# ここに書く必要はない

# WORKDIR /guest-workspace
# COPY . .