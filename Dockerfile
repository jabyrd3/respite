FROM alpine:latest
RUN mkdir -p /etc/service/puk /etc/puk/services /tmp/scratch
COPY ./docker/start-puk/run /etc/service/puk/run
RUN apk update \
    && apk --no-cache add runit pdns pdns-backend-sqlite3 sqlite curl bash unzip nodejs npm python3 make gcc g++ libc-dev rsync openssh sqlite-dev jq \
    && rm -rf /var/cache/apk/* 
WORKDIR /tmp/scratch
COPY ./docker/start-puk/puk.yml /tmp/scratch/puk.yml
RUN curl -L https://github.com/sclevine/yj/releases/download/v5.0.0/yj-linux > yj \
  && chmod +x yj \
  && cat ./puk.yml | ./yj > /etc/puk/puk.json \
  && rm -rf /tmp/scratch
WORKDIR /
RUN curl https://sqlite.org/src/raw/5bb2264c1b64d163efa46509544fd7500cb8769cb7c16dd52052da8d961505cf?at=uuid.c > uuid.c
RUN gcc -fPIC -lm -shared uuid.c -o uuid.so
RUN mkdir -p /api
WORKDIR /memhunt
RUN npm install buffer-hexdump 
# get sqlite source, modify sqlite3.h to set the trace option to 1024 and cleanup
RUN mkdir -p /ss
RUN curl https://sqlite.com/snapshot/sqlite-snapshot-202107191400.tar.gz > /ss/sqlitesource.tar.gz
WORKDIR /ss
RUN tar -xzvf sqlitesource.tar.gz
WORKDIR /ss/sqlite-snapshot-202107191400
# here goes nothing
RUN echo -e "#define SQLITE_TRACE_SIZE_LIMIT=1024\n$(cat /ss/sqlite-snapshot-202107191400/sqlite3.h)" > sqlite3.h
RUN echo -e "#undef SQLITE_HAVE_OS_TRACE\n$(cat /ss/sqlite-snapshot-202107191400/sqlite3.h)" > sqlite3.h
RUN echo -e "#undef SQLITE_DEBUG\n$(cat /ss/sqlite-snapshot-202107191400/sqlite3.h)" > sqlite3.h

# install better-sqlite3 from source and tell it where to find sqlite.c and sqlite.h
WORKDIR /api
RUN npm install better-sqlite3 --build-from-source --sqlite3="/ss/sqlite-snapshot-202107191400"
RUN rm -rf /ss

# todo: ugh
# RUN apk del nodejs npm python3 make gcc libc-dev g++
RUN apk del npm python3 make gcc libc-dev g++ sqlite-dev
WORKDIR /
COPY docker/services /etc/puk/services
# todo ugh
# RUN curl -s https://unofficial-builds.nodejs.org/download/release/v15.9.0/node-v15.9.0-linux-x64-musl.tar.xz > /node.xz
COPY puk /puk
COPY api /api
COPY memhunt /memhunt
COPY common-js /api/common
COPY common-js /memhunt/common
COPY common-js /puk/common
RUN chmod +x /puk/index.mjs
RUN ln -s /puk/index.mjs /sbin/puk
COPY docker/entrypoint /usr/local/bin/entrypoint
COPY gui /gui

ENTRYPOINT ["/usr/local/bin/entrypoint"]
