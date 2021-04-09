FROM alpine:latest
RUN apk update \
    && apk --no-cache add curl bash bind-tools git \
    && rm -rf /var/cache/apk/* 
RUN git clone https://github.com/sstephenson/bats.git \
    && cd bats \
    && ./install.sh /usr/local
