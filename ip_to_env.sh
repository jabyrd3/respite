#! /usr/bin/bash
set -ex
IP=$(ifconfig eth0 | grep 'inet' | cut -d: -f4 | awk '{print $2}' | head -n 1)
echo "export SELF=\"$IP\"" >> .env
