#!/bin/bash

sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO users (username, password) VALUES ('foobar', 'password')"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO users (username, password) VALUES ('demo', 'anotherpassword')"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO domains (name, type, owner) VALUES ('example.com', 'NATIVE', 1);"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO domains (name, type, owner) VALUES ('anotherexample.com', 'NATIVE', 2);"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','localhost admin.example.com 1 10380 3600 604800 3600','SOA',86400,NULL);"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO records (domain_id, name, content, type,ttl,prio) VALUES (1,'example.com','192.0.2.10','A',120,NULL);"
sqlite3 /root/pdns/pdns.sqlite3 "INSERT INTO domains (name, type, owner) VALUES (?, 'NATIVE', ?);"
