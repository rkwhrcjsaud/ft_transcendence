#!/bin/sh
# Vault 서버를 백그라운드에서 시작
vault server -config=/local.json &

sleep 8

# 초기화 여부 확인 및 초기화 수행
if [ ! -f /vault-data/initialized ]; then
    vault operator init -key-shares=1 -key-threshold=1 > /vault-data/init-output.txt
    sleep 3
    grep 'Unseal Key 1:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_UNSEAL_KEY
    grep 'Initial Root Token:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_ROOT_TOKEN
    touch /vault-data/initialized
    rm -rf /vault-data/init-output.txt
fi

# 언실 수행
vault operator unseal $(cat $VAULT_UNSEAL_KEY)
# Vault 로그인
vault login $(cat $VAULT_ROOT_TOKEN)
# KV 엔진 확인 및 생성
if ! vault secrets list | grep -q '^transcendence/'; then
    vault secrets enable -path=transcendence kv
fi

# AppRole 생성 스크립트 실행
vault auth enable approle
sh backrole.sh
sh frontrole.sh

# 추가 작업 실행
python3 /secret.py

wait
