FROM alpine:latest
RUN mkdir -p /etc/service/puk /etc/puk/services /tmp/scratch
COPY ./docker/start-puk/run /etc/service/puk/run
RUN apk update \
    && apk --no-cache add runit pdns pdns-backend-sqlite3 sqlite curl bash unzip nodejs npm python3 make gcc g++ libc-dev rsync openssh \
    && rm -rf /var/cache/apk/* 
WORKDIR /tmp/scratch
COPY ./docker/start-puk/puk.yml /tmp/scratch/puk.yml
RUN curl -L https://github.com/sclevine/yj/releases/download/v5.0.0/yj-linux > yj \
  && chmod +x yj \
  && cat ./puk.yml | ./yj > /etc/puk/puk.json \
  && rm -rf /tmp/scratch
WORKDIR /
RUN mkdir -p /api
WORKDIR /api
RUN npm install better-sqlite3
# todo: ugh
# RUN apk del nodejs npm python3 make gcc libc-dev g++
RUN apk del npm python3 make gcc libc-dev g++
WORKDIR /
COPY docker/services /etc/puk/services
# todo ugh
# RUN curl -s https://unofficial-builds.nodejs.org/download/release/v15.9.0/node-v15.9.0-linux-x64-musl.tar.xz > /node.xz
COPY puk /puk
COPY api /api
COPY common-js /api/common
COPY common-js /puk/common
RUN chmod +x /puk/index.mjs
RUN ln -s /puk/index.mjs /sbin/puk
COPY docker/entrypoint /usr/local/bin/entrypoint

ENTRYPOINT ["/usr/local/bin/entrypoint"]
