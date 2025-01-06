#!/bin/bash

until nc -z django 8000; do
    sleep 1
done



openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
       -out /etc/ssl/certs/certs.crt \
       -keyout /etc/ssl/private/certs.key \
       -subj "/C=KR/ST=State/L=Legion/O=42/OU=42/CN=localhost/"

nginx -g "daemon off;"