#!/bin/sh

# 데이터베이스 대기
while ! nc -z postgres 5432; do
    sleep 0.5
done

# Vault 서버가 시작될 때까지 대기
until nc -z vault 8200; do
    sleep 1
done

# role-id.json과 secret-id.json 파일이 모두 존재할 때까지 대기
until [ -f "/usr/src/app/approle/role-id.json" ] && [ -f "/usr/src/app/approle/secret-id.json" ]; do
    sleep 1
done

until [ -f "/usr/src/app/approle/front/role-id.json" ] && [ -f "/usr/src/app/approle/front/secret-id.json" ]; do
    sleep 1
done

# 비밀 저장 대기 시간
sleep 5

export DJANGO_SETTINGS_MODULE=transcendence.settings

find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"