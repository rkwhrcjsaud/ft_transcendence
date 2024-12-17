#!/bin/sh

# 데이터베이스 대기
while ! nc -z postgres 5432; do
  sleep 0.1
done

sleep 6

export DJANGO_SETTINGS_MODULE=transcendence.settings

find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"